import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

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
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth0();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
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

  return (
    <>
      <nav className="flex justify-between items-center p-6 shadow bg-white">
        <div className="text-2xl font-bold">SportBet</div>
        <div className="space-x-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Log out
          </button>
        </div>
      </nav>
      <div className="p-4 max-w bg-gray-300 m-10 mx-auto">
        <input
          type="text"
          placeholder="Search team or league"
          className="w-full mb-4 p-2 border rounded-md text-sm"
        />

        <h2 className="font-bold text-lg mb-2">Live Matches</h2>
        {liveMatches.slice(0, limit).map((match) => (
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

        <h2 className="font-bold text-lg mt-6 mb-2">Upcoming Matches</h2>
        {upcomingMatches.slice(0, limit).map((match) => (
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
            <button className="text-white bg-green-500 px-3 py-1 text-sm rounded m-[1px]">
              Pre-Bet
            </button>
          </div>
        ))}

        {(liveMatches.length > limit || upcomingMatches.length > limit) && (
          <button
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-sm py-2 rounded"
            onClick={() => setLimit((prev) => prev + 5)}
          >
            Load More
          </button>
        )}
      </div>
    </>
  );
}

export default NflMatch;
