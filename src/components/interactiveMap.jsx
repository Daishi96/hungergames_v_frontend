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
  const [pathMode, setPathMode] = useState(0);
  const [showPOI, setShowPOI] = useState(false);

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

  const togglePathMode = () => {
    setPathMode((prevMode) => (prevMode + 1) % 3);
  };


  // punti di interesse definiti con coordinate assiali (q,r)
  const puntiInteresse = [
    { id: 1, q: 10, r: 5, name: 'Villaggio' },
    { id: 2, q: -3, r: 8, name: 'Fiume' },
    { id: 3, q: 0, r: 0, name: 'Centro Mappa' },
    { id: 4, q: -5, r: -7, name: 'Montagna' },
  ];

  // funzione toggle punti interesse
  const togglePOI = () => setShowPOI((v) => !v);

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
      {/* Bottone per visualizzare il path */}
      <button
        onClick={togglePathMode}
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
          src="/position.png"
          alt="Mostra posizione"
          width="24"
          height="24"
          style={{ display: 'block' }}
        />
      </button>
            {/* Bottone per visualizzare i punti di interesse */}
      <button
        onClick={togglePOI}
        style={{
          position: 'fixed',
          top: 15,
          left: 160,
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
          src="/map.png"
          alt="Mostra posizione"
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
          width: '95vw',
          maxWidth: '500px',
          height: '100vh',
          backgroundColor: '#1a1a1a',
          color: 'white',
          paddingTop: '60px',
          transform: collapsed ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* intestazione fissa */}
        <div style={{ top: 100, padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Statistiche
        </div>
          <div style={{ overflowY: 'auto', flexGrow: 1, paddingBottom: '6rem', overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch', }}>
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

            <Grid className="grid-item" size={3}>
              <img 
                src="/menu_icons/armatura.png" 
                width={64}
                height={64}
                style={{
                  imageRendering: 'pixelated',
                  msInterpolationMode: 'nearest-neighbor',
                }}
              />
            </Grid>            
            <Grid className="grid-item" size={9}><Typography align="left">{stats.armaturatorso}</Typography></Grid>

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
            {/* Mostra inizio*/}
            {pathMode === 0 && path.length == 1 && (
              <>
                <Polyline positions={path} color="red" />
                <Marker position={path[0]}>
                  <Popup>Inizio</Popup>
                </Marker>
                </>
            )}

            {/* Mostra tutto il percorso (modalità 0) */}
            {pathMode === 0 && path.length > 1 && (
              <>
                <Polyline positions={path} color="red" />
                <Marker position={path[0]}>
                  <Popup>Inizio</Popup>
                </Marker>
                <Marker position={path[path.length - 1]}>
                  <Popup>Fine</Popup>
                </Marker>
              </>
            )}

              {/* Solo ultimi punti (modalità 1) */}
              {pathMode === 1 && path.length > 0 && (
                <>
                  <Polyline
                    positions={path.slice(Math.max(path.length - 3, 0))} // ultimi 3 o meno
                    color="orange"
                  />
                  {path.length === 1 && (
                    <Marker position={path[0]}>
                      <Popup>Inizio e Fine</Popup>
                    </Marker>
                  )}
                  {path.length === 2 && (
                    <>
                      <Marker position={path[0]}>
                        <Popup>Inizio</Popup>
                      </Marker>
                      <Marker position={path[1]}>
                        <Popup>Fine</Popup>
                      </Marker>
                    </>
                  )}
                  {path.length >= 3 && (
                    <>
                      <Marker position={path[path.length - 3]}>
                        <Popup>Penultimo</Popup>
                      </Marker>
                      <Marker position={path[path.length - 1]}>
                        <Popup>Attuale</Popup>
                      </Marker>
                    </>
                  )}
                </>
              )}

            {/* Solo ultimo punto (modalità 2) */}
            {pathMode === 2 && path.length > 0 && (
              <Marker position={path[path.length - 1]}>
                <Popup>Posizione attuale</Popup>
              </Marker>
            )}
          {/* Marker punti di interesse (visibili solo se showPOI=true) */}
          {showPOI &&
            puntiInteresse.map(({ id, q, r, name }) => {
              const [lat, lng] = axialToPixel(q, r);
              return (
                <Marker key={id} position={[lat, lng]}>
                  <Popup>{name}</Popup>
                </Marker>
              );
            })}
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}
