import React, { useEffect } from "react";

const GoogleMapComponent = ({ markers }) => {
  useEffect(() => {
    // Google Maps API を使用して地図を初期化
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 35.681236, lng: 139.767125 }, // 中心点を設定（例: 東京駅）
      zoom: 15,
    });

    // 既存のマーカーをクリア
    markers.forEach((marker) => {
      new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: map,
        title: marker.name,
      });
    });
  }, [markers]);

  return <div id="map" style={{ height: "1200px", width: "100%" }}></div>;
};

export default GoogleMapComponent;
