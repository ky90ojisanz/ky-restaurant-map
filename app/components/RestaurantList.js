"use client";
import React from "react";

const RestaurantList = ({ restaurants, onSelect }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        right: "20px",
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>飲食店リスト</h3>
      <ul>
        {restaurants.map((restaurant, index) => (
          <li key={index}>
            {restaurant.name}
            <button onClick={() => onSelect(restaurant)}>選択</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;
