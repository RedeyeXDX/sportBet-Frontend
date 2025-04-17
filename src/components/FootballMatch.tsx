import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./Navbar";
import MatchGroups from "./MatchGroup";

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

function FootballMatch() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { logout } = useAuth0();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Match[]>(
          "http://localhost:8080/api/football/matches"
        );
        setMatches(res.data);
      } catch (err) {
        console.error("Failed to load matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filteredMatches = matches.filter(
    (match) =>
      match.teams.home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.teams.away.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <input
          type="text"
          placeholder="Search team"
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300 mb-6"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <MatchGroups matches={filteredMatches} loading={loading} />
      </div>
    </>
  );
}

export default FootballMatch;
