// ================= Flashcard logic + simple filtering/shuffle =================

// Base data
const FLASHCARDS = [
  {
    id: "ai-1",
    topic: "ai-foundation",
    term: "Artificial Intelligence (AI)",
    definition:
      "The field of creating systems that perform tasks requiring human intelligence, like perception, reasoning, learning, and decision-making.",
    hint: "Broad field enabling intelligent behavior in machines.",
  },
  {
    id: "ai-2",
    topic: "ai-foundation",
    term: "Turing Test",
    definition:
      "A test of a machine's ability to exhibit intelligent behavior indistinguishable from that of a human through conversation.",
    hint: "Proposed by Alan Turing in 1950.",
  },
  {
    id: "ai-3",
    topic: "ai-foundation",
    term: "Search Algorithms",
    definition:
      "Techniques like BFS and DFS used to navigate problem spaces to find solutions or paths.",
    hint: "Breadth-first vs depth-first.",
  },
  {
    id: "ai-4",
    topic: "ai-foundation",
    term: "Knowledge Representation",
    definition:
      "Methods to model information about the world (rules, logic, graphs) so computers can reason with it.",
    hint: "Logic, ontologies, knowledge graphs.",
  },
  {
    id: "ml-1",
    topic: "machine-learning",
    term: "Machine Learning (ML)",
    definition:
      "A subset of AI where systems learn patterns from data to make predictions or decisions without explicit programming.",
    hint: "Learns from data.",
  },
  {
    id: "ml-2",
    topic: "machine-learning",
    term: "Supervised Learning",
    definition:
      "Learning from labeled examples to map inputs to outputs, e.g., classification and regression.",
    hint: "Trained with labeled data.",
  },
  {
    id: "ml-3",
    topic: "machine-learning",
    term: "Overfitting",
    definition:
      "When a model memorizes training data patterns including noise, performing poorly on new data.",
    hint: "High train accuracy, low test accuracy.",
  },
  {
    id: "ml-4",
    topic: "machine-learning",
    term: "Bias–Variance Tradeoff",
    definition:
      "Balancing underfitting (high bias) and overfitting (high variance) to achieve good generalization.",
    hint: "Sweet spot between simplicity and complexity.",
  },
];

