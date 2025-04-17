import { useNavigate } from "react-router-dom";

interface MatchCardProps {
  match: {
    id: number;
    date: string;
    league: string;
    venue: string;
    status: string;
    teams: {
      home: {
        name: string;
        logo: string;
      };
      away: {
        name: string;
        logo: string;
      };
    };
    score: {
      home: number | null;
      away: number | null;
    };
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();
  const isLive = match.status === "LIVE";
  const matchTime = new Date(match.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-gray-300 shadow-sm rounded-md px-4 py-3 flex items-center justify-between hover:shadow-md transition">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src={match.teams.home.logo}
              alt="home logo"
              className="w-5 h-5"
            />
            <span>{match.teams.home.name}</span>
          </div>
          <div className="font-semibold text-sm text-gray-800">
            {match.score.home ?? "-"} - {match.score.away ?? "-"}
          </div>
          <div className="flex items-center gap-2">
            <img
              src={match.teams.away.logo}
              alt="away logo"
              className="w-5 h-5"
            />
            <span>{match.teams.away.name}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {isLive ? (
            <span className="text-orange-600 font-semibold">LIVE</span>
          ) : (
            `🕒 ${matchTime}`
          )}{" "}
          • 🏟 {match.venue || "Unknown"}
        </div>
      </div>

      <button
        onClick={() => navigate(`/footballmatch/match/${match.id}`)}
        className={`text-sm px-4 py-2 rounded font-medium ${
          isLive
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {isLive ? "Bet Now" : "Pre-Bet"}
      </button>
    </div>
  );
}
