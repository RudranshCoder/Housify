const observerOptions = { threshold: 0.15 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-up, .animate-right').forEach((el, index) => {
  if (el.parentElement.classList.contains('row')) {
    el.style.animationDelay = `${(index % 3) * 0.2}s`;
  }
  observer.observe(el);
});

window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

window.addEventListener('load', () => {
  const hero = document.querySelector('.hero-container');
  if (hero) hero.classList.add('active');
});

document.querySelectorAll('.property-showcase .btn').forEach(btn => {
  btn.addEventListener('click', function () {
    if (this.classList.contains('active')) return;

    document.querySelectorAll('.property-showcase .btn').forEach(b => {
      b.classList.remove('active', 'btn-gold');
      b.classList.add('btn-outline-dark');
    });

    this.classList.add('active', 'btn-gold');
    this.classList.remove('btn-outline-dark');
  });
});

function toggleMoreProperties() {
  const extra = document.getElementById('extra-properties');
  const btn   = document.getElementById('view-more-btn');
  const isHidden = extra.style.display === 'none' || extra.style.display === '';

  if (isHidden) {
    extra.style.display = 'flex';
    extra.style.flexWrap = 'wrap';
    btn.innerHTML = 'Show Less <i class="fa-solid fa-chevron-up ms-2"></i>';
    extra.querySelectorAll('.animate-up').forEach((el, i) => {
      el.style.animationDelay = `${i * 0.1}s`;
      observer.observe(el);
    });
  } else {
    extra.style.display = 'none';
    btn.innerHTML = 'View More Properties <i class="fa-solid fa-chevron-down ms-2"></i>';
  }
}

function openAuthModal(tab) {
  const modal = document.getElementById('authModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  switchTab(tab || 'login');
  document.getElementById('auth-success').classList.add('hidden');
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('authModal')) {
    closeAuthModal();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAuthModal();
});

function switchTab(tab) {
  const loginForm  = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const tabLogin   = document.getElementById('tab-login');
  const tabSignup  = document.getElementById('tab-signup');
  const success    = document.getElementById('auth-success');

  success.classList.add('hidden');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
  }

  clearErrors(loginForm);
  clearErrors(signupForm);
}

function clearErrors(form) {
  form.querySelectorAll('input').forEach(inp => inp.classList.remove('error'));
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon  = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

const signupPw = document.getElementById('signup-password');
if (signupPw) {
  signupPw.addEventListener('input', () => {
    const bar = document.getElementById('pw-strength');
    const val = signupPw.value;
    let strength = 0;
    if (val.length >= 8)              strength++;
    if (/[A-Z]/.test(val))            strength++;
    if (/[0-9]/.test(val))            strength++;
    if (/[^A-Za-z0-9]/.test(val))    strength++;

    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#27ae60'];
    const widths  = ['25%', '50%', '75%', '100%'];

    if (val.length === 0) {
      bar.style.width = '0';
      bar.style.background = 'transparent';
    } else {
      bar.style.width   = widths[strength - 1] || '25%';
      bar.style.background = colors[strength - 1] || '#e74c3c';
    }
  });
}

function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  let valid = true;

  [email, password].forEach(inp => inp.classList.remove('error'));

  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    email.classList.add('error');
    valid = false;
  }
  if (!password.value || password.value.length < 6) {
    password.classList.add('error');
    valid = false;
  }

  if (!valid) return;

  showSuccess('Welcome back! You are now logged in.');
}

function handleSignup(e) {
  e.preventDefault();
  const name     = document.getElementById('signup-name');
  const email    = document.getElementById('signup-email');
  const password = document.getElementById('signup-password');
  const confirm  = document.getElementById('signup-confirm');
  const terms    = document.getElementById('terms');
  let valid = true;

  [name, email, password, confirm].forEach(inp => inp.classList.remove('error'));

  if (!name.value.trim()) { name.classList.add('error'); valid = false; }
  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) { email.classList.add('error'); valid = false; }
  if (!password.value || password.value.length < 6) { password.classList.add('error'); valid = false; }
  if (confirm.value !== password.value) { confirm.classList.add('error'); valid = false; }
  if (!terms.checked) { valid = false; }

  if (!valid) return;

  showSuccess('Account created! Welcome to Housify 🎉');
}

function showSuccess(message) {
  document.getElementById('form-login').classList.add('hidden');
  document.getElementById('form-signup').classList.add('hidden');
  const success = document.getElementById('auth-success');
  document.getElementById('auth-success-msg').textContent = message;
  success.classList.remove('hidden');

  setTimeout(() => {
    closeAuthModal();
    setTimeout(() => {
      switchTab('login');
      document.getElementById('form-login').reset();
      document.getElementById('form-signup').reset();
      const bar = document.getElementById('pw-strength');
      if (bar) { bar.style.width = '0'; bar.style.background = 'transparent'; }
    }, 400);
  }, 2200);
}
