import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Controls from './pages/Controls'
import Vulnerabilite from './pages/Vulnerabilite'
import History from './pages/History'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/controls" replace />} />
          <Route path="controls" element={<Controls />} />
            <Route path="vulnerabilite" element={<Vulnerabilite />} />
            <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
