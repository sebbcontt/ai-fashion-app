import { useState } from "react";
import "./styles.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [style, setStyle] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setError("");
    setResult(null);

    const isHeic =
      selected.type === "image/heic" ||
      selected.type === "image/heif" ||
      /\.hei[cf]$/i.test(selected.name);

    if (isHeic) {
      // Browsers can't display HEIC, so convert it to JPEG in-browser.
      setConverting(true);
      try {
        const heic2any = (await import("heic2any")).default;
        const converted = await heic2any({
          blob: selected,
          toType: "image/jpeg",
          quality: 0.9,
        });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        const jpegFile = new File(
          [blob],
          selected.name.replace(/\.hei[cf]$/i, ".jpg"),
          { type: "image/jpeg" }
        );
        setFile(jpegFile);
      } catch (err) {
        console.error(err);
        setError("Couldn't read that photo. Try a different one.");
      } finally {
        setConverting(false);
      }
    } else {
      setFile(selected);
    }
  };

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

      const API_URL = (
        import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
      ).replace(/\/$/, "");
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
        Upload a clothing item to get curated outfit ideas, color pairings, and
        styling direction.
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
                {converting ? "Reading photo..." : "Upload"}
                <input
                  type="file"
                  hidden
                  accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.gif,.bmp"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="upload-hint">JPG, PNG, WEBP, or HEIC</p>
            </div>
          ) : (
            <>
              <img src={URL.createObjectURL(file)} className="preview" alt="upload preview" />

              <div className="btn-row">
                <button
                  className="btn secondary"
                  onClick={() => setFile(null)}
                >
                  Change
                </button>

                <button
                  className="btn primary"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </>
          )}

          {error && <p className="error">{error}</p>}
        </div>

        {/* RIGHT */}
        <div className="right">
          {loading ? (
            <div className="results skeleton-results">
              <div className="skeleton skeleton-title" />
              <div className="skeleton-section">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-card" />
                <div className="skeleton skeleton-card" />
                <div className="skeleton skeleton-card" />
              </div>
              <div className="skeleton-section">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-pills" />
              </div>
              <div className="skeleton-section">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-pills" />
              </div>
            </div>
          ) : !result ? (
            <div className="placeholder">
              <h2>Styling results will appear here</h2>
              <p>Upload an item and run analysis to see results.</p>
            </div>
          ) : (
            <div className="results fade-in">
              <div className="results-header">
                <h2 className="result-title">{result.item}</h2>
                {result.vibe && <p className="result-vibe">{result.vibe}</p>}
                {result.seasons?.length > 0 && (
                  <div className="season-row">
                    {result.seasons.map((s, i) => (
                      <span key={i} className="season-pill">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

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

              {result.styling_tips?.length > 0 && (
                <div className="results-section">
                  <p className="section-label">Styling Tips</p>
                  <ul className="tip-list">
                    {result.styling_tips.map((t, i) => (
                      <li key={i} className="tip-item">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.where_to_wear?.length > 0 && (
                <div className="results-section">
                  <p className="section-label">Where to Wear</p>
                  <div className="pill-row">
                    {result.where_to_wear.map((w, i) => (
                      <span key={i} className="occasion-pill">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.accessories?.length > 0 && (
                <div className="results-section">
                  <p className="section-label">Accessories</p>
                  <div className="pill-row">
                    {result.accessories.map((a, i) => (
                      <span key={i} className="accessory-pill">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
                    <span key={i} className="avoid-pill">
                      {c}
                    </span>
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
