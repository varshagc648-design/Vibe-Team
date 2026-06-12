const screens = document.querySelectorAll('.screen');
const progressDots = document.querySelectorAll('.progress-dot');
const screenTitle = document.getElementById('screenTitle');
const loginForm = document.getElementById('loginForm');
const profileForm = document.getElementById('profileForm');
const confirmationHeading = document.getElementById('confirmationHeading');
const confirmationMessage = document.getElementById('confirmationMessage');
const viewEventsBtn = document.getElementById('viewEventsBtn');
const startOverBtn = document.getElementById('startOverBtn');

const appState = {
  user: {
    email: '',
    name: '',
    department: '',
    birthday: ''
  }
};

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });

  const activeScreen = document.getElementById(screenId);
  screenTitle.textContent = activeScreen.dataset.title;

  const step = Number(activeScreen.dataset.step);
  progressDots.forEach((dot, index) => {
    dot.classList.toggle('active', index < step);
  });
}

function showConfirmation(title, message) {
  confirmationHeading.textContent = title;
  confirmationMessage.textContent = message;
  showScreen('confirmationScreen');
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  appState.user.email = document.getElementById('email').value.trim();
  showScreen('profileScreen');
});

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  appState.user.name = document.getElementById('name').value.trim();
  appState.user.department = document.getElementById('department').value.trim();
  appState.user.birthday = document.getElementById('birthday').value;

  try {
    await fetch('http://127.0.0.1:8000/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        full_name: appState.user.name,
        department: appState.user.department,
        birthday: appState.user.birthday
      })
    });

    const firstName = appState.user.name.split(' ')[0] || 'there';

    showConfirmation(
      'Profile saved!',
      `${firstName}, your profile has been saved to Team Vibe successfully.`
    );

  } catch (error) {
    alert('Could not save profile.');
    console.error(error);
  }
});
document.querySelectorAll('[data-go-to]').forEach((button) => {
  button.addEventListener('click', () => {
    showScreen(button.dataset.goTo);
  });
});

document.querySelectorAll('.join-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const selectedEvent = button.dataset.event;
    const attendee = appState.user.name || appState.user.email || 'You';

    showConfirmation(
      'Event joined!',
      `${attendee} successfully joined ${selectedEvent}. A reminder is ready in your Team Vibe schedule.`
    );
  });
});

viewEventsBtn.addEventListener('click', () => {
  if (appState.user.name || appState.user.email) {
    showScreen('eventScreen');
  } else {
    showScreen('loginScreen');
  }
});

startOverBtn.addEventListener('click', () => {
  loginForm.reset();
  profileForm.reset();
  appState.user = {
    email: '',
    name: '',
    department: '',
    birthday: ''
  };
  showScreen('loginScreen');
});

showScreen('loginScreen');
