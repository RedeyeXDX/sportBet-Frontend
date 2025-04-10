import { useState, useEffect } from "react";
import { FaBasketball } from "react-icons/fa6";
import { PiSoccerBall } from "react-icons/pi";
import { FaFootballBall } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Sidebar from "./SideBar";

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.sub) return;

      try {
        const res = await fetch(`http://localhost:8080/users/${user.sub}`);
        const data = await res.json();
        setBalance(data.balance);
      } catch (err) {
        console.error("Failed to fetch user balance:", err);
      }
    };

    if (isAuthenticated) {
      fetchBalance();
    }
  }, [user, isAuthenticated]);

  return (
    <>
      <nav className="flex justify-between items-center p-6 shadow bg-white">
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          SportBet
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-3">
          <FaBasketball
            className="text-orange-500 text-2xl cursor-pointer hover:scale-110 transition"
            onClick={() => navigate("/basketballmatch")}
          />
          <PiSoccerBall
            className="text-green-600 text-2xl cursor-pointer hover:scale-110 transition"
            onClick={() => navigate("/footballmatch")}
          />
          <FaFootballBall
            className="text-red-600 text-2xl cursor-pointer hover:scale-110 transition"
            onClick={() => navigate("/nflmatch")}
          />
        </div>

        <div className="flex items-center gap-4">
          {balance !== null && (
            <span className="text-sm font-medium text-gray-700">
              💰 Balance: ${balance}
            </span>
          )}
        </div>
      </nav>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

export default Navbar;
