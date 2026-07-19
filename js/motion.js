// VULKANO motion: custom cursor, magnetic buttons, parallax, embers canvas
(() => {
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (fine && !noMotion) {
    const d = document.createElement('div');
    d.id = 'cur-dot';
    const r = document.createElement('div');
    r.id = 'cur-ring';
    document.body.append(d, r);
    document.body.classList.add('cur-on');
    let mx = innerWidth / 2,
      my = innerHeight / 2,
      rx = mx,
      ry = my;
    addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      r.style.transform = `translate(${rx - 19}px,${ry - 19}px)`;
      requestAnimationFrame(loop);
    })();
    const HOVERABLE = 'a, button, .card, .opt, .chip';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(HOVERABLE)) r.classList.add('big');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(HOVERABLE)) r.classList.remove('big');
    });
    document.addEventListener('mousemove', (e) => {
      const b = e.target.closest('.mag');
      document.querySelectorAll('.mag').forEach((m) => {
        if (m !== b) m.style.transform = '';
      });
      if (b) {
        const rc = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - rc.left - rc.width / 2) * 0.22}px,${(e.clientY - rc.top - rc.height / 2) * 0.22}px)`;
      }
    });
    const plx = [...document.querySelectorAll('[data-plx]')];
    if (plx.length) {
      let tick = false;
      const onScroll = () => {
        if (tick) return;
        tick = true;
        requestAnimationFrame(() => {
          const vh = innerHeight;
          plx.forEach((el) => {
            const rc = el.getBoundingClientRect();
            el.style.transform = `translateY(${((rc.top + rc.height / 2 - vh / 2) / vh) * -26}px)`;
          });
          tick = false;
        });
      };
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  if (!noMotion) {
    const c = document.querySelector('.embers');
    if (c) {
      const x = c.getContext('2d');
      const rs = () => {
        c.width = c.clientWidth;
        c.height = c.clientHeight;
      };
      rs();
      addEventListener('resize', rs);
      const P = Array.from({ length: 34 }, () => ({
        x: Math.random(),
        y: Math.random(),
        s: 1 + Math.random() * 2.4,
        v: 0.35 + Math.random() * 0.9,
        w: Math.random() * 6.28,
      }));
      (function em() {
        x.clearRect(0, 0, c.width, c.height);
        P.forEach((p) => {
          p.y -= p.v * 0.0022;
          p.w += 0.02;
          if (p.y < -0.05) {
            p.y = 1.05;
            p.x = Math.random();
          }
          x.globalAlpha = 0.18 + 0.45 * Math.abs(Math.sin(p.w));
          x.fillStyle = p.s > 2.4 ? '#FFB03A' : '#FF4D14';
          x.beginPath();
          x.arc(p.x * c.width + Math.sin(p.w) * 14, p.y * c.height, p.s, 0, 6.28);
          x.fill();
        });
        x.globalAlpha = 1;
        requestAnimationFrame(em);
      })();
    }
  }
})();
