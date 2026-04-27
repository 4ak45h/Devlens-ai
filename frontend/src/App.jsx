import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoadingPage from "./pages/LoadingPage"
import ResultsPage from "./pages/ResultsPage"
import HowItWorks from "./pages/HowItWorks"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<LandingPage />} />
        <Route path="/analyzing"     element={<LoadingPage />} />
        <Route path="/results"       element={<ResultsPage />} />
        <Route path="/how-it-works"  element={<HowItWorks />} />
      </Routes>
    </BrowserRouter>
  )
}