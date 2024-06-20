import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db("nextjs-map-app");
    const collection = db.collection("restaurants");
    const result = await collection.insertOne(req.body);
    client.close();
    res.status(200).json({ success: true, data: result });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
