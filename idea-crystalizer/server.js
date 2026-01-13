import express from "express";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static("public"));

/* =========================
   魔法陣設計API（確実に返す）
========================= */
app.post("/api/design", (req, res) => {
  try {
    const { element, emotion } = req.body;

    // 🔥 属性×感情 完全マッピング
    const ELEMENT_MAP = {
      fire:  { points: 6, rings: 4 },
      water: { points: 8, rings: 5 },
      wind:  { points: 7, rings: 3 },
      earth: { points: 5, rings: 6 },
      light: { points: 9, rings: 4 },
      dark:  { points: 10, rings: 5 }
    };

    const EMOTION_BIAS = {
      blessing: 0,
      anger: 2,
      calm: -1,
      desire: 1,
      sorrow: -2
    };

    const base = ELEMENT_MAP[element] || ELEMENT_MAP.fire;
    const bias = EMOTION_BIAS[emotion] ?? 0;

    const design = {
      element,
      emotion,
      points: Math.max(3, base.points + bias),
      rings: Math.max(2, base.rings + Math.abs(bias))
    };

    res.json(design); // ← ★ 必ず返す
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "design generation failed" });
  }
});

/* ========================= */

app.listen(PORT, () => {
  console.log(`🔥 Arcane API running on http://localhost:${PORT}`);
});