// === Add-on: more flashcards from all modules (all English) ===
const MORE_FLASHCARDS = [
  // ===== Module 1: AI Foundations =====
  {
    id: "ai-5",
    topic: "ai-foundation",
    term: "Agent & Environment",
    definition:
      "An agent observes an environment and takes actions to achieve goals rationally.",
    hint: "Core idea: rational agent.",
  },
  {
    id: "ai-6",
    topic: "ai-foundation",
    term: "Symbolic vs Statistical AI",
    definition:
      "Symbolic AI relies on explicit rules; Statistical/ML learns patterns from data.",
    hint: "Two major historical streams.",
  },
  {
    id: "ai-7",
    topic: "ai-foundation",
    term: "Narrow AI (ANI)",
    definition:
      "AI designed for a specific task; lacks general intelligence across domains.",
    hint: "Example: voice assistants.",
  },
  {
    id: "ai-8",
    topic: "ai-foundation",
    term: "AGI vs ASI",
    definition:
      "AGI matches human-level skill across many tasks; ASI surpasses humans in most domains.",
    hint: "Levels above Narrow AI.",
  },
  {
    id: "ai-9",
    topic: "ai-foundation",
    term: "BFS/DFS",
    definition:
      "Graph search methods; BFS finds shortest path on unweighted graphs; DFS explores depth-first.",
    hint: "Completeness and optimality matter.",
  },
  {
    id: "ai-10",
    topic: "ai-foundation",
    term: "A* (A-star)",
    definition:
      "Heuristic search minimizing f(n)=g(n)+h(n); optimal if heuristic is admissible.",
    hint: "Used widely for pathfinding.",
  },
  {
    id: "ai-11",
    topic: "ai-foundation",
    term: "Features & Labels",
    definition:
      "Features are inputs; labels are targets; split data into train/validation/test.",
    hint: "Avoid data leakage.",
  },
  {
    id: "ai-12",
    topic: "ai-foundation",
    term: "Learning Paradigms",
    definition:
      "Supervised (labeled), Unsupervised (unlabeled), Reinforcement (reward-based).",
    hint: "Three main families.",
  },
  {
    id: "ai-13",
    topic: "ai-foundation",
    term: "Model Evaluation",
    definition:
      "Use suitable metrics (Precision/Recall/F1, ROC-AUC), especially for imbalanced data.",
    hint: "Accuracy can be misleading.",
  },
  {
    id: "ai-14",
    topic: "ai-foundation",
    term: "Overfitting & Regularization",
    definition:
      "Mitigate overfitting with L1/L2, dropout, early stopping, and data augmentation.",
    hint: "Cross-validation helps generalization.",
  },
  {
    id: "ai-15",
    topic: "ai-foundation",
    term: "Responsible AI",
    definition:
      "Fairness, privacy, transparency, and accountability throughout the ML lifecycle.",
    hint: "Model cards and bias monitoring.",
  },

  // ===== Module 2: Machine Learning =====
  {
    id: "ml-5",
    topic: "machine-learning",
    term: "ML Data Pipeline",
    definition:
      "Dataset → preprocessing (clean/encode/scale) → training (minimize loss) → inference & evaluation.",
    hint: "Fit preprocessing on train only.",
  },
  {
    id: "ml-6",
    topic: "machine-learning",
    term: "Linear Regression",
    definition:
      "Models numeric targets as a linear combination of features; minimizes MSE.",
    hint: "Slope and intercept.",
  },
  {
    id: "ml-7",
    topic: "machine-learning",
    term: "k-NN Classification",
    definition:
      "Assigns class by majority vote among k nearest neighbors in feature space.",
    hint: "Larger k = smoother boundary.",
  },
  {
    id: "ml-8",
    topic: "machine-learning",
    term: "Decision Trees",
    definition:
      "Interpretable rule learners; can capture simple non-linearities.",
    hint: "Strong baseline.",
  },
  {
    id: "ml-9",
    topic: "machine-learning",
    term: "Bias–Variance",
    definition:
      "Underfitting = high bias; overfitting = high variance; seek balance.",
    hint: "Tuning + regularization help.",
  },
  {
    id: "ml-10",
    topic: "machine-learning",
    term: "Train/Val/Test Split",
    definition: "Train model, tune on validation, report once on test.",
    hint: "Do not touch test during training.",
  },
  {
    id: "ml-11",
    topic: "machine-learning",
    term: "Classification Metrics",
    definition:
      "Precision, Recall, F1, Confusion Matrix; ROC/PR for threshold analysis.",
    hint: "Accuracy ≠ everything.",
  },
  {
    id: "ml-12",
    topic: "machine-learning",
    term: "Feature Engineering",
    definition:
      "Scaling, encoding, imputation; TF-IDF/BOW for text; avoid leakage.",
    hint: "Compute stats on train only.",
  },
  {
    id: "ml-13",
    topic: "machine-learning",
    term: "Hyperparameter Tuning",
    definition:
      "Grid/random search + cross-validation to select the best configuration.",
    hint: "Use learning/validation curves.",
  },
  {
    id: "ml-14",
    topic: "machine-learning",
    term: "K-Means Clustering",
    definition:
      "Partitions data into k clusters by minimizing within-cluster variance.",
    hint: "Choose k via elbow/silhouette.",
  },
  {
    id: "ml-15",
    topic: "machine-learning",
    term: "PCA",
    definition:
      "Dimensionality reduction projecting to directions of maximum variance.",
    hint: "Great for visualization.",
  },

  // ===== Module 3: Neural Networks =====
  {
    id: "nn-1",
    topic: "neural-networks",
    term: "Neuron & Activation",
    definition:
      "A neuron computes weighted sum + bias then applies a nonlinear activation.",
    hint: "Nonlinearity gives expressiveness.",
  },
  {
    id: "nn-2",
    topic: "neural-networks",
    term: "Perceptron & Linearity",
    definition:
      "Perceptron separates linearly separable data; fails on XOR without hidden layers.",
    hint: "Decision boundary is a line/plane.",
  },
  {
    id: "nn-3",
    topic: "neural-networks",
    term: "MLP (Hidden Layers)",
    definition:
      "Stacks of linear layers + activations approximate complex functions.",
    hint: "Depth builds feature hierarchies.",
  },
  {
    id: "nn-4",
    topic: "neural-networks",
    term: "Loss & Backpropagation",
    definition:
      "Optimize loss (MSE/Cross-Entropy) via gradients computed with the chain rule.",
    hint: "Mini-batches and learning rate matter.",
  },
  {
    id: "nn-5",
    topic: "neural-networks",
    term: "Regularization in NN",
    definition:
      "Weight decay (L2), dropout, early stopping, augmentation improve generalization.",
    hint: "Bias–variance balancing.",
  },
  {
    id: "nn-6",
    topic: "neural-networks",
    term: "Init/Norm/Optim",
    definition:
      "Xavier/He init, Batch/Layer Norm; optimizers like Adam/AdamW; use schedulers.",
    hint: "Warmup & cosine decay help.",
  },
  {
    id: "nn-7",
    topic: "neural-networks",
    term: "CNN Basics",
    definition:
      "Convolutions with local kernels and weight sharing; stride/padding control resolution.",
    hint: "Pooling extracts spatial features.",
  },
  {
    id: "nn-8",
    topic: "neural-networks",
    term: "RNNs to Transformers",
    definition:
      "RNN/LSTM/GRU keep sequence context; Transformers use self-attention + positional encoding.",
    hint: "Great for long-range dependencies.",
  },
  {
    id: "nn-9",
    topic: "neural-networks",
    term: "Transfer Learning",
    definition:
      "Freeze early layers, fine-tune later ones; compress with quantization/distillation.",
    hint: "Key for practical deployment.",
  },

  // ===== Module 4/5: Deep Learning =====
  {
    id: "dl-1",
    topic: "deep-learning",
    term: "Deep Learning Foundations",
    definition:
      "Layered networks learn from simple to complex patterns; boosted results in vision and language.",
    hint: "Depth → abstraction.",
  },
  {
    id: "dl-2",
    topic: "deep-learning",
    term: "DL Workflow",
    definition:
      "Data prep → architecture design → training → evaluation → deployment.",
    hint: "Iterative, not one-shot.",
  },
  {
    id: "dl-3",
    topic: "deep-learning",
    term: "Transformers",
    definition:
      "Self-attention captures global relations; excels at language and multimodal tasks.",
    hint: "Parallel, scalable.",
  },
  {
    id: "dl-4",
    topic: "deep-learning",
    term: "Training & Regularization",
    definition:
      "Use suitable optimizer, normalization, dropout; monitor metrics during training.",
    hint: "Course-correct like a pilot.",
  },
  {
    id: "dl-5",
    topic: "deep-learning",
    term: "Generative Models (GAN/VAE)",
    definition:
      "Create realistic samples similar to training data; used from art to drug discovery.",
    hint: "GAN = generator vs discriminator.",
  },
  {
    id: "dl-6",
    topic: "deep-learning",
    term: "Deep Reinforcement Learning",
    definition:
      "Agent learns via rewards/penalties with deep nets for complex environments.",
    hint: "Think “train a pet with treats”.",
  },

  // ===== Module 5: NLP =====
  {
    id: "nlp-1",
    topic: "nlp",
    term: "Text Cleaning",
    definition:
      "Remove noise (punctuation, extra spaces, emojis) before processing.",
    hint: "Often skipped but important.",
  },
  {
    id: "nlp-2",
    topic: "nlp",
    term: "Tokenization",
    definition:
      "Split text into units (words, subwords, sentences) for modeling.",
    hint: "BPE/WordPiece are common.",
  },
  {
    id: "nlp-3",
    topic: "nlp",
    term: "Vectorization/Embeddings",
    definition: "Represent text as numerical vectors capturing semantics.",
    hint: "From TF-IDF to dense embeddings.",
  },
  {
    id: "nlp-4",
    topic: "nlp",
    term: "Sentiment vs Intent",
    definition:
      "Sentiment: polarity; Intent: the user’s goal (e.g., “book a ticket”).",
    hint: "Key to assistants and CS.",
  },
  {
    id: "nlp-5",
    topic: "nlp",
    term: "Chatbots & Assistants",
    definition:
      "Combine ASR, intent detection, dialog management; maintain context.",
    hint: "Like a personal secretary.",
  },
  {
    id: "nlp-6",
    topic: "nlp",
    term: "Machine Translation",
    definition:
      "Transformer-based models produce fluent, contextual translations.",
    hint: "Industry standard.",
  },
  {
    id: "nlp-7",
    topic: "nlp",
    term: "Extractive Summarization",
    definition: "Select important sentences from the source text.",
    hint: "High fidelity to source.",
  },
  {
    id: "nlp-8",
    topic: "nlp",
    term: "Abstractive Summarization",
    definition: "Paraphrase key points into new sentences.",
    hint: "Concise and natural; risk of hallucination.",
  },
  {
    id: "nlp-9",
    topic: "nlp",
    term: "Hallucination Mitigation",
    definition:
      "Ground to sources, use controlled decoding and layered summarization.",
    hint: "Evaluate with ROUGE/BERTScore + human review.",
  },

  // ===== Module 6: Ethics & Future =====
  {
    id: "eth-1",
    topic: "ethics",
    term: "Demographic Parity vs Equalized Odds",
    definition:
      "DP equalizes selection rates; EO equalizes error rates across groups.",
    hint: "Pick per context and harm model.",
  },
  {
    id: "eth-2",
    topic: "ethics",
    term: "Fairness Workflow",
    definition:
      "Define harms/stakeholders → choose metrics → disaggregated evaluation → mitigation → monitoring.",
    hint: "Document residual risk.",
  },
  {
    id: "eth-3",
    topic: "ethics",
    term: "Differential Privacy (ε)",
    definition:
      "Add calibrated noise so an individual’s contribution is hard to infer.",
    hint: "ε controls the privacy budget.",
  },
  {
    id: "eth-4",
    topic: "ethics",
    term: "Federated Learning",
    definition:
      "Train on-device; aggregate updates securely to reduce raw data movement.",
    hint: "Helps privacy and latency.",
  },
  {
    id: "eth-5",
    topic: "ethics",
    term: "Model Cards & Datasheets",
    definition:
      "Documentation on intended use, data, subgroup metrics, limitations, and risks.",
    hint: "Transparency artifact.",
  },
  {
    id: "eth-6",
    topic: "ethics",
    term: "Red-Teaming & Safeguards",
    definition:
      "Probe for failures/abuse, align policies, limit privileges, detect misuse.",
    hint: "Safety is continuous.",
  },
  {
    id: "eth-7",
    topic: "ethics",
    term: "RAG (Retrieval-Augmented Generation)",
    definition:
      "Ground generations on trusted sources to reduce hallucinations and cite evidence.",
    hint: "Requires good chunking and evals.",
  },
  {
    id: "eth-8",
    topic: "ethics",
    term: "On-Device & Quantization",
    definition:
      "Run models at the edge for privacy/latency; compress via quantization/distillation.",
    hint: "Provide fallbacks and caching.",
  },
  {
    id: "eth-9",
    topic: "ethics",
    term: "Agent Sandbox & Least Privilege",
    definition:
      "Restrict tools, inspect state, and run in sandboxes for risk mitigation.",
    hint: "Use human-in-the-loop for high-stakes actions.",
  },
];

