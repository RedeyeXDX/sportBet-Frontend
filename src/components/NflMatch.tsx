import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

interface Match {
  id: number;
  date: string;
  league: string;
  venue: string;
  status: string;
  homeTeam: string;
  awayTeam: string;
  score: {
    home: number | null;
    away: number | null;
  };
}

function NflMatch() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveLimit, setLiveLimit] = useState(5);
  const [upcomingLimit, setUpcomingLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { logout } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setMatches([]);
      try {
        const res = await axios.get<Match[]>(
          `http://localhost:8080/api/nfl/matches`
        );
        setMatches(res.data);
      } catch (err) {
        console.error("Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };
  const liveMatches = matches.filter((m) => m.status === "LIVE");
  const upcomingMatches = matches.filter((m) => m.status === "NS");

  const filteredLiveMatches = liveMatches.filter(
    (match) =>
      match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUpcomingMatches = upcomingMatches.filter(
    (match) =>
      match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-4 max-w bg-gray-300 m-10 mx-auto">
        <input
          type="text"
          placeholder="Search team or league"
          className="w-full mb-4 p-2 border rounded-md text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h2 className="font-bold text-lg mb-2">Live Matches</h2>
        {filteredLiveMatches.slice(0, liveLimit).map((match) => (
          <div
            key={match.id}
            className="border rounded-md p-3 mb-3 flex justify-between items-center"
          >
            <div>
              <div className="font-medium text-sm">
                {match.homeTeam} {match.score.home ?? "-"} –{" "}
                {match.score.away ?? "-"} {match.awayTeam}
              </div>
              <div className="text-xs text-gray-500">
                🏆 {match.league} • {match.venue || "Unknown"}
              </div>
            </div>
            <button className="text-white bg-blue-500 px-3 py-1 text-sm rounded">
              Bet Now
            </button>
          </div>
        ))}
        {filteredLiveMatches.length > liveLimit && (
          <button
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-sm py-2 rounded"
            onClick={() => setLiveLimit((prev) => prev + 5)}
          >
            Load More
          </button>
        )}

        <h2 className="font-bold text-lg mt-6 mb-2">Upcoming Matches</h2>
        {filteredUpcomingMatches.slice(0, upcomingLimit).map((match) => (
          <div
            key={match.id}
            className="border rounded-md p-3 mb-3 flex justify-between items-center"
          >
            <div>
              <div className="font-medium text-sm">
                {match.homeTeam}{" "}
                <span className="text-xs text-gray-600">
                  {new Date(match.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                🏟 {match.league} • {match.venue || "Unknown"}
              </div>
            </div>
            <button className="text-white bg-green-500 px-3 py-1 text-sm rounded">
              Pre-Bet
            </button>
          </div>
        ))}
        {filteredUpcomingMatches.length > upcomingLimit && (
          <button
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-sm py-2 rounded"
            onClick={() => setUpcomingLimit((prev) => prev + 5)}
          >
            Load More Upcoming Matches
          </button>
        )}
      </div>
    </>
  );
}

export default NflMatch;
