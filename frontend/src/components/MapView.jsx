import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, Eye, Satellite, Info } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

export function MapView({
  zones = [],
  selectedZone = null,
  onSelectZone,
  isPickerMode = false,
  pickerLocation = null,
  onLocationPicked,
  className = 'h-[600px] w-full',
}) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const pickerMarkerRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState('satellite'); // 'satellite' | 'street'

  // Default center: Aravalli Range centroid between Haryana and Rajasthan
  const defaultCenter = [27.5, 76.5];
  const defaultZoom = 7;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: pickerLocation ? [pickerLocation.lat, pickerLocation.lng] : defaultCenter,
        zoom: defaultZoom,
        zoomControl: true,
      });

      leafletMapRef.current = map;

      // Handle click for picker mode
      map.on('click', (e) => {
        if (onLocationPicked) {
          onLocationPicked({
            lat: Number(e.latlng.lat.toFixed(5)),
            lng: Number(e.latlng.lng.toFixed(5)),
          });
        }
      });
    }

    const map = leafletMapRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add selected Tile Layer
    if (activeLayer === 'satellite') {
      // Esri World Imagery (High-res satellite view)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      }).addTo(map);

      // Add faint boundary labels
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
      }).addTo(map);
    } else {
      // CartoDB Dark Matter / Street view
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);
    }

    return () => {
      // Cleanup on unmount
    };
  }, [activeLayer]);

  // Update Zone Markers and Polygons
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Clear existing zone markers & circles
    markersRef.current.forEach((item) => map.removeLayer(item));
    markersRef.current = [];

    // Render zones
    zones.forEach((zone) => {
      const lat = zone.coordinates.lat;
      const lng = zone.coordinates.lng;
      const score = zone.scoreInteger || Math.round(zone.score);
      const isCritical = zone.riskLevel === 'CRITICAL';
      const isHigh = zone.riskLevel === 'HIGH RISK';

      // Pick color
      let color = '#10b981'; // Green
      if (zone.riskLevel === 'WATCH') color = '#f59e0b'; // Amber
      if (zone.riskLevel === 'HIGH RISK') color = '#f97316'; // Orange
      if (zone.riskLevel === 'CRITICAL') color = '#ef4444'; // Red

      // Outer radial risk circle (indicates eco-sensitive buffer)
      const radius = isCritical ? 14000 : (isHigh ? 11000 : 8000);
      const circle = L.circle([lat, lng], {
        color: color,
        fillColor: color,
        fillOpacity: isCritical ? 0.35 : 0.22,
        weight: isCritical ? 2.5 : 1.5,
        dashArray: isCritical ? '6, 6' : null,
        radius: radius,
      }).addTo(map);

      // Custom HTML Marker with pulsing badge
      const customIcon = L.divIcon({
        className: 'custom-aravalli-pin',
        html: `
          <div style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            ${isCritical ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: ${color}; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #0f172a; border: 2.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.8); z-index: 10;">
              <span style="font-size: 10px; font-weight: 800; font-family: monospace; color: ${color};">${score}</span>
            </div>
            <div style="position: absolute; bottom: -20px; white-space: nowrap; font-size: 11px; font-weight: 600; color: #f8fafc; background: rgba(15, 23, 42, 0.85); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15); pointer-events: none; text-shadow: 0 1px 2px black;">
              ${zone.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Clicking marker opens detail drawer
      marker.on('click', () => {
        if (onSelectZone) {
          onSelectZone(zone);
        }
      });
      circle.on('click', () => {
        if (onSelectZone) {
          onSelectZone(zone);
        }
      });

      markersRef.current.push(circle);
      markersRef.current.push(marker);
    });
  }, [zones, onSelectZone]);

  // Update Selected Zone view flyTo
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !selectedZone) return;

    map.flyTo(
      [selectedZone.coordinates.lat, selectedZone.coordinates.lng],
      11,
      { duration: 1.2 }
    );
  }, [selectedZone]);

  // Picker Mode: Render interactive pin for report location
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (pickerMarkerRef.current) {
      map.removeLayer(pickerMarkerRef.current);
      pickerMarkerRef.current = null;
    }

    if (pickerLocation && pickerLocation.lat && pickerLocation.lng) {
      const pinIcon = L.divIcon({
        className: 'picker-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; animation: bounce 1s infinite;">
            <div style="background: #ef4444; color: white; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 2px solid white;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: white;"></div>
            </div>
            <div style="font-size: 10px; font-weight: bold; background: #111827; color: #f87171; padding: 2px 6px; border-radius: 4px; border: 1px solid #ef4444; margin-top: 4px; white-space: nowrap;">
              GPS Target
            </div>
          </div>
        `,
        iconSize: [32, 48],
        iconAnchor: [16, 44],
      });

      pickerMarkerRef.current = L.marker([pickerLocation.lat, pickerLocation.lng], { icon: pinIcon }).addTo(map);
      map.panTo([pickerLocation.lat, pickerLocation.lng]);
    }
  }, [pickerLocation]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer Switcher & Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-xl">
        <button
          onClick={() => setActiveLayer('satellite')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeLayer === 'satellite'
              ? 'bg-emerald-500 text-white font-semibold shadow'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Satellite remote sensing imagery"
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>Sentinel Satellite</span>
        </button>
        <button
          onClick={() => setActiveLayer('street')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeLayer === 'street'
              ? 'bg-emerald-500 text-white font-semibold shadow'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Topographic boundary map"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Topographic</span>
        </button>
      </div>

      {/* Picker Mode Instruction Banner */}
      {isPickerMode && (
        <div className="absolute top-4 left-4 z-20 bg-rose-950/90 border border-rose-500/40 text-rose-200 px-4 py-2 rounded-xl backdrop-blur-md shadow-xl text-xs flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4 text-rose-400" />
          <span><strong>Click anywhere on map</strong> to pinpoint coordinates for your threat report</span>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 shadow-2xl max-w-xs text-xs space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <span className="font-bold text-slate-200 font-mono">RISK ENGINE LEVELS</span>
          <span className="text-[10px] text-slate-400">Score 0–100</span>
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-slate-300">SAFE (0–30)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="text-slate-300">WATCH (31–50)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
            <span className="text-slate-300">HIGH (51–75)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
            <span className="text-rose-400 font-bold">CRITICAL (76–100)</span>
          </div>
        </div>
        <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-1 border-t border-slate-800/80">
          <Info className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          <span>Click any marker to inspect telemetry & signals</span>
        </div>
      </div>
    </div>
  );
}

export default MapView;
