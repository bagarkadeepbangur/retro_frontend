// BoardView.tsx
import React, { useState } from "react";
import API from "../api/axios";
import type { Board } from "./type";
import {
    DndContext,
    closestCenter,
    type DragEndEvent,
    MouseSensor,
    useSensor,
    useSensors,
  } from "@dnd-kit/core";
  import {
    SortableContext,
    // arrayMove,
    rectSortingStrategy,
    useSortable,
  } from "@dnd-kit/sortable";
  import { CSS } from "@dnd-kit/utilities";
interface Props {
  board: Board;
  setBoard: (board: Board) => void;
  onUpdate: () => void;
}

const SortableCard = ({
    card,
    cardId,
    onEdit,
    onDelete,
    onAddToTask,
    isEditing,
    editContent,
    setEditContent,
    handleUpdateCard,
  }: {
    card: string;
    cardId: string;
    onEdit: () => void;
    onDelete: () => void;
    onAddToTask:()=>void;
    isEditing: boolean;
    editContent: string;
    setEditContent: (val: string) => void;
    handleUpdateCard: () => void;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cardId });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-gray-100 p-2 mb-2 rounded flex justify-between items-center cursor-move"
      >
        {isEditing ? (
          <input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleUpdateCard}
            className="flex-1 mr-2 px-2 py-1"
            style={{width: "49%",borderRadius: "8px",backgroundColor: "white",color: "black",marginRight: "1px",padding:"0.6em 1.2em"}}
          />
        ) : (
          <span onClick={onEdit} style={{ fontSize: "18px", fontWeight: "bold" }}>{card}</span>
        )}
        <button className="text-red-500 text-sm" onClick={onDelete} style={{marginLeft:"5px"}}>
          ✕
        </button>
        <button className="text-red-500 text-sm" onClick={onAddToTask} style={{marginLeft:"5px"}}>
          Add to task
        </button>
      </div>
    );
  };
  

