import React, { useEffect } from "react";

const GoogleMapComponent = ({ markers }) => {
  useEffect(() => {
    // Google Maps API を使用して地図を初期化
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 35.681236, lng: 139.767125 }, // 中心点を設定（例: 東京駅）
      zoom: 15,
    });

    // 現在位置を取得する
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Geolocationがサポートされていない場合のエラーハンドリング
      handleLocationError(false, infoWindow, map.getCenter());
    }

    // 既存のマーカーをクリア
    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: map,
        title: markerData.name,
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
        <p>URL： <a href=${markerData.url}>${markerData.url}</p>
      </div>
      </div >
      `;
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: markerData.name,
      });
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
        });
      });
    });
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
