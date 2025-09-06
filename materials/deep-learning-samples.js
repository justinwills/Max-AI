// module5_nlp.js — Interactive Lessons + MCQs (no deps)
// Content provided by user; formatted and wired up for a learning website.

const lessons = [
  {
    id: 1,
    title: "Foundations of Deep Learning",
    body: `
<p>When we interact with modern technology—whether it is recognizing a face in photos, translating languages instantly, or recommending a movie—we are often seeing deep learning at work. Deep learning is a branch of machine learning that uses networks of layers, known as neural networks, to recognize patterns in data.</p >
<p>Think of deep learning like teaching a student. At first, the student learns simple facts such as letters or numbers. Later, they combine this knowledge into sentences, and eventually, into complete essays. Similarly, in deep learning, the first layers of a network learn simple patterns, while deeper layers combine these into more complex ideas.</p >
<p>Deep learning matters because it has dramatically changed what computers can do. It powers self-driving cars, medical diagnosis from images, voice assistants, and many other applications that once seemed impossible.</p >
`,
    quiz: {
      q: "What makes deep learning different from traditional machine learning?",
      options: [
        "It doesn’t require training data",
        "It memorizes patterns without processing",
        "It uses layered neural networks to learn progressively complex patterns",
        "It only works for numbers",
      ],
      answer: 2,
      hint: "",
    },
  },
  {
    id: 2,
    title: "Deep Learning Workflow",
    body: `
<p>Deep learning projects don’t succeed by just throwing data into a model — they follow a clear workflow.</p >
<ol>
  <li><b>Data Preparation:</b> Most of the effort goes here. Raw data is noisy, inconsistent, and incomplete. A well-prepared dataset often matters more than a fancy model. For example, in medical imaging, removing blurry scans and labeling them carefully is critical for accuracy.</li>
  <li><b>Model Design:</b> Choosing the right architecture is like choosing the right tool for the job. CNNs shine in vision, Transformers dominate in language, while hybrid models tackle multimodal tasks.</li>
  <li><b>Training:</b> This stage is about more than running code. It’s about setting learning rates, managing memory, and monitoring metrics in real time. Mistuned training can waste hours on GPUs without progress.</li>
  <li><b>Evaluation:</b> A model that works in the lab may fail in the real world. Proper evaluation uses test data, cross-validation, and fairness checks to ensure robust performance.</li>
  <li><b>Deployment:</b> Integration is often the hardest part. A model that works on a server may need to be compressed for a smartphone or edge device.</li>
</ol>
<p>This workflow isn’t rigid but iterative. Teams circle back when issues arise — data may need relabeling, or deployment might demand lighter architectures.</p >
`,
    quiz: {
      q: "Which step most often determines real-world model quality?",
      options: [
        "Picking the latest architecture",
        "Increasing batch size",
        "Careful data preparation and labeling",
        "Adding more GPUs",
      ],
      answer: 2,
      hint: "Garbage in, garbage out.",
    },
  },
  {
    id: 3,
    title: "Convolutional Models for Vision",
    body: `
<p>Convolutional models (CNNs) changed the way machines see the world. Unlike traditional methods that relied on handcrafted filters, CNNs learn features directly from data.</p >
<p>The magic lies in their efficiency: instead of analyzing every pixel separately, CNNs slide filters across an image to detect edges, textures, and shapes. These small building blocks combine into recognition of complex objects like faces or traffic signs.</p >
<p><b>Real-world impact:</b></p >
<ul>
  <li>Healthcare: Detecting tumors from X-rays.</li>
  <li>Transportation: Enabling cars to detect pedestrians, lanes, and obstacles.</li>
  <li>Security: Powering facial recognition in airports and smartphones.</li>
</ul>
`,
    quiz: {
      q: "What core idea makes CNNs efficient for images?",
      options: [
        "Fully connecting every pixel to every neuron",
        "Sliding shared filters to capture local patterns",
        "Sorting pixels before inference",
        "Averaging all pixels first",
      ],
      answer: 1,
      hint: "Think weight sharing and local receptive fields.",
    },
  },
  {
    id: 4,
    title: "Sequence and Language Models",
    body: `
<p>Data doesn’t always come as static images — language, speech, and financial trends are sequential. Early sequence models like RNNs captured short-term patterns but struggled with long memory.</p >
<p>Transformers solved this by introducing self-attention, allowing models to focus on relevant words or signals no matter how far apart they are. This leap turned machine translation, text generation, and even music composition into practical technologies.</p >
<p><b>Examples:</b> Google Translate; ChatGPT & BERT; stock pattern modeling.</p >
`,
    quiz: {
      q: "Why do Transformers outperform basic RNNs on long sequences?",
      options: [
        "They ignore context to run faster",
        "They store the entire dataset in memory",
        "Self-attention models long-range dependencies directly",
        "They train only on short sentences",
      ],
      answer: 2,
      hint: "All-to-all relationships in one pass.",
    },
  },
  {
    id: 5,
    title: "Training and Optimization",
    body: `
<p>Training deep models is where theory meets reality, and most failures happen here. It’s not enough to pick an algorithm — you need strategies to make learning efficient and reliable.</p >
<ul>
  <li><b>Optimization:</b> SGD+momentum / Adam influence convergence speed and stability.</li>
  <li><b>Regularization:</b> Dropout and weight decay combat overfitting.</li>
  <li><b>Normalization:</b> BatchNorm/LayerNorm stabilize activations across layers.</li>
  <li><b>Hardware:</b> GPUs/TPUs enable large-scale training.</li>
</ul>
<p>In practice, training is like piloting a plane: monitor metrics, adjust course, and handle turbulence. The right choices separate toy demos from production AI.</p >
`,
    quiz: {
      q: "Which choice best prevents overfitting in practice?",
      options: [
        "Training longer without monitoring",
        "Using dropout and proper regularization",
        "Disabling validation checks",
        "Setting learning rate to zero",
      ],
      answer: 1,
      hint: "Regularization is a deliberate design choice.",
    },
  },
  {
    id: 6,
    title: "Modern Deep Learning Architectures",
    body: `
<p>Recent advances have introduced architectures that go beyond CNNs and RNNs. Transformers, for example, use self-attention to weigh the importance of different parts of the input simultaneously. This enables large-scale language and vision tasks.</p >
<p>Imagine self-attention like reading a book and instantly highlighting key phrases. These architectures power conversational AI, automated writing, and multimodal systems. They represent the future of deep learning.</p >
`,
    quiz: {
      q: "What is the main advantage of Transformers over traditional RNNs?",
      options: [
        "They process input strictly step by step",
        "They use self-attention to capture relationships across the entire input at once",
        "They are limited to small datasets",
        "They only work for image recognition",
      ],
      answer: 1,
      hint: "",
    },
  },
  {
    id: 7,
    title: "Generative Models",
    body: `
<p>Generative models learn to create new data that resembles training data. Beyond classification, they can generate images, text, or music. Two main types are GANs and VAEs—think of GANs as an artist-and-critic duo improving together.</p >
<p>Why it matters: AI art, deepfakes, drug discovery, and data augmentation.</p >
`,
    quiz: {
      q: "What is the main goal of generative models like GANs and VAEs?",
      options: [
        "To classify data into categories",
        "To generate new data that resembles the training data",
        "To compress images without loss",
        "To eliminate the need for training",
      ],
      answer: 1,
      hint: "",
    },
  },
  {
    id: 8,
    title: "Reinforcement Learning with Deep Networks",
    body: `
<p>Reinforcement learning (RL) combines deep learning with decision-making. An agent learns by trial and error with rewards and penalties. Deep networks allow RL to handle complex environments, from games to robotics.</p >
<p>Think of teaching a dog tricks: each correct move gets a treat. Why it matters: breakthroughs in gaming, robotics, and adaptive control.</p >
`,
    quiz: {
      q: "How does reinforcement learning primarily train an agent?",
      options: [
        "By memorizing past examples",
        "By receiving rewards or penalties from its actions",
        "By scanning images with filters",
        "By copying a teacher’s answers directly",
      ],
      answer: 1,
      hint: "",
    },
  },
];

