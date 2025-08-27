/*
   IFT iFusion Website JavaScript
   Main JS file for website functionality and interactivity
*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initCarousels();
    initFaqAccordion();
    initContactForm();
    initProductModals();
        initParticles();
    // Spline viewer initialization removed
});

// Navigation functionality
function initNavigation() {
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const backToTop = document.querySelector('.back-to-top');
    
    // Add scrolled class to header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            backToTop.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            backToTop.classList.remove('active');
        }
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && 
            !event.target.closest('.nav-menu') && 
            !event.target.closest('.menu-toggle')) {
            navMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Set active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if ((currentPage === '' || currentPage === 'index.html') && linkHref === 'index.html') {
            link.classList.add('active');
        } else if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}

// Scroll effects (fade-in animations)
function initScrollEffects() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial check
    checkFade();
    
    // Check on scroll
    window.addEventListener('scroll', checkFade);
}

// Product and testimonial carousels
function initCarousels() {
    // Product carousel
    initCarousel('featured-products', 'carousel-dot', 'prev', 'next');
    
    // Testimonial carousel
    initCarousel('testimonials', 'testimonial-dot', 'prev', 'next');
}

function initCarousel(carouselClass, dotClass, prevClass, nextClass) {
    const carousel = document.querySelector(`.${carouselClass}`);
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.product-card, .testimonial-card');
    let dotsContainer;
    if (carouselClass === 'featured-products') {
        dotsContainer = document.querySelector('.carousel-dots');
    } else if (carouselClass === 'testimonials') {
        dotsContainer = document.querySelector('.testimonial-dots');
    }
    const prevButton = document.querySelector(`.${prevClass}`);
    const nextButton = document.querySelector(`.${nextClass}`);
    
    let currentIndex = 0;
    let autoplayInterval;
    let initialUpdate = true;
    
    // Create dots if container exists
    if (dotsContainer) {
        items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add(dotClass);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Previous button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
            resetAutoplay();
        });
    }
    
    // Next button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
            resetAutoplay();
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoplay();
    }
    
    // Update carousel position and active dot
    function updateCarousel() {
        // For mobile scroll snap
        if (window.innerWidth < 992) {
            if (!initialUpdate) {
                items[currentIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
            }
        } else {
            // For desktop transform
            const offset = -currentIndex * (items[0].offsetWidth + 30); // 30px is the gap
            carousel.style.transform = `translateX(${offset}px)`;
        }
        
        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll(`.${dotClass}`);
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }
    
    // Start autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        }, 5000);
    }
    
    // Reset autoplay
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Initialize
    updateCarousel();
    initialUpdate = false;
    startAutoplay();
    
    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Handle resize
    window.addEventListener('resize', updateCarousel);
}

// FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Contact form validation and submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const formSuccess = document.querySelector('.form-success');
    const formFields = contactForm.querySelectorAll('input, select, textarea');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset validation messages
        const validationMessages = contactForm.querySelectorAll('.validation-message');
        validationMessages.forEach(message => {
            message.textContent = '';
        });
        
        // Validate form
        let isValid = true;
        
        formFields.forEach(field => {
            if (field.hasAttribute('required') && !field.value.trim()) {
                const validationMessage = field.nextElementSibling;
                if (validationMessage && validationMessage.classList.contains('validation-message')) {
                    validationMessage.textContent = 'This field is required';
                }
                isValid = false;
            }
            
            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    const validationMessage = field.nextElementSibling;
                    if (validationMessage && validationMessage.classList.contains('validation-message')) {
                        validationMessage.textContent = 'Please enter a valid email address';
                    }
                    isValid = false;
                }
            }
        });
        
        // If form is valid, show success message
        if (isValid) {
            contactForm.style.display = 'none';
            if (formSuccess) {
                formSuccess.style.display = 'block';
            }
            
            // In a real implementation, you would send the form data to a server here
            console.log('Form submitted successfully');
        }
    });
    
    // Real-time validation
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            // Required field validation
            if (field.hasAttribute('required') && !field.value.trim()) {
                const validationMessage = field.nextElementSibling;
                if (validationMessage && validationMessage.classList.contains('validation-message')) {
                    validationMessage.textContent = 'This field is required';
                }
            } else {
                // Email validation
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const validationMessage = field.nextElementSibling;
                    
                    if (!emailRegex.test(field.value.trim()) && validationMessage && 
                        validationMessage.classList.contains('validation-message')) {
                        validationMessage.textContent = 'Please enter a valid email address';
                    } else if (validationMessage && validationMessage.classList.contains('validation-message')) {
                        validationMessage.textContent = '';
                    }
                } else {
                    const validationMessage = field.nextElementSibling;
                    if (validationMessage && validationMessage.classList.contains('validation-message')) {
                        validationMessage.textContent = '';
                    }
                }
            }
        });
        
        // Clear validation message when typing
        field.addEventListener('input', function() {
            const validationMessage = field.nextElementSibling;
            if (validationMessage && validationMessage.classList.contains('validation-message')) {
                validationMessage.textContent = '';
            }
        });
    });
}

// Product modal functionality
function initProductModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal with close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    });
}

// Particles animation for hero section
function initParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    particlesContainer.appendChild(svg);
    
    // Create particles
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const size = Math.random() * 3 + 1;
        
        particle.setAttribute('r', size);
        particle.setAttribute('fill', 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.2) + ')');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.setAttribute('cx', x + '%');
        particle.setAttribute('cy', y + '%');
        
        svg.appendChild(particle);
        
        // Store particle properties for animation
        particles.push({
            element: particle,
            x: x,
            y: y,
            size: size,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2
        });
    }
    
    // Animate particles
    function animateParticles() {
        particles.forEach(p => {
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            

            // Wrap around edges
            if (p.x > 100) p.x = 0;
            if (p.x < 0) p.x = 100;
            if (p.y > 100) p.y = 0;
            if (p.y < 0) p.y = 100;
            
            // Update SVG element
            p.element.setAttribute('cx', p.x + '%');
            p.element.setAttribute('cy', p.y + '%');
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}