import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  const navigate = useNavigate();
  const {
    loginWithRedirect,
    getAccessTokenSilently,
    isAuthenticated,
    user,
    isLoading,
  } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
    } catch (err) {
      console.error("Auth0 Login Error", err);
    }
  };

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        const token = await getAccessTokenSilently({});

        await axios.post("http://localhost:8080/Auth/sync", user, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        navigate("/footballmatch");
      }
    };

    if (!isLoading) syncUser();
  }, [isAuthenticated, user, isLoading]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <nav className="flex justify-between items-center p-6 shadow bg-white">
          <div className="text-2xl font-bold">SportBet</div>
          <div className="space-x-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleLogin}
            >
              Log in
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleLogin}
            >
              Sign up
            </button>
          </div>
        </nav>

        <section className="flex flex-col md:flex-row items-center justify-between p-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Bet Smarter, Win Bigger
            </h1>
            <p className="text-lg text-gray-600">
              Track matches, place bets, and view live results—all in one place.
            </p>
            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              Get Started
            </button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex gap-6 justify-center items-center">
            <img
              src="/img/NFL-logo.png"
              alt="league logo"
              className="w-10 sm:w-10 md:w-64 lg:w-40 h-auto"
            />
            <img
              src="/img/nba-logo.png"
              alt="league logo"
              className="w-10 sm:w-10 md:w-64 lg:w-40 h-auto"
            />
            <img
              src="/img/Premier-League-Logo.png"
              alt="league logo"
              className="w-10 sm:w-10 md:w-64 lg:w-40 h-auto"
            />
          </div>
        </section>

        <section className="p-12 bg-white text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose SportBet?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Real-time Odds</h3>
              <p className="text-gray-600">
                Stay updated with live odds and smart betting suggestions.
              </p>
            </div>
            <div className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Secure Wallet</h3>
              <p className="text-gray-600">
                Seamless transactions with encrypted security and fast payouts.
              </p>
            </div>
            <div className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Match Insights</h3>
              <p className="text-gray-600">
                In-depth statistics and match history to make informed bets.
              </p>
            </div>
          </div>
        </section>

        <section className="p-12 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-blue-600 text-4xl font-bold mb-2">1</div>
              <h3 className="font-semibold text-xl">Sign Up</h3>
              <p className="text-gray-600">
                Create your account in seconds using secure Auth0 login.
              </p>
            </div>
            <div>
              <div className="text-blue-600 text-4xl font-bold mb-2">2</div>
              <h3 className="font-semibold text-xl">Browse Matches</h3>
              <p className="text-gray-600">
                Find games, see stats, and follow betting trends.
              </p>
            </div>
            <div>
              <div className="text-blue-600 text-4xl font-bold mb-2">3</div>
              <h3 className="font-semibold text-xl">Place Bets</h3>
              <p className="text-gray-600">
                Bet confidently and track your winnings in real time.
              </p>
            </div>
          </div>
        </section>

        <section className="p-12 text-center bg-blue-600 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to make your first bet?
          </h2>
          <button className="mt-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100">
            Join Now
          </button>
        </section>

        <footer className="p-6 bg-gray-800 text-white text-center text-sm">
          © 2025 SportBet. All rights reserved.
        </footer>
      </div>
    </>
  );
}

export default LandingPage;
