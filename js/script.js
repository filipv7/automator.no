/* ===================================================================
   Automator.no — vanilla JS
   Mobile nav, scroll reveal, and progressive-enhancement form submit.
=================================================================== */

(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.classList.toggle('is-open', !isOpen);
      mobileMenu.classList.toggle('is-open', !isOpen);
    });

    // Close mobile menu after tapping a link
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // No IntersectionObserver support: just show everything
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');

  if (form) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Basic native validation first
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var endpoint = form.getAttribute('action');
      var placeholderEndpoint = !endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1;

      if (placeholderEndpoint) {
        // No real backend configured yet — fail gracefully and explain,
        // rather than pretending the message was sent.
        setStatus(
          'Skjemaet er ikke koblet til en mottaker ennå. Bytt ut action-URL-en i index.html med din egen Formspree-/Getform-/Web3Forms-endepunkt.',
          'error'
        );
        return;
      }

      var formData = new FormData(form);
      setLoading(true);

      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          if (response.ok) {
            setStatus('Takk! Vi har mottatt forespørselen og svarer deg innen 1–2 virkedager.', 'success');
            form.reset();
          } else {
            return response.json().then(function (data) {
              throw new Error((data && data.error) || 'Noe gikk feil. Prøv igjen.');
            });
          }
        })
        .catch(function () {
          setStatus(
            'Vi fikk ikke sendt forespørselen. Prøv igjen, eller send oss en e-post direkte på hei@automator.no.',
            'error'
          );
        })
        .finally(function () {
          setLoading(false);
        });
    });

    function setStatus(message, state) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.setAttribute('data-state', state);
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      if (submitLabel) {
        submitLabel.textContent = isLoading ? 'Sender …' : 'Send forespørsel';
      }
    }
  }
})();
