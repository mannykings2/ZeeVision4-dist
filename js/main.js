/**
 * ZeeVision - Identity Verification Platform
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initCodeTabs();
    initCopyButton();
    initSmoothScroll();
});

/**
 * Navigation Component
 * - Sticky navigation on scroll
 * - Mobile menu handling
 */
function initNavigation() {
    const navbar = document.getElementById('mainNav');
    let lastScrollTop = 0;
    
    // Handle scroll effects
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

/**
 * Scroll Animations
 * - Animate elements when they come into view
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Counter Animation
 * - Animate numbers counting up
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = formatNumber(Math.floor(current));
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = formatNumber(target);
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Code Tabs
 * - Switch between code examples
 */
function initCodeTabs() {
    const codeTabs = document.querySelectorAll('.code-tab');
    const codeDisplay = document.getElementById('code-display');
    
    const codeSnippets = {
        javascript: `// Initialize the ZeeVision client
const client = new ZeeVision({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Create a verification session
const session = await client.verification.create({
  callbackUrl: 'https://your-app.com/callback',
  template: 'standard',
  metadata: {
    userId: 'user-12345'
  }
});

console.log('Verification URL:', session.url);`,
        
        python: `from zeevision import Client

# Initialize the client
client = Client(
    api_key='your-api-key',
    environment='production'
)

# Create a verification session
session = client.verification.create(
    callback_url='https://your-app.com/callback',
    template='standard',
    metadata={
        'user_id': 'user-12345'
    }
)

print(f'Verification URL: {session.url}')`,
        
        curl: `curl -X POST "https://api.zeevision.com/v1/verifications" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "callback_url": "https://your-app.com/callback",
    "template": "standard",
    "metadata": {
      "user_id": "user-12345"
    }
  }'`
    };
    
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active state
            codeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update code display
            const lang = this.getAttribute('data-lang');
            const code = codeSnippets[lang];
            codeDisplay.innerHTML = `<code class="language-${lang}">${escapeHtml(code)}</code>`;
        });
    });
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Copy Button
 * - Copy code to clipboard
 */
function initCopyButton() {
    const copyBtn = document.querySelector('.copy-btn');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const codeDisplay = document.getElementById('code-display');
            const code = codeDisplay.textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                // Show success feedback
                const icon = this.querySelector('i');
                icon.className = 'bi bi-check2';
                this.classList.add('copied');
                
                setTimeout(() => {
                    icon.className = 'bi bi-clipboard';
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }
}

/**
 * Smooth Scroll
 * - Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('mainNav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Typing Animation Effect
 * - For hero section text (optional)
 */
function initTypingAnimation() {
    const elements = document.querySelectorAll('[data-typing]');
    
    elements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);
    });
}

/**
 * Parallax Effect
 * - For background elements
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

/**
 * Form Validation
 * - For newsletter subscription
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput && isValidEmail(emailInput.value)) {
                // Show success message
                showNotification('Thank you for subscribing!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    });
}

/**
 * Email validation
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Lazy Load Images
 * - Load images as they come into view
 */
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Mobile Menu Toggle
 * - Enhanced mobile menu behavior
 */
function initMobileMenu() {
    const toggler = document.querySelector('.navbar-toggler');
    const navbar = document.querySelector('.navbar-collapse');
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && !toggler.contains(e.target)) {
            if (navbar.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbar);
                bsCollapse.hide();
            }
        }
    });
}

/**
 * Scroll Progress Indicator
 * - Shows reading progress
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #14b8a6, #06b6d4);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
