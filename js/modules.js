// Mobile menu toggle handled by nav.js

// Hook up start buttons without navigation bubbling
document.querySelectorAll('.btn-module').forEach((button) => {
  button.addEventListener('click', function (e) {
    e.stopPropagation();
    console.log('Starting module...');
  });
});

// Animation safety net: if any cards remain in anim-init after load, reveal them
(function(){
  function fallbackReveal(){
    document.querySelectorAll('.module-card.anim-init').forEach((el)=>{
      el.classList.add('anim-in');
      el.classList.remove('anim-init');
    });
  }
  // Give IntersectionObserver time to run first
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=> setTimeout(fallbackReveal, 1200));
  } else {
    setTimeout(fallbackReveal, 1200);
  }
})();
