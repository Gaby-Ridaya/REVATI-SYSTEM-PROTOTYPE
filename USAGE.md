# REVATI — Guide d'utilisation

---

## Installation

```bash
git clone https://github.com/votre-repo/revati
cd revati
npm install
```

Créer un fichier `.env.local` à la racine :

```
ANTHROPIC_API_KEY=votre_clé_claude
```

La clé Claude est disponible sur [console.anthropic.com](https://console.anthropic.com). Le modèle utilisé est `claude-haiku-4-5` — peu coûteux à l'usage.

```bash
npm run dev
```

Cette commande démarre deux processus en parallèle : un petit serveur local (port 3001) qui fait le pont avec l'API Claude, et l'interface Vite (port 5173). La clé API reste côté serveur et n'est jamais exposée dans le navigateur.

Ouvrir `http://localhost:5173`.

---

## Interface

L'interface est divisée en trois zones :

```
┌────────────────┬───────────────────────────────┬──────────────────┐
│   JOURNAL      │        ROUE ORBITALE          │   NAVIGATION     │
│   (gauche)     │          (centre)             │    (droite)      │
│                │                               │                  │
│  historique    │   oracle ↑ en haut            │  domaines        │
│  des sessions  │   contrôles ↓ en bas          │  nœud sélectionné│
│                │                               │  résonances      │
└────────────────┴───────────────────────────────┴──────────────────┘
```

---

## La roue

17 nœuds gravitent sur 4 orbites concentriques. Chaque nœud a sa propre vitesse orbitale. Trois nœuds sont rétrogrades (ils tournent à contre-sens) — ils créent des tensions dans la matrice mémoire.

**Zoom** : molette de la souris sur la roue.

**Cliquer un nœud** : isole ce nœud et ses connexions. Tous les autres s'estompent. Le panneau de droite affiche ses informations.

**Cliquer à nouveau le même nœud** : désélectionne.

**Cliquer dans le vide** : désélectionne tout.

---

## Domaines

Quatre configurations de nœuds sont disponibles, accessibles depuis le panneau de droite :

| Domaine | Couleur | Nœuds |
|---|---|---|
| Psychologie | violet | Racine, Sang, Désir, Feu, Cœur, Regard, Verbe, Silence, Masque, Ombre, Rupture, Passage, Équilibre, Sagesse, Destin, Éveil, Étoile |
| Climat | vert | Eau, Vent, Chaleur, Forêt, Océan, Glace, Sol, CO₂, Cycle, Seuil, Biodiversité, Migration, Adaptation, Effondrement, Territoire, Société, Homéostasie |
| Algorithmes | ambre | Donnée, Opération, Mémoire, Tri, Graphe, Récursion, Recherche, Dynamique, Agent, Réseau, Compression, Probabilité, Apprentissage, Émergence, Réduction, Parallèle, Complexité |
| Philosophie | rose | Être, Devenir, Néant, Logos, Corps, Temps, Langage, Sujet, Pouvoir, Vide, Structure, Sens, Liberté, Justice, Transcendance, Éthique, Absolu |

Changer de domaine sauvegarde automatiquement la matrice du domaine quitté et charge celle du nouveau.

---

## L'oracle IA

La barre en haut au centre est le point d'entrée.

**Comment l'utiliser :**
1. Écrire une intention, un mot, une question, une phrase — en langage naturel
2. Appuyer sur `Entrée` ou cliquer **Invoquer**
3. L'oracle active 3 à 6 nœuds (halos lumineux)
4. Un écho poétique apparaît au centre de la roue (quelques secondes)
5. Une question en retour s'affiche sous la barre

**La question en retour :** Revati pose une question ouverte issue des nœuds activés et de la mémoire accumulée. Cliquer dessus la place dans le champ de saisie — répondre continue le dialogue.

**Ce qui influence l'oracle :**
- L'intention écrite
- La mémoire relationnelle accumulée (les résonances passées orientent les activations)
- La personnalité gravée (voir plus bas)
- Les nœuds rétrogrades (ils introduisent des tensions, des retours inattendus)

Chaque session est enregistrée dans le **Journal** (panneau gauche) avec l'intention, l'écho, la question, et les nœuds activés.

---

## Vitesse et animation

Contrôles en bas de la roue :

| Bouton | Effet |
|---|---|
| ⏸ / ▶ | Pause ou reprise de l'animation |
| Lent | Multiplicateur de vitesse × 0.3 |
| Normal | Multiplicateur de vitesse × 1.0 |
| Rapide | Multiplicateur de vitesse × 2.5 |

La vitesse affecte la formation de la mémoire : à vitesse rapide, les nœuds se croisent plus souvent, les résonances s'accumulent plus vite.

---

## Mémoire et connexions

**Mémoire ON / OFF** : affiche ou masque les traces orbitales et les halos d'écho derrière chaque nœud.

- **Traces** : points qui suivent la trajectoire récente de chaque nœud
- **Échos** : anneaux qui s'élargissent depuis la position du nœud à intervalles réguliers

**Les connexions de base** (filaires, toujours présentes) pulsent selon leur fréquence propre. Leur épaisseur et luminosité augmentent avec la résonance accumulée dans la matrice.

**Les connexions émergentes** (pointillées roses) apparaissent automatiquement quand deux nœuds accumulent une résonance supérieure à 55% dans la matrice. Elles ne sont pas programmées — elles naissent de l'usage.

Le compteur en bas de la roue indique le nombre de connexions émergentes actives.

---

## Carte mémoire

**Carte ON / OFF** : bascule vers une vue de la matrice mémoire. La roue reste animée mais les connexions sont remplacées par leur poids mémoriel.

- **Violet / rose** : ma carte (connexions de base en violet, émergentes en rose)
- **Ambre** : carte d'une autre personne (si une comparaison est chargée)
- **Blanc** : zones de convergence (les deux cartes sont fortes sur la même connexion)

---

## Exporter et importer une carte

**Ma carte** : exporte la matrice mémoire actuelle en JSON. Le fichier inclut le nom de profil, le domaine, la date, et toutes les valeurs de résonance.

Format du fichier exporté :
```json
{
  "type": "revati-carte",
  "profil": "mon-nom",
  "domaine": "psychologie",
  "date": "2026-05-16",
  "matrix": { "a-b": 0.72, "c-f": 0.41, ... }
}
```

**Importer** : charge une matrice exportée précédemment. Remplace la matrice courante.

**Reset mémoire** : remet à zéro la matrice du domaine actif. Irréversible.

---

## Comparer deux cartes

**Comparer une carte** : charger le fichier JSON exporté d'une autre personne (ou d'une session précédente).

