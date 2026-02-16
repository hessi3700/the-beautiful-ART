// ===================================
// STATE MANAGEMENT
// ===================================
let currentSection = 1;
let totalSections = 9;
let musicPlaying = false;

// ===================================
// DOM ELEMENTS
// ===================================
const musicToggle = document.getElementById('musicToggle');
const volumeControl = document.getElementById('volumeControl');
const backgroundMusic = document.getElementById('backgroundMusic');
const continueIndicator = document.getElementById('continueIndicator');
const particlesContainer = document.getElementById('particles');
const sections = document.querySelectorAll('.text-section');

// ===================================
// PARTICLE SYSTEM (ROSES & NOTES)
// ===================================
const particleTypes = {
    roses: ['🌹', '🥀', '💙'],
    notes: ['♪', '♫', '♬', '♩']
};

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Randomly choose between rose and note
    const isNote = Math.random() > 0.5;
    const typeArray = isNote ? particleTypes.notes : particleTypes.roses;
    const symbol = typeArray[Math.floor(Math.random() * typeArray.length)];
    
    particle.textContent = symbol;
    particle.classList.add(isNote ? 'note' : 'rose');
    
    // Random positioning
    particle.style.left = Math.random() * 100 + '%';
    
    // Random size
    const size = Math.random() * 1.5 + 0.8; // 0.8 to 2.3
    particle.style.fontSize = size + 'rem';
    
    // Random animation
    const animations = ['floatUp', 'floatUpLeft', 'floatUpWave'];
    const animation = animations[Math.floor(Math.random() * animations.length)];
    particle.style.animationName = animation;
    
    // Random duration
    const duration = Math.random() * 10 + 10; // 10-20 seconds
    particle.style.animationDuration = duration + 's';
    
    // Random delay
    const delay = Math.random() * 5;
    particle.style.animationDelay = delay + 's';
    
    // Random color variation
    const blueShades = [
        'rgba(85, 136, 163, 0.7)',
        'rgba(126, 168, 190, 0.7)',
        'rgba(15, 52, 96, 0.8)',
        'rgba(94, 156, 190, 0.6)'
    ];
    particle.style.color = blueShades[Math.floor(Math.random() * blueShades.length)];
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

// Create initial particles
function initParticles() {
    // Create 30 particles initially
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 200); // Stagger creation
    }
    
    // Continuously create new particles
    setInterval(() => {
        createParticle();
    }, 800); // New particle every 800ms
}

// ===================================
// MUSIC CONTROLS
// ===================================
function toggleMusic() {
    if (musicPlaying) {
        backgroundMusic.pause();
        musicToggle.classList.remove('playing');
        musicPlaying = false;
    } else {
        backgroundMusic.play().catch(error => {
            console.log('Autoplay prevented:', error);
            // Show a user-friendly message
            showMusicError();
        });
        musicToggle.classList.add('playing');
        musicPlaying = true;
    }
}

function showMusicError() {
    // If music file doesn't exist yet, just silently fail
    console.log('Music file not available yet');
}

// Try to start music when the page loads (may be blocked by browser autoplay policy)
function tryAutoplay() {
    backgroundMusic.volume = volumeControl.value / 100;
    const promise = backgroundMusic.play();
    if (promise !== undefined) {
        promise
            .then(() => {
                musicPlaying = true;
                musicToggle.classList.add('playing');
            })
            .catch((err) => {
                // NotAllowedError = browser blocked autoplay (user must click first) – normal, don't log
                if (err.name !== 'NotAllowedError') {
                    console.log('Music could not play:', err.message || err);
                }
            });
    }
}

function updateVolume() {
    const volume = volumeControl.value / 100;
    backgroundMusic.volume = volume;
}

// ===================================
// TEXT REVEAL SYSTEM
// ===================================
function revealNextSection() {
    if (currentSection < totalSections) {
        currentSection++;
        const nextSection = document.querySelector(`[data-section="${currentSection}"]`);
        
        if (nextSection) {
            // Reveal the section
            setTimeout(() => {
                nextSection.classList.add('visible');
            }, 100);
            
            // Smooth scroll to the new section
            setTimeout(() => {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 200);
        }
        
        // Hide continue indicator on last section
        if (currentSection === totalSections) {
            continueIndicator.classList.add('hidden');
            
            // Final animation - make particles more dramatic
            createFinalAnimation();
        }
    }
}

function createFinalAnimation() {
    // Create a burst of particles on final reveal
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 100);
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

// Music controls
musicToggle.addEventListener('click', toggleMusic);
volumeControl.addEventListener('input', updateVolume);

// Text reveal - click anywhere or on indicator
document.addEventListener('click', (e) => {
    // Don't trigger if clicking on music controls
    if (!e.target.closest('.music-control')) {
        revealNextSection();
    }
});

// Also allow keyboard navigation (Space or Enter)
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        revealNextSection();
    }
});

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded - You, My Blue Note');
    
    // Initialize particles
    initParticles();
    
    // Set initial volume
    backgroundMusic.volume = volumeControl.value / 100;
    
    // Try to play music as soon as she opens the site (may be blocked on some browsers until first click)
    setTimeout(tryAutoplay, 300);
    
    // Reveal first section automatically
    const firstSection = document.querySelector('[data-section="1"]');
    if (firstSection) {
        firstSection.classList.add('visible');
    }
    
    // Add smooth reveal animation to title
    const titleSection = document.querySelector('.title-section');
    if (titleSection) {
        titleSection.style.opacity = '0';
        setTimeout(() => {
            titleSection.style.transition = 'opacity 2s ease';
            titleSection.style.opacity = '1';
        }, 100);
    }
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Prevent context menu on long press (mobile)
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.particle')) {
        e.preventDefault();
    }
});

// Handle visibility change (pause music when tab not active)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && musicPlaying) {
        backgroundMusic.pause();
    } else if (!document.hidden && musicPlaying) {
        backgroundMusic.play().catch(err => console.log('Resume playback failed:', err));
    }
});

// Optimize particle creation for performance
let lastParticleTime = 0;
const particleThrottle = 500; // Min time between particles

function throttledCreateParticle() {
    const now = Date.now();
    if (now - lastParticleTime > particleThrottle) {
        createParticle();
        lastParticleTime = now;
    }
}

// ===================================
// RESPONSIVE TOUCH HANDLING
// ===================================
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // If it's a tap (not a swipe)
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        if (!e.target.closest('.music-control')) {
            revealNextSection();
        }
    }
}, { passive: true });

// ===================================
// EASTER EGG: Special effect on Artemis name
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const messageContent = document.querySelector('.message-content');
    
    messageContent.addEventListener('mouseover', (e) => {
        if (e.target.textContent.includes('Artemis')) {
            // Create a subtle sparkle effect
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.textContent = '✨';
                    sparkle.style.position = 'fixed';
                    sparkle.style.left = e.clientX + (Math.random() * 40 - 20) + 'px';
                    sparkle.style.top = e.clientY + (Math.random() * 40 - 20) + 'px';
                    sparkle.style.fontSize = '1rem';
                    sparkle.style.pointerEvents = 'none';
                    sparkle.style.zIndex = '9999';
                    sparkle.style.animation = 'sparkle 1s ease-out forwards';
                    document.body.appendChild(sparkle);
                    
                    setTimeout(() => sparkle.remove(), 1000);
                }, i * 100);
            }
        }
    });
});

// Sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0);
        }
        50% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-40px) scale(0.5);
        }
    }
`;
document.head.appendChild(style);

console.log('💙 All systems ready. Click anywhere to begin the journey...');
