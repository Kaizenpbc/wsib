import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './pages/Dashboard'
import AIAssistant from './pages/AIAssistant'
import RfpUpload from './pages/RfpUpload'
import StandardsUpload from './pages/StandardsUpload'
import BusinessRequirements from './pages/BusinessRequirements'
import CurriculumDesignChat from './pages/CurriculumDesignChat'
import OutputGeneration from './pages/OutputGeneration'
import ComplianceDashboard from './pages/ComplianceDashboard'
import Layout from './components/layout/Layout'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/rfp-upload" element={<RfpUpload />} />
            <Route path="/standards-upload" element={<StandardsUpload />} />
            <Route path="/brd" element={<BusinessRequirements />} />
            <Route path="/curriculum/:id" element={<CurriculumDesignChat />} />
            <Route path="/outputs/:id" element={<OutputGeneration />} />
            <Route path="/compliance/:id" element={<ComplianceDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App

