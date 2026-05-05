/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AnimatePresence, motion } from 'motion/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import NovelList from './pages/NovelList';
import NovelDetails from './pages/NovelDetails';
import ChapterReader from './pages/ChapterReader';
import WriterDashboard from './pages/WriterDashboard';
import WriterNovelManager from './pages/WriterNovelManager';
import Dashboard from './pages/Dashboard';
import Bootstrap from './components/Bootstrap';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <Home />
            </motion.div>
          } />
          <Route path="auth" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <Auth />
            </motion.div>
          } />
          <Route path="novels" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <NovelList />
            </motion.div>
          } />
          <Route path="novels/:id" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <NovelDetails />
            </motion.div>
          } />
          <Route path="read/:novelId/:chapterId" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <ChapterReader />
            </motion.div>
          } />
          <Route path="writer" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <WriterDashboard />
            </motion.div>
          } />
          <Route path="writer/novel/:id" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <WriterNovelManager />
            </motion.div>
          } />
          <Route path="dashboard" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <Dashboard />
            </motion.div>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Bootstrap />
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
