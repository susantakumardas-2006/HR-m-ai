const shell = document.querySelector('.page-shell');
const toggle = document.querySelector('.role-toggle');
const roleButtons = document.querySelectorAll('.role-toggle button');
const emailInput = document.getElementById('email');
const emailValidation = document.getElementById('email-validation');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('password-toggle');
const form = document.getElementById('login-form');
const authCard = document.getElementById('auth-card');
const dashboardView = document.getElementById('dashboard-view');
const dashboardTitle = document.getElementById('dashboard-title');
const dashboardRole = document.getElementById('dashboard-role');
const dashboardMessage = document.getElementById('dashboard-message');
const dashboardStats = document.getElementById('dashboard-stats');
const dashboardActions = document.getElementById('dashboard-actions');
const logoutBtn = document.getElementById('logout-btn');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setMode(mode) {
  const isAdmin = mode === 'admin';
  shell.classList.remove('theme-employee', 'theme-admin');
  shell.classList.add(isAdmin ? 'theme-admin' : 'theme-employee');
  toggle.dataset.mode = mode;

  roleButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.role === mode);
  });
}

function showDashboard(mode, email) {
  const isAdmin = mode === 'admin';
  const displayName = email.split('@')[0] || 'there';
  const roleLabel = isAdmin ? 'Admin Workspace' : 'Employee Workspace';

  currentMode = mode;
  authCard.classList.add('is-hidden');
  dashboardView.classList.remove('is-hidden');
  setMode(mode);

  dashboardTitle.textContent = `${roleLabel} ready`;
  dashboardRole.textContent = isAdmin ? 'Admin overview' : 'Employee overview';
  dashboardMessage.textContent = `Welcome back, ${displayName}. Your ${isAdmin ? 'team' : 'day'} is already organized.`;

  const stats = isAdmin
    ? ['12 approvals pending', '4 new leave requests', 'Payroll review due today']
    : ['2 tasks due today', 'Attendance synced', 'Leave balance updated'];
  const actions = isAdmin
    ? ['Review pending approvals', 'Message the operations team', 'Publish payroll summary']
    : ['Open your task board', 'Check attendance history', 'Request time off'];

  dashboardStats.innerHTML = stats.map((item) => `<li>${item}</li>`).join('');
  dashboardActions.innerHTML = actions.map((item) => `<li>${item}</li>`).join('');
}

function resetView() {
  authCard.classList.remove('is-hidden');
  dashboardView.classList.add('is-hidden');
  form.reset();
  emailValidation.textContent = '';
  passwordInput.type = 'password';
  passwordToggle.setAttribute('aria-label', 'Show password');
  setMode('employee');
}

roleButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.role));
});

emailInput.addEventListener('input', () => {
  const isValid = emailRegex.test(emailInput.value.trim());
  emailInput.style.borderColor = isValid
    ? 'var(--input-border-valid)'
    : 'var(--input-border-invalid)';

  if (!emailInput.value.trim()) {
    emailValidation.textContent = '';
    return;
  }

  emailValidation.textContent = isValid
    ? ''
    : 'Please enter a valid email.';
});

passwordToggle.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();
  const isEmailValid = emailRegex.test(emailValue);

  if (!isEmailValid) {
    emailValidation.textContent = 'Please enter a valid email.';
    return;
  }

  if (!passwordValue) {
    emailValidation.textContent = 'Please enter your password.';
    return;
  }

  emailValidation.textContent = '';
  showDashboard(toggle.dataset.mode || 'employee', emailValue);
});

logoutBtn.addEventListener('click', resetView);

let currentMode = 'employee';
setMode(currentMode);