// Merge the extra cards
FLASHCARDS.push(...MORE_FLASHCARDS);

// DOM elements
const grid = document.getElementById("flashcardGrid");
const topicSelect = document.getElementById("topicSelect");
const searchInput = document.getElementById("searchInput");
const showHints = document.getElementById("showHints");
const shuffleBtn = document.getElementById("shuffleBtn");

// Lightweight entrance animations for dynamically rendered cards
let flashIO = null;
function ensureFlashIO() {
  if (flashIO) return flashIO;
  const opts = { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.03 };
  flashIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("anim-in");
        e.target.classList.remove("anim-init");
        flashIO.unobserve(e.target);
      }
    });
  }, opts);
  return flashIO;
}
function prepareFlashcardAnimations() {
  const prefersReduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = Array.from(grid.querySelectorAll(".flashcard"));
  if (cards.length === 0) return;
  const io = ensureFlashIO();
  cards.forEach((el, idx) => {
    el.classList.add("anim-init", "anim-up");
    // Stagger for nicer cascade
    const delay = Math.min(600, idx * 5);
    el.setAttribute("data-anim-delay", "");
    el.style.setProperty("--anim-delay", `${delay}ms`);
    if (prefersReduce) {
      el.classList.add("anim-in");
      el.classList.remove("anim-init");
    } else {
      io.observe(el);
    }
  });
}

