import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useAuth0 } from "@auth0/auth0-react";

interface BasketballMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  venue: string;
  date: string;
  odds: {
    home: number | null;
    draw: number | null;
    away: number | null;
  };
  stats: {
    points: { home: number; away: number };
    quarters: { home: any; away: any };
    teamStats: {
      home: {
        fieldGoals: { total: number; attempts: number; percentage: number };
        threePointGoals: {
          total: number;
          attempts: number;
          percentage: number;
        };
        freeThrows: { total: number; attempts: number; percentage: number };
      };
      away: {
        fieldGoals: { total: number; attempts: number; percentage: number };
        threePointGoals: {
          total: number;
          attempts: number;
          percentage: number;
        };
        freeThrows: { total: number; attempts: number; percentage: number };
      };
    };
  };
}

type StatType = "fieldGoals" | "threePointGoals" | "freeThrows";
const statTypes: StatType[] = ["fieldGoals", "threePointGoals", "freeThrows"];

function BasketballMatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState<BasketballMatch | null>(null);
  const [selectedBet, setSelectedBet] = useState<
    "home" | "draw" | "away" | null
  >(null);
  const [stake, setStake] = useState<number>(0);
  const [betPlaced, setBetPlaced] = useState<boolean>(false);
  const { user } = useAuth0();

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/basketball/match/${id}`
        );
        setMatch(res.data);
      } catch (err) {
        console.error("Failed to fetch basketball match details", err);
      }
    };
    fetchMatchDetails();
  }, [id]);

  if (!match) return <div className="p-6 text-center">Loading...</div>;

  const getOddsValue = () => {
    if (!match || !selectedBet) return 0;
    return match.odds?.[selectedBet] ?? 0;
  };

  const handlePlaceBet = async () => {
    if (!selectedBet || !stake || stake <= 0) return;

    const auth0Id = user?.sub;

    if (!auth0Id) {
      alert("User is not authenticated.");
      return;
    }

    const betPayload = {
      auth0_id: auth0Id,
      matchId: match.id,
      team: selectedBet,
      stake,
      odds: parseFloat(getOddsValue().toString()),
    };

    try {
      await axios.post("http://localhost:8080/api/bets", betPayload);
      setBetPlaced(true);
      alert("Bet placed successfully!");
    } catch (err) {
      console.error("Failed to place bet", err);
      alert("Failed to place bet.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-2">
          {match.homeTeam} vs {match.awayTeam}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          🏀 {match.league} • 🏟 {match.venue} • 📅{" "}
          {new Date(match.date).toLocaleString()}
        </p>

        <div className="text-lg font-medium mb-4">
          🔢 Score: {match.stats.points.home} - {match.stats.points.away}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => setSelectedBet("home")}
            className={`py-2 rounded text-sm font-semibold ${
              selectedBet === "home"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {match.homeTeam} {match.odds.home}
          </button>
          <button
            onClick={() => setSelectedBet("draw")}
            className={`py-2 rounded text-sm font-semibold ${
              selectedBet === "draw"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Draw {match.odds.draw}
          </button>
          <button
            onClick={() => setSelectedBet("away")}
            className={`py-2 rounded text-sm font-semibold ${
              selectedBet === "away"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-800"
            }`}
          >
            {match.awayTeam} {match.odds.away}
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">💸 Stake (₦)</label>
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            className="w-full p-2 border rounded text-sm"
            placeholder="Enter your stake"
          />
        </div>

        {selectedBet && stake > 0 && (
          <div className="bg-gray-100 border rounded p-3 text-sm mb-4">
            <p>
              <strong>You bet:</strong>{" "}
              {selectedBet === "home"
                ? match.homeTeam
                : selectedBet === "away"
                ? match.awayTeam
                : "Draw"}{" "}
              WIN, ${stake.toLocaleString()} @ {match.odds[selectedBet]}
            </p>
            <p>
              💰 <strong>Potential winnings:</strong> $
              {(stake * getOddsValue()).toLocaleString()}
            </p>
          </div>
        )}

        <button
          onClick={handlePlaceBet}
          disabled={!selectedBet || stake <= 0}
          className="w-full bg-indigo-600 text-white py-2 rounded font-semibold"
        >
          Place Bet
        </button>

        {betPlaced && (
          <div className="bg-green-100 p-4 rounded mt-4 text-sm">
            Bet placed successfully!
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-bold text-lg mb-2">📊 Team Stats</h3>
          {statTypes.map((type) => (
            <div key={type} className="mb-3">
              <div className="text-sm font-semibold capitalize">
                {type.replace(/([A-Z])/g, " $1")}
              </div>
              <div className="text-xs text-gray-600">
                {match.homeTeam}: {match.stats.teamStats.home[type].total}/
                {match.stats.teamStats.home[type].attempts} (
                {match.stats.teamStats.home[type].percentage}%)
              </div>
              <div className="text-xs text-gray-600">
                {match.awayTeam}: {match.stats.teamStats.away[type].total}/
                {match.stats.teamStats.away[type].attempts} (
                {match.stats.teamStats.away[type].percentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BasketballMatchDetail;
