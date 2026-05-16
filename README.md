# REVATI — SYSTEME PROTOTYPE

> Prototype exploratoire d'une interface numérique qui distribue l'information de façon cyclique, non linéaire.

![Revati — roue orbitale](Revati.png)

---

## Le problème

La quasi-totalité des interfaces numériques actuelles repose sur une logique linéaire :

- début → fin
- cause → effet
- navigation hiérarchique
- progression séquentielle
- menu → sous-menu → résultat

Cette logique est héritée des premières interfaces textuelles. Elle convient bien aux flux de travail simples. Mais elle pourrait être inadaptée à la façon dont la pensée, la mémoire, et les systèmes vivants fonctionnent.

La pensée ne va pas d'un point A à un point B. Elle revient. Elle associe. Elle résonne. Elle transforme ce qu'elle a déjà traversé.

---

## L'idée centrale

**Revati explore une autre logique : la distribution cyclique de l'information.**

Au lieu de ranger l'information dans une hiérarchie, Revati la distribue dans un espace orbital. Les concepts gravitent. Ils se rapprochent par affinité. Ils forment des connexions qui naissent de l'usage, pas de la programmation.

La navigation n'est pas un chemin prédéfini. C'est un champ de résonances.

Ce que ça change :

| Système linéaire | Revati cyclique |
|---|---|
| L'information est classée | L'information gravite |
| La relation est définie à l'avance | La relation émerge de l'usage |
| La mémoire est externe | La mémoire est vivante et personnelle |
| L'utilisateur suit un chemin | L'utilisateur navigue dans un champ |
| L'état est figé | L'état évolue en permanence |

---

## Ce que fait Revati

Revati est une roue orbitale interactive. 17 nœuds gravitent autour d'un centre selon leurs propres vitesses et directions. Certains sont rétrogrades. Tous sont en mouvement.

![Interface Revati](interface-revati.png)

**La matrice mémoire** accumule les résonances entre nœuds à chaque interaction. Le mécanisme d'émergence est programmé — mais lesquelles apparaissent dépend uniquement de l'usage réel de chaque personne. Deux utilisateurs avec les mêmes nœuds arrivent à des cartes différentes.

**L'oracle IA** (Claude) reçoit une intention en langage naturel, active les nœuds correspondants, et laisse la propagation se faire via la matrice. Le résultat n'est pas une réponse — c'est un état.

---

## Domaines disponibles

Revati fonctionne avec n'importe quel ensemble de 17 concepts. Quatre domaines sont inclus :

- **Psychologie** — les 17 états intérieurs (Racine → Sang → Désir → ... → Étoile)
- **Climat** — les cycles du système terrestre (Eau, Forêt, Océan, Seuil, Migration...)
- **Algorithmes** — les paradigmes fondamentaux (Récursion, Graphe, Émergence, Réseau...)
- **Philosophie** — les tensions conceptuelles (Être, Devenir, Sujet, Vide, Liberté...)

Des données externes peuvent être chargées via un fichier JSON local. Aucune donnée ne passe par un serveur.

---

## Stack technique

- React 19 + Vite
- SVG (roue orbitale, connexions bezier, animations)
- D3.js
- Framer Motion
- Claude API (Haiku) — pour l'oracle IA

---

## Démarrer

```bash
git clone https://github.com/votre-repo/revati
cd revati
npm install
```

Créer un fichier `.env.local` :

```
ANTHROPIC_API_KEY=votre_clé_claude
```

Lancer :

```bash
npm run dev
```

La clé API reste côté serveur — elle n'est jamais exposée dans le navigateur.

---

## Charger ses propres données

Revati accepte un fichier JSON local pour alimenter les nœuds depuis une source externe :

```json
{
  "source": "Nom de votre étude",
  "domaine": "climat",
  "activations": {
    "Forêt": 0.85,
    "Océan": 0.42,
    "Seuil": 0.91
  }
}
```

Les valeurs sont entre `0.0` (inactif) et `1.0` (maximum). Un script Python est fourni pour les données climatiques :

```bash
python3 scripts/export_vers_revati.py
```

---

## Ce que Revati n'est pas

- Pas un moteur de recherche — elle résonne, elle ne cherche pas
- Pas une base de données — elle accumule, elle n'indexe pas
- Pas un dashboard — pas de métriques figées, des états vivants
- Pas un outil de productivité linéaire

**Revati ne progresse pas. Elle évolue.**

---

## Potentiel

Ce prototype explore un principe : si l'information était distribuée cycliquement plutôt que hiérarchiquement, l'utilisateur naviguerait dans un système vivant plutôt que de suivre un workflow.

Directions à explorer : pensée complexe, recherche par résonance, cartographie d'états intérieurs, visualisation de systèmes non linéaires, pédagogie par association, exploration créative. Aucune de ces applications n'a encore été validée — c'est précisément ce que ce prototype invite à tester.

---

## Contribuer

Le projet est ouvert. Les directions naturelles :

- Nouveaux domaines de nœuds (musique, neurosciences, économie...)
- Mode création — l'utilisateur définit ses propres nœuds
- Branchement sur des données en temps réel
- Export de la matrice mémoire
- IA dialogue — Revati qui questionne en retour

---

## Ce que Revati ne sait pas encore sur elle-même

Revati repose sur des intuitions qui n'ont pas encore été testées.

Les seuils internes — à partir de quand une connexion émerge, à quelle vitesse la mémoire se forme — ont été choisis par observation, pas par modèle. Ils fonctionnent visuellement. Mais personne ne sait encore s'ils correspondent à quelque chose de réel dans la façon dont la pensée associative fonctionne.

La question centrale reste ouverte :

> **Est-ce que naviguer dans un espace cyclique et non linéaire change réellement la façon dont on pense, associe, et explore des idées ?**

Pour y répondre, il faudrait des chercheurs en HCI (Human-Computer Interaction), en sciences cognitives, ou en systèmes complexes capables de concevoir des expériences et de confronter les paramètres à des modèles formels.

Si vous travaillez dans ces domaines et que cette question vous intéresse, ce projet a besoin de vous.

---

*Revati — prototype exploratoire d'interface orbitale cyclique*
