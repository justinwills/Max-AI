/*
 * ML Utils (Plain JavaScript, no dependencies)
 * Demos for Module 2: linear regression (GD), k-NN, k-means, splits, standardization, and metrics.
 * Designed for teaching + small datasets. Not optimized for large-scale use.
 */

// ------------------------
// Random & shuffling utils
// ------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleIndices(n, seed = 42) {
  const idx = Array.from({ length: n }, (_, i) => i);
  const rand = mulberry32(seed);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

// ------------------------
// Train / Val / Test split
// ------------------------
function trainValTestSplit(
  X,
  y,
  { train = 0.7, val = 0.15, shuffle = true, seed = 42 } = {}
) {
  const n = X.length;
  if (y && y.length !== n) throw new Error("X and y length mismatch");
  const indices = shuffle
    ? shuffleIndices(n, seed)
    : Array.from({ length: n }, (_, i) => i);
  const nTrain = Math.floor(n * train);
  const nVal = Math.floor(n * val);
  const toSlice = (arr) => indices.map((i) => arr[i]);
  const Xs = toSlice(X);
  const ys = y ? toSlice(y) : null;
  return {
    X_train: Xs.slice(0, nTrain),
    y_train: ys ? ys.slice(0, nTrain) : null,
    X_val: Xs.slice(nTrain, nTrain + nVal),
    y_val: ys ? ys.slice(nTrain, nTrain + nVal) : null,
    X_test: Xs.slice(nTrain + nVal),
    y_test: ys ? ys.slice(nTrain + nVal) : null,
  };
}

// ------------------------
// Standardization (z-score)
// ------------------------
function standardize(X, means = null, stds = null) {
  const n = X.length,
    d = X[0].length;
  const mu =
    means ||
    Array.from({ length: d }, (_, j) => X.reduce((s, r) => s + r[j], 0) / n);
  const sig =
    stds ||
    Array.from({ length: d }, (_, j) => {
      const v =
        X.reduce((s, r) => s + (r[j] - mu[j]) ** 2, 0) / Math.max(1, n - 1);
      return Math.sqrt(v) || 1e-12; // avoid divide by zero
    });
  const Xs = X.map((row) => row.map((v, j) => (v - mu[j]) / sig[j]));
  return { X: Xs, means: mu, stds: sig };
}

// ------------------------
// Linear Regression (Gradient Descent)
// ------------------------
function addBias(X) {
  return X.map((r) => [1, ...r]);
}

function linRegFitGD(X, y, { lr = 0.05, epochs = 1000 } = {}) {
  const Xb = addBias(X);
  const n = Xb.length,
    d = Xb[0].length;
  let w = Array.from({ length: d }, () => 0);
  for (let ep = 0; ep < epochs; ep++) {
    const grad = Array(d).fill(0);
    for (let i = 0; i < n; i++) {
      const pred = Xb[i].reduce((s, v, j) => s + v * w[j], 0);
      const err = pred - y[i];
      for (let j = 0; j < d; j++) grad[j] += (2 / n) * err * Xb[i][j];
    }
    for (let j = 0; j < d; j++) w[j] -= lr * grad[j];
  }
  return w; // [b, w1, w2, ...]
}

function linRegPredict(w, x) {
  const xb = [1, ...x];
  return xb.reduce((s, v, j) => s + v * w[j], 0);
}

// ------------------------
// k-NN Classification
// ------------------------
function euclidean(a, b) {
  return Math.hypot(...a.map((v, i) => v - b[i]));
}

function knnPredict(trainX, trainY, x, k = 3) {
  const dists = trainX.map((xi, i) => ({ d: euclidean(xi, x), y: trainY[i] }));
  dists.sort((a, b) => a.d - b.d);
  const top = dists.slice(0, k);
  const votes = new Map();
  for (const { y } of top) votes.set(y, (votes.get(y) || 0) + 1);
  let best = null,
    bestCount = -1;
  for (const [label, count] of votes)
    if (count > bestCount) {
      best = label;
      bestCount = count;
    }
  return best;
}

