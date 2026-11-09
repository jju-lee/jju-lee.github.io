/* 공통 Nav 동작 — 모바일 메뉴 토글 + (메인 페이지) 스크롤 위치별 현재 섹션 강조 */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-links');
  if (!toggle || !menu) return;

  /* 모바일 메뉴 열기/닫기 */
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }
  toggle.addEventListener('click', function () {
    setMenu(!menu.classList.contains('open'));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* 현재 섹션 강조: 같은 페이지 안의 #앵커 링크가 있을 때만 동작 (index.html) */
  var links = menu.querySelectorAll('a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  function setActive(id) {
    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  /* 화면 상단 약 40% 지점을 지나는 섹션을 현재 섹션으로 간주 */
  var opts = { rootMargin: '-40% 0px -55% 0px' };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, opts);
  sections.forEach(function (s) { observer.observe(s); });

  /* Hero 구간에서는 강조 해제 */
  var hero = document.getElementById('hero');
  if (hero) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) setActive('');
    }, opts).observe(hero);
  }
})();
