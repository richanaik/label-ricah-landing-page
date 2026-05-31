/* 
========================================================================
LABEL RICAH - LUXURY WEBSITE INTERACTION SCRIPTS
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollAnimations();
  initTestimonialsCarousel();
  initFormValidation();
  initProductInquiries();
});

/* ========================================================================
   1. STICKY GLASSMORPHISM HEADER
   ======================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Check on init
}

/* ========================================================================
   2. MOBILE NAVIGATION DRAWER
   ======================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.nav-menu');
  
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Close menu on navigation link click
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    });
  });

  // Close menu on click outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    }
  });
}

/* ========================================================================
   3. SCROLL-REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ======================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/* ========================================================================
   4. TESTIMONIALS SLIDER / CAROUSEL
   ======================================================================== */
function initTestimonialsCarousel() {
  const testimonials = document.querySelectorAll('.testimonial-item');
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (testimonials.length === 0 || !dotsContainer) return;

  let currentIndex = 0;
  let timer = null;

  // Create dot indicators
  testimonials.forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  const goToSlide = (index) => {
    testimonials[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    currentIndex = index;
    
    testimonials[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  };

  const nextSlide = () => {
    const nextIdx = (currentIndex + 1) % testimonials.length;
    goToSlide(nextIdx);
  };

  const startAutoplay = () => {
    timer = setInterval(nextSlide, 6000); // 6 seconds auto-rotate
  };

  const resetAutoplay = () => {
    clearInterval(timer);
    startAutoplay();
  };

  // Start rotation
  startAutoplay();
}

/* ========================================================================
   5. PREMIUM FORM VALIDATION & LEAD ACQUISITION
   ======================================================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate="true"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Select fields to validate
      const nameInput = form.querySelector('[name="fullname"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const eventSelect = form.querySelector('[name="event_type"]');
      const outfitSelect = form.querySelector('[name="outfit_category"]');
      
      // Reset errors
      form.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

      // Validate Name
      if (nameInput && nameInput.value.trim().length < 2) {
        showError(nameInput, 'Full Name is required (minimum 2 characters).');
        isValid = false;
      }

      // Validate Email
      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
          showError(emailInput, 'Email Address is required.');
          isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
          showError(emailInput, 'Please enter a valid Email Address.');
          isValid = false;
        }
      }

      // Validate Phone (Indian standard formats, minimum 10 digits)
      if (phoneInput) {
        const phoneVal = phoneInput.value.trim().replace(/\D/g, '');
        if (!phoneInput.value.trim()) {
          showError(phoneInput, 'Phone Number is required.');
          isValid = false;
        } else if (phoneVal.length < 10) {
          showError(phoneInput, 'Please enter a valid 10-digit Phone Number.');
          isValid = false;
        }
      }

      // Validate Event Select (if it exists)
      if (eventSelect && !eventSelect.value) {
        showError(eventSelect, 'Please select your Event Type.');
        isValid = false;
      }

      // Validate Outfit Select (if it exists)
      if (outfitSelect && !outfitSelect.value) {
        showError(outfitSelect, 'Please select an Outfit Category.');
        isValid = false;
      }

      if (isValid) {
        handleSuccessSubmit(form);
      }
    });

    // Clean errors on input
    form.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        const grp = input.closest('.form-group');
        if (grp) grp.classList.remove('has-error');
      });
      input.addEventListener('change', () => {
        const grp = input.closest('.form-group');
        if (grp) grp.classList.remove('has-error');
      });
    });
  });
}

function showError(inputElement, message) {
  const grp = inputElement.closest('.form-group');
  if (!grp) return;
  grp.classList.add('has-error');
  const errElement = grp.querySelector('.error-message');
  if (errElement) errElement.textContent = message;
}

function handleSuccessSubmit(form) {
  const overlay = form.querySelector('.form-success-overlay');
  
  // Dynamic customized customer thank-you message
  const nameInput = form.querySelector('[name="fullname"]');
  const clientName = nameInput ? nameInput.value.trim().split(' ')[0] : 'Guest';
  
  const greetingText = overlay ? overlay.querySelector('.success-greeting') : null;
  if (greetingText) {
    greetingText.textContent = `Thank you, ${clientName}!`;
  }
  
  if (overlay) {
    overlay.classList.add('show');
  }

  // Simulate form transmission (Google Ads Lead Conversion trigger point)
  console.log('Google Ads Lead Triggered successfully for Label Ricah Style Consultation!');
  
  // Optional: Trigger custom analytics events if gtag is present
  if (typeof gtag !== 'undefined') {
    gtag('event', 'conversion', {
      'send_to': 'AW-CONVERSION_ID/LABEL_RICAH_LEAD',
      'value': 1.0,
      'currency': 'INR'
    });
  }

  // Reset form after a small delay
  setTimeout(() => {
    form.reset();
  }, 1000);
}

/* ========================================================================
   6. DYNAMIC PRODUCTS WHATSAPP INQUIRIES
   ======================================================================== */
function initProductInquiries() {
  const inquireButtons = document.querySelectorAll('[data-inquiry-product]');
  
  inquireButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-inquiry-product');
      const category = btn.getAttribute('data-inquiry-category');
      
      const encodedMsg = encodeURIComponent(
        `Hello Label Ricah, I am interested in inquiring about the "${product}" from your "${category}" collection. Could you please share more details, fabric customizations, and availability?`
      );
      
      // WhatsApp API hook (realistic high-converting secondary conversion)
      const whatsappURL = `https://wa.me/919876543210?text=${encodedMsg}`;
      window.open(whatsappURL, '_blank');
      
      // Log conversion tracking
      console.log(`Secondary WhatsApp inquiry conversion registered for product: ${product}`);
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          'event_category': 'Engagement',
          'event_label': product
        });
      }
    });
  });
}
