(() => {
  document.querySelectorAll('.outreach-gallery').forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll('.gallery-slide'));
    const controls = gallery.querySelector('.gallery-controls');
    const count = gallery.querySelector('.gallery-count');
    if (slides.length < 2 || !controls || !count) return;
    let current = 0;
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== current;
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
      });
      count.textContent = `${current + 1} / ${slides.length}`;
      count.setAttribute('aria-label', `Photo ${current + 1} of ${slides.length}`);
    };
    controls.querySelectorAll('button[data-gallery-step]').forEach((button) => {
      button.addEventListener('click', () => show(current + Number(button.dataset.galleryStep)));
    });
    gallery.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const destinations = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
      if (!(event.key in destinations)) return;
      event.preventDefault();
      show(destinations[event.key]);
    });
    gallery.setAttribute('aria-roledescription', 'carousel');
    gallery.classList.add('gallery-ready');
    show(0);
    controls.hidden = false;
  });
})();
