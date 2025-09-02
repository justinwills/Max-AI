/**
 * AI Foundations — Sample Code (JS)
 * A* pathfinding on a grid (toy).
 */

function astar(grid, start, goal) {
  const h = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  const key = (n) => n.x + "," + n.y;

  const open = new Map();
  const came = new Map();
  const g = new Map();
  const f = new Map();

  g.set(key(start), 0);
  f.set(key(start), h(start, goal));
  open.set(key(start), start);

  const neighbors = (n) =>
    [
      { x: n.x + 1, y: n.y },
      { x: n.x - 1, y: n.y },
      { x: n.x, y: n.y + 1 },
      { x: n.x, y: n.y - 1 },
    ].filter((p) => grid[p.y] && grid[p.y][p.x] === 0); // 0 = free, 1 = wall

  while (open.size) {
    // pick node with smallest f
    let currentKey;
    let current;
    let best = Infinity;

    for (const [k, node] of open) {
      const fv = f.get(k) ?? Infinity;
      if (fv < best) {
        best = fv;
        currentKey = k;
        current = node;
      }
    }

    if (!current) break;

    if (current.x === goal.x && current.y === goal.y) {
      // reconstruct path
      const path = [current];
      let k = currentKey;

      while (came.has(k)) {
        k = came.get(k);
        const [x, y] = k.split(",").map(Number);
        path.push({ x, y });
      }

      return path.reverse();
    }

    open.delete(currentKey);

    for (const nb of neighbors(current)) {
      const nk = key(nb);
      const tentative = (g.get(currentKey) ?? Infinity) + 1;

      if (tentative < (g.get(nk) ?? Infinity)) {
        came.set(nk, currentKey);
        g.set(nk, tentative);
        f.set(nk, tentative + h(nb, goal));
        if (!open.has(nk)) open.set(nk, nb);
      }
    }
  }

  return null;
}

// Example usage:
// 0 = free, 1 = wall
const grid = [
  [0, 0, 0, 0, 0],
  [1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0],
];

const path = astar(grid, { x: 0, y: 0 }, { x: 4, y: 4 });
console.log("Path:", path);
