(function () {
  function setupMediaLightbox() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.media-gallery .media-gallery-item'));
    if (!links.length) {
      return;
    }

    var currentIndex = -1;

    var overlay = document.createElement('div');
    overlay.className = 'media-lightbox';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<button type="button" class="media-lightbox-close" aria-label="Zapri">&times;</button>' +
      '<div class="media-lightbox-content">' +
      '  <img class="media-lightbox-image nozoom" alt="" />' +
      '</div>' +
      '<div class="media-lightbox-hint">Klik levo/desno na sliko za prejsnjo/naslednjo.</div>';

    document.body.appendChild(overlay);

    var imageEl = overlay.querySelector('.media-lightbox-image');
    var closeBtn = overlay.querySelector('.media-lightbox-close');

    function setImage(index) {
      if (!links.length) {
        return;
      }
      if (index < 0) {
        index = links.length - 1;
      }
      if (index >= links.length) {
        index = 0;
      }
      currentIndex = index;

      var href = links[currentIndex].getAttribute('href');
      var thumb = links[currentIndex].querySelector('img');
      imageEl.src = href;
      imageEl.alt = thumb ? (thumb.getAttribute('alt') || '') : '';
    }

    function openLightbox(index) {
      setImage(index);
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('media-lightbox-open');
    }

    function closeLightbox() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('media-lightbox-open');
      imageEl.src = '';
      currentIndex = -1;
    }

    function nextImage() {
      setImage(currentIndex + 1);
    }

    function prevImage() {
      setImage(currentIndex - 1);
    }

    links.forEach(function (link, index) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeLightbox();
    });

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        closeLightbox();
      }
    });

    imageEl.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      var rect = imageEl.getBoundingClientRect();
      var x = event.clientX - rect.left;
      if (x < rect.width / 2) {
        prevImage();
      } else {
        nextImage();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!overlay.classList.contains('is-open')) {
        return;
      }
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      } else if (event.key === 'ArrowLeft') {
        prevImage();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMediaLightbox);
  } else {
    setupMediaLightbox();
  }
})();
