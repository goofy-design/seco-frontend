import React from "react";

const UnderConstruction: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        color: "#1e293b",
        fontFamily: "sans-serif",
      }}
    >
      <svg width="96" height="96" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#f59e42"
          strokeWidth="2"
          fill="#fff3cd"
        />
        <path
          d="M8 16h8M12 8v4"
          stroke="#f59e42"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <h1 style={{ marginTop: 24, fontSize: 32, fontWeight: 700 }}>
        Under Construction
      </h1>
      <p
        style={{
          marginTop: 12,
          fontSize: 18,
          color: "#64748b",
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        This page is currently under construction.
        <br />
        Please check back soon!
      </p>
    </div>
  );
};

export default UnderConstruction;
