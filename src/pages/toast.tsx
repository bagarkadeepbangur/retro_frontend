// src/components/Toast.tsx
import React, { useEffect, useState } from "react";

type Props = {
  message: string;
  type?: "error" | "success";
  duration?: number; // ms
  onClose: () => void;
};

const Toast: React.FC<Props> = ({ message, type = "error", duration = 3000, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setOpen(false), duration - 250); // start fade a bit earlier
    const t2 = setTimeout(onClose, duration);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [duration, onClose]);

  const bg = type === "error" ? "#ef4444" : "#10b981";

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: 360,
        padding: "12px 14px",
        borderRadius: 10,
        color: "white",
        background: bg,
        boxShadow: "0 10px 24px rgba(0,0,0,.15)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: open ? 1 : 0,
        transform: `translateY(${open ? 0 : 6}px)`,
        transition: "opacity .25s ease, transform .25s ease",
      }}
      onClick={onClose} // allow manual dismiss
    >
      <span style={{ fontWeight: 700 }}>{type === "error" ? "Error" : "Success"}</span>
      <span style={{ opacity: 0.95 }}>{message}</span>
    </div>
  );
};

export default Toast;
