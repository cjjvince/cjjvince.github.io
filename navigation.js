// Native details keep navigation usable without JavaScript or a hover device.
(() => {
  const navigation = document.querySelector('.site-header nav');
  if (!navigation) return;
  const menus = [...navigation.querySelectorAll('.nav-dropdown')];
  const closeOthers = (current) => menus.forEach(menu => {
    if (menu !== current) menu.open = false;
  });

  menus.forEach(menu => {
    const summary = menu.querySelector('summary');
    const links = [...menu.querySelectorAll('.nav-menu a')];
    let leaveTimer;
    let openedByHover = false;
    const cancelLeave = () => clearTimeout(leaveTimer);
    const open = () => {
      cancelLeave();
      closeOthers(menu);
      menu.open = true;
    };

    menu.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' || !matchMedia('(hover: hover)').matches) return;
      if (!menu.open) openedByHover = true;
      open();
    });
    menu.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return;
      leaveTimer = setTimeout(() => {
        if (!menu.contains(document.activeElement)) menu.open = false;
      }, 160);
    });
    summary.addEventListener('click', event => {
      cancelLeave();
      closeOthers(menu);
      // A mouse click pins an already-hovered menu rather than closing it immediately.
      if (openedByHover && menu.open && event.detail > 0) event.preventDefault();
      openedByHover = false;
    });
    menu.addEventListener('toggle', () => {
      if (!menu.open) openedByHover = false;
    });
    menu.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!menu.contains(document.activeElement)) menu.open = false;
      }, 0);
    });
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        menu.open = false;
        summary.focus();
      } else if (event.target === summary && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        open();
        links[event.key === 'ArrowDown' ? 0 : links.length - 1].focus();
      } else if (links.includes(event.target) && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const current = links.indexOf(event.target);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1
          : (current + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links[next].focus();
      }
    });
  });

  navigation.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    closeOthers(null);
    // Keep subsequent keyboard navigation at the chosen section.
    const target = document.getElementById(link.hash.slice(1));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!navigation.contains(event.target)) closeOthers(null);
  });
  window.addEventListener('hashchange', () => closeOthers(null));
})();