// ====== State & Storage ======
const state = {
  current: 0,
  answers: {}, // {lessonId: selectedIndex}
  completed: new Set(JSON.parse(localStorage.getItem("nlp_completed") || "[]")),
};

function saveProgress() {
  localStorage.setItem("nlp_completed", JSON.stringify([...state.completed]));
}

// ====== Rendering ======
const navEl = document.getElementById("nav-list");
const titleEl = document.getElementById("lesson-title");
const bodyEl = document.getElementById("lesson-body");
const qEl = document.getElementById("quiz-question");
const optsEl = document.getElementById("quiz-options");
const fbEl = document.getElementById("quiz-feedback");
const hintEl = document.getElementById("quiz-hint");
const checkBtn = document.getElementById("btn-check");
const retryBtn = document.getElementById("btn-retry");
const nextBtn = document.getElementById("btn-next");
const markBtn = document.getElementById("btn-mark");
const printBtn = document.getElementById("btn-print");
const progressBadge = document.getElementById("progress-badge");
const progressFill = document.getElementById("progress-fill");

function renderNav() {
  navEl.innerHTML = "";
  lessons.forEach((l, idx) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = "lesson-link" + (idx === state.current ? " active" : "");
    a.innerHTML = `<span>Lesson ${l.id}</span><span class="muted">— ${l.title}</span>`;
    const done = state.completed.has(l.id);
    if (done) {
      const b = document.createElement("span");
      b.className = "badge";
      b.textContent = "完成";
      a.appendChild(b);
    }
    a.addEventListener("click", (e) => {
      e.preventDefault();
      loadLesson(idx);
    });
    navEl.appendChild(a);
  });
  const pct = Math.round((state.completed.size / lessons.length) * 100);
  progressBadge.textContent = `${state.completed.size}/${lessons.length} 完成`;
  progressFill.style.width = `${pct}%`;
}

