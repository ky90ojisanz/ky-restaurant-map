import React, { useEffect, useRef, useState } from "react";

const GoogleMapComponent = ({ markers, center }) => {
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const initMap = () => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 15,
      });

      mapRef.current = map;
      infoWindowRef.current = new google.maps.InfoWindow();

      // ユーザーの位置を取得し、青いマーカーを追加
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(pos);

            new google.maps.Marker({
              position: pos,
              map: map,
              title: "Your Location",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
            });
          },
          () => {
            handleLocationError(true, infoWindowRef.current, map.getCenter());
          }
        );
      } else {
        handleLocationError(false, infoWindowRef.current, map.getCenter());
      }

      // マーカーの追加
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
              <p>URL： <a href=${markerData.url} target="_blank" rel="noopener">${markerData.url}</a></p>
            </div>
          </div>
        `;

        marker.addListener("click", () => {
          infoWindowRef.current.close(); // 前に開いていたInfoWindowを閉じる
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(map, marker);
        });
      });
    };

    initMap();
  }, [markers, center]);

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

const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(mapRef.current);
};

export default GoogleMapComponent;
