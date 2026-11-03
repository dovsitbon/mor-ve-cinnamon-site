# Mor & Cinnamon — site et demande de devis

Site 4 langues (hébreu par défaut en RTL, anglais, français, espagnol) de **מור וקינמון | קייטרינג והפקה**, traiteur et production de mariages en plein air en Israël.

- Next.js 16 (rendu statique par langue, `/he` `/en` `/fr` `/es`, hreflang), Tailwind 4, Framer Motion, Lenis.
- Textes : `locales/*.json` (aucun texte en dur). Validation : `CONTENU.md` (`npm run contenu`).
- Données : `data/menus.json` (prix « à partir de »), `data/dates.json` (dates prises), `data/weddings.json`, `data/partners.json`, `data/reviews.json`, `data/site.json`.
- Demande de devis : récapitulatif sur WhatsApp (972505368876) + e-mails Resend si `RESEND_API_KEY`, `QUOTE_NOTIFY_EMAIL` (et `RESEND_FROM`) sont définis sur Vercel.

## Médias

1. `assets/raw/` (non versionné) : publications Instagram (`npm run fetch` à partir de `mor-cinnamon_list.json`).
2. `npm run frames` : classe les photos et tire les images des reels dans `assets/<catégorie>/`.
3. `npm run media` : images web, boucles du hero, image Open Graph, icône Apple.
4. `python scripts/logo.py <dossier des polices>` : logo SVG (Heebo, licence OFL).

```bash
npm install
npm run dev
```
