document.addEventListener('DOMContentLoaded', () => {
    // ---- Sidebar Toggle Logic ----
    const menuToggle = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('closeBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if(menuToggle) menuToggle.addEventListener('click', openSidebar);
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

    // ---- Scroll Fade-In Animation ----
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
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

});
