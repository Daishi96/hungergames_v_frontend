import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
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

//Netlify o Vercel

  const path = pathHistory.map(({ q, r }) => axialToPixel(q, r));

  const sidebarWidthCollapsed = 80;
  const sidebarWidthExpanded = 250;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} style={{ height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 999 }}>
             {/* Hamburger Button */}
        <Menu>
<MenuItem>
                <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'fixed',
          top: 15,
          left: collapsed ? sidebarWidthCollapsed - 60 : sidebarWidthExpanded - 230,
          zIndex: 1100,
          background: 'white',
          border: 'none',
          padding: '0.5rem',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
          transition: 'left 0.3s ease',
        }}
        aria-label={collapsed ? "Apri menu" : "Chiudi menu"}
      >
        <FaBars size={20} />
      </button>
                </MenuItem>

          <MenuItem
            style={{
              fontWeight: 'bold',
              fontSize: '1.2rem',
              whiteSpace: 'nowrap',
              cursor: 'default',
              pointerEvents: 'none',
              color: 'grey',
              paddingLeft: collapsed ? '1rem' : '1.5rem',
            }}
          >
            Statistiche
          </MenuItem>
          {stats ? (
            <>
              <MenuItem>❤️ Vita: {stats.hp}</MenuItem>
              <MenuItem>💪 Stanchezza: {stats.stamina}%</MenuItem>
              <MenuItem>🍗 Fame: {stats.hunger}%</MenuItem>
            </>
          ) : (
            <MenuItem>Caricamento...</MenuItem>
          )}
        </Menu>
      </Sidebar>

      {/* Map container */}
      <div
        style={{
          marginLeft: collapsed ? sidebarWidthCollapsed : sidebarWidthExpanded,
          transition: 'margin-left 0.3s ease',
          width: `calc(100% - ${collapsed ? sidebarWidthCollapsed : sidebarWidthExpanded}px)`,
          height: '100vh',
        }}
      >
        <MapContainer
          crs={L.CRS.Simple}
          center={[-64, 64]}
          zoom={2}
          minZoom={0}
          maxZoom={MAX_ZOOM}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer url="/tiles/{z}/{x}/{y}.png" tileSize={TILE_SIZE} noWrap />
          {pathHistory.map(({ q, r }, i) => (
            <Marker key={i} position={axialToPixel(q, r)}>
              <Popup>
                <strong>Player {i}</strong><br />
                ({q}, {r})
              </Popup>
            </Marker>
          ))}
          <Polyline positions={path} color="red" />
          <Marker position={[0, 0]}>
            <Popup>Centro</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
