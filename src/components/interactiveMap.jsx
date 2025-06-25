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
  const [tileSet, setTileSet] = useState(1); 

  useEffect(() => {
    fetch(`https://hungergame-v.onrender.com/users/${userid}/stats`)
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, [userid]);

  const path = pathHistory.map(({ q, r }) => axialToPixel(q, r));

  // Funzione per cambiare tiles
  const toggleTiles = () => {
    setTileSet(tileSet === 1 ? 2 : 1);
  };

  // URL TileLayer in base allo stato tileSet
  const tileUrl = tileSet === 1
    ? '/tiles/base/{z}/{x}/{y}.png'
    : '/tiles/coordinates/{z}/{x}/{y}.png';

  return (
    <div className="login-background" style={{ height: '100vh', position: 'relative' }}>
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

      {/* Bottone per cambiare tiles */}
      <button
        onClick={toggleTiles}
        style={{
          position: 'fixed',
          top: 15,  // sotto l'hamburger
          left: 60,
          zIndex: 1101,
          background: 'white',
          border: 'none',
          padding: '0.5rem',
          borderRadius: '50px',
          cursor: 'pointer',
          color: 'white',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
        }}
      >
      <img
      src="/layer.png"
      alt="Cambia Tiles"
      width="24"
      height="24"
      style={{ display: 'block' }}
    />
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
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 bg-zinc-900 text-white p-4 rounded-md border border-zinc-700">
              <div className="col-span-2">🧍 Nome: {stats.nome}</div>
              <div className="col-span-2 flex gap-x-2">
                <div>🗡️ Arma: {stats.arma}</div>
                <div>💼 Slot Arma: {stats.slotarma}</div>
              </div>
              <div className="col-span-2 flex gap-x-2">
                <div>🧤 Armatura Braccia: {stats.armaturabraccia}</div>
                <div>💪 Slot Braccia: {stats.slotbraccia}</div>
              </div>
              <div>🛡️ Armatura Testa: {stats.armaturatesta}</div>
              <div>🦺 Armatura Torso: {stats.armaturatorso}</div>
              <div>👖 Armatura Gambe: {stats.armaturagambe}</div>
              <div>❤️ Vita: {stats.hp}</div>
              <div>🍗 Fame: {stats.fame}</div>
              <div>💪 Stanchezza: {stats.stanchezza}</div>
              <div>📍 Posizione: {stats.posizione}</div>
              <div>🌦️ Clima: {stats.clima}</div>
              <div>🕒 Fascia Oraria: {stats.fascia_oraria}</div>
              <div>🔁 Turno: {stats.turno}</div>
            </div>
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

        <TileLayer url={tileUrl} tileSize={TILE_SIZE} noWrap />
        <Polyline positions={path} color="red" />
        {path.length > 0 && (
          <>
            <Marker position={path[0]}>
              <Popup>Inizio</Popup>
            </Marker>
            <Marker position={path[path.length - 1]}>
              <Popup>Fine</Popup>
            </Marker>
          </>
        )}
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}
