// AI CodeNix - Main JavaScript Functions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeFormValidation();
    initializeCopyButtons();
    initializeCodeHighlighting();
    
    console.log('AI CodeNix initialized successfully');
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Add scroll effect to navbar
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(22, 33, 62, 0.95)';
            } else {
                navbar.style.background = 'rgba(22, 33, 62, 0.8)';
            }
        });
    }
    
    // Mobile menu toggle
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            const isExpanded = navbarCollapse.classList.contains('show');
            if (!isExpanded) {
                navbarCollapse.style.animation = 'slideIn 0.3s ease forwards';
            } else {
                navbarCollapse.style.animation = 'slideOut 0.3s ease forwards';
            }
        });
    }
}

// Animation initialization
function initializeAnimations() {
    // Fade in animation for cards
    const cards = document.querySelectorAll('.feature-card, .generator-card, .auth-card, .history-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-cyber, .btn-cyber-outline');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation on blur
            input.addEventListener('blur', validateField);
            
            // Focus effects
            input.addEventListener('focus', function() {
                this.parentNode.classList.add('focused');
                if (this.classList.contains('cyber-input') || 
                    this.classList.contains('cyber-textarea') || 
                    this.classList.contains('cyber-select')) {
                    this.style.transform = 'scale(1.02)';
                    this.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.3)';
                }
            });
            
            input.addEventListener('blur', function() {
                this.parentNode.classList.remove('focused');
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showToast('Please fix the errors in the form', 'error');
            }
        });
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    let isValid = true;
    let message = '';
    
    // Basic required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    }
    
    // Specific validations
    switch (fieldName) {
        case 'username':
            const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
            if (value && !usernameRegex.test(value)) {
                isValid = false;
                message = 'Username must be 4-20 alphanumeric characters';
            }
            break;
            
        case 'password':
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,50}$/;
            if (value && !passwordRegex.test(value)) {
                isValid = false;
                message = 'Password must contain uppercase, lowercase, number, and special character';
            }
            break;
            
        case 'confirm_password':
            const passwordField = field.form.querySelector('input[name="password"]');
            if (passwordField && value !== passwordField.value) {
                isValid = false;
                message = 'Passwords do not match';
            }
            break;
            
        case 'prompt':
            if (value && (value.length < 10 || value.length > 1000)) {
                isValid = false;
                message = 'Prompt must be between 10 and 1000 characters';
            }
            break;
    }
    
    // Display validation feedback
    displayValidationFeedback(field, isValid, message);
    return isValid;
}

function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField({ target: field })) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

function displayValidationFeedback(field, isValid, message) {
    let feedback = field.parentNode.querySelector('.validation-feedback');
    
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'validation-feedback';
        field.parentNode.appendChild(feedback);
    }
    
    if (!isValid && message) {
        feedback.className = 'validation-feedback error';
        feedback.innerHTML = `<small>${message}</small>`;
        field.style.borderColor = '#ff4757';
    } else if (isValid && field.value.trim()) {
        feedback.className = 'validation-feedback success';
        feedback.innerHTML = '<small class="text-success">✅ Valid</small>';
        field.style.borderColor = '#00ff88';
    } else {
        feedback.innerHTML = '';
        field.style.borderColor = 'rgba(0, 245, 255, 0.3)';
    }
}

// Copy functionality
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('[onclick*="copy"]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const buttonText = this.innerHTML;
            
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Copying...';
            this.disabled = true;
            
            // Reset button after delay
            setTimeout(() => {
                this.innerHTML = buttonText;
                this.disabled = false;
            }, 1000);
        });
    });
}

// Code highlighting
function initializeCodeHighlighting() {
    // Initialize Prism.js if available
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
        
        // Re-highlight code when new content is added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const codeBlocks = mutation.target.querySelectorAll('pre code');
                    if (codeBlocks.length > 0) {
                        Prism.highlightAll();
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Utility functions
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-message');
    existingToasts.forEach(toast => toast.remove());
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    
    const icon = getIconForToastType(type);
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

function getIconForToastType(type) {
    const icons = {
        success: 'check',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Loading state management
function showLoading(element) {
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    element.disabled = true;
}

function hideLoading(element) {
    const originalContent = element.dataset.originalContent;
    if (originalContent) {
        element.innerHTML = originalContent;
        delete element.dataset.originalContent;
    }
    element.disabled = false;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showToast('An error occurred. Please try again.', 'error');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeForm = document.activeElement.closest('form');
        if (activeForm) {
            const submitButton = activeForm.querySelector('button[type="submit"], input[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }
    }
    
    // Escape to close modals or reset forms
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal) {
            // Close modal if present
            const closeButton = activeModal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
            if (closeButton) closeButton.click();
        }
    }
});

// Export functions for global use
window.aiCodeNix = {
    showToast,
    showLoading,
    hideLoading,
    validateField,
    validateForm,
    debounce,
    throttle
};
