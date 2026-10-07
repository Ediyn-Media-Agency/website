/**
 * Ediyn Media Agency — Main Interactive Script
 * - Lucide Icons init
 * - Header scroll effect & Active Nav Spy
 * - Mobile Menu toggle & backdrop
 * - Animated Counter on Scroll (Intersection Observer)
 * - Touch & Drag Enabled Auto-Rotating Testimonial Carousel
 * - Formspree Contact Form Submission with Inline Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. STICKY HEADER & ACTIVE NAV SPY
     ========================================================================== */
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Scrollspy to highlight active nav link
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openMobileMenu = () => {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.classList.add('open');
    mobileNavOverlay.classList.add('open');
    document.body.classList.add('nav-open');
  };

  const closeMobileMenu = () => {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    document.body.classList.remove('nav-open');
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ==========================================================================
     3. ANIMATED NUMBER COUNTERS (Intersection Observer)
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      // easeOutExpo function
      const progress = frame / totalFrames;
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(target * easeProgress);

      el.textContent = current.toLocaleString() + suffix;

      if (frame === totalFrames) {
        clearInterval(counter);
        el.textContent = target.toLocaleString() + suffix;
      }
    }, frameRate);
  };

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((stat) => statObserver.observe(stat));

  /* ==========================================================================
     4. TESTIMONIAL CAROUSEL
     ========================================================================== */
  const track = document.getElementById('carouselTrack');
  const trackContainer = document.getElementById('carouselTrackContainer');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  const slides = document.querySelectorAll('.review-card-item');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoPlayTimer = null;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    const getVisibleSlidesCount = () => {
      const width = window.innerWidth;
      if (width <= 768) return 1;
      if (width <= 1024) return 2;
      return 3;
    };

    const getMaxIndex = () => {
      const visible = getVisibleSlidesCount();
      return Math.max(0, slides.length - visible);
    };

    const createDots = () => {
      dotsContainer.innerHTML = '';
      const maxIndex = getMaxIndex();
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide group ${i + 1}`);
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
          restartAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    };

    const updateCarousel = () => {
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      // Calculate slide width + gap
      const slide = slides[0];
      const slideWidth = slide.getBoundingClientRect().width;
      const computedStyle = window.getComputedStyle(track);
      const gap = parseFloat(computedStyle.gap) || 28;
      
      const moveDistance = (slideWidth + gap) * currentIndex;
      track.style.transform = `translateX(-${moveDistance}px)`;

      // Update dots
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const nextSlide = () => {
      const maxIndex = getMaxIndex();
      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel();
    };

    const prevSlide = () => {
      const maxIndex = getMaxIndex();
      if (currentIndex <= 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex--;
      }
      updateCarousel();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoplay();
      });
    }

    const startAutoplay = () => {
      autoPlayTimer = setInterval(nextSlide, 4500);
    };

    const stopAutoplay = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // Pause on hover
    trackContainer.addEventListener('mouseenter', stopAutoplay);
    trackContainer.addEventListener('mouseleave', startAutoplay);

    // Touch & Drag Support
    trackContainer.addEventListener('touchstart', (e) => {
      stopAutoplay();
      startX = e.touches[0].clientX;
    }, { passive: true });

    trackContainer.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (diffX > 40) {
        nextSlide();
      } else if (diffX < -40) {
        prevSlide();
      }
      startAutoplay();
    }, { passive: true });

    // Window resize handler
    window.addEventListener('resize', () => {
      createDots();
      updateCarousel();
    });

    // Initialize
    createDots();
    updateCarousel();
    startAutoplay();
  }

  /* ==========================================================================
     5. CONTACT FORM SUBMISSION (Formspree AJAX)
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const actionUrl = contactForm.getAttribute('action');
      const formData = new FormData(contactForm);
      const dataObj = Object.fromEntries(formData.entries());

      // Provide UI loading state
      const originalBtnText = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = 'Sending Details...';
      formFeedback.className = 'form-feedback';
      formFeedback.style.display = 'none';

      // Check if Formspree ID is still the default placeholder
      if (actionUrl.includes('YOUR_FORM_ID')) {
        setTimeout(() => {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = originalBtnText;
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `
            <strong>Thank you, ${dataObj.name || 'Friend'}!</strong><br>
            Your inquiry has been logged. 
            <br><span style="font-size: 0.85rem; color: #44E5C7;">(Notice: Formspree ID is ready to be configured. You can also connect directly via <a href="https://wa.me/916268366771" target="_blank" style="text-decoration: underline; color: #FFFFFF;">WhatsApp +91 6268366771</a> for instant response.)</span>
          `;
          formFeedback.style.display = 'block';
          contactForm.reset();
        }, 600);
        return;
      }

      // Live POST request to configured Formspree URL
      try {
        const response = await fetch(actionUrl, {
          method: 'POST',
          body: JSON.stringify(dataObj),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = '<strong>Success!</strong> Your inquiry has been sent. Our team will contact you shortly.';
          formFeedback.style.display = 'block';
          contactForm.reset();
        } else {
          const resData = await response.json();
          formFeedback.className = 'form-feedback error';
          formFeedback.innerHTML = resData.errors ? resData.errors.map(err => err.message).join(', ') : 'Oops! There was a problem submitting your form. Please reach us directly via WhatsApp.';
          formFeedback.style.display = 'block';
        }
      } catch (err) {
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = 'Network error. Please contact us directly on WhatsApp at +91 6268366771.';
        formFeedback.style.display = 'block';
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnText;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }
});
