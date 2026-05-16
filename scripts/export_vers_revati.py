"""
Export complet des données climatiques vers Revati.
Couvre : phytoplancton, cétacés, déforestation (Amazonie, Gran Chaco, Mercosur),
         scénarios futurs (BAU / restauration / arrêt pêche), économie verte.

Usage :
  python3 export_vers_revati.py                     → toutes sources, 2025
  python3 export_vers_revati.py --annee 1980        → historique 1980
  python3 export_vers_revati.py --scenario bau      → projection BAU (2026-2100)
  python3 export_vers_revati.py --scenario restauration --annee 2060
  python3 export_vers_revati.py --scenario arret_peche --annee 2050
"""

import csv, json, sys, argparse
from pathlib import Path

BASE   = Path('/home/gaby/climat')
ARCH   = BASE / 'archives_associations'
DATA   = BASE / 'data'
OUT    = Path('/home/gaby/Revati/public/donnees_climat.json')

# ── Sources ───────────────────────────────────────────────────────────────────

SOURCES = {
    'hist':      DATA / 'ecosystemes_marins/combined_real_data.csv',
    'amazon':    DATA / 'mercosur_deforestation/amazon_deforestation_prodes.csv',
    'mercosur':  DATA / 'mercosur_deforestation/mercosur_complete_dataset.csv',
    'chaco':     DATA / 'mercosur_deforestation/gran_chaco_deforestation.csv',
    'economie':  DATA / 'economie/economie_ecologie_donnees.csv',
    'bau':       DATA / 'scenarios/scenario_bau_2026_2100.csv',
    'restauration': DATA / 'scenarios/scenario_restauration_2026_2100.csv',
    'arret_peche':  DATA / 'scenarios/scenario_arret_peche_2026_2100.csv',
}

# ── Plages de normalisation (min → 0, max → 1) ───────────────────────────────

RANGES = {
    'whale':     (0.48,  4.90),
    'capture':   (0.0,   95.0),
    'sst':       (-0.42, 1.20),
    'chl':       (0.21,  0.43),
    'amazon':    (4000,  15000),   # km² — range effectif observations disponibles
    'chaco_ha':  (0,     200000),
    'tree_loss': (0,     6.0),     # mha/an
    'co2_mt':    (100,   300),
    'score_eco': (20,    80),
    'renouv':    (10,    100),
    'soutena':   (20,    80),
}

def norm(val, lo, hi):
    if hi == lo: return 0.0
    return max(0.0, min(1.0, (val - lo) / (hi - lo)))

def inv(v): return round(1.0 - v, 3)
def fwd(v): return round(v, 3)

# ── Chargeurs CSV ─────────────────────────────────────────────────────────────

def load_by_year(path):
    with open(path) as f:
        reader = csv.DictReader(f)
        year_col = next((c for c in reader.fieldnames if c.lower() in ('year', 'annee', 'année')), None)
        if not year_col:
            return {}
        return {int(r[year_col]): r for r in reader if r[year_col].isdigit()}

def load_csv(path):
    with open(path) as f:
        return list(csv.DictReader(f))

# ── Modules de données → activations ─────────────────────────────────────────

