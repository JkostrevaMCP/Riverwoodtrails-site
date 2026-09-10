// Riverwood Trails HOA — shared site script
(function () {
  const $ = (id) => document.getElementById(id);
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase() || 'index.html';

  // ---- PRELOADER ----
  const pre = document.querySelector('.preloader');
  if (pre) {
    const finish = () => pre.classList.add('done');
    const t = setTimeout(finish, 1250);
    window.addEventListener('load', () => setTimeout(finish, 900));
    setTimeout(finish, 3000);
  }

  // ---- HEADER / FAB on scroll ----
  const header = document.querySelector('header');
  const fab = document.querySelector('.fab');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (fab) fab.classList.toggle('show', y > 400);
    if (parallax) parallax.style.transform = 'translateY(' + ((y - parallaxTop) * 0.12) + 'px)';
  };
  const parallax = document.querySelector('.dues-band .bg');
  let parallaxTop = 0;
  if (parallax) {
    const band = parallax.closest('.dues-band');
    const setTop = () => { parallaxTop = band.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2; };
    setTop(); window.addEventListener('resize', setTop);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---- MOBILE MENU ----
  const menuToggle = $('menuToggle'), navLinks = $('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open'); menuToggle.classList.remove('open');
    }));
  }
  document.querySelectorAll('.dd > button').forEach(b => b.addEventListener('click', () => b.parentElement.classList.toggle('open')));

  // ---- REVEAL / STAGGER ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));

  // ---- COUNTERS ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = parseInt(el.dataset.count, 10), dur = 1400, start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / dur), ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * ease);
          if (p < 1) requestAnimationFrame(step);
        };
        setTimeout(() => requestAnimationFrame(step), 900);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  // ---- SITE SEARCH ----
  const searchIndex = [
    { title: "HOA News / Announcements", tag: "Section", href: "index.html#announcements", keywords: "announcements news updates board notices" },
    { title: "HOA Dues", tag: "Section", href: "index.html#dues", keywords: "dues payment 350 annual assessment invoice insurance lawn care reserve landscape" },
    { title: "Community Calendar", tag: "Page", href: "calendar.html", keywords: "calendar meetings annual meeting quarterly board meeting minutes" },
    { title: "Board of Directors", tag: "Page", href: "board.html#board", keywords: "board directors president treasurer secretary tim macy amanda wells daniel kostreva" },
    { title: "Design Review Board", tag: "Page", href: "board.html#design-review-board", keywords: "design review board drb approval application architectural" },
    { title: "Grounds Committee", tag: "Page", href: "board.html#grounds-committee", keywords: "grounds committee volunteer landscaping lawn care quotes" },
    { title: "Neighborhood Gallery", tag: "Section", href: "index.html#gallery", keywords: "gallery photos pictures neighborhood" },
    { title: "About Riverwood Trails", tag: "Section", href: "index.html#about", keywords: "about history real estate realtor selling home" },
    { title: "Contact the Board", tag: "Section", href: "index.html#contact", keywords: "contact email message form" },
    { title: "All FAQs", tag: "Page", href: "faq.html", keywords: "faq questions answers rules guidelines" },
    { title: "Covenants (Full Declaration)", tag: "Document", href: "documents/covenants.pdf", keywords: "covenants declaration restrictions easements articles of incorporation code of regulations design review board bylaws", external: true },
    { title: "HOA Policy Clarification", tag: "Document", href: "documents/hoa-policy-clarification.pdf", keywords: "policy clarification signs trash fencing mailbox pools shingle siding shutters fees liens", external: true },
    { title: "Garbage Can Storage Policy", tag: "Document", href: "documents/garbage-can-storage-policy.pdf", keywords: "garbage can trash storage screen enclosure policy violations fine", external: true },
    { title: "Design Review Application", tag: "Document", href: "https://38b33fdc-2fbb-45bb-8d5b-db62f2eab4e1.filesusr.com/ugd/629c19_28e2f6ca15c94cca86528ea7b258446a.pdf", keywords: "design review application form approval submit", external: true },
    { title: "New Resident Welcome Guide", tag: "Document", href: "documents/new-resident-welcome.pdf", keywords: "new resident welcome guide moving in trash day new to neighborhood", external: true },
    { title: "When are HOA dues to be paid?", tag: "FAQ", href: "faq.html#faq-1", keywords: "dues due date april 350 payment" },
    { title: "Can I install a fence? If so, what kind is allowed?", tag: "FAQ", href: "faq.html#faq-2", keywords: "fence fencing split rail" },
    { title: "Can I paint my trim, door, and shutters a different color?", tag: "FAQ", href: "faq.html#faq-3", keywords: "paint trim door shutters color" },
    { title: "Can I add on to my house or deck?", tag: "FAQ", href: "faq.html#faq-4", keywords: "addition deck add on" },
    { title: "Can I change the color of my roof or siding?", tag: "FAQ", href: "faq.html#faq-5", keywords: "roof siding color shingle" },
    { title: "Can I make my landscaping different?", tag: "FAQ", href: "faq.html#faq-6", keywords: "landscaping landscape yard" },
    { title: "Can I install a swimming pool? If so, what kind?", tag: "FAQ", href: "faq.html#faq-7", keywords: "pool swimming pool above ground in ground hot tub" },
    { title: "Can I extend the width of my driveway?", tag: "FAQ", href: "faq.html#faq-8", keywords: "driveway widen extend" },
    { title: "What's the process for getting approval for a home or yard change?", tag: "FAQ", href: "faq.html#faq-9", keywords: "approval process design review application submit" },
    { title: "What are the requirements for my mailbox?", tag: "FAQ", href: "faq.html#faq-10", keywords: "mailbox post color white loggia" },
    { title: "Where am I allowed to store my garbage cans?", tag: "FAQ", href: "faq.html#faq-11", keywords: "garbage can storage location trash" },
    { title: "What are the rules for a garbage can screen or enclosure?", tag: "FAQ", href: "faq.html#faq-12", keywords: "garbage can screen enclosure dimensions materials" },
    { title: "What happens if my garbage cans or screen aren't in compliance?", tag: "FAQ", href: "faq.html#faq-13", keywords: "garbage can violation fine compliance" },
    { title: "Can I park a truck, RV, boat, or trailer at my house?", tag: "FAQ", href: "faq.html#faq-14", keywords: "truck rv boat trailer vehicle parking pickup" },
    { title: "Can I put up a satellite dish or antenna?", tag: "FAQ", href: "faq.html#faq-15", keywords: "satellite dish antenna" },
    { title: "Can I run a business out of my home?", tag: "FAQ", href: "faq.html#faq-16", keywords: "business home occupation" },
    { title: "Are there restrictions on yard signs?", tag: "FAQ", href: "faq.html#faq-17", keywords: "signs yard sign real estate" },
    { title: "What happens if I don't pay my dues on time?", tag: "FAQ", href: "faq.html#faq-18", keywords: "late dues unpaid fee lien" },
    { title: "What does the HOA Board do?", tag: "FAQ", href: "faq.html#faq-19", keywords: "board of directors role duties" },
    { title: "What is the Design Review Board?", tag: "FAQ", href: "faq.html#faq-20", keywords: "design review board role members" },
    { title: "What is the Grounds Committee?", tag: "FAQ", href: "faq.html#faq-21", keywords: "grounds committee role volunteer" },
    { title: "How do I contact the board?", tag: "FAQ", href: "faq.html#faq-22", keywords: "contact email board" },
  ];
  const searchToggle = $('searchToggle'), searchPanel = $('searchPanel'), searchInput = $('searchInput'), searchResults = $('searchResults');
  function renderResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ''; return; }
    const matches = searchIndex.filter(item => item.title.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q)).slice(0, 8);
    if (!matches.length) { searchResults.innerHTML = '<div class="search-empty">No matches — try a different word.</div>'; return; }
    searchResults.innerHTML = matches.map(item =>
      `<a class="search-result" data-href="${item.href}" data-external="${!!item.external}"><span class="r-title">${item.title}</span><span class="r-tag">${item.tag}</span></a>`).join('');
    searchResults.querySelectorAll('.search-result').forEach(el => el.addEventListener('click', () => goToResult(el.dataset.href, el.dataset.external === 'true')));
  }
  function goToResult(href, external) {
    closeSearch();
    if (external) { window.open(href, '_blank', 'noopener'); return; }
    const [file, hash] = href.split('#');
    if (file === page && hash) { openHash(hash); return; }
    location.href = href;
  }
  function openHash(hash) {
    const el = document.getElementById(hash);
    if (!el) return;
    if (el.tagName === 'DETAILS') { el.setAttribute('open', ''); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else el.scrollIntoView({ behavior: 'smooth' });
  }
  function openSearch() { searchPanel.classList.add('open'); setTimeout(() => searchInput.focus(), 50); }
  function closeSearch() { searchPanel.classList.remove('open'); searchInput.value = ''; searchResults.innerHTML = ''; }
  if (searchToggle) {
    searchToggle.addEventListener('click', (e) => { e.stopPropagation(); searchPanel.classList.contains('open') ? closeSearch() : openSearch(); });
    searchInput.addEventListener('input', (e) => renderResults(e.target.value));
    document.addEventListener('click', (e) => { if (!searchPanel.contains(e.target) && e.target !== searchToggle) closeSearch(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
  }
  // open a FAQ item linked by hash on arrival
  if (location.hash) setTimeout(() => openHash(location.hash.slice(1)), 300);

  // ---- FAQ page filter ----
  const faqSearch = $('faqSearch');
  if (faqSearch) {
    const chips = document.querySelectorAll('.chip'), groups = document.querySelectorAll('.faq-group'), empty = $('faqEmpty');
    let cat = 'all';
    const apply = () => {
      const q = faqSearch.value.trim().toLowerCase(); let shown = 0;
      groups.forEach(g => {
        let gShown = 0;
        g.querySelectorAll('details').forEach(d => {
          const ok = (cat === 'all' || g.dataset.cat === cat) && (!q || d.textContent.toLowerCase().includes(q));
          d.classList.toggle('hidden', !ok); if (ok) gShown++;
          if (q && ok) d.setAttribute('open', '');
        });
        g.classList.toggle('hidden', gShown === 0); shown += gShown;
      });
      if (empty) empty.style.display = shown ? 'none' : 'block';
    };
    faqSearch.addEventListener('input', apply);
    chips.forEach(c => c.addEventListener('click', () => { chips.forEach(x => x.classList.remove('active')); c.classList.add('active'); cat = c.dataset.cat; apply(); }));
  }

  // ---- DRB FORM TOGGLE ----
  const drbFormToggle = $('drbFormToggle'), drbFormWrap = $('drbFormWrap');
  if (drbFormToggle) {
    drbFormToggle.addEventListener('click', () => {
      const showing = drbFormWrap.style.display !== 'none';
      drbFormWrap.style.display = showing ? 'none' : 'block';
      drbFormToggle.querySelector('.label').textContent = showing ? 'Fill It Out Online' : 'Hide Form';
      if (!showing) drbFormWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---- COMMUNITY CALENDAR (calendar.html only) ----
  if ($('calGrid')) {
// ---- COMMUNITY CALENDAR ----
  const calGrid = document.getElementById('calGrid');
  const calTitle = document.getElementById('calTitle');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const calToday = document.getElementById('calToday');

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  const calEvents = [
    { year: 2026, month: 7, day: 29, label: "Annual HOA Meeting — new board elected",
      detail: "Doug Godby (President) and John Cook (Treasurer) completed their terms. Tim Macy and Daniel Kostreva were elected to the board, and Amanda Wells continues her term. Officer positions (President, Treasurer, Secretary) will be assigned at the board's next meeting. Thank you to Doug and John for their service, and welcome to Tim and Daniel.",
      link: { label: "Read the full announcement", href: "#announcements" } }
  ];

  const duesRecurringEvent = {
    label: "Dues invoiced this month",
    detail: "Annual HOA dues invoices are mailed no later than April each year, covering the calendar year January through December. Current annual dues are $350.",
    link: { label: "See dues details", href: "#dues" }
  };

  function renderCalendar(year, month) {
    calTitle.textContent = monthNames[month] + " " + year;
    calGrid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());
    const isAprilView = (month === 3);

    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day empty';
      calGrid.appendChild(cell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      if (isCurrentMonth && d === today.getDate()) cell.classList.add('today');

      const num = document.createElement('span');
      num.className = 'cal-daynum';
      num.textContent = d;
      cell.appendChild(num);

      if (isAprilView && d === 1) {
        const ev = document.createElement('span');
        ev.className = 'cal-event recurring';
        ev.textContent = duesRecurringEvent.label;
        ev.addEventListener('click', (e) => {
          e.stopPropagation();
          openCalModal(monthNames[month] + " 1, " + year, duesRecurringEvent.label, duesRecurringEvent.detail, duesRecurringEvent.link);
        });
        cell.appendChild(ev);
      }

      const dateEvents = calEvents.filter(e => e.year === year && e.month === month && e.day === d);
      dateEvents.forEach(e => {
        const ev = document.createElement('span');
        ev.className = 'cal-event';
        ev.textContent = e.label;
        ev.addEventListener('click', (evt) => {
          evt.stopPropagation();
          openCalModal(monthNames[month] + " " + d + ", " + year, e.label, e.detail, e.link);
        });
        cell.appendChild(ev);
      });

      calGrid.appendChild(cell);
    }

    const totalCells = firstDay + daysInMonth;
    const remainder = totalCells % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day empty';
        calGrid.appendChild(cell);
      }
    }
  }

  calPrev.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar(viewYear, viewMonth);
  });
  calNext.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar(viewYear, viewMonth);
  });
  calToday.addEventListener('click', () => {
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    renderCalendar(viewYear, viewMonth);
  });

  const calModalOverlay = document.getElementById('calModalOverlay');
  const calModalClose = document.getElementById('calModalClose');
  const calModalDate = document.getElementById('calModalDate');
  const calModalTitle = document.getElementById('calModalTitle');
  const calModalDetail = document.getElementById('calModalDetail');
  const calModalLink = document.getElementById('calModalLink');

  function openCalModal(dateLabel, title, detail, link) {
    calModalDate.textContent = dateLabel;
    calModalTitle.textContent = title;
    calModalDetail.textContent = detail;
    if (link) {
      calModalLink.textContent = link.label;
      calModalLink.href = link.href;
      calModalLink.style.display = 'inline-flex';
      calModalLink.onclick = () => closeCalModal();
    } else {
      calModalLink.style.display = 'none';
    }
    calModalOverlay.classList.add('open');
  }
  function closeCalModal() {
    calModalOverlay.classList.remove('open');
  }
  calModalClose.addEventListener('click', closeCalModal);
  calModalOverlay.addEventListener('click', (e) => {
    if (e.target === calModalOverlay) closeCalModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCalModal();
  });

  renderCalendar(viewYear, viewMonth);

  
  }
})();
