// ===================================
// STATE MANAGEMENT
// ===================================
let currentSection = 1;
let totalSections = 12;
let currentLetter = 'current'; // 'current' | 'previous'
let musicPlaying = false;

const LETTER_SECTIONS = { current: 12, previous: 9 };

// ===================================
// DOM ELEMENTS
// ===================================
const musicToggle = document.getElementById('musicToggle');
const volumeControl = document.getElementById('volumeControl');
const backgroundMusic = document.getElementById('backgroundMusic');
const continueIndicator = document.getElementById('continueIndicator');
const particlesContainer = document.getElementById('particles');
const letterCurrentEl = document.getElementById('letterCurrent');
const letterPreviousEl = document.getElementById('letterPrevious');
const btnPrevLetter = document.getElementById('btnPrevLetter');
const btnCurrentLetter = document.getElementById('btnCurrentLetter');

// ===================================
// PARTICLE SYSTEM (ROSES & NOTES)
// ===================================
const ROSE_IMAGE_SRC = 'assets/images/blue-rose.png';
const particleTypes = {
    roses: ['🌹', '🥀', '💙'],
    notes: ['♪', '♫', '♬', '♩']
};

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Randomly choose between rose and note
    const isNote = Math.random() > 0.5;
    
    if (isNote) {
        const symbol = particleTypes.notes[Math.floor(Math.random() * particleTypes.notes.length)];
        particle.textContent = symbol;
        particle.classList.add('note');
        const size = Math.random() * 1.5 + 0.8;
        particle.style.fontSize = size + 'rem';
        const blueShades = [
            'rgba(85, 136, 163, 0.7)',
            'rgba(126, 168, 190, 0.7)',
            'rgba(15, 52, 96, 0.8)',
            'rgba(94, 156, 190, 0.6)'
        ];
        particle.style.color = blueShades[Math.floor(Math.random() * blueShades.length)];
    } else {
        particle.classList.add('rose');
        // Randomly use PNG image OR emoji
        const usePng = Math.random() > 0.5;
        if (usePng) {
            const img = document.createElement('img');
            img.src = ROSE_IMAGE_SRC;
            img.alt = '';
            img.className = 'particle-rose-img';
            const sizePx = Math.floor(Math.random() * 40 + 25); // 25–65px
            img.style.width = sizePx + 'px';
            img.style.height = 'auto';
            img.style.opacity = (Math.random() * 0.4 + 0.5).toFixed(2); // 0.5–0.9
            particle.appendChild(img);
        } else {
            const symbol = particleTypes.roses[Math.floor(Math.random() * particleTypes.roses.length)];
            particle.textContent = symbol;
            const size = Math.random() * 1.5 + 0.8;
            particle.style.fontSize = size + 'rem';
            const blueShades = [
                'rgba(85, 136, 163, 0.7)',
                'rgba(126, 168, 190, 0.7)',
                'rgba(15, 52, 96, 0.8)',
                'rgba(94, 156, 190, 0.6)'
            ];
            particle.style.color = blueShades[Math.floor(Math.random() * blueShades.length)];
        }
    }
    
    // Random positioning
    particle.style.left = Math.random() * 100 + '%';
    
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

function updateVolume() {
    const volume = volumeControl.value / 100;
    backgroundMusic.volume = volume;
}

// Try to play music as soon as the page loads (browsers may block until user taps/clicks)
function tryAutoplay() {
    backgroundMusic.volume = volumeControl.value / 100;
    const promise = backgroundMusic.play();
    if (promise !== undefined) {
        promise
            .then(() => {
                musicPlaying = true;
                musicToggle.classList.add('playing');
            })
            .catch(() => {
                // NotAllowedError = autoplay blocked; user can tap the ♪ button
            });
    }
}

// ===================================
// TEXT REVEAL SYSTEM
// ===================================
function getActiveLetterEl() {
    return currentLetter === 'current' ? letterCurrentEl : letterPreviousEl;
}

