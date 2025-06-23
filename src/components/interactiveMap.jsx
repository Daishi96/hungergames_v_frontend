import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { FaBars } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import '../index.css';

const TILE_SIZE = 128;
const MAX_ZOOM = 4;

function axialToPixel(q, r) {
  const centerX = 64;
  const centerY = -64;
  const correction = r !== 0 ? 0.0625 * (Math.abs(r) - 1) : 0;
  const diagonalX = r * 2.4375 - correction;
  const diagonalY = r * 1.375 - correction;
  const verticalY = q * 2.625;
  const x = centerX + diagonalX;
  const y = centerY + verticalY - diagonalY;
  return [y, x];
}

export default function MappaInterattiva({ userid, pathHistory }) {
  const [collapsed, setCollapsed] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`https://hungergame-v.onrender.com/users/${userid}/stats`)
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, [userid]);

  const path = pathHistory.map(({ q, r }) => axialToPixel(q, r));

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* Bottone hamburger */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'fixed',
          top: 15,
          left: 15,
          zIndex: 1101,
          background: 'white',
          border: 'none',
          padding: '0.5rem',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
        }}
        aria-label="Apri/chiudi menu"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar custom senza libreria */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '500px',
          height: '100vh',
          backgroundColor: '#1a1a1a',
          color: 'white',
          paddingTop: '4rem',
          transform: collapsed ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
          zIndex: 1100,
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Statistiche
        </div>
        {stats ? (
          <>
            <div className="pro-menu-item">❤️ Vita: {stats.hp}</div>
            <div className="pro-menu-item">💪 Stanchezza: {stats.stamina}%</div>
            <div className="pro-menu-item">🍗 Fame: {stats.hunger}%</div>
          </>
        ) : (
          <div className="pro-menu-item">Caricamento...</div>
        )}
      </div>

      {/* Mappa */}
      <MapContainer
        crs={L.CRS.Simple}
        center={[-64, 64]}
        zoom={2}
        minZoom={0}
        maxZoom={MAX_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer url="/tiles/{z}/{x}/{y}.png" tileSize={TILE_SIZE} noWrap />
        <Polyline positions={path} color="red" />
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}
