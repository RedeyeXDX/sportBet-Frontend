import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import FootballMatch from "./components/FootballMatch";
import BasketballMatch from "./components/BasketballMatch";
import NflMatch from "./components/NflMatch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/footballmatch" element={<FootballMatch />} />
        <Route path="/basketballmatch" element={<BasketballMatch />} />
        <Route path="/nflmatch" element={<NflMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
