"use client"; // クライアント側で動作するコンポーネントとして指定

import { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

// クライアント側でのみ実行
if (typeof window !== "undefined") {
  Modal.setAppElement("#__app"); // ルート要素を設定
}

const SearchModal = ({ onModalClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setResults([]); // モーダルを閉じたときに結果をクリア
    if (onModalClose) {
      onModalClose(); // モーダルを閉じる際に親コンポーネントに通知
    }
  };

  const handleSave = (shop) => {
    try {
      const restaurant = {
        name: shop.name,
        comment: comment,
        genre: shop.genre.name,
        access: shop.access,
        open: shop.open,
        url: shop.urls.pc,
        lat: shop.lat,
        lng: shop.lng,
      };
      const response = fetch("/api/add-markers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restaurant),
      });

      const result = response.json();
      setMessage(result.message);
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("Error saving data.");
    }
    closeModal();
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
          setResults(jsondata);
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
        <h2>飲食店検索</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="検索キーワードを入力"
          style={inputStyle}
        />
        <button onClick={handleSearch} style={searchButtonStyle}>
          検索
        </button>
        <button onClick={closeModal} style={closeButtonStyle}>
          閉じる
        </button>

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
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="一言コメント"
                      style={inputStyle}
                    />
                    <button
                      style={confirmButtonStyle}
                      onClick={() => handleSave(shop)}
                    >
                      選択
                    </button>
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
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
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  color: "#000",
  backgroundColor: "#fff",
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