def module_ecosystemes(year):
    data = load_by_year(SOURCES['hist'])
    if year not in data:
        return {}, {}
    r = data[year]
    w   = float(r['whale_population_millions'])
    cap = float(r['marine_capture_million_tonnes'])
    sst = float(r['sst_anomaly_celsius'])
    chl = float(r['chlorophyll_a_mg_m3'])

    bio  = inv(fwd(norm(w,   *RANGES['whale'])))
    oce  = fwd(norm(cap, *RANGES['capture']))
    cha  = fwd(norm(sst, *RANGES['sst']))
    hom  = inv(fwd(norm(chl, *RANGES['chl'])))
    seuil = fwd(round((cha + hom) / 2, 3))
    effo  = fwd(round((bio * hom * cha) ** (1/3), 3))
    migr  = fwd(round((bio + oce) / 2, 3))

    w1900 = 4.9; c1900 = 0.419
    acts = {
        'Biodiversité': bio, 'Homéostasie': hom, 'Chaleur': cha,
        'Océan': oce, 'Seuil': seuil, 'Effondrement': effo, 'Migration': migr,
    }
    notes = {
        'Biodiversité': f"Baleines {year}: {w:.2f}M (−{round((1-w/w1900)*100)}% depuis 1900)",
        'Homéostasie':  f"Chlorophylle-a {year}: {chl:.3f} mg/m³ (−{round((1-chl/c1900)*100)}% depuis 1900, NASA)",
        'Chaleur':      f"Anomalie SST {year}: +{sst:.2f}°C",
        'Océan':        f"Pêche marine {year}: {cap:.1f}M tonnes/an",
        'Seuil':        f"Combinaison SST + déclin phytoplancton ({year})",
        'Effondrement': f"Biodiversité × phytoplancton × chaleur ({year})",
        'Migration':    f"Pression baleines + pêche intensive ({year})",
    }
    return acts, notes

def module_deforestation(year):
    acts, notes = {}, {}

    # Amazonie PRODES
    amazon_data = load_by_year(SOURCES['amazon'])
    if year in amazon_data:
        km2 = float(amazon_data[year]['amazon_deforestation_km2'])
        v = fwd(norm(km2, *RANGES['amazon']))   # haut km² = haute pression = haut score
        acts['Forêt']  = fwd(v)                 # plus de déforestation = Forêt en crise
        acts['Sol']    = fwd(v * 0.6)
        acts['CO₂']    = fwd(v * 0.85)
        notes['Forêt'] = f"Déforestation Amazonie {year}: {km2:,.0f} km² (PRODES/INPE)"
        notes['Sol']   = f"Dégradation sols liée déforestation Amazonie {year}: {km2:,.0f} km²"
        notes['CO₂']   = f"Carbone libéré déforestation Amazonie {year}: {km2:,.0f} km²"

    # Mercosur — perte couverture arborée
    mercosur = load_csv(SOURCES['mercosur'])
    brazil_rows = [r for r in mercosur if r['country'] == 'Brazil' and r['year'] == str(year) and r['tree_cover_loss_mha']]
    if brazil_rows:
        loss_mha = float(brazil_rows[0]['tree_cover_loss_mha'])
        v = fwd(norm(loss_mha, *RANGES['tree_loss']))
        acts['Forêt']      = max(acts.get('Forêt', 0), fwd(v))
        acts['Territoire'] = fwd(v * 0.75)
        notes['Forêt']     = notes.get('Forêt', '') + f" | GFW: {loss_mha:.2f} Mha"
        notes['Territoire'] = f"Perte territoire arboré Brésil {year}: {loss_mha:.2f} Mha (Global Forest Watch)"

    # Gran Chaco — donnée fixe 2024
    if year >= 2020:
        chaco_ha = 149649
        v = fwd(norm(chaco_ha, *RANGES['chaco_ha']))
        acts['Sol'] = max(acts.get('Sol', 0), fwd(v))
        notes['Sol'] = (notes.get('Sol', '') + f" | Gran Chaco 2024: {chaco_ha:,} ha (Greenpeace)").strip(' |')

    return acts, notes

def module_economie(year):
    data = load_by_year(SOURCES['economie'])
    # Les données economie commencent à 2026
    available = sorted(data.keys())
    if not available or year < available[0]:
        return {}, {}
    closest = min(available, key=lambda y: abs(y - year))
    r = data[closest]

    co2    = float(r.get('Emissions_CO2_Mt', 0) or 0)
    eco    = float(r.get('Score_Ecosystemes', 50) or 50)
    renouv = float(r.get('Energie_Renouvelable_%', 20) or 20)
    sout   = float(r.get('Soutenabilite', 40) or 40)

    acts = {
        'CO₂':      fwd(norm(co2,    *RANGES['co2_mt'])),
        'Équilibre': inv(fwd(norm(eco, *RANGES['score_eco']))),  # score bas = déséquilibre
        'Adaptation': inv(fwd(norm(renouv, *RANGES['renouv']))), # renouv bas = peu adapté
        'Société':   fwd(round(1 - norm(sout, *RANGES['soutena']), 3)),
    }
    notes = {
        'CO₂':       f"Émissions CO₂ {closest}: {co2:.0f} Mt",
        'Équilibre': f"Score écosystèmes {closest}: {eco:.0f}/100",
        'Adaptation': f"Énergie renouvelable {closest}: {renouv:.0f}%",
        'Société':   f"Indice soutenabilité {closest}: {sout:.1f}/100",
    }
    return acts, notes

