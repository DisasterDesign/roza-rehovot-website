/* ===========================
   Roza Rehovot — Main JavaScript
   Enhanced with advanced animations & interactions
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 10. Page Loader --- */
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('loaded');
        setTimeout(() => pageLoader.remove(), 900);
      }, 800);
    });
    // Fallback — remove after 3s max
    setTimeout(() => {
      if (pageLoader.parentNode) {
        pageLoader.classList.add('loaded');
        setTimeout(() => pageLoader.remove(), 900);
      }
    }, 3000);
  }

  /* --- 1. Sticky Header --- */
  const header = document.getElementById('header');
  const hero = document.getElementById('hero');

  if (header && hero) {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    headerObserver.observe(hero);
  }

  /* --- 14. Scroll Progress Bar --- */
  const progressBar = document.querySelector('.scroll-progress__bar');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  /* --- 2. Smooth Scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* --- 3. Mobile Menu --- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !hamburger.classList.contains('open');
      hamburger.classList.toggle('open', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => toggleMenu());

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        toggleMenu(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
        hamburger.focus();
      }
    });
  }

  /* --- 4. Hero Slideshow with Ken Burns --- */
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 7000); // Longer for Ken Burns effect
  }

  /* --- 5. Scroll Animations --- */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    animatedElements.forEach(el => scrollObserver.observe(el));
  }

  /* --- Section Divider Animation (4) --- */
  const dividerLines = document.querySelectorAll('.section-divider__line');
  if (dividerLines.length > 0) {
    const dividerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            dividerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    dividerLines.forEach(el => dividerObserver.observe(el));
  }

  /* --- 6. Gallery Lightbox (Enhanced — 13) --- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
  const lightboxCounter = lightbox ? lightbox.querySelector('.lightbox__counter') : null;
  const galleryItems = document.querySelectorAll('.gallery__item');
  let lightboxIndex = 0;

  const galleryImages = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return img ? img.src.replace('=w800', '=w1920') : '';
  });

  const updateCounter = () => {
    if (lightboxCounter) {
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${galleryImages.length}`;
    }
  };

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImg) return;
    lightboxIndex = index;
    lightboxImg.src = galleryImages[index];
    updateCounter();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    lightboxIndex = (lightboxIndex + direction + galleryImages.length) % galleryImages.length;
    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = direction > 0 ? 'translateX(-20px)' : 'translateX(20px)';
      setTimeout(() => {
        lightboxImg.src = galleryImages[lightboxIndex];
        updateCounter();
        requestAnimationFrame(() => {
          lightboxImg.style.opacity = '1';
          lightboxImg.style.transform = 'translateX(0)';
        });
      }, 150);
    }
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index, 10);
      openLightbox(index);
    });
  });

  if (lightbox) {
    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', () => navigateLightbox(-1));
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(-1);
      if (e.key === 'ArrowLeft') navigateLightbox(1);
    });

    /* Lightbox swipe support (13) */
    let touchStartX = 0;
    let touchStartY = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) navigateLightbox(-1); // RTL swipe right = prev
        else navigateLightbox(1);
      }
    }, { passive: true });
  }

  /* --- 7. WhatsApp Button Visibility --- */
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappBtn && hero) {
    const waObserver = new IntersectionObserver(
      ([entry]) => {
        whatsappBtn.classList.toggle('visible', !entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    waObserver.observe(hero);
  }

  /* --- 8. Scroll indicator fade-out --- */
  const heroScroll = document.querySelector('.hero__scroll');
  if (heroScroll && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 200);
      heroScroll.style.opacity = opacity;
      if (opacity === 0) heroScroll.style.visibility = 'hidden';
      else heroScroll.style.visibility = 'visible';
    }, { passive: true });
  }

  /* --- 8. Form Validation & Submission --- */
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('[name="name"]');
      const phone = contactForm.querySelector('[name="phone"]');
      let valid = true;

      [name, phone].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#D4A96A';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          contactForm.style.display = 'none';
          if (contactSuccess) contactSuccess.classList.add('show');
        }
      } catch {
        contactForm.reset();
        contactForm.style.display = 'none';
        if (contactSuccess) contactSuccess.classList.add('show');
      }
    });
  }

  /* --- 9. Active Nav Link --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );
    sections.forEach(section => navObserver.observe(section));
  }

  /* --- 9. Button Ripple Effect --- */
  document.querySelectorAll('.btn-cta, .btn-gold, .btn-gold-outline, .contact__submit, .header__cta').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* --- 11. Parallax on Scroll --- */
  if (isDesktop && !prefersReducedMotion) {
    const heroContent = document.querySelector('.hero__content');
    const heroSlides = document.querySelector('.hero__slides');
    const aboutImage = document.querySelector('.about__image img');

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const heroHeight = hero ? hero.offsetHeight : 0;

      if (scrollY < heroHeight * 1.5) {
        if (heroSlides) heroSlides.style.transform = `translateY(${scrollY * 0.3}px)`;
        if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.5}px)`;
      }

      if (aboutImage) {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          const rect = aboutSection.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = (window.innerHeight - rect.top) * 0.05;
            aboutImage.style.transform = `translateY(${-offset}px)`;
          }
        }
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- 3. Cursor Glow (Desktop only) --- */
  if (isDesktop && !prefersReducedMotion) {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
      let mouseX = 0, mouseY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.left = (mouseX - cursorGlow.offsetWidth / 2) + 'px';
        cursorGlow.style.top = (mouseY - cursorGlow.offsetHeight / 2) + 'px';
        if (!cursorGlow.classList.contains('active')) {
          cursorGlow.classList.add('active');
        }
      });

      document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
      });

      // Enlarge on interactive elements
      const interactiveSelectors = 'a, button, .gallery__item, .btn-cta, .btn-gold, .btn-gold-outline, .contact__submit, .header__cta, input, textarea';
      document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover'));
      });
    }
  }

  /* --- 12. Magnetic Buttons (Desktop only) --- */
  if (isDesktop && !prefersReducedMotion) {
    document.querySelectorAll('.btn-cta, .btn-gold, .btn-gold-outline, .header__cta').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* --- 5. Gallery Tilt Effect (Desktop only) --- */
  if (isDesktop && !prefersReducedMotion) {
    galleryItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        item.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
        item.style.transition = 'transform 0.5s ease';
        setTimeout(() => { item.style.transition = ''; }, 500);
      });
    });
  }

  /* --- 15. Typed Text Effect --- */
  const typedWrapper = document.querySelector('.hero__typed-text');
  if (typedWrapper && !prefersReducedMotion) {
    const phrases = ['בשרים משובחים', 'אירועים פרטיים', 'אווירה נהדרת', 'חוויה קולינרית'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const type = () => {
      const current = phrases[phraseIndex];

      if (!isDeleting) {
        typedWrapper.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          setTimeout(() => { isDeleting = true; type(); }, pauseTime);
          return;
        }
      } else {
        typedWrapper.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    };

    // Start after hero animations complete
    setTimeout(type, 2500);
  }

  /* --- 16. Number Counter Animation --- */
  const counterItems = document.querySelectorAll('.counter-item__number');
  if (counterItems.length > 0) {
    let counterStarted = false;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const start = performance.now();

      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(easeOut(progress) * target);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      };

      requestAnimationFrame(update);
    };

    const hoursSection = document.getElementById('hours');
    if (hoursSection) {
      const counterObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !counterStarted) {
            counterStarted = true;
            counterItems.forEach(el => animateCounter(el));
            counterObserver.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      counterObserver.observe(hoursSection);
    }
  }

});
