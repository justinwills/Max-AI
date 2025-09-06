// Flashcard logic + simple filtering/shuffle

// Data
const FLASHCARDS = [
  { id: 'ai-1', topic: 'ai-foundation', term: 'Artificial Intelligence (AI)', definition: 'The field of creating systems that perform tasks requiring human intelligence, like perception, reasoning, learning, and decision-making.', hint: 'Broad field enabling intelligent behavior in machines.' },
  { id: 'ai-2', topic: 'ai-foundation', term: 'Turing Test', definition: "A test of a machine's ability to exhibit intelligent behavior indistinguishable from that of a human through conversation.", hint: 'Proposed by Alan Turing in 1950.' },
  { id: 'ai-3', topic: 'ai-foundation', term: 'Search Algorithms', definition: 'Techniques like BFS and DFS used to navigate problem spaces to find solutions or paths.', hint: 'Breadth-first vs depth-first.' },
  { id: 'ai-4', topic: 'ai-foundation', term: 'Knowledge Representation', definition: 'Methods to model information about the world (rules, logic, graphs) so computers can reason with it.', hint: 'Logic, ontologies, knowledge graphs.' },
  { id: 'ml-1', topic: 'machine-learning', term: 'Machine Learning (ML)', definition: 'A subset of AI where systems learn patterns from data to make predictions or decisions without explicit programming.', hint: 'Learns from data.' },
  { id: 'ml-2', topic: 'machine-learning', term: 'Supervised Learning', definition: 'Learning from labeled examples to map inputs to outputs, e.g., classification and regression.', hint: 'Trained with labeled data.' },
  { id: 'ml-3', topic: 'machine-learning', term: 'Overfitting', definition: 'When a model memorizes training data patterns including noise, performing poorly on new data.', hint: 'High train accuracy, low test accuracy.' },
  { id: 'ml-4', topic: 'machine-learning', term: 'Bias–Variance Tradeoff', definition: 'Balancing underfitting (high bias) and overfitting (high variance) to achieve good generalization.', hint: 'Sweet spot between simplicity and complexity.' },
];

const grid = document.getElementById('flashcardGrid');
const topicSelect = document.getElementById('topicSelect');
const searchInput = document.getElementById('searchInput');
const showHints = document.getElementById('showHints');
const shuffleBtn = document.getElementById('shuffleBtn');

function shuffle(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

function render() {
  const topic = topicSelect.value; const q = searchInput.value.trim().toLowerCase();
  let cards = FLASHCARDS.filter(c => topic === 'all' || c.topic === topic);
  if (q) cards = cards.filter(c => c.term.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q));
  if (cards.length === 0) { grid.innerHTML = `<div class="empty">No cards match your filters.</div>`; return; }
  grid.innerHTML = cards.map(c => `
    <article class="flashcard" tabindex="0" data-id="${c.id}">
      <div class="card-inner">
        <div class="card-face front">
          <div class="tag ${c.topic}">${c.topic === 'ai-foundation' ? 'AI Foundations' : 'Machine Learning'}</div>
          <h3>${c.term}</h3>
          <p class="hint">${c.hint ?? ''}</p>
          <div class="cta"><i class="fas fa-rotate"></i> Tap to flip</div>
        </div>
        <div class="card-face back">
          <h4>Definition</h4>
          <p>${c.definition}</p>
          <div class="cta"><i class="fas fa-rotate"></i> Tap to flip</div>
        </div>
      </div>
    </article>`).join('');
  grid.querySelectorAll('.flashcard').forEach(card => {
    const toggle = () => card.classList.toggle('flipped');
    card.addEventListener('click', toggle);
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  grid.querySelectorAll('.hint').forEach(h => { h.style.display = showHints.checked ? 'block' : 'none'; });
}

topicSelect.addEventListener('change', render);
searchInput.addEventListener('input', render);
showHints.addEventListener('change', render);
shuffleBtn.addEventListener('click', () => { shuffle(FLASHCARDS); render(); });

render();

