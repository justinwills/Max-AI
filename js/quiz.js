// ===================== Quiz page logic (Modules 1–6, max 15 per module) =====================

// ----- Topic labels -----
const TOPIC_LABELS = {
  "ai-foundation": "AI Foundations",
  "machine-learning": "Machine Learning",
  "neural-networks": "Neural Networks",
  "deep-learning": "Deep Learning",
  nlp: "Natural Language Processing",
  ethics: "AI Ethics",
};

// ----- Config -----
const MAX_PER_MODULE = 15;

// ----- Questions dataset -----
// Trimmed to max 15 per topic — add/remove inside these groups as needed.
const QUESTIONS = [
  // === Module 1: AI Foundations (15 questions) ===
  {
    id: "ai-1",
    topic: "ai-foundation",
    question: "What is the primary goal of AI?",
    options: [
      "Store data efficiently",
      "Create systems that exhibit intelligent behavior",
      "Build faster CPUs",
      "Replace humans completely",
    ],
    answer: 1,
    explain:
      "AI aims to create systems with human-like intelligence (perception, reasoning, learning).",
  },
  {
    id: "ai-2",
    topic: "ai-foundation",
    question: "The Turing Test evaluates a machine’s ability to…",
    options: [
      "Solve equations",
      "Exhibit human-like conversation",
      "Run faster code",
      "Draw graphics",
    ],
    answer: 1,
    explain:
      "Proposed by Alan Turing, it measures if machines can converse indistinguishably from humans.",
  },
  {
    id: "ai-3",
    topic: "ai-foundation",
    question: "Which is a classic AI search algorithm?",
    options: [
      "Breadth-First Search",
      "Linear Regression",
      "Pooling",
      "Backpropagation",
    ],
    answer: 0,
    explain: "BFS (and DFS) are common algorithms for exploring search spaces.",
  },
  {
    id: "ai-4",
    topic: "ai-foundation",
    question: "Knowledge Representation helps AI systems…",
    options: [
      "Display images",
      "Store and reason about information",
      "Run faster",
      "Compress data",
    ],
    answer: 1,
    explain:
      "KR uses logic, rules, or graphs to represent knowledge for reasoning.",
  },
  {
    id: "ai-5",
    topic: "ai-foundation",
    question: "What defines an intelligent agent?",
    options: [
      "Acts randomly",
      "Acts rationally to achieve goals",
      "Only follows instructions",
      "Ignores environment",
    ],
    answer: 1,
    explain:
      "An agent perceives its environment and acts rationally to achieve goals.",
  },
  {
    id: "ai-6",
    topic: "ai-foundation",
    question: "Which describes Symbolic AI?",
    options: [
      "Learns from data",
      "Uses explicit rules and symbols",
      "Uses GPUs",
      "Works only on images",
    ],
    answer: 1,
    explain: "Symbolic AI encodes knowledge with logic and rules.",
  },
  {
    id: "ai-7",
    topic: "ai-foundation",
    question: "Narrow AI (ANI) refers to…",
    options: [
      "General human-level AI",
      "AI beyond humans",
      "AI for specific tasks",
      "AI with emotions",
    ],
    answer: 2,
    explain: "ANI is AI designed for specific tasks, e.g., voice assistants.",
  },
  {
    id: "ai-8",
    topic: "ai-foundation",
    question: "Which level of AI surpasses human ability in all domains?",
    options: ["ANI", "AGI", "ASI", "Symbolic AI"],
    answer: 2,
    explain:
      "Artificial Superintelligence (ASI) exceeds human ability everywhere.",
  },
  {
    id: "ai-9",
    topic: "ai-foundation",
    question: "A* (A-star) search algorithm uses…",
    options: [
      "Random guessing",
      "Heuristics + path cost",
      "Only path cost",
      "Only heuristics",
    ],
    answer: 1,
    explain: "A* combines actual cost and heuristic estimate for efficiency.",
  },
  {
    id: "ai-10",
    topic: "ai-foundation",
    question: "Features and labels in datasets are…",
    options: [
      "Inputs and outputs",
      "Outputs and inputs",
      "Random values",
      "Unused data",
    ],
    answer: 0,
    explain: "Features = inputs; Labels = targets to predict.",
  },
  {
    id: "ai-11",
    topic: "ai-foundation",
    question: "Which is NOT a learning paradigm?",
    options: ["Supervised", "Unsupervised", "Reinforcement", "Manual coding"],
    answer: 3,
    explain:
      "Supervised, unsupervised, reinforcement are paradigms; manual coding is not.",
  },
  {
    id: "ai-12",
    topic: "ai-foundation",
    question: "Precision and Recall are important when…",
    options: [
      "Data is balanced",
      "Data is imbalanced",
      "There is no data",
      "Always irrelevant",
    ],
    answer: 1,
    explain:
      "When data is imbalanced, accuracy can be misleading, so precision/recall are better.",
  },
  {
    id: "ai-13",
    topic: "ai-foundation",
    question: "Overfitting means…",
    options: [
      "Good generalization",
      "Memorizing training noise",
      "Underfitting",
      "Zero error everywhere",
    ],
    answer: 1,
    explain:
      "Overfitting = model memorizes noise, performs poorly on unseen data.",
  },
  {
    id: "ai-14",
    topic: "ai-foundation",
    question: "Which prevents overfitting?",
    options: [
      "Dropout",
      "Regularization",
      "Data augmentation",
      "All of the above",
    ],
    answer: 3,
    explain: "Multiple techniques exist to prevent overfitting.",
  },
  {
    id: "ai-15",
    topic: "ai-foundation",
    question: "Responsible AI emphasizes…",
    options: [
      "Only speed",
      "Fairness, transparency, accountability",
      "Cheap models",
      "Ignoring bias",
    ],
    answer: 1,
    explain:
      "Responsible AI requires fairness, privacy, transparency, accountability.",
  },

  // === Module 2: Machine Learning (15 questions) ===
  {
    id: "ml-1",
    topic: "machine-learning",
    question: "Machine Learning learns from…",
    options: ["Manual rules", "Data", "Noise only", "Randomness"],
    answer: 1,
    explain: "ML learns from data to improve performance.",
  },
  {
    id: "ml-2",
    topic: "machine-learning",
    question: "Supervised learning uses…",
    options: ["Labeled data", "No data", "Random data", "Only rewards"],
    answer: 0,
    explain: "Supervised learning trains on labeled input-output pairs.",
  },
  {
    id: "ml-3",
    topic: "machine-learning",
    question: "Unsupervised learning uses…",
    options: ["Labels", "Clusters without labels", "Rewards", "Human hints"],
    answer: 1,
    explain: "Unsupervised learning finds structure without labels.",
  },
  {
    id: "ml-4",
    topic: "machine-learning",
    question: "Which is supervised?",
    options: [
      "Clustering",
      "Classification",
      "Dimensionality reduction",
      "K-means",
    ],
    answer: 1,
    explain: "Classification uses labeled training data.",
  },
  {
    id: "ml-5",
    topic: "machine-learning",
    question: "Overfitting is shown when…",
    options: [
      "High training accuracy, low test accuracy",
      "Low training accuracy",
      "Equal train/test accuracy",
      "Perfect generalization",
    ],
    answer: 0,
    explain: "Overfitting memorizes training data, fails on test.",
  },
  {
    id: "ml-6",
    topic: "machine-learning",
    question: "The bias–variance tradeoff balances…",
    options: [
      "Complexity vs generalization",
      "Memory vs speed",
      "Size vs accuracy",
      "None",
    ],
    answer: 0,
    explain: "Too simple → bias, too complex → variance.",
  },
  {
    id: "ml-7",
    topic: "machine-learning",
    question: "Which is NOT an ML algorithm?",
    options: ["Decision Trees", "SVM", "k-NN", "Photoshop"],
    answer: 3,
    explain: "Photoshop is software, not an ML algorithm.",
  },
  {
    id: "ml-8",
    topic: "machine-learning",
    question: "K-Means is used for…",
    options: ["Classification", "Clustering", "Regression", "Data cleaning"],
    answer: 1,
    explain: "K-Means clusters data into k groups.",
  },
  {
    id: "ml-9",
    topic: "machine-learning",
    question: "Linear Regression predicts…",
    options: ["Categories", "Continuous values", "Clusters", "Images"],
    answer: 1,
    explain: "Regression outputs continuous values.",
  },
  {
    id: "ml-10",
    topic: "machine-learning",
    question: "Decision Trees are popular because…",
    options: [
      "Black box",
      "Transparent and interpretable",
      "No training needed",
      "Always perfect",
    ],
    answer: 1,
    explain: "They are interpretable models.",
  },
  {
    id: "ml-11",
    topic: "machine-learning",
    question: "PCA is used for…",
    options: [
      "Classification",
      "Regression",
      "Dimensionality reduction",
      "Prediction",
    ],
    answer: 2,
    explain: "Principal Component Analysis reduces dimensions.",
  },
  {
    id: "ml-12",
    topic: "machine-learning",
    question: "Hyperparameter tuning can be done using…",
    options: [
      "Cross-validation",
      "Random guessing only",
      "Ignore parameters",
      "Always default",
    ],
    answer: 0,
    explain: "Cross-validation helps tune hyperparameters.",
  },
  {
    id: "ml-13",
    topic: "machine-learning",
    question: "Which metric is best for imbalanced classification?",
    options: ["Accuracy", "F1-score", "MSE", "R²"],
    answer: 1,
    explain: "F1-score balances precision and recall.",
  },
  {
    id: "ml-14",
    topic: "machine-learning",
    question: "A confusion matrix shows…",
    options: [
      "True/false positives/negatives",
      "Memory usage",
      "Training time",
      "CPU speed",
    ],
    answer: 0,
    explain: "It summarizes classification results.",
  },
  {
    id: "ml-15",
    topic: "machine-learning",
    question: "Feature engineering involves…",
    options: [
      "Removing all data",
      "Creating useful features",
      "Random noise",
      "Only scaling",
    ],
    answer: 1,
    explain: "Feature engineering creates meaningful features for models.",
  },

  // === Module 3: Neural Networks (15 questions) ===
  {
    id: "nn-1",
    topic: "neural-networks",
    question: "A neuron computes…",
    options: [
      "Random numbers",
      "Weighted sum + bias",
      "Only inputs",
      "Nothing",
    ],
    answer: 1,
    explain: "z = w·x + b.",
  },
  {
    id: "nn-2",
    topic: "neural-networks",
    question: "Activation functions introduce…",
    options: ["Linearity", "Non-linearity", "Bias", "Overfitting"],
    answer: 1,
    explain: "They provide non-linear decision boundaries.",
  },
  {
    id: "nn-3",
    topic: "neural-networks",
    question: "Perceptrons fail on which problem?",
    options: ["AND", "OR", "XOR", "NOT"],
    answer: 2,
    explain: "Single perceptron cannot solve XOR.",
  },
  {
    id: "nn-4",
    topic: "neural-networks",
    question: "An MLP stands for…",
    options: [
      "Multi-Layer Perceptron",
      "Multi Linear Program",
      "Multiple Logic Path",
      "Matrix Layer Processor",
    ],
    answer: 0,
    explain: "MLP = Multi-Layer Perceptron.",
  },
  {
    id: "nn-5",
    topic: "neural-networks",
    question: "Backpropagation updates weights using…",
    options: ["Heuristics", "Gradients", "Random guesses", "Memory"],
    answer: 1,
    explain: "Backprop uses gradients to update weights.",
  },
  {
    id: "nn-6",
    topic: "neural-networks",
    question: "Cross-entropy loss is common for…",
    options: ["Regression", "Classification", "Clustering", "Noise"],
    answer: 1,
    explain: "Cross-entropy fits classification tasks.",
  },
  {
    id: "nn-7",
    topic: "neural-networks",
    question: "CNNs are good at…",
    options: ["Images", "Time series only", "Graphs", "Tabular data"],
    answer: 0,
    explain: "CNNs specialize in images.",
  },
  {
    id: "nn-8",
    topic: "neural-networks",
    question: "RNNs handle…",
    options: ["Static data", "Sequential data", "Images only", "Random inputs"],
    answer: 1,
    explain: "RNNs model sequences like text or time series.",
  },
  {
    id: "nn-9",
    topic: "neural-networks",
    question: "Transformers replace RNNs using…",
    options: ["Self-attention", "Linear regression", "Decision trees", "k-NN"],
    answer: 0,
    explain: "Transformers use self-attention.",
  },
  {
    id: "nn-10",
    topic: "neural-networks",
    question: "Dropout is used for…",
    options: ["Regularization", "Optimization", "Prediction", "Initialization"],
    answer: 0,
    explain: "Dropout helps prevent overfitting.",
  },
  {
    id: "nn-11",
    topic: "neural-networks",
    question: "Weight initialization like Xavier helps…",
    options: ["Slow training", "Stable gradients", "Overfitting", "Errors"],
    answer: 1,
    explain: "Proper init avoids vanishing/exploding gradients.",
  },
  {
    id: "nn-12",
    topic: "neural-networks",
    question: "Batch normalization helps…",
    options: [
      "Stabilize training",
      "Reduce variance only",
      "Increase memory",
      "Stop training",
    ],
    answer: 0,
    explain: "BN stabilizes and accelerates training.",
  },
  {
    id: "nn-13",
    topic: "neural-networks",
    question: "Transfer learning involves…",
    options: [
      "Training from scratch only",
      "Using pre-trained models",
      "Deleting models",
      "Ignoring data",
    ],
    answer: 1,
    explain: "It adapts pre-trained models for new tasks.",
  },
  {
    id: "nn-14",
    topic: "neural-networks",
    question: "LSTMs are designed to solve…",
    options: [
      "Short-term memory",
      "Long-term dependencies",
      "Image recognition",
      "Linear problems",
    ],
    answer: 1,
    explain: "LSTMs capture long-term dependencies.",
  },
  {
    id: "nn-15",
    topic: "neural-networks",
    question: "Attention mechanisms allow…",
    options: [
      "Focusing on relevant inputs",
      "Ignoring data",
      "Random guessing",
      "Noise injection",
    ],
    answer: 0,
    explain: "Attention focuses on important inputs.",
  },

  // === Module 4: Deep Learning (15 questions) ===
  {
    id: "dl-1",
    topic: "deep-learning",
    question: "Deep learning uses…",
    options: [
      "Few layers only",
      "Many layers to learn hierarchy",
      "Random weights only",
      "No activation",
    ],
    answer: 1,
    explain: "DL stacks layers to learn complex hierarchies.",
  },
  {
    id: "dl-2",
    topic: "deep-learning",
    question: "Which breakthrough came from DL?",
    options: [
      "ImageNet success",
      "Pascal’s triangle",
      "Sorting algorithms",
      "Excel macros",
    ],
    answer: 0,
    explain: "DL achieved big breakthroughs in vision.",
  },
  {
    id: "dl-3",
    topic: "deep-learning",
    question: "Transformers excel in…",
    options: ["Graphs", "Language", "Sorting", "Arithmetic"],
    answer: 1,
    explain: "Transformers dominate NLP.",
  },
  {
    id: "dl-4",
    topic: "deep-learning",
    question: "GANs consist of…",
    options: ["One model", "Generator + Discriminator", "Trees", "CNN only"],
    answer: 1,
    explain: "GANs are two competing networks.",
  },
  {
    id: "dl-5",
    topic: "deep-learning",
    question: "VAEs are used for…",
    options: [
      "Clustering",
      "Generative modeling",
      "Classification",
      "Regression",
    ],
    answer: 1,
    explain: "Variational Autoencoders generate data.",
  },
  {
    id: "dl-6",
    topic: "deep-learning",
    question: "Reinforcement Learning agents learn via…",
    options: ["Labels", "Rewards", "Noise", "Manual input"],
    answer: 1,
    explain: "RL optimizes reward signals.",
  },
  {
    id: "dl-7",
    topic: "deep-learning",
    question: "Policy Gradient methods are used in…",
    options: ["Supervised learning", "RL", "Unsupervised", "PCA"],
    answer: 1,
    explain: "They optimize policies in RL.",
  },
  {
    id: "dl-8",
    topic: "deep-learning",
    question: "Overfitting in DL can be mitigated by…",
    options: [
      "Dropout",
      "Early stopping",
      "Data augmentation",
      "All of the above",
    ],
    answer: 3,
    explain: "Multiple regularization strategies are used.",
  },
  {
    id: "dl-9",
    topic: "deep-learning",
    question: "Which optimizer adapts learning rates?",
    options: ["SGD", "Adam", "Newton’s method", "None"],
    answer: 1,
    explain: "Adam adapts learning rates per parameter.",
  },
  {
    id: "dl-10",
    topic: "deep-learning",
    question: "ResNets introduced…",
    options: ["Skip connections", "Attention", "Pooling", "Normalization"],
    answer: 0,
    explain: "Skip connections helped train deep nets.",
  },
  {
    id: "dl-11",
    topic: "deep-learning",
    question: "Transformers rely on…",
    options: ["Self-attention", "Convolutions only", "Recurrent loops", "SVMs"],
    answer: 0,
    explain: "Transformers = self-attention.",
  },
  {
    id: "dl-12",
    topic: "deep-learning",
    question: "Which is a DL application?",
    options: ["Speech recognition", "Photoshop filters", "Sorting", "Excel"],
    answer: 0,
    explain: "DL powers speech, vision, etc.",
  },
  {
    id: "dl-13",
    topic: "deep-learning",
    question: "Edge deployment often requires…",
    options: [
      "Model compression",
      "Larger models",
      "Extra GPUs",
      "More layers",
    ],
    answer: 0,
    explain: "Compression makes models deployable.",
  },
  {
    id: "dl-14",
    topic: "deep-learning",
    question: "Batch size affects…",
    options: ["Learning dynamics", "Nothing", "Only storage", "Graphics"],
    answer: 0,
    explain: "Batch size influences learning.",
  },
  {
    id: "dl-15",
    topic: "deep-learning",
    question: "Self-supervised learning uses…",
    options: [
      "No signals",
      "Data itself as supervision",
      "Labels only",
      "Random outputs",
    ],
    answer: 1,
    explain: "SSL creates pseudo-labels from data.",
  },

  // === Module 5: NLP (15 questions) ===
  {
    id: "nlp-1",
    topic: "nlp",
    question: "NLP stands for…",
    options: [
      "Natural Logic Processing",
      "Natural Language Processing",
      "New Learning Paradigm",
      "Neural Language Program",
    ],
    answer: 1,
    explain: "NLP = Natural Language Processing.",
  },
  {
    id: "nlp-2",
    topic: "nlp",
    question: "Tokenization splits text into…",
    options: ["Random chars", "Words/subwords", "Numbers only", "Vectors"],
    answer: 1,
    explain: "Tokenization splits into words/subwords.",
  },
  {
    id: "nlp-3",
    topic: "nlp",
    question: "TF-IDF is used for…",
    options: [
      "Clustering",
      "Text vectorization",
      "Classification",
      "Translation",
    ],
    answer: 1,
    explain: "TF-IDF represents text numerically.",
  },
  {
    id: "nlp-4",
    topic: "nlp",
    question: "Word embeddings map words into…",
    options: ["Sentences", "Vectors", "Numbers only", "Images"],
    answer: 1,
    explain: "Embeddings map words into vector spaces.",
  },
  {
    id: "nlp-5",
    topic: "nlp",
    question: "Sentiment analysis detects…",
    options: ["Grammar", "Emotion polarity", "POS tags", "Translation"],
    answer: 1,
    explain: "It identifies sentiment polarity.",
  },
  {
    id: "nlp-6",
    topic: "nlp",
    question: "Intent detection is used in…",
    options: ["Chatbots", "Vision", "Sorting", "Games"],
    answer: 0,
    explain: "Chatbots detect user intent.",
  },
  {
    id: "nlp-7",
    topic: "nlp",
    question: "Machine Translation today is dominated by…",
    options: ["SVMs", "Transformers", "CNNs", "Decision trees"],
    answer: 1,
    explain: "Transformers dominate translation.",
  },
  {
    id: "nlp-8",
    topic: "nlp",
    question: "Summarization can be…",
    options: [
      "Extractive/Abstractive",
      "Only extractive",
      "Only abstractive",
      "None",
    ],
    answer: 0,
    explain: "Summarization methods include extractive and abstractive.",
  },
  {
    id: "nlp-9",
    topic: "nlp",
    question: "Stopword removal is used to…",
    options: [
      "Remove punctuation",
      "Remove common words",
      "Remove rare words",
      "Remove numbers",
    ],
    answer: 1,
    explain: "Stopword removal reduces common uninformative words.",
  },
  {
    id: "nlp-10",
    topic: "nlp",
    question: "POS tagging assigns…",
    options: ["Sentiment", "Parts of speech", "Numbers", "Clusters"],
    answer: 1,
    explain: "POS tagging labels words with their grammatical role.",
  },
  {
    id: "nlp-11",
    topic: "nlp",
    question: "NER stands for…",
    options: [
      "Named Entity Recognition",
      "Neural Encoding Representation",
      "New English Rules",
      "None",
    ],
    answer: 0,
    explain: "NER identifies named entities.",
  },
  {
    id: "nlp-12",
    topic: "nlp",
    question: "BERT is a…",
    options: ["RNN", "Transformer-based model", "CNN", "Decision Tree"],
    answer: 1,
    explain: "BERT is transformer-based.",
  },
  {
    id: "nlp-13",
    topic: "nlp",
    question: "Hallucinations in NLP mean…",
    options: [
      "Correct outputs",
      "Nonsense outputs not grounded in data",
      "Random embeddings",
      "Bias removal",
    ],
    answer: 1,
    explain: "Hallucinations = fabricated outputs.",
  },
  {
    id: "nlp-14",
    topic: "nlp",
    question: "ROUGE score evaluates…",
    options: [
      "Machine translation",
      "Summarization",
      "Parsing",
      "Speech recognition",
    ],
    answer: 1,
    explain: "ROUGE measures overlap for summaries.",
  },
  {
    id: "nlp-15",
    topic: "nlp",
    question: "ASR in NLP means…",
    options: [
      "Automated Sentence Recognition",
      "Automatic Speech Recognition",
      "Annotated Syntax Rules",
      "Artificial Semantic Reasoning",
    ],
    answer: 1,
    explain: "ASR = Automatic Speech Recognition.",
  },

  // === Module 6: Ethics & Future (15 questions) ===
  {
    id: "eth-1",
    topic: "ethics",
    question: "Fairness in AI refers to…",
    options: [
      "Equal error rates across groups",
      "Always perfect accuracy",
      "Ignoring bias",
      "Random outcomes",
    ],
    answer: 0,
    explain: "Fairness includes equal error rates.",
  },
  {
    id: "eth-2",
    topic: "ethics",
    question: "Demographic parity requires…",
    options: [
      "Equal selection rates across groups",
      "Equal rewards",
      "Random outputs",
      "Perfect precision",
    ],
    answer: 0,
    explain: "DP requires equal selection rates.",
  },
  {
    id: "eth-3",
    topic: "ethics",
    question: "Differential privacy ensures…",
    options: [
      "User data hidden with noise",
      "Zero privacy",
      "Always public data",
      "Random accuracy",
    ],
    answer: 0,
    explain: "DP adds noise for privacy.",
  },
  {
    id: "eth-4",
    topic: "ethics",
    question: "Federated learning trains models…",
    options: [
      "On central servers only",
      "On devices locally",
      "Without data",
      "Using random noise",
    ],
    answer: 1,
    explain: "FL trains on local devices.",
  },
  {
    id: "eth-5",
    topic: "ethics",
    question: "Model cards provide…",
    options: [
      "Transparency docs",
      "GPU specs",
      "Data compression",
      "Random graphs",
    ],
    answer: 0,
    explain: "Model cards give transparency.",
  },
  {
    id: "eth-6",
    topic: "ethics",
    question: "Datasheets for datasets describe…",
    options: [
      "Collection & limitations",
      "Random images",
      "Only accuracy",
      "None",
    ],
    answer: 0,
    explain: "Datasheets document datasets.",
  },
  {
    id: "eth-7",
    topic: "ethics",
    question: "Red-teaming in AI is…",
    options: [
      "Testing vulnerabilities",
      "Deploying models",
      "Compressing data",
      "None",
    ],
    answer: 0,
    explain: "Red-teaming stress-tests models.",
  },
  {
    id: "eth-8",
    topic: "ethics",
    question: "RAG (Retrieval-Augmented Generation) helps…",
    options: [
      "Ground outputs on sources",
      "Generate random answers",
      "Train faster",
      "None",
    ],
    answer: 0,
    explain: "RAG grounds outputs on trusted sources.",
  },
  {
    id: "eth-9",
    topic: "ethics",
    question: "On-device AI improves…",
    options: ["Privacy and latency", "Only speed", "Only accuracy", "Nothing"],
    answer: 0,
    explain: "Running on device enhances privacy and latency.",
  },
  {
    id: "eth-10",
    topic: "ethics",
    question: "Quantization reduces…",
    options: ["Model size", "Bias", "Data", "Transparency"],
    answer: 0,
    explain: "Quantization reduces model size.",
  },
  {
    id: "eth-11",
    topic: "ethics",
    question: "Least privilege principle means…",
    options: [
      "Agents only access necessary tools",
      "Agents access everything",
      "Users lose control",
      "None",
    ],
    answer: 0,
    explain: "Agents should access minimal privileges.",
  },
  {
    id: "eth-12",
    topic: "ethics",
    question: "Runtime safeguards include…",
    options: [
      "Monitoring misuse",
      "Unlimited access",
      "No logging",
      "Ignoring bias",
    ],
    answer: 0,
    explain: "Runtime safeguards detect misuse.",
  },
  {
    id: "eth-13",
    topic: "ethics",
    question: "AI bias can arise from…",
    options: [
      "Training data",
      "Model design",
      "Deployment context",
      "All of the above",
    ],
    answer: 3,
    explain: "Bias can enter at many stages.",
  },
  {
    id: "eth-14",
    topic: "ethics",
    question: "Transparency in AI means…",
    options: [
      "Explaining model behavior",
      "Hiding code",
      "Only publishing results",
      "None",
    ],
    answer: 0,
    explain: "Transparency means explaining decisions.",
  },
  {
    id: "eth-15",
    topic: "ethics",
    question: "Responsible AI lifecycle includes…",
    options: [
      "Fairness, accountability, monitoring",
      "Only training fast",
      "Ignoring ethics",
      "Always automating",
    ],
    answer: 0,
    explain: "Responsible AI includes fairness, accountability, monitoring.",
  },
];