const BoardView: React.FC<Props> = ({ board, setBoard,onUpdate  }) => {
    const [cardText, setCardText] = useState("");
    const [selectedColumn, setSelectedColumn] = useState("");
    const [editingIndex, setEditingIndex] = useState<{ col: number; card: number } | null>(null);
    const [editContent, setEditContent] = useState("");
    const [newColumnName, setNewColumnName] = useState("");
    const [editingColumnIndex, setEditingColumnIndex] = useState<number | null>(null);
    const [updatedColumnName, setUpdatedColumnName] = useState("");
    const [insights, setInsights] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const sensors = useSensors(useSensor(MouseSensor));
    const handleEditClick = (colIdx: number, cardIdx: number, content: string) => {
        setEditingIndex({ col: colIdx, card: cardIdx });
        setEditContent(content);
      };
    
      const handleUpdateCard = async () => {
        if (!editingIndex) return;
        const payload = {
          boardId: board._id,
          columnName: board.columns[editingIndex.col].name,
          cardIndex: editingIndex.card,
          newContent: editContent,
        };
        await API.put("/boards/card", payload);
        setEditingIndex(null);
        setEditContent("");
        onUpdate();
      };

      const handleDeleteCard = async (colIdx: number, cardIndex: number) => {
        const payload = {
          boardId: board._id,
          columnName: board.columns[colIdx].name,
          cardIndex,
        };
        console.log("Payload--->",payload)
        await API.delete("/boards/card", { data: payload });
        onUpdate();
      };

      const handleAddCardToTaskManager = async (colIdx: number, cardIndex: number) => {
        const storedUser = localStorage.getItem('user');
        const payload = {
          boardId: board._id,
          columnIndex: board.columns[colIdx]._id,
          cardIndex,
          user:storedUser
        };
        console.log("Payload in task manager--->",payload,board.columns[colIdx])
        await API.post('boards/addCardToTask', { data: payload });
        // onUpdate();
      };
    const handleAddCard = async () => {
        if (!cardText.trim()) return;
      try {
        const { data } =await API.post("/boards/card", {
          boardId: board._id,
          columnName: selectedColumn,
          content: cardText,
        });
        setBoard(data.board); // 🟢 Update the board state with new card data
        setCardText("");
        // Optionally refetch board data or update UI
      } catch (err) {
        console.error("Error adding card", err);
      }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;
      
        let sourceColIdx = -1, targetColIdx = -1;
        let draggedCard = null;
      
        board.columns.forEach((col, colIdx) => {
          const cardIdx = col.cards.findIndex(card => card._id === active.id);
          if (cardIdx > -1) {
            sourceColIdx = colIdx;
            draggedCard = col.cards[cardIdx];
          }
          if (col.cards.some(card => card._id === over.id)) {
            targetColIdx = colIdx;
          }
        });
      
        if (sourceColIdx === -1 || targetColIdx === -1 || !draggedCard) return;
      
        const updatedColumns = [...board.columns];
      
        // Remove from source
        updatedColumns[sourceColIdx].cards = updatedColumns[sourceColIdx].cards.filter(
          (card) => card._id !== active.id
        );
      
        // Insert at the start of target column for now (can adjust position later)
        updatedColumns[targetColIdx].cards.unshift(draggedCard);
      
        // setBoard({ ...board, columns: updatedColumns });
        const updatedBoard = { ...board, columns: updatedColumns };
        setBoard(updatedBoard);
      
        try {
          await API.put(`/boards/${board._id}/reorder`, {
            columns: updatedBoard.columns,
          });
        } catch (error) {
          console.error("Failed to persist reordered board:", error);
        }
      };
      const handleAddColumn = async () => {
        if (!newColumnName.trim()) return;
        try {
          const { data } = await API.post("/boards/column", {
            boardId: board._id,
            name: newColumnName,
            color:getRandomColor()
          });
          // console.log("--->",data,data.board)
          setBoard(data);
          setNewColumnName("");
        } catch (err) {
          console.error("Failed to add column:", err);
        }
      };
      const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
      const fetchInsights = async () => {
        setLoading(true);
        try {
          const res = await API.post('boards/ai/insights', { boardId: board._id });
          setInsights(res.data.insights);
          setShowModal(true);
        } catch (err) {
          // alert('Failed to fetch AI insights');
          console.error("Failed to fetch AI insights:", err);
        } finally {
          setLoading(false);
        }
      };
      const closeModal = () => {
        setShowModal(false);
        setInsights('');
      };
      const handleDeleteColumn = async (colIdx: number) => {
        const column = board.columns[colIdx];
        console.log(board)
        try {
          const { data } = await API.delete("/boards/column", {
            data: {
              boardId: board._id,
              name: column.name,
              columnIndex:column._id
            },
          });
          setBoard(data);
        } catch (err) {
          console.error("Failed to delete column:", err);
        }
      };
      
      const handleUpdateColumn = async (colIdx: number) => {
        const column = board.columns[colIdx];
        console.log("----->",column)
        try {
          const { data } = await API.put("/boards/column", {
            boardId: board._id,
            oldName: column.name,
            newName: updatedColumnName,
            columnIndex:column._id
          });
          setBoard(data.board);
          setEditingColumnIndex(null);
        } catch (err) {
          console.error("Failed to update column:", err);
        }
      };
      
    return (
        <div className="p-4" style={{ padding: "24px", backgroundColor: "#f3f4f6", minHeight: "100vh", border:"2px solid",margin:"10px 10px 10px 10px", borderRadius:"10px"}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
         <h2 className="text-xl font-semibold mb-4" style={{ fontSize: "18px", fontWeight: "bold" }}>{board.title}</h2>
         <button onClick={fetchInsights} disabled={loading} className="bg-blue-500 text-white px-3 py-1 rounded" style={{padding:'0.6em 1.2em',margin:"5px"}}>
         {loading ? 'Analyzing...' : 'Get AI Insights'}
          </button>
          {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxHeight: '80%',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            position: 'relative'
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: '2px solid',
                fontSize: '20px',
                cursor: 'pointer',
                color:"black"
              }}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: '12px' }}>🤖 AI Insights</h2>
            <pre style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{insights}</pre>
          </div>
        </div>
          )}
         <div className="mt-4" style={{marginTop:'0.6em 1.2em',margin:"5px"}}>
                <input
                    type="text"
                    placeholder="New Column Name"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="mr-2 p-1 border rounded"
                    style={{width: "49%",borderRadius: "8px",backgroundColor: "white",color: "black",marginRight: "1px",padding:"0.6em 1.2em"}}
                />
                <button onClick={handleAddColumn} className="bg-blue-500 text-white px-3 py-1 rounded" style={{padding:'6px'}}>
                    Add Column
                </button>
        </div>
         </div>
         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto" style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "8px"
            }}>
            {/* <div className="mt-4">
                <input
                    type="text"
                    placeholder="New Column Name"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="mr-2 p-1 border rounded"
                />
                <button onClick={handleAddColumn} className="bg-blue-500 text-white px-3 py-1 rounded">
                    Add Column
                </button>
            </div> */}
            {board.columns.map((col, colIdx) => (
              // const color=col.color?col.color:"#60d394"
            <div key={colIdx} className="border p-3 mb-4" style={{
                width: "280px",
                backgroundColor: "white",
                borderTop: `4px solid ${col.color ||"#60d394"}`,
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                padding: "12px",
                flexShrink: 0
              }}>
                <div className="flex justify-between items-center">
                    {editingColumnIndex === colIdx ? (
                        <>
                        <input
                            value={updatedColumnName}
                            onChange={(e) => setUpdatedColumnName(e.target.value)}
                            className="border px-2 py-1"
                        />
                        <button onClick={() => handleUpdateColumn(colIdx)} className="text-green-500 ml-2">✔</button>
                        <button onClick={() => setEditingColumnIndex(null)} className="text-gray-500 ml-1">✕</button>
                        </>
                    ) : (
                        <>
                        <div style={{display:"flex"}}>
                        <h3 className="font-semibold" style={{ fontWeight: "600", marginBottom: "10px" }}>{col.name}</h3>
                        <div className="flex items-center gap-2" style={{ fontWeight: "600", marginTop: "12px",marginLeft:"10px",display:"flow" }}>
                            <button style={{marginRight:"2px"}} onClick={() => { setEditingColumnIndex(colIdx); setUpdatedColumnName(col.name); }}>✏</button>
                            <button onClick={() => handleDeleteColumn(colIdx)} className="text-red-500">🗑</button>
                        </div>

                        </div>
                        </>
                    )}
                </div>
                <input
                type="text"
                placeholder="Add card"
                value={selectedColumn === col.name ? cardText : ""}
                onChange={(e) => {
                  setCardText(e.target.value);
                  setSelectedColumn(col.name);
                }}
                style={{width: "49%",borderRadius: "8px",backgroundColor: "white",color: "black",marginRight: "1px",padding:"0.6em 1.2em"}}
              />
              <button onClick={handleAddCard} style={{padding:'7px'}}>Add</button>
              <SortableContext
                items={col.cards.map((_, idx) => `${colIdx}-${idx}`)}
                strategy={rectSortingStrategy}
              >
                <ul style={{ display: "flex", flexDirection: "column", gap: "8px", marginLeft:"-40px"}}>
                  {col.cards.map((card, cardIdx) => {
                    const id = `${colIdx}-${cardIdx}`;
                    return (
                      <div key={id} className="relative"
                      style={{
                        backgroundColor: "#f1f5f9",
                        padding: "10px",
                        borderRadius: "4px",
                        fontSize: "14px"
                      }}>
                        {editingIndex?.col === colIdx && editingIndex?.card === cardIdx ? (
                          <input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onBlur={handleUpdateCard}
                            className="flex-1 mr-2 px-2 py-1 w-full"
                          />
                        ) : (
                            <SortableCard
                            card={card.content}
                            cardId={card._id}
                            onEdit={() => handleEditClick(colIdx, cardIdx, card.content)}
                            onDelete={() => handleDeleteCard(colIdx, cardIdx)}
                            onAddToTask={() => handleAddCardToTaskManager(colIdx, cardIdx)}
                            isEditing={editingIndex?.col === colIdx && editingIndex?.card === cardIdx}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            handleUpdateCard={handleUpdateCard}
                          />
                        )}
                      </div>
                    );
                  })}
                </ul>
              </SortableContext>
              {/* <input
                type="text"
                placeholder="Add card"
                value={selectedColumn === col.name ? cardText : ""}
                onChange={(e) => {
                  setCardText(e.target.value);
                  setSelectedColumn(col.name);
                }}
              />
              <button onClick={handleAddCard}>Add</button> */}
            </div>
                ))}
            </div>
         </DndContext>
        </div>
      );
};

export default BoardView;
