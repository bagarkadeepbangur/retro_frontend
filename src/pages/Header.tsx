import React from "react";
// import API  from "../api/axios";
import { useAuth } from "../context/AuthContext";
// import axios from "axios";
const Header: React.FC = () => {
  const { logout } = useAuth();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser).name : null;
  // const handleLogout = async () => {
  //   try {
  //     console.log("logout clicked...")
      
  //   } catch (err) {
  //     console.error("Failed to fetch boards:", err);
  //   } finally {
  //     console.log("Logout Successfully")
  //     window.location.href="http://localhost:5174/";
  //   }
  // };
  
  return (
    <header className="flex justify-between items-center bg-slate-600 shadow-md text-white" style={{display:"flex",justifyContent:"space-between",backgroundColor:"#36454F"}}>
      {/* Left: App Title */}
      <h3 className="text-lg font-semibold tracking-wide text-white" style={{color:"White"}}>Agile Retrospective Boards</h3>

      {/* Right: Profile Info and Logout */}
      <div className="flex items-center gap-4" style={{display:"flex",marginRight:"10px"}}>
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40?img=12" // Replace with your user's image or local asset
            alt="User Avatar"
            className="w-8 h-8 rounded-full border-2 border-pink-400" style={{marginRight:"10px"}}
          />
          <span className="text-sm font-medium text-white" style={{color:"White"}}>{user}</span>
        </div>

        <button className="flex items-center gap-1 hover:text-gray-300 transition" onClick={logout}>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7"
            />
          </svg> */}
          <span className="text-sm">Log Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
