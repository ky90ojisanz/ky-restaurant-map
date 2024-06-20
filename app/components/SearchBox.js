"use client";

import React, { useRef } from "react";

const SearchBox = ({ onPlacesChanged }) => {
  const inputRef = useRef(null);

  const handleSearch = () => {
    const query = inputRef.current.value;
    if (query) {
      onPlacesChanged(query);
    }
  };

  return (
    <div>
      <input type="text" ref={inputRef} placeholder="場所を検索" />
      <button onClick={handleSearch}>検索</button>
    </div>
  );
};

export default SearchBox;
