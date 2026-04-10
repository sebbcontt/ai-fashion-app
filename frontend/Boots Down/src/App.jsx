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
      console.log("API RESPONSE:", data);

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

          <button
            style={styles.settingsBtn}
            onClick={() => alert("Settings coming soon")}
          >
            ⚙
          </button>
        </div>

        <div style={styles.sectionDivider}></div>

        {/* UPLOAD */}
        <div style={styles.uploadRow}>
          <label style={styles.uploadButton}>
            Upload
            <input type="file" onChange={handleFileChange} hidden />
          </label>

          <button
            onClick={handleUpload}
            style={styles.analyzeButton}
            onMouseOver={(e) => (e.target.style.opacity = 0.8)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            Analyze
          </button>
        </div>

        <div style={styles.divider}></div>

        {/* IMAGE */}
        {preview && (
          <div style={styles.card}>
            <img src={preview} alt="preview" style={styles.image} />
          </div>
        )}

        {loading && <p style={styles.loading}>Analyzing...</p>}

        {/* RESULT */}
        {result && typeof result === "object" && (
          <div style={styles.resultCard}>
            <h2 style={styles.sectionTitle}>{result.item}</h2>

            <div style={styles.innerDivider}></div>

            {/* OUTFITS */}
            <h3 style={styles.subTitle}>Outfit Ideas</h3>
            <div style={styles.sectionDivider}></div>

            <div style={styles.grid}>
              {result.outfits?.map((o, i) => (
                <div key={i} style={styles.outfitCard}>
                  {o}
                </div>
              ))}
            </div>

            {/* COLORS */}
            <h3 style={styles.subTitle}>Best Colors</h3>
            <div style={styles.sectionDivider}></div>

            <div>
              {result.colors?.map((c, i) => (
                <span key={i} style={styles.tag}>{c}</span>
              ))}
            </div>

            {/* AVOID */}
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
    </div>
  );
}

const styles = {

  /* 🔥 SIDE COLOR BORDERS */
  outer: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #8f4a91 0%, #C3C88C 15%, #C3C88C 85%, #7E0950 100%)",
    display: "flex",
    justifyContent: "center",
  },

  /* CENTER CONTENT */
  page: {
    width: "100%",
    maxWidth: "900px",
    background: "#C3C88C",
    padding: "0 30px 40px",
    position: "relative",
  },

  header: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px",
    position: "relative",
  },

  logo: {
    fontSize: "2.4rem",
    fontWeight: "600",
    fontFamily: "Didot, serif",
  },

  settingsBtn: {
    position: "absolute",
    right: "0",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },

  sectionDivider: {
    width: "100%",
    height: "2px",
    background: "rgba(0,0,0,0.2)",
    margin: "20px 0",
  },

  container: {},

  uploadRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
  },

  uploadButton: {
    padding: "10px 18px",
    background: "#8f4a91",
    color: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },

  analyzeButton: {
    padding: "10px 18px",
    background: "#7E0950",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },

  divider: {
    width: "100%",
    height: "1px",
    background: "rgba(0,0,0,0.1)",
    margin: "30px 0",
  },

  card: {
    marginTop: "20px",
    background: "white",
    padding: "10px",
    borderRadius: "12px",
    width: "300px",
    marginLeft: "auto",
    marginRight: "auto",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
  },

  resultCard: {
    marginTop: "25px",
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
    marginBottom: "10px",
    fontSize: "1.4rem",
    color: "#301C1D",
  },

  innerDivider: {
    width: "100%",
    height: "1px",
    background: "rgba(0,0,0,0.1)",
    margin: "10px 0 15px",
  },

  loading: {
    marginTop: "10px",
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
  },

  subTitle: {
    marginTop: "15px",
    marginBottom: "8px",
    fontSize: "1.1rem",
    color: "#301C1D",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "15px",
    marginBottom: "20px",
  },

  outfitCard: {
    background: "#E3D6BF",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "16px",
    lineHeight: "1.5",
  },

  tag: {
    display: "inline-block",
    margin: "5px",
    padding: "6px 12px",
    background: "#E3D6BF",
    borderRadius: "20px",
    fontSize: "13px",
  },
};