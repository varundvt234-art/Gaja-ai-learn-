import { ConversationSession } from '../types';

export const SAMPLE_DIAGRAM_SVG = `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style="font-family: system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.1" />
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4f46e5" />
    </marker>
    <marker id="arrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#16a34a" />
    </marker>
    <marker id="arrowOrange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ea580c" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="800" height="480" rx="16" fill="url(#skyGrad)" />
  <rect x="0" y="380" width="800" height="100" fill="#78350f" opacity="0.15" />

  <!-- Title Banner -->
  <rect x="220" y="16" width="360" height="40" rx="20" fill="#ffffff" filter="url(#shadow)" />
  <text x="400" y="42" font-size="16" font-weight="bold" fill="#1e1b4b" text-anchor="middle">
    ☀️ The Photosynthesis Cycle
  </text>

  <!-- Sun Element -->
  <g transform="translate(100, 100)">
    <circle cx="0" cy="0" r="42" fill="url(#sunGrad)" filter="url(#shadow)" />
    <!-- Rays -->
    <path d="M 0 -55 L 0 -65 M 39 -39 L 46 -46 M 55 0 L 65 0 M 39 39 L 46 46 M 0 55 L 0 65 M -39 39 L -46 46 M -55 0 L -65 0 M -39 -39 L -46 -46" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
    <text x="0" y="5" font-size="12" font-weight="bold" fill="#78350f" text-anchor="middle">Sunlight</text>
    <text x="0" y="20" font-size="10" fill="#92400e" text-anchor="middle">Photon Energy</text>
  </g>

  <!-- Sunlight Beam to Leaf -->
  <path d="M 140 120 Q 250 160 330 210" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,4" fill="none" marker-end="url(#arrowOrange)" />
  <text x="210" y="150" font-size="11" font-weight="600" fill="#b45309">Light Absorption</text>

  <!-- Central Leaf Graphic -->
  <g transform="translate(400, 240)">
    <!-- Leaf Body -->
    <path d="M -120 0 C -90 -100 90 -100 120 0 C 90 100 -90 100 -120 0 Z" fill="url(#leafGrad)" filter="url(#shadow)" />
    <!-- Central Vein -->
    <path d="M -110 0 L 110 0" stroke="#bbf7d0" stroke-width="3" />
    <!-- Branch Veins -->
    <path d="M -60 0 L -30 -35 M -20 0 L 10 -40 M 20 0 L 50 -35 M -60 0 L -30 35 M -20 0 L 10 40 M 20 0 L 50 35" stroke="#bbf7d0" stroke-width="1.8" />
    <!-- Center Chloroplast Tag -->
    <rect x="-65" y="-18" width="130" height="36" rx="18" fill="#ffffff" opacity="0.95" />
    <text x="0" y="-1" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">CHLOROPLAST</text>
    <text x="0" y="12" font-size="9" fill="#166534" text-anchor="middle">Chlorophyll Factory</text>
  </g>

  <!-- Inputs Left: CO2 -->
  <g transform="translate(140, 260)">
    <rect x="0" y="0" width="120" height="52" rx="12" fill="#ffffff" filter="url(#shadow)" />
    <text x="60" y="22" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">CO₂ (Inhale)</text>
    <text x="60" y="38" font-size="10" fill="#64748b" text-anchor="middle">via Stomata Pores</text>
    <path d="M 120 26 L 255 240" stroke="#4f46e5" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />
  </g>

  <!-- Inputs Bottom: Water H2O -->
  <g transform="translate(160, 395)">
    <rect x="0" y="0" width="140" height="52" rx="12" fill="#ffffff" filter="url(#shadow)" />
    <text x="70" y="22" font-size="13" font-weight="bold" fill="#0284c7" text-anchor="middle">💧 H₂O (Water)</text>
    <text x="70" y="38" font-size="10" fill="#64748b" text-anchor="middle">Drawn by Roots</text>
    <path d="M 140 26 Q 280 400 350 310" stroke="#0284c7" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />
  </g>

  <!-- Output Right: O2 Oxygen -->
  <g transform="translate(560, 160)">
    <rect x="0" y="0" width="150" height="54" rx="12" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1.5" filter="url(#shadow)" />
    <text x="75" y="22" font-size="13" font-weight="bold" fill="#065f46" text-anchor="middle">💨 Oxygen (O₂)</text>
    <text x="75" y="38" font-size="10" fill="#047857" text-anchor="middle">Released into Air</text>
    <path d="M -40 60 Q -10 27 0 27" stroke="#10b981" stroke-width="2.5" fill="none" marker-end="url(#arrowGreen)" />
  </g>

  <!-- Output Right: Glucose Sugar -->
  <g transform="translate(560, 290)">
    <rect x="0" y="0" width="150" height="54" rx="12" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5" filter="url(#shadow)" />
    <text x="75" y="22" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">🍬 Glucose (C₆H₁₂O₆)</text>
    <text x="75" y="38" font-size="10" fill="#b45309" text-anchor="middle">Food for Plant Growth</text>
    <path d="M -40 -30 Q -10 27 0 27" stroke="#f59e0b" stroke-width="2.5" fill="none" marker-end="url(#arrowOrange)" />
  </g>

  <!-- Chemical Equation Footer Card -->
  <g transform="translate(130, 420)">
    <rect x="0" y="0" width="540" height="40" rx="10" fill="#1e1b4b" />
    <text x="270" y="25" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">
      6 CO₂ + 6 H₂O + Light Energy  ➔  C₆H₁₂O₆ (Glucose) + 6 O₂
    </text>
  </g>
</svg>`;

