import { useAuth0 } from "@auth0/auth0-react";

function Dashboard() {
  const { logout, user } = useAuth0();

  return (
    <>
      <h2>Welcome, {user?.name}</h2>
      <h1>You are logged in! Welcome to your dashboard.</h1>
      <button
        onClick={() =>
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          })
        }
      >
        Log Out
      </button>
    </>
  );
}

export default Dashboard;
