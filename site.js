/* ── Scroll reveal ──────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal:not(.hero .reveal)');
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

for (const el of reveals) {
  observer.observe(el);
}

/* ── Copyright year ────────────────────────────────── */
const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) {
  copyrightYear.textContent = String(new Date().getFullYear());
}

/* ── Vimeo embed ───────────────────────────────────── */
const vimeoCards = document.querySelectorAll('[data-vimeo-id]');

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function buildVimeoUrl(card) {
  const url = new URL(`https://player.vimeo.com/video/${card.dataset.vimeoId}`);
  if (card.dataset.vimeoHash) {
    url.searchParams.set('h', card.dataset.vimeoHash);
  }
  url.searchParams.set('autoplay', '1');
  url.searchParams.set('badge', '0');
  url.searchParams.set('autopause', '0');
  url.searchParams.set('player_id', '0');
  url.searchParams.set('app_id', '58479');
  url.searchParams.set('dnt', '1');
  return url.toString();
}

function swapCardForEmbed(card) {
  const wrapper = document.createElement('div');
  wrapper.className = 'reel-frame';

  const iframe = document.createElement('iframe');
  iframe.src = buildVimeoUrl(card);
  iframe.title = card.dataset.vimeoTitle;
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';

  wrapper.appendChild(iframe);
  card.replaceWith(wrapper);
  iframe.focus();
}

for (const card of vimeoCards) {
  card.addEventListener('click', (event) => {
    if (isModifiedClick(event)) {
      return;
    }

    event.preventDefault();
    swapCardForEmbed(card);
  }, { once: true });
}
