// Interaction scrap list. Items live only here.
// Items with `live` play their page demo (?demo) inside the card on hover. `live` is the frame size to render.

const BASE = 'https://ysh4267.github.io';

// Pages that are already on the main site are not listed here.
const ITEMS = [
  {
    name: 'Sidebar & Progress',
    url: `${BASE}/ref-stripe-sidebar/`,
    poster: 'previews/stripe.webp',
    live: [900, 563],
  },
  {
    name: 'Dither Tiles',
    url: `${BASE}/ref-basedash-tiles/`,
    poster: 'previews/basedash.webp',
    live: [1280, 800],
  },
  {
    name: 'Texture Card',
    url: `${BASE}/ref-textures-card/`,
    poster: 'previews/textures.webp',
    live: [1280, 800],
  },
  {
    name: 'Vinyl',
    url: `${BASE}/ref-vinyl-player/`,
    poster: 'previews/vinyl.webp',
    live: [1280, 800],
  },
];

const grid = document.getElementById('grid');

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function card(item, index) {
  const a = document.createElement('a');
  a.className = 'card';
  a.href = item.url;

  const media = document.createElement('div');
  media.className = 'media';
  const img = document.createElement('img');
  img.src = item.poster;
  img.alt = '';
  img.loading = index < 3 ? 'eager' : 'lazy';
  img.decoding = 'async';
  media.append(img);

  // A card holds only the picture, number and name.
  const meta = document.createElement('div');
  meta.className = 'meta';
  const h2 = document.createElement('h2');
  const no = document.createElement('span');
  no.className = 'no';
  no.textContent = String(index + 1).padStart(2, '0');
  h2.append(no, item.name);
  meta.append(h2);
  a.append(media, meta);

  if (item.live && canHover && !reduced) attachLive(a, media, item);
  return a;
}

// Load the demo page on hover and remove it on leave, so only one runs at a time.
function attachLive(a, media, item) {
  let live = null;
  let timer = 0;
  const [fw, fh] = item.live;
  const fit = () => {
    if (live) live.style.setProperty('--s', String(media.clientWidth / fw));
  };
  const open = () => {
    clearTimeout(timer);
    if (!live) {
      live = document.createElement('div');
      live.className = 'live';
      const frame = document.createElement('iframe');
      frame.src = `${item.url}?demo`;
      frame.style.width = `${fw}px`;
      frame.style.height = `${fh}px`;
      frame.title = `${item.name} preview`;
      frame.tabIndex = -1;
      frame.setAttribute('aria-hidden', 'true');
      frame.addEventListener('load', () => live && live.classList.add('on'), { once: true });
      live.appendChild(frame);
      media.appendChild(live);
      fit();
    } else {
      live.classList.add('on');
    }
  };
  const close = () => {
    if (!live) return;
    live.classList.remove('on');
    timer = setTimeout(() => {
      live?.remove();
      live = null;
    }, 400);
  };
  a.addEventListener('pointerenter', open);
  a.addEventListener('pointerleave', close);
  window.addEventListener('resize', fit);
}

ITEMS.forEach((item, i) => grid.appendChild(card(item, i)));
