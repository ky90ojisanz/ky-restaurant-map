"use client";
import React from "react";

const FloatingButton = ({ onClick }) => {
  return (
    <button
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        fontSize: "24px",
        backgroundColor: "#ff5722",
        color: "#fff",
        border: "none",
      }}
      onClick={onClick}
    >
      🍽
    </button>
  );
};

export default FloatingButton;
