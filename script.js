/* ============================================================
   script.js — Portfolio Logic V4 (Senior Upgrade)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initSharedUI();
    // initCursor(); // Removed as per request
    initParallax();
    initScrollReveal();
    initRotationController(); // Main Hero Cube
    initCommandPalette();
    initMobileMenu();
    initProjectLogic(); // Enhanced Modal Logic
});

/* ------------------------------------------------------------
   1. Shared UI Injection (FAB, Background)
   ------------------------------------------------------------ */
function initSharedUI() {
    const body = document.body;

    // Parallax Background
    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'parallax-bg';
    for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        const size = Math.random() * 250 + 100;
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
                    <li><button onclick="toggleCommandPalette()" style="background:none; border:none; color:var(--accent-cyan); cursor:pointer;">Cmd+K</button></li>
                </ul>
            </div>
            <button class="fab-btn">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
        <div class="cmd-overlay">
            <div class="cmd-modal">
                <input type="text" class="cmd-input" placeholder="Type a command or search...">
                <div class="cmd-list"></div>
            </div>
        </div>
    `;
    body.insertAdjacentHTML('beforeend', fabHTML);

    const fabBtn = document.querySelector('.fab-btn');
    const fabContainer = document.querySelector('.fab-container');
    if (fabBtn) {
        fabBtn.addEventListener('click', () => {
            fabContainer.classList.toggle('active');
            const icon = fabBtn.querySelector('i');
            if (fabContainer.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-plus';
            }
        });
    }
}

/* ------------------------------------------------------------
   2. Cmd+K Command Palette
   ------------------------------------------------------------ */
function initCommandPalette() {
    const overlay = document.querySelector('.cmd-overlay');
    const input = document.querySelector('.cmd-input');
    const list = document.querySelector('.cmd-list');

    const commands = [
        { title: 'Home', icon: 'fa-house', action: () => window.location.href = 'index.html' },
        { title: 'Projects', icon: 'fa-briefcase', action: () => window.location.href = 'projects.html' },
        { title: 'Experience', icon: 'fa-timeline', action: () => window.location.href = 'experience.html' },
        { title: 'Skills', icon: 'fa-microchip', action: () => window.location.href = 'skills.html' },
        { title: 'About', icon: 'fa-user', action: () => window.location.href = 'about.html' },
        { title: 'Download CV', icon: 'fa-download', action: () => window.open('Kripan_CV.pdf', '_blank') }
    ];

    function renderCommands(filter = '') {
        list.innerHTML = '';
        const filtered = commands.filter(cmd => cmd.title.toLowerCase().includes(filter.toLowerCase()));

        filtered.forEach((cmd, index) => {
            const item = document.createElement('div');
            item.className = 'cmd-item';
            if (index === 0) item.classList.add('selected');
            item.innerHTML = `
                <i class="fa-solid ${cmd.icon}"></i>
                <span>${cmd.title}</span> 
                <span class="cmd-shortcut">Ret</span>
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
            setTimeout(() => input.focus(), 100);
        } else {
            overlay.classList.remove('open');
        }
    };

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggleCommandPalette();
        }
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            toggleCommandPalette(false);
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) toggleCommandPalette(false);
    });
    input.addEventListener('input', (e) => renderCommands(e.target.value));
}

/* ------------------------------------------------------------
   3. Parallax & Scroll Reveal
   ------------------------------------------------------------ */
function initParallax() {
    const shapes = document.querySelectorAll('.floating-shape');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        shapes.forEach((shape, i) => {
            const speed = (i + 1) * 15;
            shape.style.transform = `translate(${(x - 0.5) * speed}px, ${(y - 0.5) * speed}px)`;
        });
    });
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 50);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .project-card, .bento-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

/* ------------------------------------------------------------
   4. Hero 3D Logic
   ------------------------------------------------------------ */
function initRotationController() {
    const heroCube = document.querySelector('.rotation-stage .rotation-cube');
    if (heroCube) {
        let currentY = 45;
        window.rotateCube = (direction) => {
            if (direction === 'left') currentY -= 90;
            if (direction === 'right') currentY += 90;
            heroCube.style.setProperty('--rot-y', `${currentY}deg`);
        };
    }
}

/* ------------------------------------------------------------
   5. Enhanced Modal Logic (Focus System)
   ------------------------------------------------------------ */
function initProjectLogic() {

    // Global Open Function
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modal-overlay');

        if (modal && overlay) {
            overlay.style.display = 'flex'; // Ensure flex first
            // Trigger reflow for transition
            void overlay.offsetWidth;

            overlay.classList.add('active'); // Fade in overlay

            // Hide all modals first
            document.querySelectorAll('.modal-box').forEach(m => {
                m.style.display = 'none';
                m.classList.remove('active');
            });

            modal.style.display = 'grid'; // Use Grid for new layout

            // Inject 3D Preview if not present
            inject3DPreviewInModal(modal);

            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modal-overlay');

        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
                if (modal) modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 400); // Wait for opacity transition
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
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                    }
                });
            });
        });
    }
}

/* 
   Dynamic 3D Injection for Modals
*/
function inject3DPreviewInModal(modal) {
    const previewContainer = modal.querySelector('.modal-preview-side');
    if (!previewContainer) return;

    // If already injected, just reset styling/rotation?
    if (previewContainer.querySelector('.rotation-stage')) return;

    // Create 3D Stage HTML
    const cubeHTML = `
        <div class="rotation-stage" style="width:180px; height:180px; margin-bottom:1rem;">
            <div class="rotation-cube" id="cube-${modal.id}">
                <div class="cube-face face-front"><i class="fa-solid fa-code"></i></div>
                <div class="cube-face face-back"><i class="fa-solid fa-layer-group"></i></div>
                <div class="cube-face face-right"><i class="fa-solid fa-database"></i></div>
                <div class="cube-face face-left"><i class="fa-solid fa-server"></i></div>
                <div class="cube-face face-top"><i class="fa-solid fa-satellite"></i></div>
                <div class="cube-face face-bottom"><i class="fa-solid fa-microchip"></i></div>
            </div>
        </div>
        <div class="modal-3d-controls">
            <span style="font-size:0.8rem; color:var(--text-muted);">Rotation:</span>
            <select class="rotation-select" onchange="updateModalCube(this, 'cube-${modal.id}')">
                <option value="0deg">0°</option>
                <option value="90deg">90°</option>
                <option value="180deg">180°</option>
                <option value="270deg">270°</option>
                <option value="rotate3d(1,1,1,45deg)">Complex</option>
            </select>
        </div>
    `;
    previewContainer.innerHTML = cubeHTML;
}

window.initMobileMenu = function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
}

// Global helper for the select dropdown
window.updateModalCube = function (select, cubeId) {
    const cube = document.getElementById(cubeId);
    const val = select.value;
    if (val.includes('rotate3d')) {
        cube.style.transform = val;
    } else {
        // Assume Y rotation
        cube.style.transform = `rotateX(-15deg) rotateY(${val})`;
    }
}
