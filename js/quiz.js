// Quiz page logic (migrated from inline)

// Profile nav handled by nav.js

// Questions dataset
const QUESTIONS = [
  { id: 'ai-1', topic: 'ai-foundation', question: 'Which statement best defines AI?', options: ['Only faster hardware','Systems that can perceive, reason, learn and act','Only data compression','Only visual design'], answer: 1, explain: 'AI involves perception, reasoning, learning and action.' },
  { id: 'ai-2', topic: 'ai-foundation', question: 'What does the Turing Test measure?', options: ['Network latency','Indistinguishability from human responses','CPU efficiency','Image similarity'], answer: 1, explain: 'It measures whether a machine can imitate human responses.' },
  { id: 'ml-1', topic: 'machine-learning', question: 'Which is supervised learning?', options: ['Clustering','Classification','Dimensionality reduction','Compression'], answer: 1, explain: 'Classification is supervised with labeled data.' },
  { id: 'ml-2', topic: 'machine-learning', question: 'Overfitting means...', options: ['Model generalizes well','Model learns noise in training data','Model underfits','Model is unbiased'], answer: 1, explain: 'Overfitting memorizes noise; poor generalization.' },
  { id: 'ai-5', topic: 'ai-foundation', question: 'Which best describes heuristics in search?', options: ['Random guessing','Guidance approximating distance to goal','Exact optimal cost','Guaranteed shortest path only'], answer: 1, explain: 'Heuristics estimate closeness to goal.' },
];

const topicSelect = document.getElementById('topicSelect');
const countSelect = document.getElementById('countSelect');
const startBtn = document.getElementById('startBtn');
const quizCard = document.getElementById('quizCard');
const resultCard = document.getElementById('resultCard');
const reviewList = document.getElementById('reviewList');

const questionText = document.getElementById('questionText');
const questionTag = document.getElementById('questionTag');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const qCounter = document.getElementById('questionCounter');
const scoreCounter = document.getElementById('scoreValue');
const progressBar = document.getElementById('progressBar');

const statScore = document.getElementById('statScore');
const statTotal = document.getElementById('statTotal');
const statPercent = document.getElementById('statPercent');
const resultSummary = document.getElementById('resultSummary');
const reviewBtn = document.getElementById('reviewBtn');
const retakeBtn = document.getElementById('retakeBtn');

let queue = []; let index = 0; let score = 0; let answers = [];

function shuffle(array){ for (let i=array.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [array[i],array[j]]=[array[j],array[i]];} return array; }

function prepareQuiz(){ const topic=topicSelect.value; const count=parseInt(countSelect.value,10); let pool=QUESTIONS.slice(); if (topic!=='mixed') pool=pool.filter(q=>q.topic===topic); shuffle(pool); queue=pool.slice(0, Math.min(count, pool.length)); index=0; score=0; answers=[]; scoreCounter.textContent='0'; updateProgress(); }

function updateProgress(){ const total=queue.length || parseInt(countSelect.value,10); qCounter.textContent = `Question ${Math.min(index+1,total)}/${total}`; const pct=Math.min(100, Math.round((index/total)*100)); progressBar.style.width = pct + '%'; }

function renderQuestion(){ const q=queue[index]; if (!q) return; questionText.textContent=q.question; questionTag.textContent = q.topic==='ai-foundation' ? 'AI Foundations' : 'Machine Learning'; optionsEl.innerHTML=''; nextBtn.disabled=true; q.options.forEach((opt,i)=>{ const btn=document.createElement('button'); btn.className='option-btn'; btn.setAttribute('role','listitem'); btn.setAttribute('aria-pressed','false'); btn.textContent=opt; btn.addEventListener('click', ()=>handleAnswer(i)); optionsEl.appendChild(btn); }); }

function handleAnswer(choice){ const q=queue[index]; const correct=q.answer; const children=Array.from(optionsEl.children); children.forEach((el,i)=>{ el.disabled=true; if (i===correct) el.classList.add('correct'); if (i===choice && i!==correct) el.classList.add('wrong'); }); const isCorrect=choice===correct; if (isCorrect){ score+=1; scoreCounter.textContent=String(score);} answers.push({ id:q.id, question:q.question, topic:q.topic, choice, correct, options:q.options, explain:q.explain, isCorrect }); nextBtn.disabled=false; nextBtn.innerHTML = index===queue.length-1 ? 'Finish <i class="fas fa-flag-checkered"></i>' : 'Next <i class="fas fa-arrow-right"></i>'; }

function showResults(){
  quizCard.hidden=true; resultCard.hidden=false;
  const total=queue.length; const percent=Math.round((score/total)*100);
  statScore.textContent=String(score); statTotal.textContent=String(total); statPercent.textContent=percent+'%';
  let msg='Nice work! Keep practicing to master the concepts.';
  if (percent===100) msg='Perfect score! You\'re a star!';
  else if (percent>=80) msg='Great job! Strong understanding.';
  else if (percent<50) msg='Good start—review and try again!';
  resultSummary.textContent=msg; reviewList.hidden=true;

  // Persist attempt for average score on home dashboard (per-user scope)
  try {
    function userScope(){
      try{ const u = JSON.parse(localStorage.getItem('currentUser')||'null'); const id = u?.id || u?.email || u?.username; return id ? String(id) : 'guest'; }catch{ return 'guest'; }
    }
    const key = 'quiz_attempts_v1::' + userScope();
    let arr; try { arr = JSON.parse(localStorage.getItem(key)||'[]'); } catch { arr = []; }
    if (!Array.isArray(arr)) arr = [];
    arr.push({ ts: Date.now(), percent });
    // keep last 50 attempts to bound storage
    if (arr.length > 50) arr = arr.slice(arr.length - 50);
    localStorage.setItem(key, JSON.stringify(arr));
  } catch {}
}

function renderReview(){ reviewList.innerHTML = answers.map((a,idx)=>{ const topic=a.topic==='ai-foundation' ? 'AI Foundations' : 'Machine Learning'; return `
  <div class="review-item ${a.isCorrect ? 'ok' : 'bad'}">
    <div class="review-top"><span class="num">${idx+1}.</span><span class="tag">${topic}</span></div>
    <div class="q">${a.question}</div>
    <div class="a">Your answer: <strong>${a.options[a.choice] ?? '—'}</strong></div>
    <div class="c">Correct answer: <strong>${a.options[a.correct]}</strong></div>
    <div class="explain">${a.explain || ''}</div>
  </div>`; }).join(''); }

startBtn.addEventListener('click', ()=>{ prepareQuiz(); document.getElementById('resultCard').hidden = true; quizCard.hidden=false; renderQuestion(); });
nextBtn.addEventListener('click', ()=>{ if (index < queue.length-1){ index+=1; updateProgress(); renderQuestion(); } else { updateProgress(); showResults(); } });
reviewBtn.addEventListener('click', ()=>{ const hidden=reviewList.hidden; if (hidden) renderReview(); reviewList.hidden = !hidden; });
retakeBtn.addEventListener('click', ()=>{ resultCard.hidden=true; quizCard.hidden=true; });
