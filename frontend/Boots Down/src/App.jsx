import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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
      setResult(data.analysis);
    } catch (err) {
      console.error(err);
      setResult("Uh oh something went wrong :(");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Didot" }}>
      <h1>Boots Down AI Stylist </h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Analyze Outfit
      </button>

      {loading && <p>Analyzing... </p>}

      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        {result}
      </div>
    </div>
  );
}