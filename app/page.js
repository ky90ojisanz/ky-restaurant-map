"use client";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import FloatingButton from "./components/FloatingButton";
import RestaurantList from "./components/RestaurantList";
import SearchModal from "./components/SearchModal";
import GoogleMapComponent from "./components/GoogleMapComponent";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 35.6895,
  lng: 139.6917,
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const [markers, setMarkers] = useState([]);
  const [updateMarkers, setUpdateMarkers] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  //  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const fetchMarkersFromDB = useCallback(async () => {
    // データベースからマーカー情報を取得
    const response = await fetch("/api/get-markers");
    const data = await response.json();
    setMarkers(data);
  }, []);

  useEffect(() => {
    fetchMarkersFromDB();
  }, [fetchMarkersFromDB, updateMarkers]);

  const handleModalClose = () => {
    setUpdateMarkers((prev) => !prev); // マーカーの更新をトリガー
  };

  const handlePlacesChanged = async (query) => {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const { location } = res.data.results[0].geometry;
    setMarkers([{ lat: location.lat, lng: location.lng }]);
  };

  // const handleRestaurantSearch = async () => {
  //   const res = await axios.get(
  //     `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=YOUR_HOTPEPPER_API_KEY&lat=35.6895&lng=139.6917&range=2&format=json`
  //   );
  //   setRestaurants(res.data.results.shop);
  // };

  const handleButtonClick = () => {
    setIsSearchModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsSearchModalVisible(false);
  };

  const handleRestaurantSelect = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    const geoRes = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${restaurant.address}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const { location } = geoRes.data.results[0].geometry;
    await axios.post("/api/saveRestaurant", {
      ...restaurant,
      lat: location.lat,
      lng: location.lng,
    });
    setMarkers([...markers, { lat: location.lat, lng: location.lng }]);
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

/* <GoogleMap
mapContainerStyle={mapContainerStyle}
zoom={15}
center={center}
ref={mapRef}
>
{markers.map((marker, index) => (
  <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
))}
</GoogleMap> */
