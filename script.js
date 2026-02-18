/* ============================================================
   script.js — Portfolio Logic V5 (Reconstruction)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMeshGradient();
    initScrollAnimations();
    initMobileMenu();
    initModalSystem();
});

/* ------------------------------------------------------------
   1. Modern Mesh Gradient Mouse Follow
   ------------------------------------------------------------ */
function initMeshGradient() {
    // Create the background elements if they don't exist
    if (!document.querySelector('.mesh-bg')) {
        const bg = document.createElement('div');
        bg.className = 'mesh-bg';
        document.body.prepend(bg); // Very back
    }
    if (!document.querySelector('.mesh-cursor')) {
        const cursor = document.createElement('div');
        cursor.className = 'mesh-cursor';
        document.body.prepend(cursor); // Just in front of bg
    }

    const cursorEl = document.querySelector('.mesh-cursor');

    // Mouse Interaction
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Use transform for performance
        // Center the 600px circle on cursor
        cursorEl.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    });
}

/* ------------------------------------------------------------
   2. Scroll Animations (Intersection Observer)
   ------------------------------------------------------------ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    // Target Elements: Timeline Nodes, Bento Boxes, Hero Text
    const targets = document.querySelectorAll('.timeline-node, .bento-box, .hero-label, .hero-title, .hero-subtitle, .hero-actions, .project-card');

    targets.forEach((el, index) => {
        // Set initial state via JS to avoid FOUC if JS fails
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.1}s`;
        observer.observe(el);
    });
}

/* ------------------------------------------------------------
   3. Mobile Menu Logic
   ------------------------------------------------------------ */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // Animate hamburger if needed (CSS usually handles this via class)
        });
    }
}

/* ------------------------------------------------------------
   4. Project Focus System (The Modal)
   ------------------------------------------------------------ */
function initModalSystem() {
    // Create Global Modal Overlay if not exists
    if (!document.querySelector('.modal-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                
                <div class="project-3d-visual">
                    <i class="fa-brands fa-github"></i>
                </div>
                
                <div class="modal-details">
                    <h2 class="modal-title">Project Title</h2>
                    <p class="modal-desc" style="color:var(--text-muted); margin-bottom:2rem;">
                        Project description goes here...
                    </p>
                    <div class="modal-actions">
                        <a href="#" class="btn-primary modal-github" target="_blank">
                            <i class="fa-brands fa-github"></i> GitHub Repo
                        </a>
                        <a href="#" class="btn-outline modal-abstract" target="_blank">
                            <i class="fa-solid fa-file-pdf"></i> Abstract PDF
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Bind Close Events
        const closeBtn = overlay.querySelector('.modal-close');
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    // Bind Open Events
    // Assuming project cards have data attributes: data-title, data-desc, data-github, data-abstract
    // Or we use existing inline onclicks and redirect them here. 
    // Ideally, we rewrite inline onclicks to event listeners, but to be safe with existing HTML structure:
    window.openModal = function (projectId) {
        // Map projectId to content (Simulation since we don't have a DB)
        // In a real refactor, create a content map.
        const contentMap = {
            'modal-precip': {
                title: 'Precipitation Modeling Optimization',
                desc: 'Developed and implemented a novel directional DEM smoothing and stratified kriging framework, reducing precipitation estimation errors by 45.4%. Grade 1.0 Master\'s Project.',
                github: 'https://github.com/Kripankc/Study_Project',
                tag: 'Study_Project'
            },
            'modal-memory': {
                title: 'Geospatial Memory Optimizer',
                desc: 'A specialized Python framework designed to handle large-scale geospatial data processing by implementing Copy-On-Write (COW) shared memory architecture. Significantly reduces RAM overhead.',
                github: 'https://github.com/Kripankc/geospatial-memory-optimizer',
                tag: 'Python Tool'
            },
            'modal-voronoi': {
                title: 'Raster Voronoi Solver',
                desc: 'High-performance algorithm for generating Voronoi diagrams directly on raster grids, optimized for environmental modeling.',
                github: 'https://github.com/Kripankc/raster-voronoi-solver',
                tag: 'Algorithm'
            },
            'modal-flood': {
                title: 'Flood Risk Reduction in Roßhaupten',
                desc: 'Micro-level flood risk assessment utilizing high-res topography and hydrological modeling. Analyzed runoff mitigation strategies (culverts, basins).',
                github: '#',
                tag: 'Risk Analysis'
            },
            'modal-snow': {
                title: 'Snowmelt Runoff Modeling',
                desc: 'Physically-based snowmelt model integrating satellite-derived radiation data via GEE for the Inn River Basin.',
                github: '#',
                tag: 'Hydrology'
            },
            'modal-glacier': {
                title: 'Glacier Dynamics in Nepal',
                desc: 'Long-term analysis (1990-2020) of glacier changes in the Marshyangdi river basin using ML and multi-temporal satellite imagery.',
                github: '#',
                tag: 'Climate Change'
            },
            'modal-lulc': {
                title: 'Post-Disaster LULC Change',
                desc: 'Quantified Land Use/Land Cover changes in Panauti/Banepa Valley following the 2015 earthquake using Remote Sensing.',
                github: '#',
                tag: 'Remote Sensing'
            },
            // Defaults for others
            'default': {
                title: 'Geospatial Project',
                desc: 'Detailed analysis and modeling using advanced GIS techniques.',
                github: '#',
                tag: 'GIS'
            }
        };

        const data = contentMap[projectId] || contentMap['default'];
        const overlay = document.querySelector('.modal-overlay');

        // Populate Data
        overlay.querySelector('.modal-title').textContent = data.title;
        overlay.querySelector('.modal-desc').textContent = data.desc;
        overlay.querySelector('.modal-github').href = data.github;
        // Abstract PDF link logic? For now uses # or same as github
        overlay.querySelector('.modal-abstract').href = '#';

        // Visual Icon
        const icon = overlay.querySelector('.project-3d-visual i');
        icon.className = projectId.includes('code') || projectId.includes('memory') ? 'fa-brands fa-python' : 'fa-solid fa-layer-group';

        // Show
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}