function revealNextSection() {
    const letterEl = getActiveLetterEl();
    if (!letterEl) return;

    if (currentSection < totalSections) {
        currentSection++;
        const nextSection = letterEl.querySelector(`.text-section[data-section="${currentSection}"]`);
        
        if (nextSection) {
            nextSection.classList.add('visible');
            setTimeout(() => {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 80);
        }
        
        if (currentSection === totalSections) {
            continueIndicator.classList.add('hidden');
            if (currentLetter === 'current') {
                btnPrevLetter.classList.add('visible');
                btnCurrentLetter.classList.remove('visible');
            } else {
                btnCurrentLetter.classList.add('visible');
                btnPrevLetter.classList.remove('visible');
            }
            createFinalAnimation();
        }
    }
}

function switchToLetter(letter) {
    currentLetter = letter;
    totalSections = LETTER_SECTIONS[letter];
    currentSection = 1;
    
    const showEl = letter === 'current' ? letterCurrentEl : letterPreviousEl;
    const hideEl = letter === 'current' ? letterPreviousEl : letterCurrentEl;
    
    hideEl.classList.add('letter-hidden');
    hideEl.querySelectorAll('.text-section.visible').forEach(s => s.classList.remove('visible'));
    
    showEl.classList.remove('letter-hidden');
    showEl.querySelectorAll('.text-section').forEach((s, i) => {
        s.classList.toggle('visible', parseInt(s.dataset.section, 10) === 1);
    });
    
    continueIndicator.classList.remove('hidden');
    btnPrevLetter.classList.remove('visible');
    btnCurrentLetter.classList.remove('visible');
    
    const newSrc = letter === 'current' ? MUSIC_CURRENT : MUSIC_PREVIOUS;
    backgroundMusic.src = newSrc;
    backgroundMusic.load();
    if (musicPlaying) backgroundMusic.play().catch(() => {});
    
    showEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// ===================================
// OPENING OVERLAY & EXPLOSION
// ===================================
const openingOverlay = document.getElementById('openingOverlay');
const openingCta = document.getElementById('openingCta');
const openingContent = document.getElementById('openingContent');
const explosionDedication = document.getElementById('explosionDedication');
const explosionContainer = document.getElementById('explosionContainer');

const MUSIC_CURRENT = 'assets/music/background2.mp3';
const MUSIC_PREVIOUS = 'assets/music/background.mp3';

const EXPLOSION_ROSES = ['🌹', '🥀', '💙'];
const EXPLOSION_NOTES = ['♪', '♫', '♬', '♩'];

/** Fairy flight path: smooth arc across the screen (like a fairy flying and leaving sparkles) */
function getFairyPathPoints() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const points = [];
    const steps = 28;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const t2 = t * Math.PI;
        const x = w * (0.15 + t * 0.7) + Math.sin(t2) * w * 0.06;
        const y = h * (0.42 - Math.sin(t2) * 0.18) + (1 - t) * h * 0.04;
        points.push({ x, y });
    }
    return points;
}