// ------------------------
// Confusion Matrix & Metrics (binary)
// ------------------------
function confusionMatrix(yTrue, yPred, positive = 1) {
  let tp = 0,
    tn = 0,
    fp = 0,
    fn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const t = yTrue[i] === positive;
    const p = yPred[i] === positive;
    if (p && t) tp++;
    else if (p && !t) fp++;
    else if (!p && t) fn++;
    else tn++;
  }
  return { tp, fp, fn, tn };
}

function precisionRecallF1(yTrue, yPred, positive = 1) {
  const { tp, fp, fn } = confusionMatrix(yTrue, yPred, positive);
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 =
    precision + recall === 0
      ? 0
      : (2 * precision * recall) / (precision + recall);
  return { precision, recall, f1 };
}

// ------------------------
// k-means Clustering (2D or nD)
// ------------------------
function randomChoice(arr, k, seed = 42) {
  const rand = mulberry32(seed);
  const picks = new Set();
  while (picks.size < Math.min(k, arr.length)) {
    picks.add(Math.floor(rand() * arr.length));
  }
  return [...picks].map((i) => arr[i].slice());
}

function mean(points) {
  const d = points[0].length;
  const s = Array(d).fill(0);
  for (const p of points) for (let j = 0; j < d; j++) s[j] += p[j];
  return s.map((v) => v / points.length);
}

function kmeans(X, k, { maxIter = 100, seed = 42 } = {}) {
  let centers = randomChoice(X, k, seed);
  let assign = Array(X.length).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    // Assign step
    let changed = false;
    for (let i = 0; i < X.length; i++) {
      let best = 0,
        bestD = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = euclidean(X[i], centers[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (assign[i] !== best) {
        assign[i] = best;
        changed = true;
      }
    }
    // Update step
    const groups = Array.from({ length: k }, () => []);
    for (let i = 0; i < X.length; i++) groups[assign[i]].push(X[i]);
    for (let c = 0; c < k; c++) {
      centers[c] = groups[c].length ? mean(groups[c]) : centers[c];
    }
    if (!changed) break;
  }
  return { centers, assign };
}

// ------------------------
// Simple k-fold indices (not stratified)
// ------------------------
function kFoldIndices(n, k = 5, shuffle = true, seed = 42) {
  const idx = shuffle
    ? shuffleIndices(n, seed)
    : Array.from({ length: n }, (_, i) => i);
  const folds = Array.from({ length: k }, () => []);
  idx.forEach((id, i) => folds[i % k].push(id));
  return folds; // array of index arrays
}

// ------------------------
// Example usage (uncomment to run in Node)
// ------------------------
/*
// Linear regression demo
const X = [[1],[2],[3],[4],[5]]; // one feature
const y = [3, 5, 7, 9, 11]; // y = 2x + 1
const w = linRegFitGD(X, y, { lr: 0.1, epochs: 2000 });
console.log('weights [b, w]:', w, 'pred x=6 ->', linRegPredict(w, [6]));

// k-NN demo
const trainX = [[0,0],[0,1],[1,0],[5,5],[6,5],[5,6]];
const trainY = ['A','A','A','B','B','B'];
console.log('kNN predict [0.2,0.1]:', knnPredict(trainX, trainY, [0.2,0.1], 3));

// k-means demo
const pts = [[0,0],[0,1],[1,0],[5,5],[6,5],[5,6]];
console.log('kmeans:', kmeans(pts, 2));
*/

// Export for module usage
export {
  mulberry32,
  shuffleIndices,
  trainValTestSplit,
  standardize,
  linRegFitGD,
  linRegPredict,
  knnPredict,
  confusionMatrix,
  precisionRecallF1,
  kmeans,
  kFoldIndices,
};
