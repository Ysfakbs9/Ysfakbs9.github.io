document.addEventListener('DOMContentLoaded', () => {
    // ---- Sidebar Toggle Logic ----
    const menuToggle = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('closeBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function openSidebar() {
        console.log("Opening sidebar...");
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    function closeSidebar() {
        console.log("Closing sidebar...");
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if(menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            openSidebar();
        });
        // Add touchstart for faster response on some mobile browsers
        menuToggle.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            openSidebar();
        }, {passive: true});
    }
    if(closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if(overlay) overlay.addEventListener('click', closeSidebar);


    // ---- Sidebar Accordion (Submenu) Logic ----
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = toggle.parentElement;
            
            // Toggle current
            parentLi.classList.toggle('open');
            const submenu = parentLi.querySelector('.submenu');
            if (parentLi.classList.contains('open')) {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
            } else {
                submenu.style.maxHeight = "0";
            }
        });
    });

    // Make sure already 'open' submenus have max-height set correctly
    document.querySelectorAll('.has-submenu.open .submenu').forEach(sub => {
        sub.style.maxHeight = sub.scrollHeight + 100 + "px"; // added padding safe margin
    });


    // ---- Sticky Header Background on Scroll ----
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ---- Scroll Reveal Animation ----
    const reveals = document.querySelectorAll('[data-reveal], .fade-in');
    const revealOptions = { 
        threshold: 0.15, 
        rootMargin: "0px 0px -80px 0px" 
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, revealOptions);
    
    reveals.forEach(el => revealOnScroll.observe(el));

    // Stagger effect for cards
    document.querySelectorAll('.projects-grid, .shop-grid').forEach(grid => {
        grid.querySelectorAll('article').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
            revealOnScroll.observe(card);
        });
    });

    // ---- Filtering & Tabs Logic (Projects & Tutorials) ----
    const tabBtns = document.querySelectorAll('.tab-btn');
    const filterItems = document.querySelectorAll('.filter-item');

    function filterSelection(category) {
        if(tabBtns.length === 0) return;

        // Update active tab visual
        tabBtns.forEach(btn => btn.classList.remove('active'));
        const activeBtn = Array.from(tabBtns).find(btn => btn.getAttribute('data-filter') === category);
        if(activeBtn) activeBtn.classList.add('active');

        // Filter valid items
        if(filterItems.length > 0) {
            filterItems.forEach(item => {
                // reset first
                item.classList.remove('hidden');
                
                if (category !== 'all') {
                    // split by space if multiple tags exist
                    const itemCategories = item.getAttribute('data-category').split(' ');
                    if (!itemCategories.includes(category)) {
                        item.classList.add('hidden');
                    }
                }
            });
        }
    }

    // Checking URL parameters for '?category=xyz' on load
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        filterSelection(categoryParam);
        
        const pageTitle = document.querySelector('.page-title');
        // Gently scroll to the list if a category was selected from a link
        if (pageTitle && window.innerWidth < 768) {
             // For mobile, scroll slightly after paint
            setTimeout(() => {
                pageTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }

    // Tab button click events inside the page
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            // Update URL without reloading page, for shareability
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?category=' + filterValue;
            window.history.pushState({path:newUrl}, '', newUrl);
            filterSelection(filterValue);
        });
    });

    // Smooth Scroll Polyfill/Behavior for identical page anchors (#contact)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                closeSidebar();
            }
        });
    });

    // ---- Back to Top Button ----
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    Object.assign(backToTop.style, {
        position: 'fixed', bottom: '30px', right: '30px', width: '50px', height: '50px',
        borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff',
        border: 'none', cursor: 'pointer', display: 'none', zIndex: '99',
        boxShadow: '0 5px 20px rgba(0,0,0,0.4)', transition: 'var(--transition-fast)'
    });
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) backToTop.style.display = 'block';
        else backToTop.style.display = 'none';
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    backToTop.addEventListener('mouseenter', () => backToTop.style.transform = 'translateY(-5px)');
    backToTop.addEventListener('mouseleave', () => backToTop.style.transform = 'translateY(0)');

});