/** One sparkle left behind at (spawnX, spawnY); it drifts gently and fades */
function createExplosionParticle(type, spawnX, spawnY) {
    const el = document.createElement('div');
    el.className = 'explosion-particle';

    el.style.left = spawnX + 'px';
    el.style.top = spawnY + 'px';

    const driftX = (Math.random() - 0.5) * 48;
    const driftY = 25 + Math.random() * 75;
    const rot = (Math.random() - 0.5) * 60;

    el.style.setProperty('--ex-dx', driftX + 'px');
    el.style.setProperty('--ex-dy', driftY + 'px');
    el.style.setProperty('--ex-rot', rot + 'deg');
    el.style.animationDuration = (1.7 + Math.random() * 0.5) + 's';
    el.style.animationDelay = (Math.random() * 0.05) + 's';

    if (type === 'rose-emoji') {
        el.classList.add('rose-emoji');
        el.textContent = EXPLOSION_ROSES[Math.floor(Math.random() * EXPLOSION_ROSES.length)];
        el.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    } else if (type === 'note') {
        el.classList.add('note-emoji');
        el.textContent = EXPLOSION_NOTES[Math.floor(Math.random() * EXPLOSION_NOTES.length)];
        el.style.fontSize = (1.2 + Math.random() * 1) + 'rem';
    } else {
        el.classList.add('rose-img');
        const img = document.createElement('img');
        img.src = ROSE_IMAGE_SRC;
        img.alt = '';
        el.appendChild(img);
    }

    explosionContainer.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

let explosionStarted = false;

function runExplosionAndDismiss() {
    if (!openingOverlay || openingOverlay.classList.contains('dismissed') || explosionStarted) return;
    explosionStarted = true;

    openingCta.style.opacity = '0';
    openingCta.style.pointerEvents = 'none';
    if (openingContent) openingContent.style.opacity = '0';
    if (explosionDedication) explosionDedication.classList.add('visible');

    const path = getFairyPathPoints();
    const pathLen = path.length;
    let totalSpawned = 0;
    const spawnInterval = 28;
    const totalDuration = pathLen * spawnInterval;

    for (let i = 0; i < pathLen; i++) {
        const point = path[i];
        const countHere = i === 0 || i === pathLen - 1 ? 1 : 2;
        for (let k = 0; k < countHere; k++) {
            const delay = i * spawnInterval + k * (spawnInterval / 2);
            setTimeout(() => {
                const r = Math.random();
                const type = r < 0.4 ? 'rose-emoji' : r < 0.78 ? 'note' : 'rose-img';
                const jitterX = (Math.random() - 0.5) * 16;
                const jitterY = (Math.random() - 0.5) * 12;
                createExplosionParticle(type, point.x + jitterX, point.y + jitterY);
            }, delay);
            totalSpawned++;
        }
    }

    setTimeout(() => {
        openingOverlay.classList.add('dismissed');
        document.body.classList.remove('overlay-active');
        tryAutoplay();
    }, totalDuration + 1800);
}

function initOpeningOverlay() {
    if (!openingOverlay) return;

    const handleClick = (e) => {
        if (e.target.closest('.opening-cta') || e.target === openingOverlay) {
            e.preventDefault();
            runExplosionAndDismiss();
            openingOverlay.removeEventListener('click', handleClick);
            openingCta.removeEventListener('click', handleClick);
        }
    };

    openingOverlay.addEventListener('click', handleClick);
    openingCta.addEventListener('click', (e) => {
        e.stopPropagation();
        runExplosionAndDismiss();
    });

    openingOverlay.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
            const t = e.changedTouches[0];
            runExplosionAndDismiss();
            openingOverlay.removeEventListener('click', handleClick);
        }
    }, { passive: true });
}

// Music controls
musicToggle.addEventListener('click', toggleMusic);
volumeControl.addEventListener('input', updateVolume);

// Text reveal - click anywhere or on indicator
document.addEventListener('click', (e) => {
    if (document.body.classList.contains('overlay-active')) return;
    if (e.target.closest('.music-control') || e.target.closest('.letter-switch-btn')) return;
    revealNextSection();
});

// Letter switching
if (btnPrevLetter) btnPrevLetter.addEventListener('click', (e) => { e.stopPropagation(); switchToLetter('previous'); });
if (btnCurrentLetter) btnCurrentLetter.addEventListener('click', (e) => { e.stopPropagation(); switchToLetter('current'); });

// Also allow keyboard navigation (Space or Enter)
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        if (document.activeElement && document.activeElement.closest('.letter-switch-btn')) return;
        e.preventDefault();
        revealNextSection();
    }
});

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded - You, My Blue Note');
    
    initOpeningOverlay();
    initParticles();
    backgroundMusic.volume = volumeControl.value / 100;
    
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
    
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        if (!e.target.closest('.music-control') && !e.target.closest('.letter-switch-btn')) {
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
