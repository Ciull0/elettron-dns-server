import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";

function Hello() {
  const [requests, setRequests] = useState([
    {host:"localhost", url:"prova", request:{headers:"this should be key pair", body:"dsf"}},
    {host:"localhost", url:"prova", request:{headers:"this should be key pair", body:"dsf"}},
    {host:"localhost", url:"prova", request:{headers:"this should be key pair", body:"dsf"}},
    {host:"localhost", url:"prova", request:{headers:"this should be key pair", body:"dsf"}}

  ]);
  
  console.log('aaaaaaaaaaaaaaaa');

  const columns = [
    {field: 'host', header: 'Host'},
    {field: 'url', header: 'Url'},
    {field: 'request.body', header: 'Requst body'},
    {field: 'request.headers', header: 'Request headers'}
];
  window.electron.ipcRenderer.on('request:new', (arg: Object) => {
    console.log('sssss', arg);
    setRequests(requests.concat([arg]));
  });
  return (
    
    <DataTable value={requests} tableStyle={{ minWidth: '50rem' }}>
    {columns.map((col, i) => (
        <Column key={col.field} field={col.field} header={col.header} />
    ))}
</DataTable>
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
