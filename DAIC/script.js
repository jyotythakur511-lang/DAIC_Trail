document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const slides = document.querySelectorAll('.slide');
    const navItems = document.querySelectorAll('.nav-item');
    const navDotsContainer = document.getElementById('nav-dots');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnDeckMode = document.getElementById('btn-deck-mode');
    const btnScrollMode = document.getElementById('btn-scroll-mode');
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const btnPrint = document.getElementById('btn-print');
    const brochureContainer = document.getElementById('brochure-container');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    let currentSlideIndex = 0; // 0-indexed
    let isScrollMode = false;
    
    // -------------------------------------------------------------
    // NAVIGATION GENERATOR & SLIDE DECK FUNCTIONS
    // -------------------------------------------------------------
    
    // Generate Navigation Dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (!isScrollMode) goToSlide(index);
        });
        navDotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Update active state in sidebar and dots
    function updateNavUI(activeIndex) {
        navItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Disabled states for buttons
        btnPrev.disabled = activeIndex === 0;
        btnNext.disabled = activeIndex === slides.length - 1;
    }
    
    // Switch to target slide
    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        
        // Remove active class from old slide, add to new slide
        slides[currentSlideIndex].classList.remove('active');
        slides[index].classList.add('active');
        
        currentSlideIndex = index;
        updateNavUI(currentSlideIndex);
        
        // Smooth scroll focus in case the parent container layout shifts
        brochureContainer.scrollTop = 0;
    }
    
    // Previous & Next controls
    btnPrev.addEventListener('click', () => {
        if (!isScrollMode && currentSlideIndex > 0) {
            goToSlide(currentSlideIndex - 1);
        }
    });
    
    btnNext.addEventListener('click', () => {
        if (!isScrollMode && currentSlideIndex < slides.length - 1) {
            goToSlide(currentSlideIndex + 1);
        }
    });
    
    // Sidebar nav clicks
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (isScrollMode) {
                // Scroll directly to the slide element
                const targetSlide = document.getElementById(`slide-${index + 1}`);
                if (targetSlide) {
                    targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                goToSlide(index);
            }
        });
    });
    
    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (isScrollMode) return;
        
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            if (currentSlideIndex < slides.length - 1) {
                goToSlide(currentSlideIndex + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentSlideIndex > 0) {
                goToSlide(currentSlideIndex - 1);
            }
        }
    });
    
    // -------------------------------------------------------------
    // VIEW MODE SWITCHER (DECK vs SCROLL)
    // -------------------------------------------------------------
    
    function setViewMode(mode) {
        if (mode === 'scroll') {
            isScrollMode = true;
            btnScrollMode.classList.add('active');
            btnDeckMode.classList.remove('active');
            
            brochureContainer.classList.remove('view-deck');
            brochureContainer.classList.add('view-scroll');
            
            // Show all slides and clean inactive attributes
            slides.forEach(slide => slide.classList.add('active'));
            
            // Hide deck footer navigation
            document.getElementById('deck-controls').style.opacity = '0.3';
            document.getElementById('deck-controls').style.pointerEvents = 'none';
            
            // Init Intersection Observer to update sidebar during scrolling
            initScrollObserver();
            
        } else {
            isScrollMode = false;
            btnDeckMode.classList.add('active');
            btnScrollMode.classList.remove('active');
            
            brochureContainer.classList.remove('view-scroll');
            brochureContainer.classList.add('view-deck');
            
            // Hide deck footer navigation
            document.getElementById('deck-controls').style.opacity = '1';
            document.getElementById('deck-controls').style.pointerEvents = 'auto';
            
            // Hide all slides except active index
            slides.forEach((slide, index) => {
                if (index === currentSlideIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            updateNavUI(currentSlideIndex);
            
            // Disconnect Scroll Observer
            if (scrollObserver) {
                scrollObserver.disconnect();
            }
        }
    }
    
    btnDeckMode.addEventListener('click', () => setViewMode('deck'));
    btnScrollMode.addEventListener('click', () => setViewMode('scroll'));
    
    // Intersection Observer for Scroll Mode tracking
    let scrollObserver = null;
    function initScrollObserver() {
        if (scrollObserver) scrollObserver.disconnect();
        
        const options = {
            root: brochureContainer,
            rootMargin: '-50% 0px -50% 0px', // Trigger when slide passes halfway point
            threshold: 0
        };
        
        scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const pageNum = parseInt(entry.target.getAttribute('data-page')) - 1;
                    currentSlideIndex = pageNum;
                    updateNavUI(pageNum);
                }
            });
        }, options);
        
        slides.forEach(slide => scrollObserver.observe(slide));
    }
    
    // -------------------------------------------------------------
    // THEME CONTROLLER & PRINT SERVICES
    // -------------------------------------------------------------
    
    // Theme Toggle
    btnThemeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            html.setAttribute('data-theme', 'light');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            html.setAttribute('data-theme', 'dark');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    });
    
    // Print / Download PDF handler
    btnPrint.addEventListener('click', () => {
        // Display a nice help popup to ensure correct print configurations
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(7, 11, 25, 0.95)';
        overlay.style.color = '#ffffff';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.fontFamily = "'Outfit', sans-serif";
        overlay.style.textAlign = 'center';
        overlay.style.padding = '30px';
        overlay.innerHTML = `
            <div style="background-color:#101835; border:1px solid #00b4d8; padding:40px; border-radius:12px; max-width:550px; box-shadow: 0 10px 40px rgba(0,0,0,0.6)">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                <h2 style="font-size:24px; margin-bottom:15px; color:#ffffff">PDF Generation Instructions</h2>
                <p style="font-size:14px; color:#94a3b8; line-height:1.6; margin-bottom:20px; text-align:left;">
                    To generate a perfect 15-page corporate brochure PDF:
                </p>
                <ol style="font-size:13px; color:#f8fafc; text-align:left; line-height:1.8; margin-bottom:25px; padding-left:20px;">
                    <li>Set <strong>Destination</strong> to <strong>Save as PDF</strong>.</li>
                    <li>Set <strong>Layout</strong> to <strong>Portrait</strong>.</li>
                    <li>Set <strong>Paper Size</strong> to <strong>A4</strong>.</li>
                    <li>Set <strong>Margins</strong> to <strong>Default</strong> or <strong>None</strong>.</li>
                    <li>Check the box for <strong>Background graphics</strong> (highly critical for colors & shapes).</li>
                </ol>
                <button id="btn-start-print" style="background: linear-gradient(135deg, #00b4d8 0%, #2563eb 100%); color:#ffffff; font-weight:600; border:none; padding:12px 28px; border-radius:6px; font-size:14px; cursor:pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.3)">
                    Open Print Dialog
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('btn-start-print').addEventListener('click', () => {
            document.body.removeChild(overlay);
            // Wait brief moment, then trigger system print
            setTimeout(() => {
                window.print();
            }, 300);
        });
    });
});
