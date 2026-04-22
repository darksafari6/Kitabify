/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import NovelList from './pages/NovelList';
import NovelDetails from './pages/NovelDetails';
import ChapterReader from './pages/ChapterReader';
import WriterDashboard from './pages/WriterDashboard';
import WriterNovelManager from './pages/WriterNovelManager';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="auth" element={<Auth />} />
            <Route path="novels" element={<NovelList />} />
            <Route path="novels/:id" element={<NovelDetails />} />
            <Route path="read/:novelId/:chapterId" element={<ChapterReader />} />
            <Route path="writer" element={<WriterDashboard />} />
            <Route path="writer/novel/:id" element={<WriterNovelManager />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
