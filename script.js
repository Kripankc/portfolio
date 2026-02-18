/* ============================================================
   script.js — Portfolio Logic V3 (Creative Tech Upgrade)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initSharedUI();
    initCursor();
    initParallax();
    initScrollReveal();
    initRotationController();
    initCommandPalette();
    initMobileMenu();
    initProjectLogic();
});

/* ------------------------------------------------------------
   1. Shared UI Injection (FAB, Cursor, Background)
   ------------------------------------------------------------ */
function initSharedUI() {
    const body = document.body;

    // Cursor
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    const cursorCircle = document.createElement('div');
    cursorCircle.className = 'cursor-circle';
    body.appendChild(cursorDot);
    body.appendChild(cursorCircle);

    // Parallax Background
    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'parallax-bg';
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        const size = Math.random() * 200 + 100;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.background = i % 2 === 0 ? 'var(--accent-purple)' : 'var(--accent-cyan)';
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        parallaxContainer.appendChild(shape);
    }
    body.prepend(parallaxContainer);

    // FAB & Command UI
    const fabHTML = `
        <div class="fab-container">
            <div class="fab-menu">
                <ul style="text-align:right;">
                    <li style="margin-bottom:0.5rem;"><a href="index.html" style="color:var(--text-main);">Home</a></li>
                    <li style="margin-bottom:0.5rem;"><a href="projects.html" style="color:var(--text-main);">Projects</a></li>
                    <li><button onclick="toggleCommandPalette()" style="background:none; border:none; color:var(--accent-cyan);">Cmd+K</button></li>
                </ul>
            </div>
            <button class="fab-btn">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
        <div class="cmd-overlay">
            <div class="cmd-modal">
                <input type="text" class="cmd-input" placeholder="Type a command or search...">
                <div class="cmd-list">
                    <!-- Dynamic Items -->
                </div>
            </div>
        </div>
    `;
    body.insertAdjacentHTML('beforeend', fabHTML);

    // FAB Logic
    const fabBtn = document.querySelector('.fab-btn');
    const fabContainer = document.querySelector('.fab-container');
    if (fabBtn) {
        fabBtn.addEventListener('click', () => {
            fabContainer.classList.toggle('active');
            fabBtn.querySelector('i').classList.toggle('fa-xmark');
            fabBtn.querySelector('i').classList.toggle('fa-plus');
        });
    }
}

/* ------------------------------------------------------------
   2. Magnetic Cursor
   ------------------------------------------------------------ */
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const circle = document.querySelector('.cursor-circle');

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Smooth follow for circle
    function animateCursor() {
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;

        circle.style.left = `${circleX}px`;
        circle.style.top = `${circleY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Magnet Effect
    const interactables = document.querySelectorAll('a, button, .project-card, .bento-item');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => circle.classList.add('magnet'));
        el.addEventListener('mouseleave', () => circle.classList.remove('magnet'));
    });
}

/* ------------------------------------------------------------
   3. Cmd+K Command Palette
   ------------------------------------------------------------ */
function initCommandPalette() {
    const overlay = document.querySelector('.cmd-overlay');
    const input = document.querySelector('.cmd-input');
    const list = document.querySelector('.cmd-list');

    const commands = [
        { title: 'Go to Home', icon: 'fa-house', action: () => window.location.href = 'index.html' },
        { title: 'View Projects', icon: 'fa-briefcase', action: () => window.location.href = 'projects.html' },
        { title: 'Read Research Details', icon: 'fa-book-open', action: () => window.location.href = 'projects.html' },
        { title: 'See Experience', icon: 'fa-timeline', action: () => window.location.href = 'experience.html' },
        { title: 'Check Skills', icon: 'fa-microchip', action: () => window.location.href = 'skills.html' },
        { title: 'Contact / About', icon: 'fa-user', action: () => window.location.href = 'about.html' },
        { title: 'Download CV', icon: 'fa-download', action: () => window.open('Kripan_CV.pdf', '_blank') },
        { title: 'Toggle Theme (Demo)', icon: 'fa-palette', action: () => alert('Theme toggle demo!') }
    ];

    function renderCommands(filter = '') {
        list.innerHTML = '';
        const filtered = commands.filter(cmd => cmd.title.toLowerCase().includes(filter.toLowerCase()));

        filtered.forEach((cmd, index) => {
            const item = document.createElement('div');
            item.className = 'cmd-item';
            if (index === 0) item.classList.add('selected'); // Auto-select first
            item.innerHTML = `
                <i class="fa-solid ${cmd.icon}"></i>
                <span>${cmd.title}</span>
                <span class="cmd-shortcut">⏎</span>
            `;
            item.addEventListener('click', () => {
                cmd.action();
                toggleCommandPalette(false);
            });
            list.appendChild(item);
        });
    }

    window.toggleCommandPalette = (show) => {
        const isOpen = overlay.classList.contains('open');
        const shouldOpen = show !== undefined ? show : !isOpen;

        if (shouldOpen) {
            overlay.classList.add('open');
            input.value = '';
            renderCommands();
            input.focus();
        } else {
            overlay.classList.remove('open');
        }
    };

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggleCommandPalette();
        }
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            toggleCommandPalette(false);
        }
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) toggleCommandPalette(false);
    });

    // Input filtering
    input.addEventListener('input', (e) => renderCommands(e.target.value));
}

/* ------------------------------------------------------------
   4. Parallax Background & Scroll Reveal
   ------------------------------------------------------------ */
function initParallax() {
    const shapes = document.querySelectorAll('.floating-shape');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, i) => {
            const speed = (i + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Staggered delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .project-card, .bento-item, .glass-card').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(el);
    });
}

/* ------------------------------------------------------------
   5. 3D Rotation Controller
   ------------------------------------------------------------ */
function initRotationController() {
    const cube = document.querySelector('.rotation-cube');
    if (!cube) return;

    let currentY = 45;
    window.rotateCube = (direction) => {
        if (direction === 'left') currentY -= 90;
        if (direction === 'right') currentY += 90;
        cube.style.setProperty('--rot-y', `${currentY}deg`);
    };
}

/* ------------------------------------------------------------
   6. Mobile Menu & Project Logic (Legacy Port)
   ------------------------------------------------------------ */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // Toggle hamburger icon animation handled in CSS
        });
    }
}

function initProjectLogic() {
    // Port existing modal logic if needed, or rely on global scope if inline onclicks used
    // Ensuring global scope for onclick handlers
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modal-overlay');
        if (modal && overlay) {
            overlay.style.display = 'flex';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modal-overlay');
        if (modal && overlay) {
            modal.style.display = 'none';
            // Check if others are open
            const openModals = document.querySelectorAll('.modal-box[style*="display: block"]');
            if (openModals.length === 0) {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    };

    // Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const val = btn.getAttribute('data-filter');
                projects.forEach(card => {
                    const cats = card.getAttribute('data-categories');
                    if (val === 'all' || (cats && cats.includes(val))) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}
