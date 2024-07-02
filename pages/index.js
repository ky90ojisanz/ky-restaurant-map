import React, { useCallback, useRef, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import SearchBox from "../app/components/SearchBox";
import FloatingButton from "../app/components/FloatingButton";
import SearchModal from "../app/components/SearchModal";
import GoogleMapComponent from "../app/components/GoogleMapComponent";
import { useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { data: session, status } = useSession();
  const [updateMarkers, setUpdateMarkers] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const router = useRouter();

  const fetchMarkersFromDB = useCallback(async () => {
    // データベースからマーカー情報を取得
    const response = await fetch("/api/get-markers");
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) setMarkers(data);
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
      fetchMarkersFromDB();
      setIsInitialLoad(false);
    }
  }, [fetchMarkersFromDB, isInitialLoad]);

  useEffect(() => {
    fetchMarkersFromDB();
  }, [fetchMarkersFromDB, updateMarkers]);

  useEffect(() => {
    if (status === "loading") return; // セッションの読み込み中は何もしない
    if (!session && status !== "loading") {
      router.push("/login"); // ログインしていない場合、ログインページにリダイレクト
    }
  }, [session, status, router]);

  const handleShopSelect = (shop) => {
    setMarkers([shop]);
  };

  const handlePlacesChanged = async (query) => {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`
    );
    console.log(res.data);
    const { location } = res.data.results[0].geometry;
    new google.maps.Map(document.getElementById("map"), {
      center: { lat: location.lat, lng: location.lng },
      zoom: 15,
    });
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";
  if (status === "loading") return "Loading...";
  if (!session) return null;

  return (
    <div>
      <SearchBox onPlacesChanged={handlePlacesChanged} />
      <GoogleMapComponent markers={markers} />
      <SearchModal onShopSelect={handleShopSelect} />
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
