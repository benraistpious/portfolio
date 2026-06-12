document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------
    // Theme Toggle Logic
    // -----------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) themeToggle.innerHTML = '☾';
    } else {
        document.body.classList.remove('light-theme');
        if (themeToggle) themeToggle.innerHTML = '☀';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            let theme = 'dark';
            if (document.body.classList.contains('light-theme')) {
                theme = 'light';
                themeToggle.innerHTML = '☾';
            } else {
                themeToggle.innerHTML = '☀';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // -----------------------------------------
    // Navbar Overlay & Click Logic
    // -----------------------------------------
    const navbar = document.getElementById('navbar');
    const overlay = document.getElementById('overlay');

    if (navbar && overlay) {
        navbar.addEventListener('mouseenter', () => {
            if (!navbar.classList.contains('force-close')) {
                overlay.classList.add('active');
            }
        });

        navbar.addEventListener('mouseleave', () => {
            overlay.classList.remove('active');
            navbar.classList.remove('force-close'); // Reset the forced close state
        });
    }

    const navLinks = document.querySelectorAll('.navbar-content a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) navbar.classList.add('force-close');
            if (overlay) overlay.classList.remove('active');
        });
    });

    // -----------------------------------------
    // Morphing Wireframe Cursor Logic (Desktop Only)
    // -----------------------------------------
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.createElement('div');
        cursor.classList.add('glass-cursor');
        document.body.appendChild(cursor);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        
        let cursorX = mouseX;
        let cursorY = mouseY;
        let cursorWidth = 40;
        let cursorHeight = 40;
        let cursorRadius = 50;

        let targetElement = null;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Event Delegation for dynamically generated elements
        document.addEventListener('mouseover', (e) => {
            const el = e.target.closest('a, button, .navbar-trigger');
            if (el) {
                targetElement = el;
                el.style.cursor = 'none';
            }
        });

        document.addEventListener('mouseout', (e) => {
            const el = e.target.closest('a, button, .navbar-trigger');
            if (el && targetElement === el) {
                targetElement = null;
            }
        });

        function animateCursor() {
            let targetX = mouseX;
            let targetY = mouseY;
            let targetW = 40;
            let targetH = 40;
            let targetR = 50; 

            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                targetW = rect.width + 16;
                targetH = rect.height + 16;
                targetX = rect.left + rect.width / 2;
                targetY = rect.top + rect.height / 2;
                
                const computedStyle = window.getComputedStyle(targetElement);
                if (computedStyle.borderRadius !== '0px' && computedStyle.borderRadius !== '0') {
                    targetR = parseInt(computedStyle.borderRadius) > 10 ? 50 : 0;
                } else {
                    targetR = 0; 
                }
            }

            cursorX += (targetX - cursorX) * 0.2;
            cursorY += (targetY - cursorY) * 0.2;
            cursorWidth += (targetW - cursorWidth) * 0.2;
            cursorHeight += (targetH - cursorHeight) * 0.2;
            cursorRadius += (targetR - cursorRadius) * 0.2;

            cursor.style.width = `${cursorWidth}px`;
            cursor.style.height = `${cursorHeight}px`;
            cursor.style.borderRadius = `${cursorRadius}%`;
            cursor.style.transform = `translate(${cursorX - (cursorWidth / 2)}px, ${cursorY - (cursorHeight / 2)}px)`;

            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
        
        document.body.style.cursor = 'none';
        
        // Initial hide for static elements
        document.querySelectorAll('a, button, .navbar-trigger').forEach(el => {
            el.style.cursor = 'none';
        });
    }

    // -----------------------------------------
    // Scroll Tracking API
    // -----------------------------------------
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link'); 

    const observerOptions = {
        root: null,
        rootMargin: '0px -60% 0px -20%', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => link.classList.remove('active'));
                
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // -----------------------------------------
    // Automatic Loading Screen Logic
    // -----------------------------------------
    const splashScreen = document.getElementById('splashScreen');
    const loadingSlice = document.querySelector('.loading-slice');
    
    // Prevent scrolling while loading screen is active
    document.body.style.overflow = 'hidden';

    if (splashScreen && loadingSlice) {
        loadingSlice.addEventListener('animationend', () => {
            // Wait just a moment for visual impact once full
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                
                // Restore scrolling once slide-up animation completes
                setTimeout(() => {
                    document.body.style.overflow = 'auto';
                }, 800); 
            }, 300);
        });
    }

    // -----------------------------------------
    // Project Rendering (Client-Side CMS)
    // -----------------------------------------
    const projectsGrid = document.getElementById('projectsGrid');

    if (projectsGrid) {
        // Default Projects (Fallback)
        const defaultProjects = [
            {
                id: 1,
                title: "Brutalist Agency Template",
                description: "A high-contrast web template focusing on bold typography and stark geometry.",
                softwares: ["Figma"],
                link: "#"
            },
            {
                id: 2,
                title: "Fintech Dashboard",
                description: "Redesigned financial overview with a modular widget system for better readability.",
                softwares: ["Figma", "Illustrator"],
                link: "#"
            },
            {
                id: 3,
                title: "AI Image Generator UI",
                description: "Clean, prompt-focused interface designed for a new AI generation tool.",
                softwares: ["Figma", "AI Tools"],
                link: "#"
            }
        ];

        // Load from localStorage or use defaults
        const storedProjects = localStorage.getItem('portfolioProjects');
        let projects = [];

        if (storedProjects) {
            projects = JSON.parse(storedProjects);
        } else {
            projects = defaultProjects;
            localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        }

        // Software Icon Map based on constraints
        const iconMap = {
            "Figma": "ph:figma-logo-bold",
            "Photoshop": "ph:image-bold",
            "Illustrator": "ph:pen-nib-bold",
            "Notion": "ph:notebook-bold",
            "AI Tools": "ph:robot-bold"
        };

        // Render Cards
        projectsGrid.innerHTML = '';
        projects.forEach(proj => {
            // Generate software tags
            const tagsHTML = proj.softwares.map(soft => {
                const icon = iconMap[soft] || "ph:code-bold";
                return `<span><iconify-icon icon="${icon}"></iconify-icon> ${soft}</span>`;
            }).join('');

            // Apply uploaded image if available
            const bannerStyle = proj.image 
                ? `style="background-image: url('${proj.image}'); background-size: cover; background-position: center;"` 
                : '';

            const cardHTML = `
                <article class="brutal-card">
                    <div class="card-banner" ${bannerStyle}></div>
                    <div class="card-content">
                        <h3>${proj.title}</h3>
                        <div class="software-tags">
                            ${tagsHTML}
                        </div>
                        <p>${proj.description}</p>
                        <a href="${proj.link || '#'}" class="btn btn-primary" target="_blank">View Full Project</a>
                    </div>
                </article>
            `;
            projectsGrid.innerHTML += cardHTML;
        });

        // (Cursor event delegation handles dynamic hover automatically)
    }

    // -----------------------------------------
    // Motion Blur on Scroll
    // -----------------------------------------
    const mainContent = document.querySelector('.main-content');
    let lastScrollLeft = window.scrollX;
    let scrollTimeout;

    if (mainContent) {
        window.addEventListener('scroll', () => {
            const scrollLeft = window.scrollX;
            const scrollDelta = Math.abs(scrollLeft - lastScrollLeft);
            lastScrollLeft = scrollLeft;

            // Cap the blur so it doesn't get nauseating (max 8px)
            const blurAmount = Math.min(scrollDelta * 0.05, 8); 

            if (blurAmount > 0.5) {
                // Remove transition during active scroll so it updates instantly
                mainContent.style.transition = 'none';
                mainContent.style.filter = `blur(${blurAmount}px)`;
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Smoothly return to sharp focus when scrolling stops
                mainContent.style.transition = 'filter 0.3s ease-out';
                mainContent.style.filter = 'blur(0px)';
            }, 60);
        });
    }

    // -----------------------------------------
    // Horizontal Scroll Mapping
    // -----------------------------------------
    window.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // Multiply deltaY to increase scroll speed (e.g., by 3)
            window.scrollBy({
                left: e.deltaY * 3,
                behavior: 'auto'
            });
            e.preventDefault();
        }
    }, { passive: false });

});
