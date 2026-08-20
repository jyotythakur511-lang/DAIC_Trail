document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const iconName = navLinks.classList.contains('active') ? 'x' : 'menu';
        // Need to recreate icon since Lucide swaps the element
        mobileMenuBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
        lucide.createIcons();
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
            lucide.createIcons();
        });
    });

    // 2. Sticky Navbar on Scroll
    const navbar = document.querySelector('.navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    // 3. Scroll Reveal Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: unobserve after revealing
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // 4. Glow Effect tracking mouse on Service Cards
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 5. Save Contact Form Submissions to localStorage
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        // Remove inline onsubmit so we can handle it fully in JS
        form.removeAttribute('onsubmit');
        
        form.addEventListener('submit', e => {
            e.preventDefault();
            
            const nameEl = form.querySelector('#name');
            const emailEl = form.querySelector('#email');
            const subjectEl = form.querySelector('#subject');
            const messageEl = form.querySelector('#message');
            
            const newContact = {
                name: nameEl ? nameEl.value.trim() : '',
                email: emailEl ? emailEl.value.trim() : '',
                subject: subjectEl ? subjectEl.value.trim() : 'General Inquiry',
                message: messageEl ? messageEl.value.trim() : '',
                date: new Date().toLocaleString()
            };
            
            let contacts = [];
            try {
                contacts = JSON.parse(localStorage.getItem('contacted_users')) || [];
            } catch (err) {
                contacts = [];
            }
            
            contacts.unshift(newContact);
            localStorage.setItem('contacted_users', JSON.stringify(contacts));
            
            alert('Thank you! Your message has been saved successfully.');
            form.reset();
        });
    });
});

