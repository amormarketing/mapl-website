/**
 * Manuel Alejandro Polanco Larreal - Personal Website
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeHeader();
    initializeMobileMenu();
    initializeScrollAnimations();
    initializeContactForms();
    initializeSmoothScroll();
    initializePartnerLogos();
    initializeBackToTop();
    
    // Initialize EmailJS if it's available
    if (window.emailjs) {
        console.log("EmailJS is loaded and available");
        emailjs.init("Cj7onGuIZJeiXYXED");
    } else {
        console.error("EmailJS is not loaded properly");
    }
});

/**
 * Back to Top button functionality
 */
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (!backToTopBtn) return;
    
    // Show button when user scrolls down 300px from the top
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Header behavior on scroll
 * Changes header appearance when scrolling down
 */
function initializeHeader() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initial check
    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    }
}

/**
 * Mobile menu functionality
 */
function initializeMobileMenu() {
    // Create menu toggle button if it doesn't exist
    let menuToggle = document.querySelector('.menu-toggle');
    
    if (!menuToggle) {
        menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', 'Toggle menu');
        
        const headerContainer = document.querySelector('.header .container');
        const socialLinks = document.querySelector('.header__social');
        
        if (headerContainer && socialLinks) {
            headerContainer.insertBefore(menuToggle, socialLinks);
        }
    }
    
    const nav = document.querySelector('.header__nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav || !menuToggle) return;
            
            const isClickInsideMenu = nav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && nav.classList.contains('active')) {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
}

/**
 * Scroll animations
 * Adds reveal animations to elements as they enter the viewport
 */
function initializeScrollAnimations() {
    // Add js-hidden class to elements we want to animate
    const animatedElements = document.querySelectorAll('.section__title, .about__content, .impact__card, .news__card, .achievements__content');
    
    animatedElements.forEach(element => {
        element.classList.add('js-hidden');
    });
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
    }
    
    // Function to handle scroll animation
    function handleScrollAnimation() {
        const hiddenElements = document.querySelectorAll('.js-hidden');
        
        hiddenElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('js-visible');
                
                // Add staggered animation to child elements if it's a grid
                if (element.classList.contains('impact__card') || element.classList.contains('news__card')) {
                    const index = Array.from(element.parentElement.children).indexOf(element);
                    element.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }
    
    // Run on initial load
    handleScrollAnimation();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimation);
}

/**
 * Contact form validation and submission
 * Handles both the hero contact form and the footer contact form
 * Now with EmailJS integration
 */
