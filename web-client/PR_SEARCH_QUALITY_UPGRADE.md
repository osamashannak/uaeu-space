# Search Quality Upgrade

## Summary

This PR improves the shared lookup search used by both professor and course search.

The main goals were:

- make pasted queries behave the same way as typed queries
- improve result ordering so the top matches better reflect user intent
- keep the existing UI and API contracts unchanged
- make the implementation safer and more maintainable

## Problem

The previous search behavior had a few issues:

- professor search only indexed the professor name, so pasted email addresses could not match
- search indexes were rebuilt on every input change, which was unnecessary work
- fuzzy ranking could return results in an order that did not feel aligned with the query
- formatting differences in pasted input such as extra whitespace, punctuation, or honorifics like `Dr.` could reduce match quality
- the component used a global `document.querySelector("input")` blur call, which was brittle

## What Changed

### Shared search engine

- extracted the matching and ranking logic into a dedicated typed utility: `src/lib/search.ts`
- added a reusable prepared search index for both professor and course datasets
- cached the prepared search index instead of rebuilding `Fuse` on every keystroke

### Query and dataset normalization

- normalize both indexed values and incoming queries by:
  - trimming leading and trailing whitespace
  - collapsing repeated whitespace
  - lowercasing consistently
  - removing punctuation and formatting noise for matching
  - normalizing diacritics
- strip common professor honorifics such as `dr`, `doctor`, `prof`, and `professor` during matching
- normalize course tags so separator differences behave consistently, for example:
  - `MATH101`
  - `math 101`
  - `math-101`

### Better indexed fields

- professor search now indexes:
  - normalized name
  - compact name
  - token-sorted name
  - normalized email
- course search now indexes:
  - normalized name
  - token-sorted name
  - normalized tag
  - compact tag

### Deterministic ranking

Fuse is still used for fuzzy matching, but results now go through a deterministic post-ranking step so higher-confidence matches consistently appear first:

1. exact normalized match
2. prefix / exact phrase prefix match
3. all query tokens present in order
4. all query tokens present in any order
5. fuzzy-only matches

This improves cases like:

- full pasted professor names
- names with extra spaces or newlines
- pasted professor emails
- reversed name token order
- compact vs spaced course tags

### UI stability

- preserved the existing dropdown interaction and navigation behavior
- preserved the current result limit
- preserved per-university professor caching behavior
- replaced the global input lookup with a local input ref

### Build stability

- added a small Vite/esbuild compatibility workaround in `vite.config.ts`
- explicitly marked destructuring as supported for the configured modern build targets
- this avoids a production build failure during Vite's chunk transpile step without changing runtime behavior for supported browsers

## Scope / Non-Goals

- no backend changes
- no API changes
- no route changes
- no display shape changes for search results
- no visual redesign
- no new test tooling introduced in this PR

## Validation

### Automated

- `npx tsc --noEmit`
- `npm run build`

### Manual scenarios covered

- pasted full professor name returns the expected top match
- pasted professor name with extra spaces or newlines still matches
- pasted professor email matches the correct professor
- exact full-name matches rank above looser fuzzy matches
- reversed professor name token order still returns sensible results
- course tag search works with compact and spaced formats
- course name search still works
- search selection still navigates to the correct professor/course page

## Notes

- production build now passes after the Vite/esbuild compatibility workaround
- build still reports large vendor chunk warnings, but those are warnings only and are not introduced by this PR
