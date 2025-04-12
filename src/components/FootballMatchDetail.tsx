import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useAuth0 } from "@auth0/auth0-react";

interface MatchDetail {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  venue: string;
  date?: string;
  score?: {
    home: number;
    away: number;
  };
  stats: {
    type: string;
    home: string | number;
    away: string | number;
  }[];
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

function FootballmatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState<MatchDetail | null>(null);
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
          `http://localhost:8080/api/football/match/${id}`
        );
        setMatch(res.data);
      } catch (err) {
        console.error("Failed to fetch match details", err);
      }
    };

    fetchMatchDetails();
  }, [id]);

  if (!match)
    return <div className="p-6 text-center">Loading match details...</div>;

  const getOddsValue = () => {
    if (!match || !selectedBet) return 0;
    return match.odds?.[selectedBet] ?? 0;
  };

  const potentialWinnings = (stake * getOddsValue()).toFixed(2);

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

  function getBarWidth(
    home: string | number,
    away: string | number,
    isHome: boolean
  ) {
    const [h, a] = [
      parseFloat(home as string) || 0,
      parseFloat(away as string) || 0,
    ];
    const total = h + a || 1;
    return ((isHome ? h : a) / total) * 100;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {match.homeTeam} vs {match.awayTeam}
          </h2>
          {match.score && (
            <div className="text-lg font-semibold bg-gray-100 px-3 py-1 rounded">
              {match.score.home} - {match.score.away}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <p>
            📅{" "}
            {match.date ? new Date(match.date).toDateString() : "Date Unknown"}
          </p>
          <p>
            🏆 {match.league} • 🏟 {match.venue}
          </p>
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

        <div className="my-4">
          <label className="block text-sm mb-1 font-medium">
            💸 Stake Amount ($)
          </label>
          <input
            type="text"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            className="w-full p-2 border rounded text-sm"
            placeholder="Enter your stake"
          />
        </div>

        {selectedBet && stake > 0 && (
          <div className="bg-gray-50 border rounded p-3 mb-4 text-sm">
            <p>
              ✅ <strong>You bet:</strong>{" "}
              {selectedBet === "home"
                ? match.homeTeam
                : selectedBet === "away"
                ? match.awayTeam
                : "Draw"}{" "}
              WIN, ${stake.toLocaleString()} @ {match.odds[selectedBet]}
            </p>
            <p>
              💰 <strong>Potential winnings:</strong> $
              {parseFloat(potentialWinnings).toLocaleString()}
            </p>
          </div>
        )}

        <button
          disabled={!selectedBet || stake <= 0}
          onClick={handlePlaceBet}
          className="w-full bg-indigo-600 text-white py-2 rounded font-semibold"
        >
          Place Bet
        </button>

        {betPlaced && selectedBet && (
          <div className="bg-green-100 p-4 rounded mt-4 text-sm">
            <p>
              ✅ <strong>Bet placed:</strong>{" "}
              {selectedBet === "home"
                ? match.homeTeam
                : selectedBet === "away"
                ? match.awayTeam
                : "Draw"}{" "}
              WIN, ${stake.toLocaleString()} @ {match.odds[selectedBet]}
            </p>
            <p>
              💰 <strong>Potential winnings:</strong> $
              {parseFloat(potentialWinnings).toLocaleString()}
            </p>
          </div>
        )}

        <div className="mt-6">
          {match.stats.map((stat) => (
            <div key={stat.type} className="mb-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{stat.home}</span>
                <span className="font-semibold">{stat.type}</span>
                <span>{stat.away}</span>
              </div>
              <div className="flex h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="bg-blue-500"
                  style={{
                    width: `${getBarWidth(stat.home, stat.away, true)}%`,
                  }}
                ></div>
                <div
                  className="bg-green-500"
                  style={{
                    width: `${getBarWidth(stat.home, stat.away, false)}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FootballmatchDetail;
