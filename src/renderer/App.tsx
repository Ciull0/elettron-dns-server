import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';

function Hello() {
  const [requests, setRequests] = useState([]);
  console.log('aaaaaaaaaaaaaaaa');

  window.electron.ipcRenderer.on('request:new', (arg: Object) => {
    console.log('sssss', arg);
    setRequests(requests.concat([arg]));
  });
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <ul>
        {requests.map((req) => {
          return <li>{req.url}</li>;
        })}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
