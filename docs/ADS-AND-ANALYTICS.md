# Ads

Ad slots live in `src/components/ads/AdSlot.astro`.

- Without `PUBLIC_ADSENSE_CLIENT`, slots render non-intrusive placeholders.
- Never place ads over navigation, inside assessments, or in a way that causes large CLS.
- Document publisher configuration before enabling in production.

# Analytics

Do not hard-code tracking IDs. Load analytics only when an env flag/ID is present. Core site must work if analytics fails.
