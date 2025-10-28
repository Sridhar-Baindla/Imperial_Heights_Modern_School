// Initialize Lucide Icons & All Features
document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function () {
            const isActive = mobileNav.classList.toggle('active');
            mobileNav.setAttribute('aria-hidden', String(!isActive));
            mobileMenuBtn.setAttribute('aria-expanded', String(isActive));
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
            lucide.createIcons();
        });
    }

    // Close menu on nav link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // --- Smooth scrolling for nav links ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Special Buttons ---
    document.querySelectorAll('button').forEach(button => {
        const text = button.textContent;
        if (/Admission|Apply|Start Application/i.test(text)) {
            button.addEventListener('click', () => scrollToSection('#programs'));
        } else if (/Contact|Message|Schedule Visit/i.test(text)) {
            button.addEventListener('click', () => scrollToSection('#contact'));
        } else if (/Brochure/i.test(text)) {
            button.addEventListener('click', () => downloadBrochure());
        } else if (/Get Directions/i.test(text)) {
            button.addEventListener('click', () => openDirections());
        } else if (/Schedule Campus Tour/i.test(text)) {
            button.addEventListener('click', () => prefillContactForm('tour'));
        } else if (/Request Callback/i.test(text)) {
            button.addEventListener('click', () => prefillContactForm('other'));
        }
    });

    // --- Footer Links ---
    const footerAdmissions = document.querySelector('.footer-links a[href="#"]');
    if (footerAdmissions && footerAdmissions.textContent.includes("Admissions")) {
        footerAdmissions.addEventListener('click', e => {
            e.preventDefault();
            scrollToSection('#programs');
        });
    }

    const programLinksMap = {
        "Early Childhood": ".program-card.early-childhood",
        "Primary Education": ".program-card.primary",
        "Middle School": ".program-card.middle",
        "High School": ".program-card.high"
    };
    document.querySelectorAll('.footer-links a').forEach(link => {
        const text = link.textContent.trim();
        if (programLinksMap[text]) {
            link.addEventListener('click', e => {
                e.preventDefault();
                scrollToElement(programLinksMap[text], -20);
            });
        }
    });

    // --- Header background on scroll ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        header.style.backgroundColor = scrollTop > 100
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(255, 255, 255, 0.95)';
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(contactForm).entries());
            if (!data.parentName || !data.email || !data.phone || !data.subject || !data.message) {
                return showNotification('Please fill in all required fields.', 'error');
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                return showNotification('Please enter a valid email address.', 'error');
            }
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }

    // --- Newsletter Form ---
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', e => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            if (!email) return showNotification('Please enter your email address.', 'error');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return showNotification('Please enter a valid email address.', 'error');
            }
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        });
    }

    // --- Intersection Observer (animations) ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('fade-in-up');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.feature-card, .program-card, .facility-card, .contact-card')
        .forEach(el => observer.observe(el));

    // --- Stats Counter ---
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(stat => statsObserver.observe(stat));

    // --- Ripple Effect ---
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', e => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position: absolute; border-radius: 50%; background: rgba(255,255,255,0.4);
                transform: scale(0); animation: ripple 0.6s ease-out;
                left:${e.clientX - rect.left - size / 2}px; 
                top:${e.clientY - rect.top - size / 2}px; 
                width:${size}px; height:${size}px;
            `;
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// --- Utility Functions ---
function scrollToSection(selector) {
    const target = document.querySelector(selector);
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' });
    }
}
function scrollToElement(selector, offset = 0) {
    const el = document.querySelector(selector);
    if (el) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        window.scrollTo({ top: el.offsetTop - headerHeight + offset, behavior: 'smooth' });
    }
}
function downloadBrochure() {
    const link = document.createElement('a');
    link.href = 'assets/brochure.pdf';
    link.download = 'Imperial-Heights-Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
}
function openDirections() {
    const addr = encodeURIComponent("Imperial Heights Modern School, Yellareddy, Kamareddy, Telangana 503108, India");
    window.open(`https://www.google.com/maps/search/?api=1&query=${addr}`, "_blank");
}
function prefillContactForm(subjectValue) {
    const form = document.getElementById('contactForm');
    if (form) {
        const subjectSelect = form.querySelector('#subject');
        if (subjectSelect) subjectSelect.value = subjectValue;
        scrollToElement('#contactForm');
    }
}

