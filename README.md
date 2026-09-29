A browser game where you spawn, squish, and manage an ever-growing army of Floweries

> Originally generated on [Websim](https://websim.com) by [@Larpsolete_gaming](https://websim.com/@Larpsolete_gaming/flowery-sim/82), locally preserved and packaged for self-hosting.


## Features

- **Spawn Floweries** — click to bring them into the world, or let spawners do it for you.
- **Squish them** — earn Flowey Currency (ƒ) for every defeat.
- **Shop upgrades** — autospawn, bigger scene, extra spawners, Yellow, cars, Clark, Clark's knife, toolbar, Monsterbox.
- **Attack tools** — squish, lazer, and roaring blade.
- **Rebirth system** — max every upgrade, then reset for permanent bonuses.
- **Achievements** — 40+ unlockables, from "First Bloom" to "The Completionist".
- **Cheats console** — press `~` (backquote) and type `sv_cheats 1`.
- **Audio settings** — separate volume for voice, SFX, and music.

## Quick Start

### Option 1: Docker (recommended)

```bash
docker build -t flowery-sim .
docker run -d -p 8000:80 --restart unless-stopped --name flowery-sim flowery-sim
```
Open http://localhost:8000

### Option 2: Node.js (dev)
```bash
npm install
npm start
```

### Option 3: Python (no dependencies)
```bash
python -m http.server 8000
```
Open http://localhost:8000


