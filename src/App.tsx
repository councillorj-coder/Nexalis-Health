import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import RigiSensePage from './components/RigiSensePage'
import EnterSystemPage from './components/EnterSystemPage'
import EngineeringPortal from './components/EngineeringPortal'

function AppRoutes() {
  const navigate = useNavigate()
  // TEMPORARY: client-side gate only.
  const ENGINEERING_PORTAL_PASSWORD = 'nexalis'

  const handleInactiveNode = (nodeName: string) => {
    console.log(`${nodeName} navigation triggered. Node is currently inactive.`)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onEnterOverview={() => navigate('/enter-system')}
            engineeringPassword={ENGINEERING_PORTAL_PASSWORD}
            onEnterEngineering={() => navigate('/engineering')}
          />
        }
      />
      <Route
        path="/enter-system"
        element={<EnterSystemPage onBack={() => navigate('/')} />}
      />
      <Route
        path="/rigisense"
        element={<RigiSensePage onBack={() => navigate('/')} />}
      />
      <Route
        path="/engineering/*"
        element={<EngineeringPortal />}
      />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

