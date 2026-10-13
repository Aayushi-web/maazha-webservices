/* ═══════════════════════════════════════════
   main.js — Maazha Web Services
   Step 2: Navbar interactions
═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Element refs ──
  const navbar       = document.getElementById('navbar');
  const hamburger    = document.getElementById('hamburger');
  const navRight     = document.getElementById('navRight');
  const navOverlay   = document.getElementById('navOverlay');
  const pricingBtn   = document.getElementById('pricingBtn');
  const pricingPanel = document.getElementById('pricingPanel');
  const pricingClose = document.getElementById('pricingClose');
  const gridBg       = document.getElementById('gridBg');

  // ── State ──
  let pricingOpen  = false;
  let activeDropdown = null; // { btn, menu }

  // ═══════════════════════════════════════
  // 1. NAVBAR SCROLL EFFECT
  // ═══════════════════════════════════════
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ═══════════════════════════════════════
  // 2. DROPDOWN LOGIC
  // ═══════════════════════════════════════
  function openDropdown(btn, menu) {
    if (activeDropdown && activeDropdown.menu !== menu) {
      closeDropdown(activeDropdown.btn, activeDropdown.menu);
    }
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('active');
    menu.classList.add('open');
    activeDropdown = { btn, menu };
  }

  function closeDropdown(btn, menu) {
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('active');
    menu.classList.remove('open');
    if (activeDropdown && activeDropdown.menu === menu) {
      activeDropdown = null;
    }
  }

  function toggleDropdown(btn, menu) {
    if (menu.classList.contains('open')) {
      closeDropdown(btn, menu);
    } else {
      openDropdown(btn, menu);
    }
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (activeDropdown) {
      const { btn, menu } = activeDropdown;
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        closeDropdown(btn, menu);
      }
    }
  });

  // Close dropdowns on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (activeDropdown) closeDropdown(activeDropdown.btn, activeDropdown.menu);
      if (pricingOpen) closePricing();
      if (mobileMenuOpen) closeMobileMenu();
    }
  });

  // ═══════════════════════════════════════
  // 3. PRICING PANEL
  // ═══════════════════════════════════════
  function openPricing() {
    pricingPanel.classList.add('open');
    pricingPanel.setAttribute('aria-hidden', 'false');
    pricingBtn.classList.add('active');
    navOverlay.classList.add('active');
    pricingOpen = true;
    // Close any open dropdown
    if (activeDropdown) closeDropdown(activeDropdown.btn, activeDropdown.menu);
  }

  function closePricing() {
    pricingPanel.classList.remove('open');
    pricingPanel.setAttribute('aria-hidden', 'true');
    if (pricingBtn) pricingBtn.classList.remove('active');
    navOverlay.classList.remove('active');
    pricingOpen = false;
  }

  if (pricingBtn) {
    pricingBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pricingOpen) {
        closePricing();
      } else {
        openPricing();
      }
    });
  }

  pricingClose.addEventListener('click', closePricing);

  navOverlay.addEventListener('click', () => {
    closePricing();
    closeMobileMenu();
  });

  // ═══════════════════════════════════════
  // 4. MOBILE MENU (HAMBURGER)
  // ═══════════════════════════════════════
  let mobileMenuOpen = false;

  function openMobileMenu() {
    navRight.classList.add('open');
    hamburger.classList.add('open');
    navOverlay.classList.add('active');
    mobileMenuOpen = true;
  }

  function closeMobileMenu() {
    navRight.classList.remove('open');
    hamburger.classList.remove('open');
    if (!pricingOpen) navOverlay.classList.remove('active');
    mobileMenuOpen = false;
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // ═══════════════════════════════════════
  // 5. INTERACTIVE GRID SPOTLIGHT
  // ═══════════════════════════════════════
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      gridBg.style.setProperty('--mx', e.clientX + 'px');
      gridBg.style.setProperty('--my', e.clientY + 'px');
    });
  }, { passive: true });

  // Reset spotlight when mouse leaves window
  document.addEventListener('mouseleave', () => {
    gridBg.style.setProperty('--mx', '-999px');
    gridBg.style.setProperty('--my', '-999px');
  });

  // ═══════════════════════════════════════
  // 6. LOGO HOVER GLOW PULSE
  // ═══════════════════════════════════════
  const logoIcon = document.querySelector('.logo-icon');
  let pulseInterval;

  document.querySelector('.nav-logo').addEventListener('mouseenter', () => {
    pulseInterval = setInterval(() => {
      logoIcon.style.filter = 'drop-shadow(0 0 16px rgba(0,245,255,0.9))';
      setTimeout(() => {
        logoIcon.style.filter = 'drop-shadow(0 0 8px rgba(79,142,247,0.5))';
      }, 400);
    }, 800);
  });

  document.querySelector('.nav-logo').addEventListener('mouseleave', () => {
    clearInterval(pulseInterval);
    logoIcon.style.filter = 'drop-shadow(0 0 8px rgba(79,142,247,0.5))';
  });

  // ═══════════════════════════════════════
  // 7. SCROLL REVEAL
  // ═══════════════════════════════════════
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));

  // Trigger hero elements immediately (already in view)
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);

  const viewMoreClientsBtn = document.getElementById('viewMoreClients');
  const extraClientCards = document.querySelectorAll('.extra-client-card');
  const viewMoreLabel = viewMoreClientsBtn?.querySelector('.testimonial-view-more-label');

  viewMoreClientsBtn?.addEventListener('click', () => {
    const isExpanded = viewMoreClientsBtn.getAttribute('aria-expanded') === 'true';
    extraClientCards.forEach((card) => { card.hidden = isExpanded; });
    viewMoreClientsBtn.setAttribute('aria-expanded', String(!isExpanded));
    if (viewMoreLabel) viewMoreLabel.textContent = isExpanded ? 'View More' : 'Show Less';
  });

})();

