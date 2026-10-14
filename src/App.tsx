// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScenarioSelector } from './pages/ScenarioSelector';
import { ScenarioDetail } from './pages/ScenarioDetail';
import { Activate } from './pages/Activate';
import { Footer } from './components/Footer';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ScenarioSelector />} />
            <Route path="/scenario/:id" element={<ScenarioDetail />} />
            <Route path="/activate" element={<Activate />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}