import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./Navbar";

type TransactionType = "add" | "Withdraw";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

function BalanceForm() {
  const { user, isLoading } = useAuth0();
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600 text-lg">Loading user...</p>
        </div>
      </>
    );
  }
  const handleTransaction = async (type: TransactionType) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8080/accounts/users/${user.sub}/balance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, type }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setBalance(data.balance);
      setMessage(data.message);
      setAmount(0);
      fetchTransactions(); // Refresh history
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^0-9.]/g, "");
    setAmount(Number(cleaned));
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/accounts/users/${user.sub}/transactions`
      );
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          💰 Manage Balance
        </h2>

        <input
          type="text"
          value={amount === 0 ? "" : amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-4">
          <button
            onClick={() => handleTransaction("add")}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition"
          >
            Deposit
          </button>

          <button
            onClick={() => handleTransaction("Withdraw")}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
          >
            Withdraw
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        {balance !== null && (
          <p className="mt-2 text-center font-semibold text-blue-600">
            Current Balance: ${balance.toFixed(2)}
          </p>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-2">
          🧾 Transaction History
        </h3>
        <ul className="text-sm text-gray-700 max-h-60 overflow-y-auto">
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <li
                key={txn.id}
                className="border-b py-2 flex justify-between text-sm"
              >
                <span>{txn.description}</span>
                <span>{new Date(txn.created_at).toLocaleString()}</span>
              </li>
            ))
          ) : (
            <li>No transactions yet.</li>
          )}
        </ul>
      </div>
    </>
  );
}

export default BalanceForm;
