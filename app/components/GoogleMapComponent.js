import React, { useEffect, useRef } from "react";

const GoogleMapComponent = ({ markers }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Google Maps API を使用して地図を初期化
    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.681236, lng: 139.767125 }, // 中心点を設定（例: 東京駅）
        zoom: 15,
      });
    }

    // 既存のマーカーをクリア
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 新しいマーカーを追加
    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: mapRef.current,
        title: markerData.name,
        animation: google.maps.Animation.DROP,
      });

      const contentString = `
      <div id="content">
        <div id="siteNotice"></div>
        <h1 id="firstHeading" class="firstHeading">店名：${markerData.name}</h1>
        <div id="bodyContent">
          <p><b>一言コメント：</b>${markerData.comment}</p>
          <p>ジャンル：${markerData.genre}</p>
          <p>アクセス：${markerData.access}</p>
          <p>営業時間：${markerData.open}</p>
          <p>URL： <a href=${markerData.url} target="_blank" rel="noopener">${markerData.url}</a></p>
        </div>
      </div>
      `;

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map: mapRef.current,
        });
      });

      markersRef.current.push(marker);
    });

    // マーカーが1つ以上ある場合、最初のマーカーにマップの中心を移動
    if (markers.length > 0) {
      mapRef.current.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
    }
  }, [markers]);

  return (
    <div
      id="map"
      style={{
        height: "1200px",
        width: "100%",
        color: "#000",
        backgroundColor: "#FFF",
      }}
    ></div>
  );
};

export default GoogleMapComponent;
