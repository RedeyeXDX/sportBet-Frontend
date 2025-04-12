import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./Navbar";

interface Bet {
  match_id: number;
  team?: string;
  stake: number;
  odds: number;
  status: string;
  created_at: string;
  payout?: number;
  bet_choice: string;
}

interface MatchInfo {
  homeTeam: string;
  awayTeam: string;
}

function BetHistory() {
  const { user } = useAuth0();
  const [pendingBets, setPendingBets] = useState<Bet[]>([]);
  const [settledBets, setSettledBets] = useState<Bet[]>([]);
  const [matchDetails, setMatchDetails] = useState<Record<number, MatchInfo>>(
    {}
  );

  useEffect(() => {
    if (user) {
      const fetchBetHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/users/${user.sub}/bets`
          );

          setPendingBets(response.data.pending);
          setSettledBets(response.data.settled);

          // ✅ Extract match IDs here
          const allMatchIds = [
            ...response.data.pending,
            ...response.data.settled,
          ].map((b: Bet) => b.match_id);
          fetchMatchDetails(allMatchIds);
        } catch (error) {
          console.error("Error fetching bet history", error);
        }
      };

      fetchBetHistory();
    }
  }, [user]);

  const fetchMatchDetails = async (matchIds: number[]) => {
    const matchPromises = matchIds.map(async (id) => {
      try {
        const res = await axios.get(`http://localhost:8080/match/${id}`);
        return { id, data: res.data };
      } catch (err) {
        console.error("Failed to fetch match", id);
        return null;
      }
    });

    const results = await Promise.all(matchPromises);
    const matchMap: Record<number, MatchInfo> = {};
    results.forEach((res) => {
      if (res && res.data) {
        matchMap[res.id] = {
          homeTeam: res.data.home_team,
          awayTeam: res.data.away_team,
        };
      }
    });

    setMatchDetails(matchMap);
  };

  const renderBetCard = (bet: Bet) => (
    <div key={bet.match_id} className="border-b py-2">
      <div className="flex justify-between">
        <span>
          {matchDetails[bet.match_id]
            ? `${matchDetails[bet.match_id].homeTeam} vs ${
                matchDetails[bet.match_id].awayTeam
              }`
            : `Match #${bet.match_id}`}{" "}
          — Bet {bet.bet_choice?.toUpperCase() || "Unknown"}
        </span>
        <span className="font-semibold">
          {bet.status === "pending" ? "Pending" : bet.status}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        <p>Stake: ${bet.stake}</p>
        <p>Odds: {bet.odds}</p>
        {bet.payout !== undefined && (
          <p>
            <strong>Payout:</strong> ${Number(bet.payout).toFixed(2)}
          </p>
        )}
      </div>
      {bet.status !== "pending" && (
        <div className="mt-2">
          <span className="font-semibold">
            {bet.status === "won" ? "🏆 You won!" : "You lost"}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Your Bet History</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Pending Bets</h3>
          {pendingBets.length === 0 ? (
            <p>No pending bets.</p>
          ) : (
            <div className="space-y-4">{pendingBets.map(renderBetCard)}</div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Settled Bets</h3>
          {settledBets.length === 0 ? (
            <p>No settled bets yet.</p>
          ) : (
            <div className="space-y-4">{settledBets.map(renderBetCard)}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default BetHistory;
