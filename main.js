/**
 * PartyTime Banquet Hall & Entertainment - Main Interactive Application Engine
 * Venue Address: 6230 Miramar Parkway, Miramar, FL 33023
 * Phone: 954-985-6886
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDateChecker();
  initPackagesTabs();
  initGalleryFilter();
  initLightbox();
  initTestimonialsSlider();
  initQuoteModal();
  initFAQAccordion();
  initMobileMenu();
  initAnimations();
  initCustomCursor();
});

/* ==========================================================================
   1. Navigation & Fast Smooth Scroll Handling
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Fast Smooth Scroll Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        fastSmoothScrollTo(offsetPosition, 480);

        // Close mobile drawer if open
        const mobileMenu = document.querySelector('.mobile-menu-drawer');
        if (mobileMenu && mobileMenu.style.display === 'block') {
          mobileMenu.style.display = 'none';
        }
      }
    });
  });
}

/* ==========================================================================
   2. Date Availability Checker Widget (Hero & Quick Card)
   ========================================================================== */
function initDateChecker() {
  const dateInput = document.getElementById('hero-date-input');
  const guestSelect = document.getElementById('hero-guest-select');
  const checkBtn = document.getElementById('hero-check-btn');
  const resultBox = document.getElementById('hero-availability-result');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  if (checkBtn && resultBox) {
    checkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedDate = dateInput.value;
      
      if (!selectedDate) {
        showToast('Please select your desired event date first!', 'warning');
        dateInput.focus();
        return;
      }

      // Format date for display
      const dateObj = new Date(selectedDate);
      const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
      });

      // Simulated availability check logic
      checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking Availability...';
      checkBtn.disabled = true;

      setTimeout(() => {
        checkBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Check Availability';
        checkBtn.disabled = false;

        // Display positive availability message with direct trigger to complete quote
        resultBox.className = 'availability-result available';
        resultBox.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
            <span>Great News! <strong>${formattedDate}</strong> is currently AVAILABLE for booking.</span>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="lock-date-btn" style="padding: 6px 14px; font-size: 0.85rem; margin-top: 6px; width: 100%;">
            Lock This Date & Get Custom Quote
          </button>
        `;

        document.getElementById('lock-date-btn')?.addEventListener('click', () => {
          openQuoteModalWithDate(selectedDate, guestSelect ? guestSelect.value : '100');
        });
      }, 700);
    });
  }
}

/* ==========================================================================
   3. Packages Tab Switcher
   ========================================================================== */
function initPackagesTabs() {
  const tabBtns = document.querySelectorAll('.packages-tabs .tab-btn');
  const packageCards = document.querySelectorAll('.packages-grid .pricing-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.tab;

      packageCards.forEach(card => {
        if (targetTab === 'all' || card.dataset.category === targetTab) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Filterable Event Photo Gallery
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Lightbox Modal
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'PartyTime Venue Gallery';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
}

/* ==========================================================================
   6. Testimonials Slider Carousel
   ========================================================================== */
function initTestimonialsSlider() {
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  let currentIndex = 0;
  let autoSlideTimer = null;

  if (cards.length === 0) return;

  function showSlide(index) {
    cards.forEach((card, idx) => {
      card.classList.remove('active');
      if (idx === index) {
        card.classList.add('active');
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showSlide(currentIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 6000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  startAutoSlide();
}

/* ==========================================================================
   7. Interactive Multi-Step Date & Quote Calculator Modal
   ========================================================================== */
let currentStep = 1;
const totalSteps = 4;

function initQuoteModal() {
  const modal = document.getElementById('quote-modal');
  const triggers = document.querySelectorAll('[data-open-quote]');
  const closeBtn = document.getElementById('modal-close-btn');

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuoteModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeQuoteModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeQuoteModal();
      }
    });
  }

  // Step Navigation Buttons
  const nextBtns = document.querySelectorAll('.btn-next-step');
  const prevBtns = document.querySelectorAll('.btn-prev-step');
  const modalForm = document.getElementById('multi-step-quote-form');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  });

  // Calculate live estimate when options change
  document.querySelectorAll('#multi-step-quote-form input, #multi-step-quote-form select').forEach(input => {
    input.addEventListener('change', updateLiveEstimate);
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reserving Date...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        closeQuoteModal();
        showToast('🎉 Your date inquiry & quote request has been received! Our Miramar venue manager will call you shortly at (954) 985-6886.', 'success', 8000);
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Complete Inquiry';
          submitBtn.disabled = false;
        }
        modalForm.reset();
        goToStep(1);
      }, 1200);
    });
  }
}

function openQuoteModal() {
  const modal = document.getElementById('quote-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateLiveEstimate();
  }
}

function openQuoteModalWithDate(dateStr, guests) {
  openQuoteModal();
  const dateField = document.getElementById('modal-date-input');
  const guestField = document.getElementById('modal-guest-count');
  if (dateField && dateStr) dateField.value = dateStr;
  if (guestField && guests) guestField.value = guests;
  updateLiveEstimate();
}

function closeQuoteModal() {
  const modal = document.getElementById('quote-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function goToStep(stepNum) {
  if (stepNum < 1 || stepNum > totalSteps) return;

  const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const nextStepEl = document.querySelector(`.form-step[data-step="${stepNum}"]`);
  const stepDots = document.querySelectorAll('.step-dot');

  if (currentStepEl) currentStepEl.classList.remove('active');
  if (nextStepEl) nextStepEl.classList.add('active');

  stepDots.forEach((dot, idx) => {
    const dotStep = idx + 1;
    dot.classList.remove('active', 'completed');
    if (dotStep === stepNum) {
      dot.classList.add('active');
    } else if (dotStep < stepNum) {
      dot.classList.add('completed');
    }
  });

  currentStep = stepNum;
  if (currentStep === 4) {
    updateLiveEstimate();
  }
}

function validateCurrentStep(step) {
  if (step === 1) {
    const dateVal = document.getElementById('modal-date-input').value;
    if (!dateVal) {
      showToast('Please select your target event date.', 'warning');
      return false;
    }
  } else if (step === 2) {
    const eventType = document.querySelector('input[name="event-type"]:checked');
    if (!eventType) {
      showToast('Please select an event type.', 'warning');
      return false;
    }
  }
  return true;
}

function updateLiveEstimate() {
  let basePrice = 2000; // Venue Rental Baseline
  
  // Package Selection
  const selectedPkg = document.querySelector('input[name="package-tier"]:checked')?.value || 'venue-only';
  if (selectedPkg === 'venue-decor') basePrice = 3500;
  if (selectedPkg === 'all-inclusive') basePrice = 4900;

  // Add-ons
  let addonsTotal = 0;
  if (document.getElementById('addon-photobooth')?.checked) addonsTotal += 300;
  if (document.getElementById('addon-partybus')?.checked) addonsTotal += 600;
  if (document.getElementById('addon-uplighting')?.checked) addonsTotal += 250;
  if (document.getElementById('addon-djsound')?.checked) addonsTotal += 400;

  const estimatedTotal = basePrice + addonsTotal;

  // Render values
  const baseEl = document.getElementById('summary-base-price');
  const addonsEl = document.getElementById('summary-addons-price');
  const totalEl = document.getElementById('summary-total-price');

  if (baseEl) baseEl.textContent = `$${basePrice.toLocaleString()}`;
  if (addonsEl) addonsEl.textContent = `$${addonsTotal.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `$${estimatedTotal.toLocaleString()}`;
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(i => i.classList.remove('active'));

        // Toggle clicked
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   9. Mobile Menu Drawer Toggle
   ========================================================================== */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  let drawer = document.querySelector('.mobile-menu-drawer');

  if (!drawer) {
    // Create drawer dynamically
    drawer = document.createElement('div');
    drawer.className = 'mobile-menu-drawer';
    drawer.innerHTML = `
      <div style="position: fixed; inset: 0; background: rgba(15,15,18,0.98); z-index: 2500; padding: 40px 24px; display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 20px;">
          <div style="font-family: var(--font-heading-brand); font-size: 1.3rem; font-weight: 800;" class="gold-text">PartyTime Miramar</div>
          <button id="close-mobile-drawer" style="color: #FFF; font-size: 1.8rem;">&times;</button>
        </div>
        <nav style="display: flex; flex-direction: column; gap: 20px; font-size: 1.2rem; font-weight: 700;">
          <a href="#amenities">Banquet Hall</a>
          <a href="#packages">Packages & Pricing</a>
          <a href="#photobooth">360 Photo Booth</a>
          <a href="#partybus">VIP Party Bus</a>
          <a href="#gallery">Photo Gallery</a>
          <a href="#contact">Location & Hours</a>
        </nav>
        <div style="margin-top: auto; display: flex; flex-direction: column; gap: 12px;">
          <a href="tel:9549856886" class="btn btn-secondary" style="width: 100%;">
            <i class="fas fa-phone-alt"></i> Call (954) 985-6886
          </a>
          <button class="btn btn-primary" data-open-quote style="width: 100%;">
            Get Instant Quote
          </button>
        </div>
      </div>
    `;
    drawer.style.display = 'none';
    document.body.appendChild(drawer);

    drawer.querySelector('#close-mobile-drawer').addEventListener('click', () => {
      drawer.style.display = 'none';
    });

    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.style.display = 'none';
      });
    });

    drawer.querySelector('[data-open-quote]').addEventListener('click', () => {
      drawer.style.display = 'none';
      openQuoteModal();
    });
  }

  if (btn) {
    btn.addEventListener('click', () => {
      drawer.style.display = 'block';
    });
  }
}

/* ==========================================================================
   10. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'warning') icon = 'fa-exclamation-triangle';

  toast.innerHTML = `<i class="fas ${icon}" style="color: var(--gold-primary);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==========================================================================
   11. Scroll Animations
   ========================================================================== */
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stat-card, .amenity-card, .pricing-card, .showcase-block, .process-card').forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   12. Custom Luxury Cursor Engine
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function render() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  const hoverSelectors = 'a, button, input, select, textarea, .gallery-item, .pricing-card, .amenity-card, .faq-question, .tab-btn, .filter-btn, .addon-card';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      ring.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      ring.classList.remove('hover');
    }
  });

  document.addEventListener('mousedown', () => {
    ring.classList.add('active');
  });

  document.addEventListener('mouseup', () => {
    ring.classList.remove('active');
  });
}

/* ==========================================================================
   13. Fast Smooth Scroll Engine
   ========================================================================== */
function fastSmoothScrollTo(targetPosition, duration = 480) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function easeOutCubic(t) {
    return (--t) * t * t + 1;
  }

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeOutCubic(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

