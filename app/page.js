"use client";
import React, { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import GoogleMapComponent from "./components/GoogleMapComponent";
import SearchModal from "./components/SearchModal";

const libraries = ["places"];

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchMarkersFromDB = async () => {
    try {
      const response = await fetch("/api/get-markers", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Data fetched:", data);
        if (Array.isArray(data) && data.length > 0) {
          setMarkers(data);
        } else {
          console.log("No markers found.");
          setMarkers([]);
        }
      } else {
        console.error("Failed to fetch markers:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  useEffect(() => {
    fetchMarkersFromDB();
  }, [updateTrigger]);

  const handleModalClose = () => {
    setUpdateTrigger((prev) => prev + 1);
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
      <button onClick={() => setUpdateTrigger((prev) => prev + 1)}>
        Refresh Markers
      </button>
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
