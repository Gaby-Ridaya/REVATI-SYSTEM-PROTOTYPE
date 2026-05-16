# REVATI — User Guide

---

## Installation

```bash
git clone https://github.com/your-repo/revati
cd revati
npm install
```

Create a `.env.local` file at the root:

```
ANTHROPIC_API_KEY=your_claude_key
```

Your Claude API key is available at [console.anthropic.com](https://console.anthropic.com). The model used is `claude-haiku-4-5` — inexpensive to run.

```bash
npm run dev
```

This command starts two processes in parallel: a small local server (port 3001) that bridges the Claude API, and the Vite interface (port 5173). The API key stays server-side and is never exposed in the browser.

Open `http://localhost:5173`.

---

## Interface Layout

The interface is divided into three zones:

```
┌────────────────┬───────────────────────────────┬──────────────────┐
│    JOURNAL     │        ORBITAL WHEEL          │   NAVIGATION     │
│    (left)      │          (center)             │    (right)       │
│                │                               │                  │
│  session log   │   oracle ↑ at top             │  domains         │
│                │   controls ↓ at bottom        │  selected node   │
│                │                               │  resonances      │
└────────────────┴───────────────────────────────┴──────────────────┘
```

---

## The Wheel

17 nodes orbit on 4 concentric rings. Each node has its own orbital speed. Three nodes are retrograde (they rotate counter-clockwise) — they create tensions in the memory matrix.

**Zoom**: mouse scroll wheel over the wheel.

**Click a node**: isolates that node and its connections. All others fade. The right panel shows its information.

**Click the same node again**: deselects.

**Click empty space**: deselects everything.

---

## Domains

Four node configurations are available, accessible from the right panel:

| Domain | Color | Nodes |
|---|---|---|
| Psychology | violet | Root, Blood, Desire, Fire, Heart, Gaze, Word, Silence, Mask, Shadow, Rupture, Passage, Balance, Wisdom, Destiny, Awakening, Star |
| Climate | green | Water, Wind, Heat, Forest, Ocean, Ice, Soil, CO₂, Cycle, Threshold, Biodiversity, Migration, Adaptation, Collapse, Territory, Society, Homeostasis |
| Algorithms | amber | Data, Operation, Memory, Sort, Graph, Recursion, Search, Dynamic, Agent, Network, Compression, Probability, Learning, Emergence, Reduction, Parallel, Complexity |
| Philosophy | pink | Being, Becoming, Nothingness, Logos, Body, Time, Language, Subject, Power, Void, Structure, Meaning, Freedom, Justice, Transcendence, Ethics, Absolute |

Switching domains automatically saves the current domain's matrix and loads the new one's.

---

## The AI Oracle

The input bar at the top center is the entry point.

**How to use it:**
1. Type an intention, a word, a question, a phrase — in natural language
2. Press `Enter` or click **Invoke**
3. The oracle activates 3 to 6 nodes (glowing halos)
4. A poetic echo appears at the center of the wheel (for a few seconds)
5. A follow-up question appears below the bar

**The follow-up question:** Revati asks an open question drawn from the activated nodes and accumulated memory. Click it to place it in the input field — answering it continues the dialogue.

**What influences the oracle:**
- The written intention
- The accumulated relational memory (past resonances shape activations)
- Engraved personality (see below)
- Retrograde nodes (they introduce tensions and unexpected returns)

Each session is recorded in the **Journal** (left panel) with the intention, echo, question, and activated nodes.

---

## Speed and Animation

Controls at the bottom of the wheel:

| Button | Effect |
|---|---|
| ⏸ / ▶ | Pause or resume animation |
| Slow | Speed multiplier × 0.3 |
| Normal | Speed multiplier × 1.0 |
| Fast | Speed multiplier × 2.5 |

Speed affects memory formation: at fast speed, nodes cross paths more often and resonances accumulate faster.

---

## Memory and Connections

**Memory ON / OFF**: shows or hides orbital trails and echo halos behind each node.

- **Trails**: dots following each node's recent trajectory
- **Echoes**: rings expanding outward from the node's position at regular intervals

**Base connections** (always visible) pulse at their own frequency. Their thickness and brightness increase with the accumulated resonance in the matrix.

**Emergent connections** (pink dashed lines) appear automatically when two nodes accumulate a resonance above 55% in the matrix. Their specific appearance depends on use — not on preset rules.

The counter at the bottom of the wheel shows the number of active emergent connections.

---

## Memory Map

**Map ON / OFF**: switches to a memory matrix view. The wheel keeps animating but connections are replaced by their memory weight.

- **Violet / pink**: your map (base connections in violet, emergent in pink)
- **Amber**: another person's map (if a comparison is loaded)
- **White**: convergence zones (both maps are strong on the same connection)

---

## Exporting and Importing a Map

**My Map**: exports the current memory matrix as JSON. The file includes the profile name, domain, date, and all resonance values.

Exported file format:
```json
{
  "type": "revati-carte",
  "profil": "my-name",
  "domaine": "psychologie",
  "date": "2026-05-16",
  "matrix": { "a-b": 0.72, "c-f": 0.41, ... }
}
```

**Import**: loads a previously exported matrix. Replaces the current matrix.

**Reset memory**: clears the active domain's matrix. Irreversible.

---

## Comparing Two Maps

**Compare a map**: load the JSON file exported by another person (or from a previous session).

Enable **Map ON** to visualize the comparison:
- Amber connections show the loaded map
- White indicates where both maps converge strongly
- The legend at the top of the wheel shows both profile names

**Comparison ON / OFF**: shows or hides the comparison map without unloading it.

**✕**: unloads the comparison map.

---

## Navigation Panel (Right)

**My name**: enter an identifier. It is included in map exports.

**Trajectory**: history of the last 5 visited nodes. Click a node in the trajectory to navigate to it directly.

When a node is selected, the panel shows:

- **Name and function** of the node
- **Orbit and direction** (direct or retrograde)
- **Memory resonances**: the 6 most strongly linked nodes in the matrix, with their score as a percentage. Click a resonance to navigate to that node.
- **Query [node]**: places `Node — ` in the oracle field to start a question related to this node.
- **Real data**: if external data is loaded and contains a note for this node, it appears here.

---

## Engraved Personality

Each node can be "engraved" — meaning it becomes a dominant node in the current configuration.

An engraved node:
- Maintains a permanent background activation (visible as a faint halo)
- Orients oracle responses (it appears in activations unless the intention contradicts it)
- Reinforces memory connections around it
- Is marked with a ◆ symbol on the wheel

**Engraving a node:** click the node → right panel → "Engraved Personality" section → click "Engrave this node".

**Intensity:** three levels — Light (35%), Medium (60%), Strong (90%).

**Unengraving:** removes the engraved personality from this node.

Personality is saved per domain. Switching domains loads the corresponding personality.

---

## Free Nodes

Custom nodes can be added outside the domain's 17 nodes.

**Creating a node:**
1. Click **+ Create** in the right panel
2. Enter a name (18 characters max)
3. Choose a color (palette of 10 colors)
4. Choose an orbit — 0 (fast), 1, 2, 3 (very slow)
5. Choose direction — Direct or Retrograde
6. Click **Add to orbit** or press `Enter`

The node is placed automatically in the free space of the chosen orbit. It is marked with a ✦ on the wheel.

Free nodes participate in the memory matrix on equal footing with domain nodes. They are saved per domain.

**Deleting a free node:** click the node → "Delete this free node" at the bottom of the panel.

---

## Loading External Data

**Load data**: loads a JSON file to activate nodes from an external source.

Expected format:
```json
{
  "source": "Source name",
  "annee": 2025,
  "domaine": "climat",
  "activations": {
    "Forêt": 0.85,
    "Océan": 0.42,
    "Seuil": 0.91
  },
  "notes": {
    "Forêt": "Deforestation 2025: 12.4 Mha (Global Forest Watch)",
    "Seuil": "IPCC AR6: 1.5°C reached by 2030 in the median scenario"
  }
}
```

- Activation values are between `0.0` and `1.0`
- Node names must match exactly the nodes of the active domain
- `notes` is optional — notes appear in the navigation panel when clicking the corresponding node

**Example Python script:**

The file `scripts/export_vers_revati.py` is an example that reads personal climate data (phytoplankton, cetaceans, deforestation) from local CSV files. It will not run as-is on another machine — the data paths are specific to the author.

It is provided as a reference for writing your own export script. Any tool that can produce a JSON in the format above can feed Revati: Python, R, shell, or even a hand-written file.

A sample output is available in `public/donnees_climat.json`.

---

## Journal

The left panel records all oracle sessions.

Each entry contains:
- Date and time
- The written intention (YOU) or a reply to a Revati question (→)
- Revati's poetic echo
- The follow-up question
- Activated nodes

**Export**: downloads the journal as a `.txt` file.

**Clear**: erases the entire journal (irreversible).

The journal is saved in the browser (localStorage). It persists across sessions, up to 200 entries.

---

## Automatic Saving

Revati automatically saves to the browser (localStorage) every 10 seconds:

- The memory matrix (per domain)
- Engraved personality (per domain)
- Free nodes (per domain)
- The journal
- The profile name
- The last used domain

No data leaves your machine. Everything is local.

---

## Shortcuts

| Action | Gesture |
|---|---|
| Zoom in | Scroll wheel up |
| Zoom out | Scroll wheel down |
| Invoke the oracle | `Enter` in the input field |
| Create a free node | `Enter` in the name field |
| Deselect | Click empty space |
| Navigate to a resonance | Click in the right panel list |
| Reply to a question | Click the question bubble |
