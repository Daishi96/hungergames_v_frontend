import React, { useState } from 'react';
import MappaInterattiva from './components/interactiveMap';
import 'leaflet/dist/leaflet.css';
import './App.css'; // importa il file CSS

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

        const historyRes = await fetch(`https://hungergame-v.onrender.com/users/${userid}/history`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          const path = historyData.map(({ x, y }) => ({ q: Number(y), r: Number(x) }));
          setPathHistory(path);
        } else {
          setPathHistory([{ q: 0, r: 0 }]);
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
    <div className="login-background">
      <div className="login-box">
        <h2>Hunger James</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="User ID" value={userid} onChange={e => setUserid(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">Entra nell'arena</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default App;