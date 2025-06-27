import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { FaBars } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import '../index.css';
import { Grid, Typography } from '@mui/material';

const TILE_SIZE = 128;
const MAX_ZOOM = 4;

function axialToPixel(q, r) {
  const centerX = 64;
  const centerY = -64;

  const diagonalX = r * 2.375; // spostamento orizzontale "a scatti"
  const correctionY = r * 0.0625;
  const diagonalY = r * 1.375 - correctionY;

  const verticalY = q * 2.625;

  const x = centerX + diagonalX;
  const y = centerY + verticalY - diagonalY;

  return [y, x];
}



export default function MappaInterattiva({ userid, pathHistory }) {
  const [collapsed, setCollapsed] = useState(true);
  const [stats, setStats] = useState(null);
  const [tileSet, setTileSet] = useState(1);

  const refreshData = () => {
    fetch(`https://hungergame-v.onrender.com/users/${userid}/stats`)
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
    // eventualmente qui puoi aggiornare anche pathHistory, se dinamico
  };

  useEffect(() => {
    refreshData();
  }, [userid]);

  const path = pathHistory.map(({ q, r }) => axialToPixel(q, r));
  
  useEffect(() => {
  console.log("Coordinate path:");
  path.forEach((pos, index) => {
    console.log(`Punto ${index}: [lat: ${pos[0]}, lng: ${pos[1]}]`);
  });
}, [path]);

  const toggleTiles = () => {
    setTileSet(tileSet === 1 ? 2 : 1);
  };

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
          top: 15,
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

      {/* Bottone per Refresh */}
      <button
        onClick={refreshData}
        style={{
          position: 'fixed',
          top: 15,
          left: 110,
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
          src="/refresh.png"
          alt="Cambia Tiles"
          width="24"
          height="24"
          style={{ display: 'block' }}
        />
      </button>

      {/* Sidebar custom */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '95vw',               // responsive
          maxWidth: '500px',  
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
          <Grid container spacing={2} sx={{ backgroundColor: '#1a1a1a', color: 'white', p: 2, borderRadius: 2, border: '1px solid #444' }}>
            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Nome:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.userid}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Turno:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.turno}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Vita:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.hp}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Fame:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.fame}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Stanchezza:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.stanchezza}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Posizione:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.posizione}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Arma:</strong></Typography></Grid>
            <Grid className="grid-item" size={5}><Typography variant="body1" align="left">{stats.arma}</Typography></Grid>
            <Grid className="grid-item" size={3}><Typography variant="body1"><strong>Slot:</strong> {stats.slotarma}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Armatura Braccia:</strong></Typography></Grid>
            <Grid className="grid-item" size={5}>
              <Typography variant="body1"> {stats.armaturabraccia}</Typography>
            </Grid>
            <Grid className="grid-item" size={3}>
              <Typography variant="body1" ><strong>Slot:</strong> {stats.slotbraccia}</Typography>
            </Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Armatura Testa:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.armaturatesta}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Armatura Torso:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.armaturatorso}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Armatura Gambe:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.armaturagambe}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Clima:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.clima}</Typography></Grid>

            <Grid className="grid-item" size={4}><Typography variant="body1"><strong>Fascia Oraria:</strong></Typography></Grid>
            <Grid className="grid-item" size={8}><Typography align="left">{stats.fascia_oraria}</Typography></Grid>


          </Grid>
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
                  <Marker position={[0,0]}> 
            <Popup>Centro</Popup>
          </Marker>
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}
