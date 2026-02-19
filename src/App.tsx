import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import SentinelPage from './components/SentinelPage'
import EnterSystemPage from './components/EnterSystemPage'
import EngineeringPortal from './components/EngineeringPortal'
import NodePage from './components/nodes/NodePage'
import MarketingPage from './components/MarketingPage'

function AppRoutes() {
  const navigate = useNavigate()
  // TEMPORARY: client-side gate only.

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
            onEnterEngineering={() => navigate('/engineering')}
            onNodeClick={(nodeId: string) => navigate(`/product/${nodeId}`)}
          />
        }
      />
      <Route
        path="/enter-system"
        element={<EnterSystemPage onBack={() => navigate('/')} />}
      />
      <Route
        path="/sentinel"
        element={<SentinelPage onBack={() => navigate('/')} />}
      />
      <Route
        path="/node/mantrix"
        element={<NodePage nodeId="mantrix" onBack={() => navigate('/')} />}
      />
      <Route
        path="/node/innersense"
        element={<NodePage nodeId="innersense" onBack={() => navigate('/')} />}
      />
      <Route
        path="/node/caliber"
        element={<NodePage nodeId="caliber" onBack={() => navigate('/')} />}
      />
      <Route
        path="/node/meridia"
        element={<NodePage nodeId="meridia" onBack={() => navigate('/')} />}
      />
      <Route
        path="/node/compass"
        element={<NodePage nodeId="compass" onBack={() => navigate('/')} />}
      />
      <Route
        path="/product/:id"
        element={<MarketingPage onBack={() => navigate('/')} onViewEngineering={(id: string) => navigate(`/engineering/${id}`)} />}
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

