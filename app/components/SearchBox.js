"use client";

import React, { useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  flex: 1;
  color: #000;
  background-color: #fff;
  margin-right: 10px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0070f3;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #0070f3;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }
`;

const SearchBox = ({ onPlacesChanged }) => {
  const inputRef = useRef(null);

  const handleSearch = () => {
    const query = inputRef.current.value;
    if (query) {
      onPlacesChanged(query);
    }
  };

  return (
    <Container>
      <Input type="text" ref={inputRef} placeholder="場所を検索" />
      <Button onClick={handleSearch}>検索</Button>
    </Container>
  );
};

export default SearchBox;
