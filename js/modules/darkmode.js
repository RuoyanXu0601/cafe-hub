export function setupDarkModeToggle() {
    const toggleButton = document.getElementById('darkModeToggle');
    if (!toggleButton) return;
    // Load mode
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      toggleButton.innerHTML = '☀️';
    }
  
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
  
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        toggleButton.innerHTML = '☀️';
      } else {
        localStorage.setItem('theme', 'light');
        toggleButton.innerHTML = '🌙';
      }
    });
  }
  