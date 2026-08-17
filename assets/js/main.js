/* Ambition Medical Aesthetics — interactions
   Vanilla JS. No dependencies. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.header');
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('.header__burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mnav a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Split headline words for masked reveal ---------- */
  document.querySelectorAll('.words').forEach(function (el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3 && child.textContent.trim()) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'w';
            var inner = document.createElement('span');
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
    // stagger
    var i = 0;
    el.querySelectorAll('.w > span').forEach(function (s) {
      s.style.transitionDelay = (0.08 + i * 0.055) + 's';
      i++;
    });
  });

  /* ---------- Split headline into letters (Venetian-style cascade) ---------- */
  document.querySelectorAll('.letters').forEach(function (el) {
    var idx = 0;
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3 && child.textContent) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (word) {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(word)); return; }
            // Group each word's letters so the browser only ever breaks lines at real spaces.
            var lw = document.createElement('span');
            lw.className = 'lw';
            word.split('').forEach(function (ch) {
              var c = document.createElement('span');
              c.className = 'c';
              c.textContent = ch;
              c.style.transitionDelay = (0.1 + idx * 0.032 + (idx % 4) * 0.018) + 's';
              idx++;
              lw.appendChild(c);
            });
            frag.appendChild(lw);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
  });

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.rv, .img-rv, .words, .letters').forEach(function (el) {
    io.observe(el);
  });

  /* ---------- Counters ---------- */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduced) { el.textContent = target + suffix; return; }
      var start = null;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 1400, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ---------- Subtle parallax ---------- */
  var plx = Array.prototype.slice.call(document.querySelectorAll('.plx'));
  if (plx.length && !reduced) {
    var raf = null;
    function parallax() {
      raf = null;
      var vh = window.innerHeight;
      plx.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5-ish
        var depth = parseFloat(el.getAttribute('data-depth') || '18');
        el.style.transform = 'translateY(' + (progress * depth).toFixed(2) + 'px)';
      });
    }
    window.addEventListener('scroll', function () {
      if (!raf) raf = requestAnimationFrame(parallax);
    }, { passive: true });
    parallax();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      // close others in same group
      var group = item.closest('.faq') || document;
      group.querySelectorAll('.faq__item.is-open').forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq__a').style.maxHeight = null;
        other.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Before / After drag-reveal ---------- */
  document.querySelectorAll('.bareveal').forEach(function (el) {
    var after = el.querySelector('.bareveal__after');
    var line = el.querySelector('.bareveal__line');
    var handle = el.querySelector('.bareveal__handle');
    var dragging = false;
    var userInteracted = false;

    function setPct(pct) {
      pct = Math.max(2, Math.min(98, pct));
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      line.style.left = pct + '%';
      handle.style.left = pct + '%';
    }
    function pctFromEvent(clientX) {
      var r = el.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    }
    function onMove(clientX) { setPct(pctFromEvent(clientX)); }

    el.addEventListener('pointerdown', function (e) {
      dragging = true;
      userInteracted = true; // stop the auto-preview sweep from fighting the user's drag
      el.setPointerCapture(e.pointerId);
      onMove(e.clientX);
    });
    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      onMove(e.clientX);
    });
    el.addEventListener('pointerup', function () { dragging = false; });
    el.addEventListener('pointercancel', function () { dragging = false; });

    // Gentle auto-preview: sweep once when it first scrolls into view (cancels immediately if the user touches it)
    var reduced2 = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e2) {
        if (!e2.isIntersecting) return;
        bio.unobserve(el);
        if (reduced2 || userInteracted) { if (!userInteracted) setPct(50); return; }
        var start = null;
        function tick(ts) {
          if (userInteracted) return; // user grabbed it — hand control over immediately
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1600, 1);
          var eased = 0.5 - 0.5 * Math.cos(p * Math.PI); // ease in-out to 65%, settles near center
          setPct(18 + eased * (65 - 18));
          if (p < 1) requestAnimationFrame(tick);
          else if (!userInteracted) setTimeout(function () { if (!userInteracted) setPct(50); }, 250);
        }
        setPct(18);
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    bio.observe(el);
  });

  /* ---------- Carousels (services, reviews) ---------- */
  function glide(track, delta) {
    var start = track.scrollLeft;
    var max = track.scrollWidth - track.clientWidth;
    var target = Math.max(0, Math.min(max, start + delta));
    var t0 = null;
    track.style.scrollSnapType = 'none';
    if (document.hidden || reduced) {
      track.scrollLeft = target;
      track.style.scrollSnapType = '';
      return;
    }
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 500, 1);
      var e = 1 - Math.pow(1 - p, 3);
      track.scrollLeft = start + (target - start) * e;
      if (p < 1) { requestAnimationFrame(tick); }
      else { track.style.scrollSnapType = ''; }
    }
    requestAnimationFrame(tick);
  }
  document.querySelectorAll('.car').forEach(function (car) {
    var track = car.querySelector('.car__track');
    if (!track) return;
    car.querySelectorAll('.car__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = track.querySelector('.car__card, .rev__card');
        var step = card ? card.getBoundingClientRect().width + 18 : track.clientWidth * 0.8;
        glide(track, btn.classList.contains('car__btn--prev') ? -step : step);
      });
    });
  });

  /* ---------- Current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Active nav link ---------- */
  var path = location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.header__nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    var clean = href.replace(/^\.\.?\//, '/').replace(/index\.html$/, '');
    if (clean !== '/' && path.indexOf(clean.replace('.html', '')) !== -1) {
      a.classList.add('is-active');
    }
  });

  /* ---------- Concierge FAQ widget ---------- */
  (function () {
    var base = location.pathname.indexOf('/blog/') !== -1 ? '../' : '';

    // Each node: a short summary answer (the "first answer"), then chips —
    // one of which always deep-links to the real page for full detail.
    var TREE = {
      root: {
        bot: "Hi, I'm the Ambition Concierge. Quick answers to common questions — what can I help with?",
        chips: [
          { label: 'Hours & location', to: 'hours' },
          { label: 'Our treatments', to: 'treatments' },
          { label: 'Current offers', to: 'offers' },
          { label: 'Pricing', to: 'pricing' },
          { label: 'How do I book?', to: 'booking' }
        ]
      },
      hours: {
        bot: "Campbell studio: Monday–Saturday, 10:30 AM–6:00 PM, at 436 Marathon Dr, Campbell, CA 95008. Our Milpitas studio (236 N Abel St) is opening soon.",
        chips: [
          { label: 'Get directions', href: 'https://maps.google.com/?q=436+Marathon+Dr,+Campbell,+CA+95008', external: true },
          { label: 'Contact page →', href: base + 'contact.html' },
          { label: '← Back', to: 'root' }
        ]
      },
      treatments: {
        bot: "Sixteen treatments across four categories: Facials & Skin, Body Sculpting, Injectables, and Wellness & PRP — every plan customized to you.",
        chips: [
          { label: 'See the full menu →', href: base + 'services.html' },
          { label: '← Back', to: 'root' }
        ]
      },
      offers: {
        bot: "This season: HydroGlow Facial with free LED therapy, CoolSculpting + EMSculpting for $99, Lymphatic Drainage Massage for $119, and PRP Scalp Therapy for $299.",
        chips: [
          { label: 'View all offers →', href: base + 'offers.html' },
          { label: '← Back', to: 'root' }
        ]
      },
      pricing: {
        bot: "Pricing depends on your treatment plan — every visit starts with a consultation so we can recommend exactly what's right for you, with no surprises.",
        chips: [
          { label: 'See current offers', to: 'offers' },
          { label: 'Book a consultation →', href: base + 'contact.html' },
          { label: '← Back', to: 'root' }
        ]
      },
      booking: {
        bot: "Three easy ways: book online in under a minute, call (669) 336-9814, or email ambitionmedicalaesthetics@gmail.com. We reply quickly, Monday–Saturday.",
        chips: [
          { label: 'Book online →', href: base + 'contact.html' },
          { label: '← Back', to: 'root' }
        ]
      }
    };

    var fab = document.createElement('button');
    fab.className = 'concierge-fab';
    fab.setAttribute('aria-label', 'Open quick answers');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML =
      '<span class="concierge-dot" aria-hidden="true"></span>' +
      '<svg class="icon-chat" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8c-1.1 0-2.1-.2-3-.6L5 20l1.1-3.8C4.8 15 4 13.6 4 12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>' +
      '<svg class="icon-close" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

    var panel = document.createElement('div');
    panel.className = 'concierge-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Ambition Concierge quick answers');
    panel.innerHTML =
      '<div class="concierge-head">' +
        '<div class="concierge-head__mark"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1c-2 2-2 4 0 6s2 4 0 6" stroke="#f8f4ed" stroke-width="1.3"/></svg></div>' +
        '<div><h3 class="serif">Ambition Concierge</h3><p>Quick answers &middot; not live chat</p></div>' +
      '</div>' +
      '<div class="concierge-body" tabindex="-1"></div>' +
      '<div class="concierge-foot">' +
        '<a href="' + base + 'contact.html">Reserve</a>' +
        '<a href="tel:+16693369814">Call Us</a>' +
      '</div>' +
      '<p class="concierge-note">Prefer a real person? Call (669) 336-9814 anytime.</p>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var body = panel.querySelector('.concierge-body');

    function renderNode(key, userLabel) {
      var node = TREE[key];
      if (!node) return;
      if (userLabel) {
        var um = document.createElement('div');
        um.className = 'cmsg cmsg--user';
        um.textContent = userLabel;
        body.appendChild(um);
      }
      var bm = document.createElement('div');
      bm.className = 'cmsg cmsg--bot';
      bm.textContent = node.bot;
      body.appendChild(bm);

      var chipsWrap = document.createElement('div');
      chipsWrap.className = 'cchips';
      node.chips.forEach(function (c) {
        var el;
        if (c.href) {
          el = document.createElement('a');
          el.href = c.href;
          if (c.external) { el.target = '_blank'; el.rel = 'noopener'; }
        } else {
          el = document.createElement('button');
          el.type = 'button';
          el.addEventListener('click', function (e) {
            e.stopPropagation(); // chipsWrap.remove() below detaches this button from the DOM
            chipsWrap.remove();  // before the click finishes bubbling — without stopping it here,
            renderNode(c.to, c.label); // the document-level "click outside closes panel" listener
          });                    // would see a detached e.target and treat this as an outside click.
        }
        el.className = 'cchip';
        el.textContent = c.label;
        chipsWrap.appendChild(el);
      });
      body.appendChild(chipsWrap);
      body.scrollTop = body.scrollHeight;
    }

    var started = false;
    function openPanel() {
      document.body.classList.add('concierge-open');
      fab.setAttribute('aria-expanded', 'true');
      fab.querySelector('.concierge-dot').classList.add('is-seen');
      if (!started) { started = true; renderNode('root'); }
    }
    function closePanel() {
      document.body.classList.remove('concierge-open');
      fab.setAttribute('aria-expanded', 'false');
    }
    fab.addEventListener('click', function () {
      if (document.body.classList.contains('concierge-open')) closePanel();
      else openPanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('concierge-open')) closePanel();
    });
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('concierge-open')) return;
      if (panel.contains(e.target) || fab.contains(e.target)) return;
      closePanel();
    });
  })();

  /* ---------- Cookie consent ---------- */
  (function () {
    var KEY = 'ambition-cookie-consent';
    if (localStorage.getItem(KEY)) return; // already chosen

    var base = location.pathname.indexOf('/blog/') !== -1 ? '../' : '';
    var bar = document.createElement('div');
    bar.className = 'cookiebar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie preferences');
    bar.innerHTML =
      '<p class="cookiebar__text">We use cookies to improve your experience. See our <a href="' + base + 'privacy.html">Privacy Policy</a>.</p>' +
      '<div class="cookiebar__actions">' +
        '<button type="button" class="cookiebar__btn cookiebar__btn--reject">Reject All</button>' +
        '<button type="button" class="cookiebar__btn cookiebar__btn--accept">Accept All</button>' +
      '</div>';
    document.body.appendChild(bar);

    function choose(value) {
      localStorage.setItem(KEY, value);
      document.body.classList.remove('cookiebar-visible');
      bar.classList.remove('is-visible');
      setTimeout(function () { bar.remove(); }, 500);
    }
    bar.querySelector('.cookiebar__btn--reject').addEventListener('click', function () { choose('rejected'); });
    bar.querySelector('.cookiebar__btn--accept').addEventListener('click', function () { choose('accepted'); });

    requestAnimationFrame(function () {
      document.body.classList.add('cookiebar-visible');
      bar.classList.add('is-visible');
    });
  })();
})();