function initializeContactForms() {
    const contactForm = document.getElementById('contactForm');
    const heroContactForm = document.getElementById('heroContactForm');
    
    // Validation regex patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        message: /^.{10,500}$/
    };
    
    // Validation error messages
    const errorMessages = {
        firstName: 'Please enter a valid first name (2-50 characters, letters only)',
        lastName: 'Please enter a valid last name (2-50 characters, letters only)',
        email: 'Please enter a valid email address',
        message: 'Please enter a message (10-500 characters)',
        comment: 'Please enter a comment (10-500 characters)'
    };
    
    // Process main contact form (footer form)
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Validate fields
            let isValid = true;
            
            if (firstName && lastName && email && message) {
                isValid = validateField(firstName, patterns.name, errorMessages.firstName) && isValid;
                isValid = validateField(lastName, patterns.name, errorMessages.lastName) && isValid;
                isValid = validateField(email, patterns.email, errorMessages.email) && isValid;
                isValid = validateField(message, patterns.message, errorMessages.message) && isValid;
                
                if (isValid && window.emailjs) {
                    // Show loading state
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        const originalText = submitButton.textContent;
                        submitButton.textContent = 'Sending...';
                        submitButton.disabled = true;
                        
                        // Collect form data
                        const formData = {
                            first_name: firstName.value,
                            last_name: lastName.value,
                            email: email.value,
                            message: message.value,
                            form_name: 'Footer Contact Form'
                        };
                        
                        console.log("Sending footer form data:", formData);
                        
                        // Send the form using EmailJS
                        emailjs.send(
                            'service_ijhm2nv',
                            'template_nfgh15s',
                            formData
                        )
                        .then(function(response) {
                            console.log("EmailJS Success Response:", response);
                            showToast('Thank you! Your message has been sent.', 'success');
                            contactForm.reset();
                        })
                        .catch(function(error) {
                            console.error('EmailJS Error:', error);
                            showToast('Oops! Something went wrong.', 'error');
                        })
                        .finally(function() {
                            // Reset button state
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        });
                    }
                }
            }
        });
    }
    
    // Process hero contact form
    if (heroContactForm) {
        heroContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const firstName = document.getElementById('heroFirstName');
            const email = document.getElementById('heroEmail');
            const comment = document.getElementById('heroComment');
            
            // Validate fields
            let isValid = true;
            
            if (firstName && email && comment) {
                isValid = validateField(firstName, patterns.name, errorMessages.firstName) && isValid;
                isValid = validateField(email, patterns.email, errorMessages.email) && isValid;
                isValid = validateField(comment, patterns.message, errorMessages.comment) && isValid;
                
                if (isValid && window.emailjs) {
                    // Show loading state
                    const submitButton = heroContactForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        const originalText = submitButton.textContent;
                        submitButton.textContent = 'Sending...';
                        submitButton.disabled = true;
                        
                        // Collect form data
                        const formData = {
                            first_name: firstName.value,
                            last_name: "",
                            email: email.value,
                            message: comment.value,
                            form_name: 'Hero Contact Form'
                        };
                        
                        console.log("Sending hero form data:", formData);
                        
                        // Send the form using EmailJS
                        emailjs.send(
                            'service_ijhm2nv',
                            'template_jm90lfe',
                            formData
                        )
                        .then(function(response) {
                            console.log("EmailJS Success Response:", response);
                            showToast('Thank you! Your message has been sent.', 'success');
                            heroContactForm.reset();
                        })
                        .catch(function(error) {
                            console.error('EmailJS Error:', error);
                            showToast('Oops! Something went wrong.', 'error');
                        })
                        .finally(function() {
                            // Reset button state
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        });
                    }
                }
            }
        });
    }
    
    /**
     * Validate a form field
     * @param {HTMLElement} field - The field to validate
     * @param {RegExp} pattern - The validation pattern
     * @param {string} errorMessage - The error message to display
     * @return {boolean} - Whether the field is valid
     */
    function validateField(field, pattern, errorMessage) {
        if (!field || !field.parentElement) return false;
        
        // Remove any existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Remove error class
        field.classList.remove('form-error');
        
        // Check if the field value matches the pattern
        if (!pattern.test(field.value)) {
            // Add error class
            field.classList.add('form-error');
            
            // Create error message
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = errorMessage;
            
            // Add error message after the field
            field.parentElement.appendChild(error);
            
            return false;
        }
        
        return true;
    }
}

/**
 * Smooth scrolling for navigation links
 */
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (!targetId) return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                // Add extra padding to ensure section titles aren't hidden beneath the header
                const extraPadding = -50;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraPadding;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Partner logos animation
 */
function initializePartnerLogos() {
    const partners = document.querySelectorAll('.partner');
    
    if (partners.length === 0) return;
    
    // Add initial animation class to partner logos
    partners.forEach((partner, index) => {
        partner.style.opacity = '0';
        partner.style.transform = 'translateY(20px)';
        
        // Staggered animation
        setTimeout(() => {
            partner.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            partner.style.opacity = '1';
            partner.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });
}

/**
 * Create a simple toast notification system
 * @param {string} message - The message to display
 * @param {string} type - The type of toast ('success' or 'error')
 */
function showToast(message, type) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '1000';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.style.minWidth = '250px';
    toast.style.margin = '10px';
    toast.style.padding = '15px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.transition = 'all 0.3s ease';
    toast.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
    
    // Set color based on message type
    if (type === 'success') {
        toast.style.backgroundColor = '#3F51B5'; // Using your site's primary color
        toast.style.color = 'white';
    } else {
        toast.style.backgroundColor = '#F44336';
        toast.style.color = 'white';
    }
    
    toast.textContent = message;
    
    // Add CSS for animations
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}