def module_scenario(scenario_key, year):
    path = SOURCES.get(scenario_key)
    if not path or not path.exists():
        return {}, {}
    data = load_by_year(path)
    if year not in data:
        available = sorted(data.keys())
        year = min(available, key=lambda y: abs(y - year))
    r = data[year]
    w   = float(r['whale_population_millions'])
    cap = float(r['marine_capture_million_tonnes'])
    sst = float(r['sst_anomaly_celsius'])
    chl = float(r['chlorophyll_a_mg_m3'])

    bio  = inv(fwd(norm(w,   *RANGES['whale'])))
    oce  = fwd(norm(cap, *RANGES['capture']))
    cha  = fwd(norm(sst, *RANGES['sst']))
    hom  = inv(fwd(norm(chl, *RANGES['chl'])))

    labels = {'bau': 'Business As Usual', 'restauration': 'Restauration', 'arret_peche': 'Arrêt de la pêche'}
    label  = labels.get(scenario_key, scenario_key)

    acts = {
        'Biodiversité': bio, 'Homéostasie': hom,
        'Chaleur': cha, 'Océan': oce,
        'Seuil': fwd(round((cha + hom) / 2, 3)),
    }
    notes = {
        'Biodiversité': f"[{label} {year}] Baleines: {w:.2f}M",
        'Homéostasie':  f"[{label} {year}] Chlorophylle-a: {chl:.3f} mg/m³",
        'Chaleur':      f"[{label} {year}] Anomalie SST: +{sst:.2f}°C",
        'Océan':        f"[{label} {year}] Pêche: {cap:.1f}M tonnes/an",
        'Seuil':        f"[{label} {year}] Indicateur combiné",
    }
    return acts, notes

# ── Fusion des modules ────────────────────────────────────────────────────────

def merge(modules):
    all_acts, all_notes = {}, {}
    for acts, notes in modules:
        for k, v in acts.items():
            all_acts[k] = max(all_acts.get(k, 0), v)
        for k, v in notes.items():
            if k not in all_notes:
                all_notes[k] = v
    return all_acts, all_notes

# ── Affichage terminal ────────────────────────────────────────────────────────

def afficher(acts, notes, source):
    print(f"\n✓ {source}")
    for label, val in sorted(acts.items(), key=lambda x: -x[1]):
        bar  = '█' * int(val * 20)
        note = notes.get(label, '')[:60]
        print(f"  {label:<15} {bar:<20} {int(val*100):>3}%  — {note}")

# ── Point d'entrée ────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--annee',    type=int, default=2025)
    p.add_argument('--scenario', choices=['bau', 'restauration', 'arret_peche'], default=None)
    args = p.parse_args()

    year     = args.annee
    scenario = args.scenario

    if scenario:
        acts, notes = module_scenario(scenario, year)
        labels = {'bau': 'Business As Usual', 'restauration': 'Restauration', 'arret_peche': 'Arrêt de la pêche'}
        source = f"Scénario {labels[scenario]} — projection {year}"
    else:
        modules = [
            module_ecosystemes(year),
            module_deforestation(year),
            module_economie(year),
        ]
        acts, notes = merge(modules)
        source = f"Données climatiques complètes — {year} (phytoplancton, cétacés, déforestation, économie)"

    output = {
        'source':      source,
        'annee':       year,
        'domaine':     'climat',
        'scenario':    scenario,
        'activations': acts,
        'notes':       notes,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, 'w') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"Exporté → {OUT}")
    afficher(acts, notes, source)

if __name__ == '__main__':
    main()
