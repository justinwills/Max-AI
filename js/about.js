// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// Team member animation on page load
function animateTeamMembers() {
  const teamMembers = document.querySelectorAll('.team-member');
  teamMembers.forEach((member, index) => { setTimeout(() => { member.classList.add('animate-in'); }, index * 200); });
}
window.addEventListener('load', animateTeamMembers);

// Click micro-interaction
document.querySelectorAll('.team-member').forEach((member) => {
  member.addEventListener('click', function () { this.style.transform = 'scale(0.95)'; setTimeout(() => { this.style.transform = ''; }, 150); });
});

