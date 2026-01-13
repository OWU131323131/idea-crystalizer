let design = null;
let rotX = 0, rotY = 0;
let seed = 1;
let patternType = 0;

const RUNES = [
  "ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ",
  "ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ"
];

async function generate() {
  const element = document.getElementById("element").value;
  const emotion = document.getElementById("emotion").value;

  const res = await fetch("/api/design", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ element, emotion })
  });

  design = await res.json();

  seed = Math.floor(Math.random() * 999999);
  patternType = seed % 4; // ← 形の型を切り替える
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);
  textAlign(CENTER, CENTER);
  textFont("serif");
  generate();
}

function draw() {
  background(5, 0, 15);
  if (!design) return;

  randomSeed(seed);

  rotateX(rotX);
  rotateY(rotY);

  blendMode(ADD);
  stroke(getColor());
  noFill();

  const base = min(width, height) * 0.28;

  drawOuterRing(base * 1.05);
  drawCore(base * 0.35);

  if (patternType === 0) drawStarPolygon(base * 0.9);
  if (patternType === 1) drawIrregularPolygon(base * 0.9);
  if (patternType === 2) drawNestedPolygons(base * 0.9);
  if (patternType === 3) drawRadialLines(base * 0.9);

  drawMoon(base * 0.55);
  drawPetals(base * 1.0);
  drawRunes(base * 1.25);

  blendMode(BLEND);
}

/* ===============================
   基本構造
=============================== */

function drawOuterRing(r) {
  strokeWeight(1.2);
  ellipse(0, 0, r * 2);
}

function drawCore(r) {
  strokeWeight(1);
  ellipse(0, 0, r * 2);
}

/* ===============================
   形のバリエーション
=============================== */

function drawStarPolygon(r) {
  strokeWeight(1.4);
  beginShape();
  for (let i = 0; i < design.points * 2; i++) {
    const a = PI * i / design.points;
    const rr = i % 2 === 0 ? r : r * 0.45;
    vertex(cos(a) * rr, sin(a) * rr);
  }
  endShape(CLOSE);
}

function drawIrregularPolygon(r) {
  strokeWeight(1.3);
  beginShape();
  for (let i = 0; i < design.points; i++) {
    const a = TWO_PI * i / design.points;
    const rr = r * random(0.6, 1.0);
    vertex(cos(a) * rr, sin(a) * rr);
  }
  endShape(CLOSE);
}

function drawNestedPolygons(r) {
  for (let i = 0; i < design.rings; i++) {
    const rr = r * (1 - i * 0.15);
    beginShape();
    for (let j = 0; j < design.points; j++) {
      const a = TWO_PI * j / design.points + i * 0.2;
      vertex(cos(a) * rr, sin(a) * rr);
    }
    endShape(CLOSE);
  }
}

function drawRadialLines(r) {
  strokeWeight(1);
  for (let i = 0; i < design.points * 3; i++) {
    const a = TWO_PI * i / (design.points * 3);
    line(0, 0, cos(a) * r, sin(a) * r);
  }
}

/* ===============================
   装飾
=============================== */

function drawMoon(r) {
  push();
  strokeWeight(1.2);
  ellipse(0, 0, r * 2);
  translate(r * 0.25, 0);
  ellipse(0, 0, r * 2);
  pop();
}

function drawPetals(r) {
  strokeWeight(0.8);
  for (let i = 0; i < design.points * 2; i++) {
    const a = TWO_PI * i / (design.points * 2);
    beginShape();
    for (let t = 0; t <= PI; t += PI / 10) {
      vertex(
        cos(a) * r * cos(t),
        sin(a) * r * sin(t)
      );
    }
    endShape();
  }
}

/* ===============================
   🔮 ルーン：必ず円周
=============================== */

function drawRunes(r) {
  push();
  textSize(20);
  fill(getColor());
  noStroke();

  const count = RUNES.length;

  for (let i = 0; i < count; i++) {
    const a = TWO_PI * i / count - HALF_PI;
    const x = cos(a) * r;
    const y = sin(a) * r;

    push();
    translate(x, y);
    rotate(a + HALF_PI);
    text(RUNES[i], 0, 0);
    pop();
  }
  pop();
}

/* ===============================
   補助
=============================== */

function getColor() {
  const map = {
    fire:  color(255, 100, 80, 160),
    water: color(80, 160, 255, 160),
    wind:  color(160, 255, 200, 160),
    earth: color(180, 150, 100, 160),
    light: color(255, 240, 200, 180),
    dark:  color(180, 120, 255, 160)
  };
  return map[design.element] || color(200, 200, 255, 150);
}

function mouseDragged() {
  rotY += (mouseX - pmouseX) * 0.005;
  rotX -= (mouseY - pmouseY) * 0.005;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
