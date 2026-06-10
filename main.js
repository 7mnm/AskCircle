/* ==========================================================================
   Askcircle Premium Dynamic Interactions (Vanilla JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Translations Data for Marquee ---
  const marqueeFR = [
    "Covering véhicules", "Impression livre", "Goodies personnalisés", 
    "Vinyle & signalétique", "Matériels événementiels", "Cadeaux corporate", 
    "Grand format", "Wrapping voiture"
  ];

  const marqueeAR = [
    "تغليف مركبات", "طباعة كتب", "هدايا مخصصة", 
    "فينيل وإشارات", "مواد فعاليات", "هدايا شركات", 
    "طباعة ضخمة", "تغليف سيارات"
  ];

  // --- Elements ---
  const html = document.documentElement;
  const langToggleBtn = document.getElementById('lang-toggle');
  const langOptions = document.querySelectorAll('.lang-opt');
  const navBar = document.getElementById('nav-bar');
  const animatedCircle = document.querySelector('.animated-circle');

  // --- Dynamic Font Loader for Arabic (Performance Optimization) ---
  let arFontsLoaded = false;
  
  function loadArabicFonts() {
    if (arFontsLoaded) return;
    
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Noto+Naskh+Arabic:wght@400..700&display=swap';
    
    // Append to head
    document.head.appendChild(fontLink);
    arFontsLoaded = true;
    
    // Add temporary loading class to html to avoid drastic layout shifts
    html.classList.add('fonts-ar-loading');
    fontLink.onload = () => {
      html.classList.remove('fonts-ar-loading');
    };
  }

  // --- Marquee Population ---
  function updateMarquee(lang) {
    const track = document.getElementById('marquee-track-fr');
    if (!track) return;

    const items = lang === 'ar' ? marqueeAR : marqueeFR;
    track.innerHTML = '';

    // Repeat items to fill screen width for seamless looping scroll
    const repeatedItems = [...items, ...items, ...items];
    repeatedItems.forEach(text => {
      const span = document.createElement('span');
      span.textContent = text;
      
      const dotSpan = document.createElement('span');
      dotSpan.className = 'dot';
      dotSpan.textContent = '●';
      
      track.appendChild(span);
      track.appendChild(dotSpan);
    });
  }

  // --- Language Swapping ---
  function setLanguage(lang) {
    // 1. Update Lang and Dir attributes on <html>
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // 2. Load Fonts dynamically if Arabic is selected
    if (lang === 'ar') {
      loadArabicFonts();
    }

    // 3. Toggle Language option active styles
    langOptions.forEach(opt => {
      if (opt.dataset.langVal === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // 4. Update all DOM elements with data-fr and data-ar attributes
    document.querySelectorAll('[data-fr]').forEach(el => {
      el.innerHTML = lang === 'ar' ? el.dataset.ar : el.dataset.fr;
    });

    // 5. Update Marquee terms
    updateMarquee(lang);

    // 6. Save selection in localStorage
    localStorage.setItem('lang', lang);
  }

  // --- Lang Toggle Event Listener ---
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const currentLang = html.lang;
      const nextLang = currentLang === 'ar' ? 'fr' : 'ar';
      setLanguage(nextLang);
    });
  }

  // --- Sticky / Scrolled Navigation Bar ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navBar.classList.add('scrolled');
    } else {
      navBar.classList.remove('scrolled');
    }
  });

  // --- Custom Smooth Scroll Offset (Clickability & Navigation Overlap Fix) ---
  const navLinks = document.querySelectorAll('.nav-links a, .nav-logo');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href === '#' ? 'body' : href;
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const headerHeight = navBar.offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- Services Click-to-Expand Accordion Drawer System ---
  const serviceRows = document.querySelectorAll('.service-row');
  
  serviceRows.forEach(row => {
    row.addEventListener('click', (e) => {
      // Don't trigger toggle if user clicks inside the active expand drawer
      if (e.target.closest('.service-row-details')) {
        return;
      }
      
      const isExpanded = row.classList.contains('expanded');
      
      // Collapse all other rows
      serviceRows.forEach(otherRow => {
        if (otherRow !== row) {
          otherRow.classList.remove('expanded');
        }
      });
      
      // Toggle current row
      if (isExpanded) {
        row.classList.remove('expanded');
      } else {
        row.classList.add('expanded');
      }
    });
  });

  // --- Intersection Observer for Scroll Reveals ---
  // Apply a clean fade-in reveal animation as user scrolls
  const revealElements = document.querySelectorAll('.work-row, .services-list, .statement-quote, .contact-title, .contact-details, .premium-form, .approach-left, .approach-right, .atelier-item');
  
  // Add base reveal classes
  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    scrollObserver.observe(el);
  });

  // --- Trigger Hero SVG Drawing Circle Animation ---
  setTimeout(() => {
    if (animatedCircle) {
      animatedCircle.classList.add('draw');
    }
  }, 100);

  // --- Premium Contact & Reservation Form Submission Handler ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Extract form values
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      console.log('Askcircle Form Captured:', data);

      formStatus.textContent = html.lang === 'ar' ? 'جاري إرسال طلبكم...' : 'Envoi en cours de votre demande...';
      formStatus.className = 'form-status-msg';

      setTimeout(() => {
        formStatus.textContent = html.lang === 'ar' 
          ? 'شكراً لكم! تم إرسال طلب الحجز بنجاح. سنرد عليكم خلال 4 ساعات عمل.' 
          : 'Merci ! Votre demande a été reçue. Nous vous répondrons sous 4 heures ouvrées.';
        formStatus.className = 'form-status-msg success';
        
        contactForm.reset();
      }, 1000);
    });
  }

  // --- Initialize Language State ---
  const savedLang = localStorage.getItem('lang') || 'fr';
  setLanguage(savedLang);
});