// ----- DOM refs -----
const topicSelect = document.getElementById("topicSelect");
const countSelect = document.getElementById("countSelect");
const startBtn = document.getElementById("startBtn");
const quizCard = document.getElementById("quizCard");
const resultCard = document.getElementById("resultCard");
const reviewList = document.getElementById("reviewList");

const questionText = document.getElementById("questionText");
const questionTag = document.getElementById("questionTag");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const qCounter = document.getElementById("questionCounter");
const scoreCounter = document.getElementById("scoreValue");
const progressBar = document.getElementById("progressBar");

const statScore = document.getElementById("statScore");
const statTotal = document.getElementById("statTotal");
const statPercent = document.getElementById("statPercent");
const resultSummary = document.getElementById("resultSummary");
const reviewBtn = document.getElementById("reviewBtn");
const retakeBtn = document.getElementById("retakeBtn");

// ----- State -----
let queue = [];
let index = 0;
let score = 0;
let answers = [];

// ----- Utils -----
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function listTopics() {
  return Array.from(new Set(QUESTIONS.map((q) => q.topic)));
}

// ----- Quiz prep -----
function prepareQuiz() {
  const topic = topicSelect.value; // 'mixed' or a specific topic
  const requested = parseInt(countSelect.value, 10) || 1;

  const take = (arr, n) => {
    const copy = arr.slice();
    shuffle(copy);
    return copy.slice(0, Math.min(n, copy.length));
  };

  if (topic !== "mixed") {
    const pool = QUESTIONS.filter((q) => q.topic === topic);
    const cap = Math.min(MAX_PER_MODULE, pool.length);
    queue = take(pool, Math.min(requested, cap));
  } else {
    let cappedPool = [];
    for (const t of listTopics()) {
      const pool = QUESTIONS.filter((q) => q.topic === t);
      cappedPool = cappedPool.concat(
        take(pool, Math.min(MAX_PER_MODULE, pool.length))
      );
    }
    queue = take(cappedPool, Math.min(requested, cappedPool.length));
  }

  index = 0;
  score = 0;
  answers = [];
  scoreCounter.textContent = "0";
  updateProgress();
}

