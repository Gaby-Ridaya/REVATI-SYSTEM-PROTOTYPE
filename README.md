[Français](README.fr.md)

# REVATI — SYSTEM PROTOTYPE

> Exploratory prototype of a digital interface that distributes information in a cyclical, non-linear way.

![Revati — orbital wheel](Revati.png)

---

## The Problem

Almost all digital interfaces today are built on linear logic:

- start → end
- cause → effect
- hierarchical navigation
- sequential progression
- menu → submenu → result

This logic is inherited from the earliest text-based interfaces. It works well for simple workflows. But it might be poorly suited to the way thought, memory, and living systems actually work.

Thought does not move from point A to point B. It returns. It associates. It resonates. It transforms what it has already passed through.

---

## The Central Idea

**Revati explores a different logic: cyclical distribution of information.**

Instead of filing information into a hierarchy, Revati distributes it across an orbital space. Concepts gravitate. They draw closer by affinity. They form connections that arise from use, not from programming.

Navigation is not a predefined path. It is a field of resonances.

What changes:

| Linear system | Cyclical Revati |
|---|---|
| Information is classified | Information gravitates |
| Relations are defined in advance | Relations emerge from use |
| Memory is external | Memory is living and personal |
| The user follows a path | The user navigates a field |
| State is fixed | State evolves continuously |

---

## What Revati Does

Revati is an interactive orbital wheel. 17 nodes orbit a center at their own speeds and directions. Some are retrograde. All are in motion.

![Revati interface](interface-revati.png)

**The memory matrix** accumulates resonances between nodes with each interaction. The emergence mechanism is programmed — but which connections appear depends entirely on each person's actual use. Two users with the same nodes arrive at different maps.

**The AI oracle** (Claude) receives an intention in natural language, activates the corresponding nodes, and lets propagation unfold through the matrix. The result is not an answer — it is a state.

---

## Available Domains

Revati works with any set of 17 concepts. Four domains are included:

- **Psychology** — 17 inner states (Root → Blood → Desire → ... → Star)
- **Climate** — cycles of the Earth system (Water, Forest, Ocean, Threshold, Migration...)
- **Algorithms** — fundamental paradigms (Recursion, Graph, Emergence, Network...)
- **Philosophy** — conceptual tensions (Being, Becoming, Subject, Void, Freedom...)

External data can be loaded via a local JSON file. No data passes through a server.

---

## Technical Stack

- React 19 + Vite
- SVG (orbital wheel, bezier connections, animations)
- D3.js
- Framer Motion
- Claude API (Haiku) — for the AI oracle

---

## Getting Started

```bash
git clone https://github.com/your-repo/revati
cd revati
npm install
```

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your_claude_key
```

Run:

```bash
npm run dev
```

The API key stays server-side — it is never exposed in the browser.

---

## Loading Your Own Data

Revati accepts a local JSON file to feed nodes from an external source:

```json
{
  "source": "Name of your dataset",
  "domaine": "climat",
  "activations": {
    "Forêt": 0.85,
    "Océan": 0.42,
    "Seuil": 0.91
  }
}
```

Values range from `0.0` (inactive) to `1.0` (maximum). A Python script is provided as a reference for climate data:

```bash
python3 scripts/export_vers_revati.py
```

---

## What Revati Is Not

- Not a search engine — it resonates, it does not search
- Not a database — it accumulates, it does not index
- Not a dashboard — no fixed metrics, only living states
- Not a linear productivity tool

**Revati does not progress. It evolves.**

---

## Potential

This prototype explores a principle: if information were distributed cyclically rather than hierarchically, the user would navigate a living system rather than follow a workflow.

Directions to explore: complex thinking, resonance-based research, mapping inner states, visualizing non-linear systems, associative learning, creative exploration. None of these applications have been validated yet — that is precisely what this prototype invites people to test.

---

## Contributing

The project is open. Natural directions:

- New node domains (music, neuroscience, economics...)
- Creation mode — the user defines their own nodes
- Connecting to real-time data sources
- Exporting the memory matrix
- Dialogue AI — Revati questioning back

---

## What Revati Does Not Yet Know About Itself

Revati is built on intuitions that have not been tested.

The internal thresholds — when a connection emerges, how fast memory forms — were chosen by observation, not by formal model. They work visually. But no one yet knows whether they correspond to anything real in the way associative thinking works.

The central question remains open:

> **Does navigating a cyclical, non-linear space actually change the way we think, associate, and explore ideas?**

Answering this would require researchers in HCI (Human-Computer Interaction), cognitive science, or complex systems — people capable of designing experiments and confronting the parameters with formal models.

If you work in these fields and this question interests you, this project needs you.

---

*Revati — exploratory prototype of a cyclical orbital interface*
