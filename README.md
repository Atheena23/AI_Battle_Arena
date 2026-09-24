# AI Battle Arena — A* + Quick Select

A frontend-only interactive learning/game project integrating two Module 2 concepts:

- **AI/ML:** A* Search
- **DAA:** Quick Select

## Features

- Interactive grid-based battle arena
- Player movement with WASD / arrow keys
- AI enemy pathfinding using A*
- A* metrics: nodes explored, path length, heuristic and f(n)
- Quick Select for choosing the K highest-priority nearby items
- Health/weapon items
- Safe-zone objective
- Difficulty levels
- Pause/resume AI
- Animated path and responsive cyberpunk UI
- No backend and no external libraries

## Run

Just open `index.html` in Chrome, Edge, or Firefox.

For best experience, use a local server (optional), for example VS Code Live Server.

## How the algorithms are integrated

### A* Search
The AI repeatedly calculates a route from the enemy position to the player's position.

A* uses:

`f(n) = g(n) + h(n)`

where:
- `g(n)` = cost from the AI start position to node n
- `h(n)` = Manhattan-distance heuristic from n to the player
- `f(n)` = estimated total cost

### Quick Select
The item scanner assigns each item a priority based on distance and item type. Quick Select partitions the item list to obtain the top K items without fully sorting the complete list.

Average expected time: O(n).

## Suggested presentation points

1. Explain the state-space/grid representation.
2. Explain why A* is suitable for shortest pathfinding.
3. Show how Manhattan distance works as the heuristic.
4. Explain Quick Select's partition-based selection.
5. Demonstrate changing K and running the scanner.
6. Compare the algorithm metrics shown in the AI Command Core.
