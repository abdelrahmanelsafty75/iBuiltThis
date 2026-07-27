"use client";

import { useEffect } from "react";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <AlertTriangleIcon
            style={{ width: 48, height: 48, color: "#f87171", opacity: 0.8 }}
          />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#a1a1aa", margin: 0, lineHeight: 1.6 }}>
            A critical error occurred and the page could not be loaded. Please
            try again or refresh your browser.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#52525b",
                fontFamily: "monospace",
                margin: 0,
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={unstable_retry}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              border: "1px solid #3f3f46",
              backgroundColor: "transparent",
              color: "#fafafa",
              fontSize: "0.875rem",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            <RefreshCwIcon style={{ width: 14, height: 14 }} />
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