export const SAMPLE_SHOWCASE_SESSION: ConversationSession = {
  id: 'showcase_photosynthesis_v1',
  title: 'What is photosynthesis and how does it work?',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  mode: 'easy',
  level: 'middle',
  language: 'en',
  isBookmarked: true,
  currentImage: {
    base64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%2310b981"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>',
    mimeType: 'image/svg+xml',
    fileName: 'green_leaf_sample.svg',
  },
  messages: [
    {
      id: 'showcase_msg_1',
      role: 'user',
      content: 'What is photosynthesis? How do plants turn sunlight into energy, and why is it important for humans?',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      modeUsed: 'easy',
      levelUsed: 'middle',
      languageUsed: 'en',
    },
    {
      id: 'showcase_msg_2',
      role: 'assistant',
      content: `Hello there! I am **Gaja AI Learn**, your friendly learning teacher. Let’s dive into one of nature's greatest biological marvels!

---

## 🌟 Summary: What is Photosynthesis?
Think of **Photosynthesis** as the way plants "cook" their own meals using clean energy. Unlike humans, who need to visit a grocery store, plants make their own nutritious snacks using just three ingredients: **Sunlight, Water, and Air**.

In simple terms: Plants capture energy from the Sun, drink water from the soil, and breathe in carbon dioxide from the air to produce **glucose** (their food) and release **oxygen** for us to breathe!

---

## 🔬 How It Works (The Leaf Factory)
Inside every green leaf are millions of microscopic power plants called **Chloroplasts**. These contain a bright green pigment named **Chlorophyll**, which acts just like miniature solar panels.

The entire process works in two synchronized stages:
1. **Light Absorption & Water Splitting:** Chlorophyll absorbs light waves from the Sun. The plant's roots suck water ($H_2O$) up from the earth. Sunlight energy splits the water molecules, releasing **Oxygen ($O_2$)** into the atmosphere.
2. **Sugar Synthesis:** Tiny microscopic breathing pores on the underside of leaves (called **Stomata**) take in Carbon Dioxide ($CO_2$). Using the stored solar energy, the plant bonds carbon, hydrogen, and oxygen together into **Glucose ($C_6H_{12}O_6$)**.

$$\\text{6 } H_2O + \\text{6 } CO_2 + \\text{Light} \\longrightarrow C_6H_{12}O_6 + \\text{6 } O_2$$

---

## 💡 Everyday Life Applications
* **Every Breath You Take:** Over 50% of Earth’s oxygen is generated by tiny ocean organisms called **phytoplankton**, with the rest produced by rainforests and plants.
* **The Base of Every Meal:** Whether you eat fresh fruits, vegetables, rice, or dairy, every single food chain on Earth begins with photosynthesizing plants.
* **Ancient Solar Fuel:** Coal and petroleum are actually ancient solar energy stored by prehistoric plants millions of years ago!

---

## ❓ Common Misconceptions & Fun Facts
* **Misconception:** *Plants only make oxygen and do not breathe.*  
  **Fact:** Plants perform cellular respiration day and night, using a fraction of the oxygen they make to burn glucose for energy!
* **Fun Fact:** A solar panel made by humans achieves about 15–20% energy conversion, whereas natural plants have been quietly converting sunlight into living biomass for over 3 billion years!

---

## ⚠️ Nature Caution
* While photosynthesis creates healthy food, never ingest unknown wild plants or pond algae. Certain cyanobacteria (blue-green photosynthetic algae) can produce harmful microcystin toxins. Always verify wild plants with an adult or botanist!

---

### 🧭 Curious Next Questions
- How do desert plants like cacti perform photosynthesis without drying out?
- Why do deciduous tree leaves change from green to vibrant red and gold in autumn?
- Can scientists build artificial photosynthesis to combat atmospheric carbon dioxide?`,
      timestamp: new Date().toISOString(),
      modeUsed: 'easy',
      levelUsed: 'middle',
      languageUsed: 'en',
      diagramSvg: SAMPLE_DIAGRAM_SVG,
      quiz: [
        {
          question: 'What microscopic pigment inside leaf cells absorbs sunlight energy?',
          options: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Keratin'],
          correctIndex: 1,
          explanation: 'Chlorophyll is the green pigment in chloroplasts that absorbs sunlight like a solar panel.',
        },
        {
          question: 'What gas do plants take in from the air to build glucose sugar?',
          options: ['Nitrogen (N2)', 'Carbon Dioxide (CO2)', 'Helium (He)', 'Methane (CH4)'],
          correctIndex: 1,
          explanation: 'Plants absorb Carbon Dioxide (CO2) through microscopic pores called stomata.',
        },
        {
          question: 'What vital gas is released into the atmosphere as a byproduct of photosynthesis?',
          options: ['Carbon Monoxide', 'Oxygen (O2)', 'Argon', 'Hydrogen Gas'],
          correctIndex: 1,
          explanation: 'When water molecules are split by sunlight, pure Oxygen is released into the air!',
        },
      ],
      sources: [
        { title: 'National Science Teaching Association (NSTA)', url: 'https://www.nsta.org' },
        { title: 'Encyclopædia Britannica — Photosynthesis', url: 'https://www.britannica.com' },
        { title: 'NASA Earth Observatory — Phytoplankton', url: 'https://earthobservatory.nasa.gov' },
      ],
    },
  ],
};
