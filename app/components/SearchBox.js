"use client";

import React, { useRef } from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #f0f0f0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px 15px;
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  flex: 1;
  color: #000;
  background-color: #fff;
  transition: border-color 0.3s;
  margin-right: 10px;
  width: calc(100% - 110px); // Subtracting button width and margin

  &:focus {
    border-color: #0070f3;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
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
  width: 100px; // Fixed width for the button

  &:hover {
    background-color: #005bb5;
  }

  @media (max-width: 768px) {
    width: 100%;
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
    <HeaderContainer>
      <Container>
        <Input type="text" ref={inputRef} placeholder="場所を検索" />
        <Button onClick={handleSearch}>検索</Button>
      </Container>
    </HeaderContainer>
  );
};

export default SearchBox;