// Topic label mapping (so non-ML topics display correctly)
const TOPIC_LABELS = {
  "ai-foundation": "AI Foundations",
  "machine-learning": "Machine Learning",
  "neural-networks": "Neural Networks",
  "deep-learning": "Deep Learning",
  nlp: "Natural Language Processing",
  ethics: "AI Ethics",
};

// Fisher–Yates shuffle (in-place)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function render() {
  const topic = topicSelect.value;
  const q = searchInput.value.trim().toLowerCase();

  let cards = FLASHCARDS.filter((c) => topic === "all" || c.topic === topic);
  if (q) {
    cards = cards.filter(
      (c) =>
        c.term.toLowerCase().includes(q) ||
        c.definition.toLowerCase().includes(q) ||
        (c.hint || "").toLowerCase().includes(q)
    );
  }

  if (cards.length === 0) {
    grid.innerHTML = `<div class="empty">No cards match your filters.</div>`;
    return;
  }

  grid.innerHTML = cards
    .map(
      (c) => `
    <article class="flashcard" tabindex="0" data-id="${c.id}">
      <div class="card-inner">
        <div class="card-face front">
          <div class="tag ${c.topic}">${TOPIC_LABELS[c.topic] || c.topic}</div>
          <h3>${c.term}</h3>
          <p class="hint">${c.hint || ""}</p>
          <div class="cta"><i class="fas fa-rotate"></i> Tap to flip</div>
        </div>
        <div class="card-face back">
          <h4>Definition</h4>
          <p>${c.definition}</p>
          <div class="cta"><i class="fas fa-rotate"></i> Tap to flip</div>
        </div>
      </div>
    </article>
  `
    )
    .join("");

  grid.querySelectorAll(".flashcard").forEach((card) => {
    const toggle = () => card.classList.toggle("flipped");
    card.addEventListener("click", toggle);
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  grid.querySelectorAll(".hint").forEach((h) => {
    h.style.display = showHints.checked ? "block" : "none";
  });

  // Prepare and run entrance animations for the rendered cards
  try {
    prepareFlashcardAnimations();
  } catch {}
}

topicSelect.addEventListener("change", render);
searchInput.addEventListener("input", render);
showHints.addEventListener("change", render);
shuffleBtn.addEventListener("click", () => {
  shuffle(FLASHCARDS);
  render();
});

// Optional: token chip controls (if present)
try {
  document.querySelectorAll('.topic-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');
      if (!val) return;
      topicSelect.value = val;
      document.querySelectorAll('.topic-chip').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      render();
    });
  });
} catch {}

render();
