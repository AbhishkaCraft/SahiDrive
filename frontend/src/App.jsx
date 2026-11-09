import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AssumptionsModal from './components/AssumptionsModal';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
import CalculatorPage from './pages/CalculatorPage';
import RecommendPage from './pages/RecommendPage';
import { fetchAssumptions } from './api';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);
  const [assumptions, setAssumptions] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAssumptions();
        setAssumptions(data);
      } catch (err) {
        console.error('Failed to load assumptions', err);
      }
    }
    load();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
        {/* Navigation Header */}
        <Navbar onOpenAssumptions={() => setIsAssumptionsOpen(true)} />

        {/* Main Routed Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={<HomePage onOpenAssumptions={() => setIsAssumptionsOpen(true)} />}
            />
            <Route
              path="/compare"
              element={<ComparePage onOpenAssumptions={() => setIsAssumptionsOpen(true)} />}
            />
            <Route
              path="/calculator"
              element={<CalculatorPage onOpenAssumptions={() => setIsAssumptionsOpen(true)} />}
            />
            <Route
              path="/recommend"
              element={<RecommendPage onOpenAssumptions={() => setIsAssumptionsOpen(true)} />}
            />
            {/* Fallback to home */}
            <Route
              path="*"
              element={<HomePage onOpenAssumptions={() => setIsAssumptionsOpen(true)} />}
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer onOpenAssumptions={() => setIsAssumptionsOpen(true)} />

        {/* Assumptions & Methodology Drawer/Modal */}
        <AssumptionsModal
          isOpen={isAssumptionsOpen}
          onClose={() => setIsAssumptionsOpen(false)}
          assumptions={assumptions}
        />
      </div>
    </BrowserRouter>
  );
}
