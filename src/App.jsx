import React, { useState } from 'react';
import MappaInterattiva from './components/interactiveMap';
import 'leaflet/dist/leaflet.css';
//import './index.css'

function App() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pathHistory, setPathHistory] = useState([{ q: 0, r: 0 }]);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://hungergame-v.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Login riuscito. Benvenuto, ${userid}`);
        setIsLoggedIn(true);

        // Ora prendo la history dal backend
        const historyRes = await fetch(`https://hungergame-v.onrender.com/users/${userid}/history`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          // historyData = [{ q, r, timestamp, username }, ...]
          // Mappo solo q e r per la mappa
          const path = historyData.map(({ q, r }) => ({ q, r }));
          setPathHistory(path);
        } else {
          setPathHistory([{ q: 0, r: 0 }]); // fallback se non c'è storia
        }

      } else {
        setMessage(data.error || 'Errore di login');
      }
    } catch (err) {
      setMessage('Errore di connessione al server');
    }
  };

  return isLoggedIn ? (
    <MappaInterattiva userid={userid} pathHistory={pathHistory} />
  ) : (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Login Hunger Games</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="User ID" value={userid} onChange={e => setUserid(e.target.value)} /><br/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default App;