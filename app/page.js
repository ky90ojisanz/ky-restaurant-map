"use client";
import React, { useCallback, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import FloatingButton from "./components/FloatingButton";
import SearchModal from "./components/SearchModal";
import GoogleMapComponent from "./components/GoogleMapComponent";

const libraries = ["places"];
const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);
  const fetchMarkersFromDB = async () => {
    // データベースからマーカー情報を取得
    const response = await fetch("/api/get-markers", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      console.log("Data fetched:", data);
      if (Array.isArray(data) && data.length > 0) {
        setMarkers(data);
      } else {
        console.log("No markers found.");
      }
    }
  };

  useEffect(() => {
    fetchMarkersFromDB();
  }, []);

  const handleModalClose = () => {
    fetchMarkersFromDB(); // モーダルが閉じられたときに再度マーカー情報を取得
  };

  const handlePlacesChanged = async (query) => {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`
    );
    const { location } = res.data.results[0].geometry;
    new google.maps.Map(document.getElementById("map"), {
      center: { lat: location.lat, lng: location.lng },
      zoom: 15,
    });
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <SearchBox onPlacesChanged={handlePlacesChanged} />
      <GoogleMapComponent markers={markers} />
      <SearchModal onModalClose={handleModalClose} />
      <p>
        Powered by{" "}
        <a href="http://webservice.recruit.co.jp/">
          ホットペッパーグルメ Webサービス
        </a>
      </p>
    </div>
  );
};

export default Map;
