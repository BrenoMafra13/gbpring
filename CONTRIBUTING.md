# Contributing to CS Webring

If you've studied any CS course at George Brown Polytechnic, you can add yourself to the webring.

## How to join (easy way)

1. Go to [`sites.json`](sites.json) on GitHub
2. Click the pencil icon to edit
3. Add your entry at the bottom of the array:

```json
{ "name": "Your Name", "year": 2026, "website": "https://yoursite.com" }
```

4. Click "Propose changes" — GitHub handles the rest

That's it. Once merged, your node will appear on the maple leaf and in the members list.

No need to clone, fork, or use git. Just edit the file in your browser.

## How to join (git users)

1. Fork this repository
2. Add your entry to `sites.json`
3. Submit a pull request

## While you're here

Give the repo a star — it helps more GBP students find the ring.

## Rules

- **`name`** — your real name
- **`year`** — your graduation year
- **`website`** — your personal portfolio or site (must be live and accessible)
- Only add yourself, not other people
- One entry per person
- Only edit `sites.json` — do not modify any other files
- Your site must actually exist and load

## Adding the webring to your site (optional)

Paste this anywhere on your portfolio to link back to the ring:

```html
<a href="https://github.com/A-Shalchian/gbpring" target="_blank">
  <img src="https://raw.githubusercontent.com/A-Shalchian/gbpring/main/assets/badge.svg" alt="GBP CS Webring" height="36" />
</a>
```

Or if you prefer a text link:

```html
<a href="https://github.com/A-Shalchian/gbpring" target="_blank">GBP CS Webring</a>
```

## Questions?

Open an issue or reach out to the dev team.
