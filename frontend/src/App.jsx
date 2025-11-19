import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Controls from './pages/Controls'
import Risks from './pages/Risks'
import History from './pages/History'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="controls" element={<Controls />} />
          <Route path="risks" element={<Risks />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