function renderLesson(idx) {
  const l = lessons[idx];
  titleEl.textContent = `Lesson ${l.id}: ${l.title}`;
  bodyEl.innerHTML = l.body;
  // Quiz
  qEl.textContent = l.quiz.q;
  hintEl.textContent = l.quiz.hint || "";
  fbEl.style.display = "none";
  fbEl.className = "feedback";
  // options
  optsEl.innerHTML = "";
  l.quiz.options.forEach((text, i) => {
    const id = `opt-${l.id}-${i}`;
    const label = document.createElement("label");
    label.className = "opt";
    label.setAttribute("for", id);
    label.innerHTML = `<input type="radio" name="q-${
      l.id
    }" id="${id}" value="${i}"> <span>${String.fromCharCode(
      65 + i
    )}. ${text}</span>`;
    optsEl.appendChild(label);
  });
  retryBtn.disabled = true;
}

function getSelected() {
  const radios = optsEl.querySelectorAll("input[type=radio]");
  for (const r of radios) {
    if (r.checked) return +r.value;
  }
  return null;
}

function checkAnswer() {
  const sel = getSelected();
  if (sel === null) {
    fbEl.style.display = "block";
    fbEl.className = "feedback bad";
    fbEl.textContent = "请选择一个选项再提交。";
    return;
  }
  const l = lessons[state.current];
  const ok = sel === l.quiz.answer;
  state.answers[l.id] = sel;
  if (ok) {
    fbEl.style.display = "block";
    fbEl.className = "feedback good";
    fbEl.textContent = "✅ 正确！";
    retryBtn.disabled = false;
  } else {
    fbEl.style.display = "block";
    fbEl.className = "feedback bad";
    fbEl.textContent = "❌ 不正确。查看提示并再试一次。";
    retryBtn.disabled = false;
  }
}

function retry() {
  const radios = optsEl.querySelectorAll("input[type=radio]");
  radios.forEach((r) => (r.checked = false));
  fbEl.style.display = "none";
}

function loadLesson(idx) {
  state.current = idx;
  renderNav();
  renderLesson(idx);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextLesson() {
  const next = (state.current + 1) % lessons.length;
  loadLesson(next);
}

function markComplete() {
  const l = lessons[state.current];
  state.completed.add(l.id);
  saveProgress();
  renderNav();
}

function init() {
  renderNav();
  renderLesson(0);
  checkBtn.addEventListener("click", (e) => {
    e.preventDefault();
    checkAnswer();
  });
  retryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    retry();
  });
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    nextLesson();
  });
  markBtn.addEventListener("click", (e) => {
    e.preventDefault();
    markComplete();
  });
  printBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.print();
  });
}

document.addEventListener("DOMContentLoaded", init);
