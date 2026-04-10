import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-style", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.analysis || data);
    } catch (err) {
      console.error(err);
      setResult("Something went wrong 😭");
    }

    setLoading(false);
  };

  return (
    <div style={styles.outer}>
      <div style={styles.page}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.logo}>Boots Down</h1>
          <div style={styles.headerLine}></div>

          <button
            style={styles.settingsBtn}
            onClick={() => alert("Settings coming soon")}
          >
            ⚙
          </button>
        </div>

        {/* HERO */}
        {!result && (
          <div style={styles.hero}>

            {/* 🔥 DESCRIPTION BUBBLE */}
            <div style={styles.descriptionCard}>
              <p style={styles.tagline}>
                Upload a clothing item to get curated outfit ideas, color pairings,
                and styling insights tailored to your piece.
              </p>
            </div>

            <div style={styles.uploadRow}>
              <label style={styles.uploadButton}>
                Upload
                <input type="file" onChange={handleFileChange} hidden />
              </label>

              {/* 🔥 ONLY SHOW AFTER UPLOAD */}
              {file && (
                <button onClick={handleUpload} style={styles.analyzeButton}>
                  Analyze
                </button>
              )}
            </div>
          </div>
        )}

        {/* IMAGE */}
        {preview && (
          <div style={styles.card}>
            <img src={preview} alt="preview" style={styles.image} />
          </div>
        )}

        {/* RESULT */}
        {result && typeof result === "object" && (
          <div style={styles.resultCard}>
            <h2 style={styles.sectionTitle}>{result.item}</h2>

            <div style={styles.innerDivider}></div>

            <h3 style={styles.subTitle}>Outfit Ideas</h3>
            <div style={styles.sectionDivider}></div>

            <div style={styles.grid}>
              {result.outfits?.map((o, i) => (
                <div key={i} style={styles.outfitCard}>{o}</div>
              ))}
            </div>

            <h3 style={styles.subTitle}>Best Colors</h3>
            <div style={styles.sectionDivider}></div>

            <div>
              {result.colors?.map((c, i) => (
                <span key={i} style={styles.tag}>{c}</span>
              ))}
            </div>

            <h3 style={styles.subTitle}>Avoid</h3>
            <div style={styles.sectionDivider}></div>

            <div>
              {result.avoid?.map((a, i) => (
                <span key={i} style={styles.tag}>{a}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Analyzing your look...</p>
        </div>
      )}
    </div>
  );
}

const styles = {

  /* 🔥 SOFTER GRADIENT */
  outer: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #a7749f 0%, #C3C88C 20%, #C3C88C 80%, #8a2c60 100%)",
    display: "flex",
    justifyContent: "center",
  },

  page: {
    width: "100%",
    maxWidth: "900px",
    background: "#C3C88C",
    padding: "0 30px 60px",
    position: "relative",
  },

  header: {
    position: "relative",
    textAlign: "center",
    marginTop: "30px",
  },

  logo: {
    fontSize: "3rem",
    fontWeight: "600",
    fontFamily: "Didot, serif",
    letterSpacing: "1px",
  },

  /* 🔥 LINE UNDER TITLE */
  headerLine: {
    width: "120px",
    height: "2px",
    background: "#301C1D",
    margin: "10px auto 0",
  },

  settingsBtn: {
    position: "absolute",
    right: "0",
    top: "10px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },

  hero: {
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "25px",
  },

  /* 🔥 DESCRIPTION CARD */
  descriptionCard: {
    background: "#E3D6BF",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "500px",
    textAlign: "center",
    border: "1px solid rgba(0,0,0,0.2)",
  },

  tagline: {
    fontSize: "16px",
    color: "#301C1D",
    lineHeight: "1.6",
  },

  uploadRow: {
    display: "flex",
    gap: "12px",
  },

  uploadButton: {
    padding: "12px 22px",
    background: "#8f4a91",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
  },

  analyzeButton: {
    padding: "12px 22px",
    background: "#7E0950",
    color: "white",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },

  card: {
    marginTop: "40px",
    background: "white",
    padding: "10px",
    borderRadius: "12px",
    width: "320px",
    marginLeft: "auto",
    marginRight: "auto",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
  },

  resultCard: {
    marginTop: "40px",
    background: "#B5728A",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "800px",
    width: "100%",
    color: "#7E0950",
    border: "2px solid rgba(0,0,0,0.2)",
    marginLeft: "auto",
    marginRight: "auto",
  },

  sectionTitle: {
    fontSize: "1.5rem",
    color: "#301C1D",
  },

  innerDivider: {
    height: "1px",
    background: "rgba(0,0,0,0.1)",
    margin: "10px 0 15px",
  },

  sectionDivider: {
    height: "2px",
    background: "rgba(0,0,0,0.2)",
    margin: "10px 0 20px",
  },

  subTitle: {
    fontSize: "1.1rem",
    color: "#301C1D",
  },

  grid: {
    display: "grid",
    gap: "15px",
  },

  outfitCard: {
    background: "#E3D6BF",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "16px",
  },

  tag: {
    display: "inline-block",
    margin: "5px",
    padding: "6px 12px",
    background: "#E3D6BF",
    borderRadius: "20px",
    fontSize: "13px",
  },

  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(4px)",
  },

  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid white",
    borderTop: "5px solid #7E0950",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "15px",
    color: "white",
    fontSize: "18px",
  },
};