import React, { useCallback, useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import SearchBox from "../app/components/SearchBox";
import SearchModal from "../app/components/SearchModal";
import GoogleMapComponent from "../app/components/GoogleMapComponent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const libraries = ["places"];

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { data: session, status } = useSession();
  const [updateMarkers, setUpdateMarkers] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const router = useRouter();

  const fetchMarkersFromDB = useCallback(async () => {
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

  useEffect(() => {
    fetchMarkersFromDB();
  }, [fetchMarkersFromDB, updateMarkers]);

  useEffect(() => {
    if (isInitialLoad && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsInitialLoad(false);
        },
        () => {
          // エラー時はデフォルトの位置（東京）を設定
          setMapCenter({ lat: 35.6895, lng: 139.6917 });
          setIsInitialLoad(false);
        }
      );
    }
  }, [isInitialLoad]);

  const handleModalClose = async () => {
    fetchMarkersFromDB(); // データ追加に伴いDBから取得して
  };

  const handlePlacesChanged = async (query) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`
      );
      const { location } = res.data.results[0].geometry;
      setMapCenter({ lat: location.lat, lng: location.lng });
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded || !mapCenter) return "Loading Maps";
  if (status === "loading") return "Loading...";
  if (!session) return null;

  return (
    <div>
      <SearchBox onPlacesChanged={handlePlacesChanged} />
      <GoogleMapComponent markers={markers} center={mapCenter} />
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
