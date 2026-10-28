import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, Eye, Satellite, Info, ShieldAlert } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

const CATEGORY_DEFAULT_PHOTOS = {
  'Illegal Mining': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
  'Deforestation': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
  'Water Stress': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
  'Toxic Dumping': 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
  'Encroachment': 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
  'Land Degradation': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
};

export function MapView({
  zones = [],
  reports = [],
  selectedZone = null,
  onSelectZone,
  onSelectReport,
  isPickerMode = false,
  pickerLocation = null,
  onLocationPicked,
  className = 'h-[600px] w-full',
  isAreaSelectMode = false,
  onAreaSelected,
}) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const zoneLayersRef = useRef([]);
  const reportMarkersRef = useRef([]);
  const pickerMarkerRef = useRef(null);
  const areaCircleRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState('satellite'); // 'satellite' | 'street'

  const defaultCenter = [27.5, 76.5];
  const defaultZoom = 7;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: pickerLocation ? [pickerLocation.lat, pickerLocation.lng] : defaultCenter,
        zoom: defaultZoom,
        zoomControl: true,
      });

      leafletMapRef.current = map;

      // Handle click events
      map.on('click', (e) => {
        const lat = Number(e.latlng.lat.toFixed(5));
        const lng = Number(e.latlng.lng.toFixed(5));

        if (isPickerMode && onLocationPicked) {
          onLocationPicked({ lat, lng });
        } else if (isAreaSelectMode && onAreaSelected) {
          onAreaSelected({ lat, lng, radiusKm: 25 });
        }
      });
    }

    const map = leafletMapRef.current;

    // Reset base tiles
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (activeLayer === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri, Earthstar Geographics',
        maxZoom: 18,
      }).addTo(map);

      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);
    }
  }, [activeLayer, isPickerMode, isAreaSelectMode]);

  // Render Macro Zones
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    zoneLayersRef.current.forEach((item) => map.removeLayer(item));
    zoneLayersRef.current = [];

    zones.forEach((zone) => {
      const lat = zone.coordinates?.lat;
      const lng = zone.coordinates?.lng;
      if (!lat || !lng) return;

      const score = Math.round(zone.score);
      const isCritical = zone.riskLevel === 'CRITICAL';
      const isHigh = zone.riskLevel === 'HIGH RISK';

      let color = '#10b981';
      if (zone.riskLevel === 'WATCH') color = '#f59e0b';
      if (zone.riskLevel === 'HIGH RISK') color = '#f97316';
      if (zone.riskLevel === 'CRITICAL') color = '#ef4444';

      const radius = isCritical ? 14000 : (isHigh ? 11000 : 8000);
      const circle = L.circle([lat, lng], {
        color: color,
        fillColor: color,
        fillOpacity: isCritical ? 0.32 : 0.18,
        weight: isCritical ? 2 : 1.2,
        dashArray: isCritical ? '6, 6' : null,
        radius: radius,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-aravalli-zone-pin',
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

      const triggerSelect = () => {
        if (onSelectZone) onSelectZone(zone);
        if (isAreaSelectMode && onAreaSelected) {
          onAreaSelected({ zoneId: zone.id, zoneName: zone.name, lat, lng });
        }
      };

      marker.on('click', triggerSelect);
      circle.on('click', triggerSelect);

      zoneLayersRef.current.push(circle);
      zoneLayersRef.current.push(marker);
    });
  }, [zones, onSelectZone, isAreaSelectMode, onAreaSelected]);

  // Render Individual Stored Citizen Report Markers
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    reportMarkersRef.current.forEach((m) => map.removeLayer(m));
    reportMarkersRef.current = [];

    reports.forEach((report) => {
      const lat = parseFloat(report.latitude);
      const lng = parseFloat(report.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const score = report.riskAssessment?.score || report.riskScore || 50;
      const isCritical = score >= 76;
      const isHigh = score >= 51 && score < 76;
      const isWatch = score >= 31 && score < 51;

      let pinColor = '#10b981';
      if (isWatch) pinColor = '#f59e0b';
      if (isHigh) pinColor = '#f97316';
      if (isCritical) pinColor = '#ef4444';

      const reportIcon = L.divIcon({
        className: 'citizen-report-pin',
        html: `
          <div style="position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
            <div style="background: ${pinColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 8px ${pinColor};"></div>
          </div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const reportMarker = L.marker([lat, lng], { icon: reportIcon }).addTo(map);

      // Popup Content with thumbnail and dossier link
      const fallbackImg = CATEGORY_DEFAULT_PHOTOS[report.threatCategory] || CATEGORY_DEFAULT_PHOTOS['Illegal Mining'];
      const displayImg = report.imageUrl || fallbackImg;

      const popupHtml = `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; width: 230px; color: #f8fafc; padding: 4px;">
          <div style="border-radius: 8px; overflow: hidden; height: 90px; background: #0f172a; margin-bottom: 6px;">
            <img src="${displayImg}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${fallbackImg}'" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #34d399;">${report.id}</span>
            <span style="font-size: 9px; font-weight: bold; padding: 1px 6px; border-radius: 4px; background: ${pinColor}33; color: ${pinColor}; border: 1px solid ${pinColor}66;">
              ${score}/100
            </span>
          </div>
          <div style="font-size: 11px; font-weight: bold; color: #ffffff; margin-bottom: 2px;">
            ${report.threatCategory}
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
            ${report.locationName || 'Aravalli Range'}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #334155; padding-top: 5px;">
            <span style="font-size: 9px; text-transform: uppercase; color: #94a3b8;">${report.status?.replace('_', ' ')}</span>
            <a href="/incident/${report.id}" style="font-size: 10px; font-weight: 600; color: #10b981; text-decoration: none; padding: 2px 6px; background: #1e293b; border-radius: 4px;">
              View Case &rarr;
            </a>
          </div>
        </div>
      `;

      reportMarker.bindPopup(popupHtml, {
        className: 'custom-aravalli-popup',
        maxWidth: 260,
      });

      reportMarkersRef.current.push(reportMarker);
    });
  }, [reports]);

  // Selected Zone FlyTo
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !selectedZone || !selectedZone.coordinates) return;

    map.flyTo(
      [selectedZone.coordinates.lat, selectedZone.coordinates.lng],
      11,
      { duration: 1.2 }
    );
  }, [selectedZone]);

  // Picker Mode Pin
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
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Layer Toggle Switch */}
      <div className="absolute top-4 right-4 z-10 flex rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900/90 backdrop-blur-md p-1 shadow-xl">
        <button
          type="button"
          onClick={() => setActiveLayer('satellite')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
            activeLayer === 'satellite'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>Sentinel-2 Imagery</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveLayer('street')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
            activeLayer === 'street'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Topographic Grid</span>
        </button>
      </div>

      {/* Map Overlay Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 border border-slate-800 rounded-xl p-3 backdrop-blur-md text-[11px] font-mono space-y-1.5 shadow-xl hidden sm:block">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
          Aravalli Risk Thresholds
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-slate-300">Critical Risk (76–100)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-slate-300">High Risk (51–75)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-300">Watch Band (31–50)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-300">Safe / Baseline (0–30)</span>
        </div>
        {reports.length > 0 && (
          <div className="pt-1 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-white bg-emerald-400" />
            <span>{reports.length} Ground Incidents Mapped</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapView;
