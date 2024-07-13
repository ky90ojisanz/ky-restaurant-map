"use client";

import { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

if (typeof window !== "undefined") {
  Modal.setAppElement("body");
}

const SearchModal = ({ onModalClose, onShopSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  const closeModalSave = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    if (onModalClose) {
      onModalClose();
    }
  };

  const handleSave = async (shop, comment) => {
    const params = { name: shop.name };
    const shopName = new URLSearchParams(params);
    const response = await fetch(`/api/get-markers?${shopName}`);
    const data = await response.json();
    if (data.length > 0) {
      setResults((prevResults) =>
        prevResults.map((r) =>
          r.id === shop.id ? { ...r, message: "既に登録されています。" } : r
        )
      );
      return;
    }

    try {
      const restaurant = {
        name: shop.name,
        comment: comment,
        genre: shop.genre.name,
        access: shop.access,
        open: shop.open,
        url: shop.urls.pc,
        lat: parseFloat(shop.lat),
        lng: parseFloat(shop.lng),
      };
      const response = await fetch("/api/add-markers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restaurant),
      });

      const result = await response.json();
      setResults((prevResults) =>
        prevResults.map((r) =>
          r.id === shop.id ? { ...r, message: "保存しました。" } : r
        )
      );
    } catch (error) {
      setResults((prevResults) =>
        prevResults.map((r) =>
          r.id === shop.id ? { ...r, message: "DBに保存できませんでした" } : r
        )
      );
    }
    closeModalSave();
  };

  const handleSearch = () => {
    if (!query) return;
    try {
      const promise = fetch(
        `/api/hotpepper?query=${encodeURIComponent(query)}`
      );
      promise
        .then((response) => response.json())
        .then((jsondata) => {
          setResults(
            jsondata.map((shop) => ({ ...shop, comment: "", message: "" }))
          );
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <button onClick={openModal} style={buttonStyle}>
        🔍
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Search Modal"
      >
        <h1>
          <strong>飲食店DB保存画面</strong>
        </h1>
        <h2>
          HotPepperグルメサーチAPIを使って飲食店を検索
          <br />
          検索した店情報をDBに保存することができます。
        </h2>
        <div style={controlStyle}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="検索キーワードを入力"
            style={inputStyle}
          />
          <div style={clickStyle}>
            <button onClick={handleSearch} style={searchButtonStyle}>
              検索
            </button>
            <button onClick={closeModal} style={closeButtonStyle}>
              閉じる
            </button>
          </div>
        </div>
        <div style={resultsContainerStyle}>
          {results.length > 0 ? (
            <div>
              <ul>
                {results.map((shop) => (
                  <li key={shop.id} style={resultItemStyle}>
                    <p>
                      <strong>{shop.name}</strong>
                    </p>
                    <p>{shop.address}</p>
                    <p>{shop.genre.name}</p>
                    <p>{shop.access}</p>
                    <p>{shop.open}</p>
                    <input
                      type="text"
                      value={shop.comment}
                      onChange={(e) => {
                        setResults((prevResults) =>
                          prevResults.map((r) =>
                            r.id === shop.id
                              ? { ...r, comment: e.target.value }
                              : r
                          )
                        );
                      }}
                      placeholder="一言コメント"
                      style={commentStyle}
                    />
                    <button
                      style={confirmButtonStyle}
                      onClick={() => handleSave(shop, shop.comment)}
                    >
                      保存
                    </button>
                    {shop.message && (
                      <p style={{ color: "red" }}>{shop.message}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>結果がありません。</p>
          )}
        </div>
      </Modal>
      <style>{mediaQueryStyles}</style>
    </div>
  );
};

const buttonStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  padding: "10px 20px",
  fontSize: "20px",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
};

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "80%", // 初期設定として幅を80%に設定
    maxHeight: "90vh", // モーダルの最大高さを設定
    overflow: "auto", // モーダル内でスクロール可能にする
  },
};

const controlStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const clickStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

const inputStyle = {
  width: "80%",
  padding: "10px",
  margin: "10px 0",
  fontSize: "16px",
  color: "#000",
  backgroundColor: "#fff",
  border: "1px solid #000",
};

const commentStyle = {
  width: "80%",
  padding: "10px",
  margin: "16px",
  fontSize: "16px",
  color: "#000",
  backgroundColor: "#fff",
  border: "1px solid #000",
};

const searchButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "10px",
};

const confirmButtonStyle = {
  padding: "7px 12px",
  fontSize: "13px",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "10px",
};

const closeButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#ccc",
  color: "#000",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const resultsContainerStyle = {
  marginTop: "20px",
  maxHeight: "600px", // モバイルでも見やすいように高さを調整
  overflowY: "auto",
  width: "100%", // モバイルで幅を100%に設定
  boxSizing: "border-box", // パディングを含む幅の計算
};

const resultItemStyle = {
  width: "88%",
  padding: "16px",
  marginLeft: "auto",
  marginRight: "auto",
  marginBottom: "16px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  color: "#000",
  backgroundColor: "#fff",
  boxShadow: "0 8px 4px rgba(0, 0, 0, 0.1)",
};

// メディアクエリを使ってモバイルデバイス向けのスタイルを追加
const mediaQueryStyles = `
  @media (max-width: 600px) {
    .modalContent {
      width: 90%; // モバイルでのモーダルの幅を調整
      maxHeight: 80%; // モバイルでの最大高さを調整
    }
    .resultItem {
      padding: 8px; // モバイルでのアイテムパディングを調整
      fontSize: 14px; // モバイルでのフォントサイズを調整
    }
  }
`;

export default SearchModal;