Activer **Carte ON** pour visualiser la comparaison :
- Les connexions ambre montrent la carte chargée
- Le blanc indique là où les deux cartes convergent fortement
- La légende au sommet de la roue indique les deux profils

**Comparaison ON / OFF** : affiche ou masque la carte de comparaison sans la décharger.

**✕** : décharge la carte de comparaison.

---

## Panneau de navigation (droite)

**Mon nom** : entrer un identifiant. Il est inclus dans les exports de carte.

**Trajectoire** : historique des 5 derniers nœuds visités. Cliquer un nœud dans la trajectoire y navigue directement.

Quand un nœud est sélectionné, le panneau affiche :

- **Nom et fonction** du nœud
- **Orbite et direction** (direct ou rétrograde)
- **Résonances mémoire** : les 6 nœuds les plus fortement liés dans la matrice, avec leur score en pourcentage. Cliquer une résonance navigue vers ce nœud.
- **Interroger [nœud]** : place `Nœud — ` dans le champ oracle pour démarrer une question liée à ce nœud.
- **Données réelles** : si des données externes sont chargées et contiennent une note pour ce nœud, elle s'affiche ici.

---

## Personnalité gravée

Chaque nœud peut être "gravé" — ce qui signifie qu'il devient un nœud dominant dans la configuration actuelle.

Un nœud gravé :
- Maintient une activation de fond permanente (visible comme un léger halo)
- Oriente les réponses de l'oracle (il apparaît dans les activations sauf si l'intention le contredit)
- Renforce les connexions mémoire autour de lui
- Est marqué d'un symbole ◆ sur la roue

