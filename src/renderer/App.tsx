import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function Hello() {
  const [requests, setRequests] = useState([]);
  const [localUrl, setLocalUrl] = useState('');
  const [remoteUrl, setRemoteUrl] = useState('');
  const [activeRedirects, setActiveRedirects] = useState([]);

  const columns = [
    { field: 'host', header: 'Host' },
    { field: 'url', header: 'Url' },
    { field: 'method', header: 'Method' },
    { field: 'headers.User-Agent', header: 'User Agent' },
    { field: 'headers.Proxy-Connection', header: 'Proxy connection' },
  ];

  function addRedirect() {
    window.electron.ipcRenderer.sendMessage('newRedirect', {
      local: localUrl,
      remote: remoteUrl,
    });
    setActiveRedirects(
      activeRedirects.concat([
        {
          local: localUrl,
          remote: remoteUrl,
        },
      ]),
    );
    console.log(activeRedirects);
  }

  window.electron.ipcRenderer.on('request:new', (arg: Object) => {
    setRequests(requests.concat([arg]));
  });

  return (
    <Splitter style={{ gap: '24px', width: '100%' }}>
      <SplitterPanel size={25} style={{ flexFlow: 'column', gap: '16px' }}>
        <InputText
          onChange={(e) => {
            setLocalUrl(e.target.value);
          }}
          placeholder="Local Url"
        />
        <InputText
          onChange={(e) => {
            setRemoteUrl(e.target.value);
          }}
          placeholder="Remote Url"
        />
        <Button
          onClick={() => {
            addRedirect();
          }}
        >
          Aggiungi Redirect
        </Button>
        <Button
          onClick={() => {
            setRequests([]);
          }}
        >
          Cancella Richieste
        </Button>
      </SplitterPanel>
      <SplitterPanel size={75}>
        <DataTable value={requests} tableStyle={{ minWidth: '50rem' }}>
          {columns.map((col, i) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
        </DataTable>
      </SplitterPanel>
    </Splitter>
  );
}

export default function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}
