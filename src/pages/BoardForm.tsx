import React, { useState } from "react";
import API from "../api/axios";
// import { useSelector } from 'react-redux';
interface Props {
  onBoardCreated: () => void;
}

const BoardForm: React.FC<Props> = ({ onBoardCreated }) => {
  const [title, setTitle] = useState("");
  // const user = useSelector((state) => state.auth.user);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  // console.log("Create board--->",user)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/boards", {
        title,
        columns: [
          { name: "Went Well", cards: [],color: "#60d394", },
          { name: "To Improve", cards: [],color: "#f6c453", },
          { name: "Action Items", cards: [] ,color: "#4fc3f7",},
        ],
        user:user,
      });
      setTitle("");
      onBoardCreated();
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4" style={{display:"flex",width: "100%",justifyContent:"flex-end",marginTop:"3px"}}>
      <input
        type="text"
        placeholder="Board title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-2 py-1 mr-2"
        required
        style={{width: "30%",borderRadius:"12px",backgroundColor:"white",color:"black",marginRight:"1px"}}
      />
      <button type="submit" className="bg-blue-600 text-white px-3 py-1" style={{backgroundColor:"#0000FF"}}>
        Create Board
      </button>
    </form>
  );
};

export default BoardForm;