// ----- Progress & Render -----
function updateProgress() {
  const total = queue.length || parseInt(countSelect.value, 10);
  qCounter.textContent = `Question ${Math.min(index + 1, total)}/${total}`;
  const pct = Math.min(100, Math.round((index / total) * 100));
  progressBar.style.width = pct + "%";
}

function renderQuestion() {
  const q = queue[index];
  if (!q) return;

  // text + tag
  questionText.textContent = q.question;
  questionTag.textContent = TOPIC_LABELS[q.topic] || q.topic;

  // options
  optionsEl.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => {
      const correct = i === q.answer;
      answers.push({
        id: q.id,
        topic: q.topic,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explain: q.explain,
        chosen: i,
        correct,
      });

      if (correct) {
        score++;
        scoreCounter.textContent = String(score);
      }

      index++;
      if (index < queue.length) {
        updateProgress();
        renderQuestion();
      } else {
        // make sure you have a finishQuiz() that shows the result card
        finishQuiz();
      }
    };
    optionsEl.appendChild(btn);
  });

  updateProgress();
}

// ----- Results + Review -----
function finishQuiz() {
  quizCard.hidden = true;
  resultCard.hidden = false;

  const total = queue.length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  statScore.textContent = String(score);
  statTotal.textContent = String(total);
  statPercent.textContent = percent + "%";

  let msg = "Nice work! Keep practicing to master the concepts.";
  if (percent === 100) msg = "Perfect score! You're a star!";
  else if (percent >= 80) msg = "Great job! Strong understanding.";
  else if (percent < 50) msg = "Good start—review and try again!";
  resultSummary.textContent = msg;
  reviewList.hidden = true;

  // Persist attempt for dashboard average score (per-user key)
  try {
    function userScope() {
      try {
        const u = JSON.parse(localStorage.getItem("currentUser") || "null");
        const id = u?.id || u?.email || u?.username;
        return id ? String(id) : "guest";
      } catch (_) {
        return "guest";
      }
    }
    const key = "quiz_attempts_v1::" + userScope();
    const raw = localStorage.getItem(key);
    let arr = [];
    try {
      arr = raw ? JSON.parse(raw) : [];
    } catch (_) {
      arr = [];
    }
    if (!Array.isArray(arr)) arr = [];
    arr.push({ ts: Date.now(), percent, source: 'quiz' });
    if (arr.length > 50) arr = arr.slice(arr.length - 50);
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (_) {}
}

function renderReview() {
  reviewList.innerHTML = answers
    .map((a, idx) => {
      const label = TOPIC_LABELS[a.topic] || a.topic;
      return (
        '<div class="review-item ' +
        (a.correct ? "ok" : "bad") +
        '">' +
        '<div class="review-top"><span class="num">' +
        (idx + 1) +
        '.</span><span class="tag">' +
        label +
        "</span></div>" +
        '<div class="q">' +
        a.question +
        "</div>" +
        '<div class="a">Your answer: <strong>' +
        (a.options[a.chosen] ?? "—") +
        "</strong></div>" +
        '<div class="c">Correct answer: <strong>' +
        a.options[a.answer] +
        "</strong></div>" +
        '<div class="explain">' +
        (a.explain || "") +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}

// ----- Wire up controls -----
if (startBtn) {
  startBtn.addEventListener("click", () => {
    // Try to prepare for the selected topic; fallback to mixed if empty
    prepareQuiz();
    if (!queue.length) {
      topicSelect.value = "mixed";
      prepareQuiz();
    }
    resultCard.hidden = true;
    quizCard.hidden = false;
    renderQuestion();
  });
}

if (reviewBtn) {
  reviewBtn.addEventListener("click", () => {
    const hidden = reviewList.hidden;
    if (hidden) renderReview();
    reviewList.hidden = !hidden;
  });
}

if (retakeBtn) {
  retakeBtn.addEventListener("click", () => {
    resultCard.hidden = true;
    quizCard.hidden = true;
  });
}
