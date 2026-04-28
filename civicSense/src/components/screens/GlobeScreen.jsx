import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { STATE_SCORES } from "../../mockData";

const STATE_CENTROIDS = {
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  Delhi: { lat: 28.7041, lng: 77.1025 },
  Maharashtra: { lat: 19.7515, lng: 75.7139 },
  Karnataka: { lat: 15.3173, lng: 75.7139 },
  "West Bengal": { lat: 24.5391, lng: 88.2434 },
  "Tamil Nadu": { lat: 11.1271, lng: 79.2787 },
  Telangana: { lat: 18.1124, lng: 79.0193 },
  Gujarat: { lat: 22.2587, lng: 71.1924 },
  Haryana: { lat: 29.0588, lng: 77.0745 },
  Punjab: { lat: 31.5497, lng: 74.3436 },
  Kerala: { lat: 10.8505, lng: 76.2711 },
  Rajasthan: { lat: 27.0238, lng: 74.2179 }
};

export const GlobeScreen = () => {
  const globeRef = useRef();
  const [selectedState, setSelectedState] = useState(null);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetch India GeoJSON
    fetch("https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        if (globeRef.current) {
          globeRef.current.pointOfView({ lat: 20, lng: 78, altitude: 2.5 }, 0);
        }
      })
      .catch(() => console.error("Failed to load GeoJSON"));
  }, []);

  const handlePolygonHover = (polygon) => {
    if (polygon) {
      polygon.properties.hover = true;
    }
  };

  const handlePolygonClick = (polygon) => {
    if (polygon?.properties?.NAME_1) {
      setSelectedState(polygon.properties.NAME_1);
      const centroid = STATE_CENTROIDS[polygon.properties.NAME_1];
      if (centroid && globeRef.current) {
        globeRef.current.pointOfView(
          {
            lat: centroid.lat,
            lng: centroid.lng,
            altitude: 1.8
          },
          1200
        );
      }
    }
  };

  const handleResetGlobe = () => {
    setSelectedState(null);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 78, altitude: 2.5 }, 1200);
    }
  };

  const getColorForScore = (stateName) => {
    const score = STATE_SCORES[stateName]?.total || 50;
    if (score > 70) return "rgba(29,158,117,0.55)";
    if (score > 50) return "rgba(239,159,39,0.55)";
    return "rgba(226,75,74,0.55)";
  };

  const polygonsData = geoData?.features.map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      color: getColorForScore(feature.properties.NAME_1)
    }
  })) || [];

  return (
    <div className="w-full h-screen bg-black relative pb-20 md:pb-0">
      {globeRef && (
        <Globe
          ref={globeRef}
          globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
          polygonsData={polygonsData}
          polygonAltitude={0.01}
          polygonCapColor={(feature) => feature.properties.color}
          polygonSideColor={() => "rgba(200, 200, 200, 0.15)"}
          polygonStrokeColor={() => "#ffffff"}
          onPolygonHover={handlePolygonHover}
          onPolygonClick={handlePolygonClick}
          backgroundColor="#0a0a1a"
          enablePointerInteraction={true}
        />
      )}

      {/* Reset button */}
      <button
        onClick={handleResetGlobe}
        className="absolute top-20 left-4 bg-white text-gray-900 px-3 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
      >
        ← All India
      </button>

      {/* Region Panel */}
      {selectedState && (
        <RegionPanel
          state={selectedState}
          onClose={() => setSelectedState(null)}
        />
      )}
    </div>
  );
};

const RegionPanel = ({ state, onClose }) => {
  const scores = STATE_SCORES[state] || {};

  const scoreItems = [
    { label: "Infrastructure", value: scores.infra, key: "infra" },
    { label: "Safety & Crime", value: scores.safety, key: "safety" },
    { label: "Civic Engagement", value: scores.civic, key: "civic" },
    { label: "Geo-Tension", value: scores.tension, key: "tension", reverse: true },
    { label: "Environment", value: scores.env, key: "env" },
    { label: "Govt Response", value: scores.govt, key: "govt" }
  ];

  const getTriptionColor = (value, reverse) => {
    if (reverse) {
      if (value > 70) return "#E24B4A";
      if (value > 50) return "#EF9F27";
      return "#1D9E75";
    } else {
      if (value > 70) return "#1D9E75";
      if (value > 50) return "#EF9F27";
      return "#E24B4A";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:right-4 md:transform md:-translate-y-1/2 z-40">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-lg md:max-w-sm max-h-96 overflow-y-auto p-4">
        {/* Handle bar for mobile */}
        <div className="flex md:hidden justify-center mb-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{state}</h3>
            <p className="text-2xl font-bold text-teal-600">{scores.total}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 text-2xl hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Score bars */}
        <div className="space-y-3 mb-4">
          {scoreItems.map((item) => (
            <div key={item.key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">
                  {item.label}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: getTriptionColor(item.value, item.reverse) }}
                >
                  {item.value}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: getTriptionColor(item.value, item.reverse)
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-teal-700 transition-colors">
          View Full Report →
        </button>
      </div>
    </div>
  );
};
