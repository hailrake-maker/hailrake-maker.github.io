(() => {
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Шапка при прокрутке */
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Появление блоков */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* Живые превью сайтов: iframe 1280×800 масштабируем под ширину окна */
  const screens = $$('.browser__screen');
  const fit = (screen) => {
    const frame = screen.querySelector('iframe');
    if (frame) frame.style.setProperty('--scale', String(screen.clientWidth / 1280));
  };
  const fitAll = () => screens.forEach(fit);
  fitAll();
  window.addEventListener('load', fitAll);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => entries.forEach((entry) => fit(entry.target)));
    screens.forEach((screen) => ro.observe(screen));
  } else {
    window.addEventListener('resize', fitAll);
  }

  /* Год в подвале */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
