import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import FootballMatch from "./components/FootballMatch";
import BasketballMatch from "./components/BasketballMatch";
import NflMatch from "./components/NflMatch";
import BalanceForm from "./components/BalanceForm";
import FootballmatchDetail from "./components/FootballMatchDetail";
import BasketballMatchDetail from "./components/BasketballMatchDetail";
import BetHistory from "./components/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/footballmatch" element={<FootballMatch />} />
        <Route path="/basketballmatch" element={<BasketballMatch />} />
        <Route path="/nflmatch" element={<NflMatch />} />
        <Route path="/balanceform" element={<BalanceForm />} />
        <Route path="betHistory" element={<BetHistory />} />
        <Route
          path="/footballmatch/match/:id"
          element={<FootballmatchDetail />}
        />
        <Route
          path="/basketballmatch/match/:id"
          element={<BasketballMatchDetail />}
        />
      </Routes>
    </Router>
  );
}

export default App;