// --- Notifications ---
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i data-lucide="x"></i></button>
        </div>
    `;
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification { position: fixed; top:2rem; right:2rem; z-index:1000; background:white;
                padding:1rem 1.5rem; border-radius:0.5rem; box-shadow:0 10px 25px -5px rgba(0,0,0,.15);
                border-left:4px solid; max-width:400px; animation: slideInRight 0.3s ease-out; }
            .notification-success{border-left-color:#10b981;}
            .notification-error{border-left-color:#ef4444;}
            .notification-info{border-left-color:#3b82f6;}
            .notification-content{display:flex; align-items:center; gap:0.75rem;}
            .notification-close{background:none; border:none; cursor:pointer; margin-left:auto;}
            @keyframes slideInRight{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}
            @keyframes slideOutRight{from{transform:translateX(0);opacity:1;}to{transform:translateX(100%);opacity:0;}}
        `;
        document.head.appendChild(styles);
    }
    document.body.appendChild(notification);
    lucide.createIcons();
    const autoRemove = setTimeout(() => removeNotification(notification), 5000);
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}
function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
}

// --- Number Counter ---
function animateNumber(el) {
    const text = el.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const number = parseInt(text.replace(/\D/g, ''));
    if (isNaN(number)) return;
    const duration = 2000, steps = 60, increment = number / steps, stepDuration = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        let displayValue = Math.floor(current).toString();
        if (hasPlus) displayValue += '+';
        if (hasPercent) displayValue += '%';
        el.textContent = displayValue;
    }, stepDuration);
}

// --- CSS for Ripple ---
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
document.head.appendChild(rippleStyles);

// --- Parallax Background ---
(function() {
    const hero = document.querySelector('.hero-background');
    if (!hero) return;
    let ticking = false;
    function update() {
        const y = window.scrollY;
        // smaller multiplier for subtlety
        hero.style.transform = `translateY(${y * -0.25}px)`;
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
})();

// --- Lazy Load Images ---
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imgObserver.unobserve(img);
                }
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// Modal focus management and ARIA updates
let _previouslyFocusedElement = null;
function openAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (!modal) return;
    _previouslyFocusedElement = document.activeElement;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // stop background scroll
    const content = modal.querySelector('.modal-content');
    if (content) content.focus();
    // close on ESC
    function onEsc(e) {
        if (e.key === 'Escape') closeAboutModal();
    }
    modal._escListener = onEsc;
    document.addEventListener('keydown', onEsc);
}

function closeAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    if (document.removeEventListener && modal._escListener) {
        document.removeEventListener('keydown', modal._escListener);
        modal._escListener = null;
    }
    if (_previouslyFocusedElement) _previouslyFocusedElement.focus();
}
function openTourForm() {
    window.location.href = "./about/schedule-tour.html"; 
}
function openProgram(program) {
    // Example redirect
    if(program === 'early') window.location.href = "./academic/early-childhood.html";
    if(program === 'primary') window.location.href = "./academic/primary.html";
    if(program === 'middle') window.location.href = "./academic/middle.html";
    if(program === 'high') window.location.href = "./academic/high.html";
}
// Select the header
const header = document.querySelector('.header');

// On scroll, check the scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { // adjust threshold for smooth effect
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".feature-card");
  const popup = document.querySelector(".popup");
  const popupTitle = popup.querySelector(".popup-title");
  const popupDesc = popup.querySelector(".popup-description");
  const popupImages = popup.querySelector(".popup-images");
  const popupClose = popup.querySelector(".popup-close");
  const aboutGrid = document.querySelector(".about-grid");

  const renderImages = (images = []) =>
    images.map(src => src.trim()).filter(Boolean).map(src => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      return img;
    });

const openPopup = (title, description, images) => {
    popupTitle.textContent = title;
    popupDesc.textContent = description;
    popupImages.innerHTML = "";
    renderImages(images).forEach(img => popupImages.appendChild(img));

    aboutGrid.classList.add("blurred");
    popup.classList.add("active");

    // Stop background scrolling
    document.body.style.overflow = "hidden";

    popup.style.opacity = "0";
    popup.style.transform = "translate(-50%, -50%) scale(0.95)";
    requestAnimationFrame(() => {
        popup.style.transition = "opacity 0.35s ease, transform 0.35s ease";
        popup.style.opacity = "1";
        popup.style.transform = "translate(-50%, -50%) scale(1)";
    });
};

const closePopup = () => {
    popup.style.opacity = "0";
    popup.style.transform = "translate(-50%, -50%) scale(0.95)";
    aboutGrid.classList.remove("blurred");

    // Restore background scrolling
    document.body.style.overflow = "auto";

    setTimeout(() => popup.classList.remove("active"), 350);
};

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const title = card.dataset.title || "";
      const description = card.dataset.description || "";
      const images = card.dataset.images?.split(",") || [];
      openPopup(title, description, images);
    });
  });

  popupClose.addEventListener("click", closePopup);

  document.addEventListener("click", e => {
    if (popup.classList.contains("active") && !popup.contains(e.target) && !e.target.closest(".feature-card")) {
      closePopup();
    }
  });
});
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
