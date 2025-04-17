import MatchCard from "./MatchCard";

interface Match {
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
}

interface MatchGroupsProps {
  matches: Match[];
  loading: boolean;
}

export default function MatchGroups({ matches, loading }: MatchGroupsProps) {
  const grouped = matches.reduce((acc: Record<string, Match[]>, match) => {
    if (!acc[match.league]) acc[match.league] = [];
    acc[match.league].push(match);
    return acc;
  }, {});

  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-500">Loading matches...</p>
      ) : (
        Object.entries(grouped).map(([league, matches]) => (
          <div key={league} className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 border-b pb-1 mb-2">
              {league}
            </h2>
            <div className="space-y-3">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
