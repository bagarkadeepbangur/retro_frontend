// src/pages/Login.tsx
import React, { useMemo, useState} from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API  from "../api/axios";
import { isAuthenticated } from "../auth";
import Toast from "./toast";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  // If already logged in, go home
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  const styles = useMemo(() => {
    const cardShadow =
      "0 20px 45px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)";
    const radius = 24;

    return {
      page: {
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(1200px 600px at 50% -80%, #c7d2fe22, transparent 60%), #f7f7f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      } as React.CSSProperties,

      card: {
        width: 500,
        maxWidth: "92vw",
        borderRadius: radius,
        padding: 28,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.98))",
        boxShadow: cardShadow,
        position: "relative",
      } as React.CSSProperties,

    //   subtleGrid: {
    //     position: "absolute" as const,
    //     inset: 0,
    //     borderRadius: radius,
    //     pointerEvents: "none" as const,
    //     backgroundImage:
    //       "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
    //     backgroundSize: "28px 28px, 28px 28px",
    //     opacity: 0.25,
    //     maskImage:
    //       "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,1))",
    //   },

      brandRow: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 6,
      } as React.CSSProperties,

      brandDot: {
        width: 18,
        height: 10,
        borderRadius: 10,
        background:
          "linear-gradient(135deg, #5b7cfa 0%, #8aa4ff 55%, #c3d1ff 100%)",
        marginRight: 6,
      },

      title: {
        fontSize: 28,
        fontWeight: 800,
        margin: "6px 0 4px",
        letterSpacing: -0.2,
      } as React.CSSProperties,

      subtitle: {
        color: "#6b7280",
        fontSize: 13,
        marginBottom: 18,
      } as React.CSSProperties,

      orRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "14px 0",
      } as React.CSSProperties,

      line: {
        height: 1,
        background: "#e5e7eb",
        flex: 1,
      } as React.CSSProperties,

      orText: { color: "#9ca3af", fontSize: 12 } as React.CSSProperties,

      socialRow: {
        display: "flex",
        gap: 12,
        marginTop: 2,
      } as React.CSSProperties,

    //   socialBtn: {
    //     width: 48,
    //     height: 48,
    //     borderRadius: 999,
    //     border: "1px solid #e5e7eb",
    //     background: "#fff",
    //     display: "grid",
    //     placeItems: "center",
    //     cursor: "pointer",
    //     boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
    //   } as React.CSSProperties,

      fieldLabel: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 14,
      } as React.CSSProperties,

      inputWrap: {
        position: "relative" as const,
        marginTop: 6,
      },

      input: {
        width: "95%",
        height: 44,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        outline: "none",
        padding: "0 14px",
        background: "#fff",
        fontSize: 14,
        color:"black"
      } as React.CSSProperties,

      pwdToggle: {
        position: "absolute" as const,
        right: 10,
        top: 0,
        height: 44,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        color: "#6b7280",
      },

      tinyRow: {
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      } as React.CSSProperties,

      rememberWrap: { display: "flex", gap: 8, alignItems: "center" },

    //   link: {
    //     color: "#4b5563",
    //     fontSize: 12,
    //     textDecoration: "underline",
    //     cursor: "pointer",
    //   } as React.CSSProperties,

      submit: {
        marginTop: 16,
        width: "102%",
        height: 46,
        borderRadius: 12,
        border: "0",
        cursor: "pointer",
        color: "white",
        fontWeight: 600,
        letterSpacing: 0.3,
        background:
          "linear-gradient(180deg, #2b2b2b 0%, #1a1a1a 60%, #111 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 18px rgba(0,0,0,0.15)",
      } as React.CSSProperties,

    //   footer: {
    //     marginTop: 14,
    //     textAlign: "center" as const,
    //     color: "#6b7280",
    //     fontSize: 13,
    //   },

    //   signUp: {
    //     fontWeight: 700,
    //     color: "#111827",
    //     marginLeft: 6,
    //     cursor: "pointer",
    //     textDecoration: "underline",
    //   } as React.CSSProperties,
    };
  }, []);

  const Eye = ({ off = false }: { off?: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {off ? (
        <>
          <path d="M2 2l20 20" stroke="#6b7280" strokeWidth="2" />
          <path d="M12 5C7 5 3.2 8.1 2 12c.6 1.9 2.1 3.8 4 5.1M22 12c-.7-2.2-2.3-4.1-4.4-5.3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d="M2 12c2.2-4 6-7 10-7s7.8 3 10 7c-2.2 4-6 7-10 7S4.2 16 2 12z" stroke="#9ca3af" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="12" r="3" stroke="#9ca3af" strokeWidth="2" fill="none"/>
        </>
      )}
    </svg>
  );


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setErr(null);
    setLoading(true);
    try {
      /**
       * Expected backend response (example):
       * { token: "JWT_STRING", user: {...} }
       * Endpoint example: POST /auth/login  body: { email, password }
       */
      const res = await API.post("/boards/login", { email, password });
    //   console.log(res)
      const token = res.data?.token;
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (!token) throw new Error("Token not found in response");
      login(token);
      navigate("/", { replace: true });
    } catch (e: any) {
        console.log("LOGIN Failed")
        const msg = e?.response?.data?.message || e.message || "Login failed";
        setToastMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* <div style={styles.subtleGrid} /> */}

        {/* Brand */}
        <div style={styles.brandRow}>
          <div style={styles.brandDot} />
          <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>RetroFlow</div>
        </div>

        <div style={styles.title}>Welcome back</div>
        <div style={styles.subtitle}>Please enter your details to sign in</div>

        {/* Social buttons */}
        {/* <div style={styles.socialRow}>
          <button style={styles.socialBtn} aria-label="Continue with Google">
            {Google}
          </button>
          <button style={styles.socialBtn} aria-label="Continue with Apple">
            {Apple}
          </button>
          <button style={styles.socialBtn} aria-label="Continue with X">
            {XIcon}
          </button>
        </div> */}

        {/* OR divider */}
        {/* <div style={styles.orRow}>
          <div style={styles.line} />
          <div style={styles.orText}>OR</div>
          <div style={styles.line} />
        </div> */}

        {/* Form */}
        <form onSubmit={onSubmit} noValidate>
          <div style={styles.fieldLabel}>Your Email Address</div>
          <div style={styles.inputWrap}>
            <input
              style={styles.input}
              type="email"
              placeholder="Your Email Address"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.fieldLabel}>Password</div>
          <div style={styles.inputWrap}>
            <input
              style={styles.input}
              type={showPwd ? "text" : "password"}
              placeholder="**********"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              style={styles.pwdToggle}
              onClick={() => setShowPwd((s) => !s)}
              title={showPwd ? "Hide password" : "Show password"}
            >
              <Eye off={!showPwd} />
            </div>
          </div>

          {/* <div style={styles.tinyRow}>
            <label style={styles.rememberWrap}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span style={{ fontSize: 12, color: "#4b5563" }}>Remember me</span>
            </label>
            <a style={styles.link}>Forgot password?</a>
          </div> */}

          <button type="submit" style={styles.submit}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        {toastMsg && (
            <Toast
            message={toastMsg}
            type="error"
            duration={5000}         // auto-hide in 3s
            onClose={() => setToastMsg(null)}
            />
        )}
        {/* <div style={styles.footer}>
          Don’t have an account?
          <span style={styles.signUp}> Sign up</span>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
