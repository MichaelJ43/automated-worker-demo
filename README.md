# TaskMaster 9000

Local demo todo app used for automated worker experiments. Tasks stay in the browser; nothing is sent to a server.

## Setup

This is a static site. Clone the repo and serve the files over HTTP (opening `index.html` as a `file://` URL can block Web Crypto in some browsers):

```bash
git clone https://github.com/MichaelJ43/automated-worker-demo.git
cd automated-worker-demo
python3 -m http.server 8080
```

Then open http://localhost:8080

If you prefer Node:

```bash
npx --yes serve .
```

## Scripts

There is no build step. Useful local commands:

| Command | Purpose |
| --- | --- |
| `python3 -m http.server 8080` | Serve the app on port 8080 |
| `npx serve .` | Same, using the `serve` package |

## Features

- Add, complete, and remove tasks
- Persist tasks in `localStorage`
- Optional device PIN, stored only as a SHA-256 hash (not plaintext, not filled back into the form)
- Confirm before clearing all local data

## Contributing

1. Create a branch from `main`.
2. Keep changes in `index.html`, `app.js`, and `styles.css` unless a new file is required.
3. Prefer DOM APIs (`textContent`, `createElement`) over `innerHTML` so task titles cannot run as HTML.
4. Keep contrast readable (light text on dark panels) and make controls keyboard-focusable.
5. Open a pull request describing the change and how you tested it in a browser.

Report bugs and ideas as GitHub issues.
