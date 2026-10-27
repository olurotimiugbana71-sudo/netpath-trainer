// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScenarioSelector } from './pages/ScenarioSelector';
import { ScenarioDetail } from './pages/ScenarioDetail';
import { Activate } from './pages/Activate';
import { Purchase } from './pages/Purchase';
import { Footer } from './components/Footer';
import './App.css';

const BASENAME = import.meta.env.BASE_URL;

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ScenarioSelector />} />
            <Route path="/scenario/:id" element={<ScenarioDetail />} />
            <Route path="/activate" element={<Activate />} />
            <Route path="/purchase" element={<Purchase />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}