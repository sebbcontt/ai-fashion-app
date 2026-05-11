import { useState } from "react";
import "./styles.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [style, setStyle] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!file) {
      setError("Upload something first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("style", style);

      const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
      const res = await fetch(`${API_URL}/analyze-style`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setResult(data.analysis || data);

    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="logo">Closet Guide.</h1>

      <p className="subtitle">
        Upload a clothing item to get curated outfit ideas, color pairings, and styling direction.
      </p>

      {/* STYLE TOGGLE */}
      <div className="style-toggle">
        {["masculine", "feminine", "neutral"].map((opt) => (
          <button
            key={opt}
            className={`style-pill ${style === opt ? "active" : ""}`}
            onClick={() => setStyle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="main">
        {/* LEFT */}
        <div className="left">
          {!file ? (
            <div className="upload-wrapper">
              <label className="btn primary upload-btn">
                Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>
          ) : (
            <>
              {/* SAFE PREVIEW */}
              {file.type !== "image/heic" ? (
                <img
                  src={URL.createObjectURL(file)}
                  className="preview"
                />
              ) : (
                <p>Preview not available for HEIC</p>
              )}

              <div className="btn-row">
                <button className="btn secondary" onClick={() => setFile(null)}>
                  Change
                </button>

                <button className="btn primary" onClick={handleAnalyze}>
                  {loading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </>
          )}

          {error && <p className="error">{error}</p>}
        </div>

        {/* RIGHT */}
        <div className="right">
          {!result ? (
            <div className="placeholder">
              <h2>Styling results will appear here</h2>
              <p>Upload an item and run analysis to see results.</p>
            </div>
          ) : (
            <div className="results">
              <h2 className="result-title">{result.item}</h2>

              <div className="results-section">
                <p className="section-label">Outfits</p>
                <div className="outfit-list">
                  {result.outfits?.map((o, i) => (
                    <div className="outfit-card" key={i}>
                      <div className="outfit-number">{i + 1}</div>
                      <p className="outfit-text">{o}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="results-section">
                <p className="section-label">Best Colors</p>
                <div className="pill-row">
                  {result.colors?.map((c, i) => (
                    <span key={i} className="color-pill">
                      <span
                        className="color-swatch"
                        style={{ background: c.toLowerCase() }}
                      ></span>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="results-section">
                <p className="section-label">Avoid</p>
                <div className="pill-row">
                  {result.avoid?.map((c, i) => (
                    <span key={i} className="avoid-pill">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}