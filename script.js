(() => {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const cartCount = document.getElementById('cartCount');
  const yearEl = document.getElementById('year');
  const previewBox = document.querySelector('.preview-box');
  const previewImage = document.getElementById('previewImage');
  const fileInput = document.querySelector('.file-input');
  const sellForm = document.querySelector('.sell-form');
  const openLoginBtn = document.getElementById('openLogin');
  const closeLoginBtn = document.getElementById('closeLogin');
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const loginStatus = document.getElementById('loginStatus');
  const passwordInput = document.querySelector('input[name="loginPassword"]');
  const passwordToggle = document.querySelector('.password-toggle');
  const googleLoginBtn = document.getElementById('googleLogin');
  const providerButtons = document.querySelectorAll('[data-provider]');
  const phoneField = document.querySelector('.login-form__field--phone');
  const otpField = document.querySelector('.login-form__field--otp');
  const phoneInput = document.querySelector('input[name="phoneNumber"]');
  const otpInput = document.querySelector('input[name="otpCode"]');
  const rememberMeCheckbox = document.querySelector('input[name="rememberMe"]');
  const submitBtn = document.querySelector('.login-submit-btn');
  const searchInput = document.getElementById('searchInput');
  const searchShell = document.getElementById('searchShell');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClear = document.getElementById('searchClear');
  const searchSuggestions = document.querySelectorAll('[data-suggest]');

  const getCartCount = () => Number(localStorage.getItem('cartCount') || 0);
  const updateCartCount = () => {
    if (cartCount) {
      cartCount.textContent = String(getCartCount());
    }
  };
  const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true';

  const setLoginStatus = (message, isError = false) => {
    if (!loginStatus) return;
    loginStatus.textContent = message;
    loginStatus.style.color = isError ? '#fda4af' : '#22d3ee';
  };

  const openLogin = () => {
    if (!loginModal) return;
    loginModal.classList.add('is-open');
    loginModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  };

  const closeLogin = () => {
    if (!loginModal) return;
    loginModal.classList.remove('is-open');
    loginModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    setLoginStatus('');
  };

  const triggerLogin = (message = 'Inicia sesión para continuar.') => {
    setLoginStatus(message, true);
    openLogin();
  };

  const updateLoginButton = (loggedIn = false) => {
    if (!openLoginBtn) return;
    openLoginBtn.textContent = loggedIn ? 'Mi cuenta' : 'Iniciar sesión';
  };

  const setRememberedSession = (value) => {
    if (value) {
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.setItem('isLoggedIn', 'true');
      localStorage.removeItem('isLoggedIn');
    }
  };

  const setProviderMode = (provider = 'email') => {
    if (!loginForm || !submitBtn) return;
    loginForm.dataset.provider = provider;

    const showPhone = provider === 'whatsapp';
    const showOtp = provider === 'whatsapp' && !!otpInput?.value;
    const showPassword = provider === 'email';

    if (phoneField) phoneField.hidden = !showPhone;
    if (otpField) otpField.hidden = !showOtp;
    if (passwordInput) passwordInput.closest('.login-form__field--password').style.display = showPassword ? '' : 'none';

    if (provider === 'whatsapp') {
      submitBtn.textContent = 'Enviar código';
    } else if (provider === 'magic') {
      submitBtn.textContent = 'Enviar enlace';
    } else if (provider === 'apple' || provider === 'google') {
      submitBtn.textContent = 'Continuar';
    } else {
      submitBtn.textContent = 'Ingresar';
    }
  };

  const filterProducts = (query = '') => {
    const term = query.trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach((card) => {
      const text = card.textContent.toLowerCase();
      const match = !term || text.includes(term);
      card.style.display = match ? '' : 'none';
    });
  };

  const openSearchOverlay = () => {
    if (!searchOverlay || !searchShell) return;
    searchOverlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  };

  const closeSearchOverlay = () => {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  const syncSearchUI = () => {
    if (!searchInput || !searchShell) return;
    const hasValue = searchInput.value.trim().length > 0;
    searchShell.classList.toggle('is-active', hasValue);
    filterProducts(searchInput.value);
  };

  const toggleMenu = () => {
    if (!navMenu || !hamburger) return;
    const isOpen = navMenu.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (searchInput && searchShell && searchOverlay) {
    searchInput.addEventListener('focus', () => {
      syncSearchUI();
      if (!searchInput.value.trim()) {
        openSearchOverlay();
      }
    });

    searchInput.addEventListener('input', () => {
      syncSearchUI();
      if (!searchInput.value.trim()) {
        openSearchOverlay();
      }
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (!searchOverlay.contains(document.activeElement)) {
          closeSearchOverlay();
        }
      }, 120);
    });

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        syncSearchUI();
        closeSearchOverlay();
        searchInput.focus();
      });
    }

    searchSuggestions.forEach((suggestion) => {
      suggestion.addEventListener('click', () => {
        const value = suggestion.dataset.suggest || '';
        searchInput.value = value;
        syncSearchUI();
        closeSearchOverlay();
      });
    });

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        closeSearchOverlay();
      }
    });
  }

  if (closeLoginBtn && loginModal && loginForm) {
    const savedLogin = isLoggedIn();
    if (openLoginBtn) {
      updateLoginButton(savedLogin);
      openLoginBtn.addEventListener('click', () => {
        openLogin();
      });
    }

    closeLoginBtn.addEventListener('click', closeLogin);

    loginModal.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close-login')) {
        closeLogin();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && loginModal.classList.contains('is-open')) {
        closeLogin();
      }
    });

    if (passwordToggle && passwordInput) {
      passwordToggle.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        passwordToggle.textContent = isHidden ? '🙈' : '👁';
        passwordToggle.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
      });
    }

    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', () => {
        setRememberedSession(true);
        updateLoginButton(true);
        setLoginStatus('¡Ingresaste con Google correctamente!');
        loginForm.reset();
        closeLogin();
      });
    }

    providerButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const provider = button.dataset.provider || 'email';
        setProviderMode(provider);

        if (provider === 'apple') {
          setLoginStatus('Apple Login listo para usar en tu backend.');
        } else if (provider === 'whatsapp') {
          setLoginStatus('Ingresa tu número para recibir el código por WhatsApp.');
        } else if (provider === 'magic') {
          setLoginStatus('Te enviaremos un enlace mágico a tu correo.');
        }
      });
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const provider = loginForm.dataset.provider || 'email';
      const email = String(formData.get('loginEmail') || '').trim();
      const password = String(formData.get('loginPassword') || '').trim();
      const phone = String(formData.get('phoneNumber') || '').trim();
      const otp = String(formData.get('otpCode') || '').trim();
      const keepLoggedIn = rememberMeCheckbox ? rememberMeCheckbox.checked : true;

      if (provider === 'whatsapp') {
        if (!phone) {
          setLoginStatus('Ingresa tu número de WhatsApp.', true);
          return;
        }
        if (!otp) {
          if (otpField) otpField.hidden = false;
          setLoginStatus('Te enviamos un código por WhatsApp.');
          submitBtn.textContent = 'Confirmar código';
          return;
        }
        setRememberedSession(keepLoggedIn);
        updateLoginButton(true);
        setLoginStatus('¡Inicio de sesión correcto con WhatsApp!');
        loginForm.reset();
        setProviderMode('email');
        closeLogin();
        return;
      }

      if (provider === 'magic') {
        if (!email || !email.includes('@') || !email.includes('.')) {
          setLoginStatus('Ingresa un email válido para el enlace mágico.', true);
          return;
        }
        setLoginStatus('Revisa tu correo: te enviamos el enlace mágico.');
        return;
      }

      if (!email || !password) {
        setLoginStatus('Completa email y contraseña.', true);
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        setLoginStatus('El email no es válido.', true);
        return;
      }

      setRememberedSession(keepLoggedIn);
      updateLoginButton(true);
      setLoginStatus('¡Inicio de sesión correcto!');
      loginForm.reset();
      setProviderMode('email');
      closeLogin();
    });
  }

  document.querySelectorAll('.add-btn').forEach((button) => {
    const originalText = button.textContent;

    button.addEventListener('click', () => {
      const currentCount = getCartCount() + 1;
      localStorage.setItem('cartCount', String(currentCount));
      updateCartCount();
      button.textContent = '✓ Agregado';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1200);
    });
  });

  document.querySelectorAll('.checkout-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (!isLoggedIn()) {
        triggerLogin('Inicia sesión para completar tu compra.');
        return;
      }
      alert('¡Gracias por tu compra!');
    });
  });

  document.querySelectorAll('.publish-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (!isLoggedIn()) {
        triggerLogin('Inicia sesión para publicar tu producto.');
        return;
      }
      alert('¡Tu producto ya está listo para publicar!');
    });
  });

  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');

      document.querySelectorAll('.product-card').forEach((card) => {
        const category = card.dataset.category || '';
        const shouldShow = filter === 'all' || category === filter;
        card.style.display = shouldShow ? '' : 'none';
      });
    });
  });

  if (fileInput && previewBox && previewImage) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        previewImage.src = event.target.result;
        previewBox.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }

  if (sellForm) {
    sellForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isLoggedIn()) {
        triggerLogin('Inicia sesión para publicar tu producto.');
        return;
      }
      alert('¡Producto publicado correctamente!');
      sellForm.reset();
      if (previewBox && previewImage) {
        previewBox.style.display = 'none';
        previewImage.removeAttribute('src');
      }
    });
  }

  const dashboardSections = document.querySelectorAll('.dashboard-section');
  const dashboardNavButtons = document.querySelectorAll('[data-section]');

  if (dashboardSections.length && dashboardNavButtons.length) {
    dashboardNavButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const section = button.dataset.section;
        dashboardSections.forEach((panel) => {
          panel.classList.toggle('is-active', panel.dataset.panel === section);
        });
        dashboardNavButtons.forEach((navButton) => {
          navButton.classList.toggle('is-active', navButton.dataset.section === section);
        });
      });
    });
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  updateCartCount();
})();
