import { NextResponse } from "next/server";
import OpenAI from "openai";
import { load } from "cheerio";
import axios from "axios";
import { fetchHotPepperData } from "../hotpepper/route";
import { insertFromDiscord } from "../add-markers/route";
import { fetchDBByName } from "../get-markers/route";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export async function POST(request) {
  try {
    let isNew = true;
    const restaurantResult = {
      name: "",
      url: "",
    };
    const { content, author } = await request.json();
    const urls = findUrlsWithPatterns(content);
    const restaurantInfo = [];
    if (urls.length > 0) {
      for (const url of urls) {
        console.log("URL:", url);
        const response = await axios.get(url);
        const html = response.data;
        // cheerioを使用してHTMLを解析
        const $ = load(html);

        // 必要な情報を抽出
        if (url.includes("tabelog")) {
          // 食べログの場合
          // 店名を取得
          const storeName = $("h2.display-name span").first().text().trim();

          // 住所を取得
          const address = $('th:contains("住所")')
            .next("td")
            .find("p.rstinfo-table__address")
            .text()
            .trim()
            .replace(/\s+/g, " ");
          restaurantInfo.push({
            restaurantName: storeName,
            restaurantAddress: address,
          });
        } else if (url.includes("hotpepper")) {
          // ホットペッパーの場合
          const jsonLdScript = $('script[type="application/ld+json"]').html();
          const jsonData = JSON.parse(jsonLdScript);

          // Extract store name and address details
          const storeName = jsonData.name;
          const address = jsonData.address;
          const addressString = `${address.addressRegion}${address.addressLocality}${address.streetAddress}`;

          restaurantInfo.push({
            restaurantName: storeName,
            restaurantAddress: addressString,
          });
        }
      }
    } else {
      const restaurantNames = await extractRestaurantNames(content);
      // JSON.parseを使用して、文字列を配列に変換します
      const jsonString = restaurantNames.replace(/'/g, '"');
      const responseArray = JSON.parse(jsonString);
      responseArray.forEach((v) => {
        if (v !== "Nothing") {
          restaurantInfo.push({
            restaurantName: v,
            restaurantAddress: "",
          });
        }
      });
    }
    // ここでメッセージの解析を行います
    for (let i = 0; i < restaurantInfo.length; i++) {
      const restaurant = `${restaurantInfo[i].restaurantName} ${restaurantInfo[i].restaurantAddress}`;
      const data = await fetchHotPepperData(restaurant);
      if (data.length > 0) {
        const response = await fetchDBByName(data[0].name);
        const existData = await response.json();
        if (existData.length > 0) {
          isNew = false;
          restaurantResult.name = existData[0].name;
          restaurantResult.url = existData[0].url;
        } else {
          await insertFromDiscord(data[0]);
          restaurantResult.name = data[0].name;
          restaurantResult.url = data[0].urls.pc;
        }
      }
    }
    const analysis = {
      isNew,
      restaurantResult,
    };

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Error analyzing message:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

function findUrlsWithPatterns(text) {
  // 正規表現パターン
  const urlPattern =
    /https?:\/\/(?:www\.)?(?:tabelog\.com|hotpepper\.jp)(?:[^\s]*)/g;

  // すべてのURLを検索
  const urls = text.match(urlPattern);

  return urls || [];
}

async function extractRestaurantNames(content) {
  // ここでレストラン名を抽出する処理を実装します
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `I will extract and return words from the given text that are presumed to be the names of restaurants. If multiple names are presumed, I will return them as an array of strings. If unsure, I will search the web and respond with the formal name of the restaurant that seems the closest match. If no words are presumed to be restaurant names, I will respond with ['Nothing'] only.`,
      },
      {
        role: "user",
        content:
          "Please provide the response as a list of strings, where each string is an item in the list. For example: ['item 1', 'item 2', 'item 3'].",
      },
      {
        role: "user",
        content: content,
      },
    ],
    model: "gpt-4o",
  });
  return chatCompletion.choices[0].message.content;
}
