# CS Webring — George Brown Polytechnic

A webring for students and alumni of CS programs at George Brown Polytechnic. Each member is a node on a maple leaf visualization built with D3.js.

## Live

Coming soon — will be hosted on GitHub Pages.

## How it works

Students add themselves by submitting a pull request to `sites.json`. Once merged, their portfolio appears as a node on the interactive maple leaf chart and in the members list.

## Join the ring

1. Fork this repo
2. Add your entry to `sites.json`:

```json
{ "name": "Your Name", "year": 2026, "website": "https://yoursite.com" }
```

3. Open a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

If you're just browsing, give the repo a star — it helps more GBP students find the ring.

## Goal

We're trying to reach 200 students to fill the entire maple leaf.

## Tech

- Vanilla HTML/CSS/JS
- D3.js for the force-directed graph
- GitHub Pages for hosting

## Dev team

- [Arash Shalchian](https://shalchian.dev)
- [Vy Nguyen](https://vy-software-dev.vercel.app)
