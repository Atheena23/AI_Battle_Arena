# AI Battle Arena — A* Search + Quick Sort

An interactive, frontend-only game that integrates two algorithmic concepts from AI/ML and Design and Analysis of Algorithms (DAA). A* Search powers intelligent enemy pathfinding, while Quick Sort prioritizes game items based on distance and item type.

## Project Links

- **GitHub Repository:** https://github.com/Atheena23/AI_Battle_Arena
- **Live Demo (Vercel):** https://arenax-chi.vercel.app/

## Project Overview

AI Battle Arena is a grid-based game where players navigate an arena, interact with health and weapon items, and avoid an AI-controlled enemy. The project demonstrates how pathfinding and sorting algorithms can be applied to an interactive game environment.

## Subjects and Concepts

### 1. AI/ML — A* Search

A* Search is used to calculate a path from the enemy's position to the player's position on the grid.

The algorithm uses the evaluation function:

f(n)=g(n)+h(n)

Where:

- **\(g(n)\):** Cost from the starting node to the current node.
- **\(h(n)\):** Estimated cost from the current node to the goal, calculated using Manhattan distance.
- **\(f(n)\):** Estimated total cost of the path through the current node.

A* uses these values to guide the enemy toward the player while finding a suitable path through the grid.

**Key concepts demonstrated:**
- Grid-based state-space representation
- Heuristic-based search
- Manhattan-distance heuristic
- Pathfinding and path visualization
- Nodes explored and path-length metrics

### 2. DAA — Quick Sort

Quick Sort is used to arrange game items according to their calculated priority. The priority depends on the item's distance from the player and its type.

The algorithm selects a pivot and partitions the items into groups. It then recursively sorts the groups and combines them to produce a list arranged in descending order of priority.

**Key concepts demonstrated:**
- Divide-and-conquer technique
- Pivot selection
- Partitioning
- Recursion and base cases
- Priority calculation and sorting
- Time-complexity analysis

**Time complexity of Quick Sort:**
- Best case: \(O(n\log n)\)
- Average case: \(O(n\log n)\)
- Worst case: \(O(n^2)\)

## Features

- Interactive grid-based battle arena
- Player movement using WASD or arrow keys
- AI enemy pathfinding using A* Search
- A* metrics, including nodes explored, path length, heuristic, and \(f(n)\)
- Health and weapon items
- Item prioritization using Quick Sort
- Safe-zone objective
- Multiple difficulty levels
- Pause and resume AI
- Animated path visualization
- Responsive cyberpunk-themed interface
- Frontend-only implementation with no backend or external libraries

## Technologies Used

- HTML5
- CSS3
- JavaScript
- A* Search
- Quick Sort
- Git and GitHub
- Vercel for deployment

## How to Run Locally

1. Clone the GitHub repository or download the project ZIP.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a supported browser, or use the VS Code Live Server extension.
4. Start playing and explore the arena.

## How the Algorithms Work Together

A* Search calculates a route for the AI enemy to follow, while Quick Sort organizes the available game items according to their priority scores.

These algorithms demonstrate two different problem-solving approaches: **searching for a suitable path** and **sorting data into a meaningful order**. Together, they connect AI/ML and DAA concepts through a common game scenario.

## Learning Outcomes

Through this project, the following concepts are demonstrated:

1. Applying A* Search to grid-based pathfinding.
2. Understanding heuristics and Manhattan distance.
3. Implementing Quick Sort using divide and conquer.
4. Calculating and comparing target priority scores.
5. Understanding the time complexity of algorithms.
6. Applying theoretical concepts to an interactive application.

## Academic Context

This micro-project integrates concepts from two subjects:

- **AI/ML:** A* Search for intelligent pathfinding.
- **Design and Analysis of Algorithms (DAA):** Quick Sort for target prioritization.

The project demonstrates the practical application of these algorithms in a frontend-only interactive game.