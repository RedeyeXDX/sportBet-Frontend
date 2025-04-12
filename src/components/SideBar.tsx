import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: "http://localhost:5173",
      },
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity z-30 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <ul className="p-4 space-y-4">
          <li>
            <button
              onClick={() => navigate("/footballmatch")}
              className="hover:underline"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/balanceform")}
              className="hover:underline"
            >
              Balance
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/bethistory")}
              className="hover:underline"
            >
              History
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
