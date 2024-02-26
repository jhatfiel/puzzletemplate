# Puzzle Template

`npm install` to initialize node_modules folder

Put each puzzle in its own directory, labeled with a number (such as the example `0001`). This will correspond with data files under `data/0001/*.txt`

Put visualizations for a puzzle in app/visualization/ and reference them in app-routing.module.ts.  If a puzzle doesn't have a visualization, it directs to GenericPuzzle component which will just display the output to the browser window.

`ng serve` for webserver

and `CTRL-SHIFT-B` / `tsc: watch - tsconfig.json` to auto-compile src

`F5` / `CTRL-F5` to run current puzle