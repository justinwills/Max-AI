// Mobile menu toggle handled by nav.js

// Hook up start buttons without navigation bubbling
document.querySelectorAll('.btn-module').forEach((button) => {
  button.addEventListener('click', function (e) {
    e.stopPropagation();
    console.log('Starting module...');
  });
});

// Ensure module cards visible (basic reveal)
document.querySelectorAll('.module-card').forEach((card, index) => {
  card.style.opacity = '1';
  card.style.transform = 'translateY(0)';
  console.log(`Module ${index + 1} is visible`);
});

