// AI CodeNix - Particle Animation System

class ParticleSystem {
    constructor(containerId = 'particles-container') {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.maxParticles = 15;
        this.animationId = null;
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        this.createParticles();
        this.animate();
        this.handleResize();
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random initial position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 4 + 2;
        
        // Random speed and direction
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        
        // Random color variation
        const colors = ['#00f5ff', '#8a2be2', '#ff006e', '#00ff88'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Set particle properties
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;
        
        // Store movement data
        particle.dataset.x = x;
        particle.dataset.y = y;
        particle.dataset.speedX = speedX;
        particle.dataset.speedY = speedY;
        particle.dataset.originalSize = size;
        
        // Random animation duration
        const duration = Math.random() * 4 + 4;
        particle.style.animation = `float ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
    
    animate() {
        this.particles.forEach(particle => {
            let x = parseFloat(particle.dataset.x);
            let y = parseFloat(particle.dataset.y);
            let speedX = parseFloat(particle.dataset.speedX);
            let speedY = parseFloat(particle.dataset.speedY);
            
            // Update position
            x += speedX;
            y += speedY;
            
            // Bounce off edges
            if (x <= 0 || x >= window.innerWidth - 10) {
                speedX = -speedX;
            }
            if (y <= 0 || y >= window.innerHeight - 10) {
                speedY = -speedY;
            }
            
            // Update particle
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.dataset.x = x;
            particle.dataset.y = y;
            particle.dataset.speedX = speedX;
            particle.dataset.speedY = speedY;
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            // Reposition particles on resize
            this.particles.forEach(particle => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.dataset.x = x;
                particle.dataset.y = y;
            });
        });
    }
    
    addInteractivity() {
        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            this.particles.forEach(particle => {
                const rect = particle.getBoundingClientRect();
                const particleX = rect.left + rect.width / 2;
                const particleY = rect.top + rect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2)
                );
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
                    
                    let currentX = parseFloat(particle.dataset.x);
                    let currentY = parseFloat(particle.dataset.y);
                    
                    currentX += Math.cos(angle) * force * 2;
                    currentY += Math.sin(angle) * force * 2;
                    
                    particle.dataset.x = currentX;
                    particle.dataset.y = currentY;
                    
                    // Scale effect
                    const scale = 1 + force * 0.5;
                    particle.style.transform = `scale(${scale})`;
                    
                    // Glow effect
                    const originalSize = parseFloat(particle.dataset.originalSize);
                    particle.style.boxShadow = `0 0 ${originalSize * 3 * scale}px currentColor`;
                } else {
                    particle.style.transform = 'scale(1)';
                    const originalSize = parseFloat(particle.dataset.originalSize);
                    particle.style.boxShadow = `0 0 ${originalSize * 3}px currentColor`;
                }
            });
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        
        this.particles = [];
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
}

// Enhanced particle effects for special events
class EnhancedParticleEffects {
    static createBurst(x, y, color = '#00f5ff', count = 10) {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle burst-particle';
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 100 + 50;
            const size = Math.random() * 6 + 3;
            
            particle.style.position = 'absolute';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            container.appendChild(particle);
            
            // Animate burst
            const endX = x + Math.cos(angle) * velocity;
            const endY = y + Math.sin(angle) * velocity;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).addEventListener('finish', () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            });
        }
    }
    
    static createTrail(startX, startY, endX, endY, color = '#8a2be2') {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const steps = Math.floor(distance / 10);
        
        for (let i = 0; i < steps; i++) {
            setTimeout(() => {
                const progress = i / steps;
                const x = startX + (endX - startX) * progress;
                const y = startY + (endY - startY) * progress;
                
                const particle = document.createElement('div');
                particle.className = 'particle trail-particle';
                particle.style.position = 'absolute';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.width = '3px';
                particle.style.height = '3px';
                particle.style.background = color;
                particle.style.borderRadius = '50%';
                particle.style.boxShadow = `0 0 10px ${color}`;
                particle.style.pointerEvents = 'none';
                
                container.appendChild(particle);
                
                // Fade out
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.style.transition = 'opacity 0.5s ease';
                        particle.style.opacity = '0';
                        setTimeout(() => {
                            if (particle.parentNode) {
                                particle.parentNode.removeChild(particle);
                            }
                        }, 500);
                    }
                }, 200);
            }, i * 50);
        }
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const particleSystem = new ParticleSystem();
        
        // Add interactivity on non-mobile devices
        if (window.innerWidth > 768) {
            particleSystem.addInteractivity();
        }
        
        // Pause particles when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                particleSystem.pause();
            } else {
                particleSystem.resume();
            }
        });
        
        // Add particle burst effect on successful actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-cyber') || 
                e.target.closest('.btn-cyber')) {
                EnhancedParticleEffects.createBurst(
                    e.clientX, 
                    e.clientY, 
                    '#00f5ff', 
                    8
                );
            }
        });
        
        // Store particle system reference globally
        window.particleSystem = particleSystem;
        window.EnhancedParticleEffects = EnhancedParticleEffects;
    } else {
        // For users who prefer reduced motion, create a simple static background
        const container = document.getElementById('particles-container');
        if (container) {
            container.style.background = 'radial-gradient(circle at 20% 50%, rgba(0, 245, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)';
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.particleSystem) {
        window.particleSystem.destroy();
    }
});