**Graver un nœud :** cliquer le nœud → panneau de droite → section "Personnalité gravée" → cliquer "Graver ce nœud".

**Intensité :** trois niveaux — Léger (35%), Moyen (60%), Fort (90%).

**Dégraver :** retire la personnalité gravée sur ce nœud.

La personnalité est sauvegardée par domaine. Changer de domaine charge la personnalité correspondante.

---

## Nœuds libres

Il est possible d'ajouter des nœuds personnalisés en dehors des 17 nœuds du domaine.

**Créer un nœud :**
1. Cliquer **+ Créer** dans le panneau de droite
2. Entrer un nom (18 caractères max)
3. Choisir une couleur (palette de 10 couleurs)
4. Choisir une orbite — 0 (rapide), 1, 2, 3 (très lente)
5. Choisir la direction — Direct ou Rétrograde
6. Cliquer **Ajouter à l'orbite** ou appuyer sur `Entrée`

Le nœud est placé automatiquement dans l'espace libre de l'orbite choisie. Il est marqué d'un ✦ sur la roue.

Les nœuds libres participent à la matrice mémoire au même titre que les nœuds du domaine. Ils sont sauvegardés par domaine.

**Supprimer un nœud libre :** cliquer le nœud → "Supprimer ce nœud libre" en bas du panneau.

---

## Charger des données externes

**Charger données** : charge un fichier JSON pour activer les nœuds depuis une source externe.

Format attendu :
```json
{
  "source": "Nom de la source",
  "annee": 2025,
  "domaine": "climat",
  "activations": {
    "Forêt": 0.85,
    "Océan": 0.42,
    "Seuil": 0.91
  },
  "notes": {
    "Forêt": "Déforestation 2025 : 12.4 Mha (Global Forest Watch)",
    "Seuil": "IPCC AR6 : 1.5°C atteint dès 2030 dans le scénario médian"
  }
}
```

- Les valeurs d'activation sont entre `0.0` et `1.0`
- Les noms de nœuds doivent correspondre exactement aux nœuds du domaine actif
- `notes` est optionnel — les notes apparaissent dans le panneau de navigation quand on clique le nœud correspondant

**Exemple de script Python :**

Le fichier `scripts/export_vers_revati.py` est un exemple qui lit des données climatiques personnelles (phytoplancton, cétacés, déforestation) depuis des CSV locaux. Il ne fonctionnera pas tel quel sur une autre machine — les chemins de données sont spécifiques à l'auteur.

Il est fourni comme référence pour écrire son propre script d'export. N'importe quel outil capable de produire un JSON dans le format ci-dessus peut alimenter Revati : Python, R, shell, ou même un fichier écrit à la main.

Un exemple de sortie est disponible dans `public/donnees_climat.json`.

---

## Journal

Le panneau de gauche enregistre toutes les sessions oracle.

Chaque entrée contient :
- La date et l'heure
- L'intention écrite (TOI) ou la réponse à une question de Revati (→)
- L'écho poétique de Revati
- La question posée en retour
- Les nœuds activés

**Exporter** : télécharge le journal en `.txt`.

**Vider** : efface tout le journal (irréversible).

Le journal est sauvegardé dans le navigateur (localStorage). Il persiste entre les sessions, jusqu'à 200 entrées.

---

## Sauvegarde automatique

Revati sauvegarde automatiquement dans le navigateur (localStorage) toutes les 10 secondes :

- La matrice mémoire (par domaine)
- La personnalité gravée (par domaine)
- Les nœuds libres (par domaine)
- Le journal
- Le nom de profil
- Le dernier domaine utilisé

Aucune donnée ne quitte la machine. Tout est local.

---

## Raccourcis

| Action | Geste |
|---|---|
| Zoom + | Scroll molette vers le haut |
| Zoom − | Scroll molette vers le bas |
| Invoquer l'oracle | `Entrée` dans le champ de saisie |
| Créer un nœud libre | `Entrée` dans le champ de nom |
| Désélectionner | Cliquer dans le vide |
| Naviguer vers une résonance | Cliquer dans la liste du panneau droit |
| Répondre à la question | Cliquer sur la bulle de question |
