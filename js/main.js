document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = document.getElementById('menu-icon');
    const navbarLinks = document.getElementById('navbar-links');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        navbarLinks.classList.toggle('mobile-active');

        // Change icon based on menu state
        if (navbarLinks.classList.contains('mobile-active')) {
            menuIcon.textContent = 'X'; // X icon
        } else {
            menuIcon.textContent = '☰'; // Hamburger icon
        }
    });

    // Close mobile menu on nav click and revert icon
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarLinks.classList.remove('mobile-active');
            menuIcon.textContent = '☰'; // Reset to hamburger
        });
    });

    // Smooth scroll with offset
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const navbarHeight = document.getElementById('navbar').offsetHeight;

            if (targetSection) {
                const targetPosition = targetSection.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Carousel Specific Variables and Functions ---
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-nav-btn.prev'); // Specific selector for carousel buttons
    const nextBtn = document.querySelector('.carousel-nav-btn.next'); // Specific selector for carousel buttons
    let currentSlide = 0;
    let slideInterval; // Variable to hold the interval for auto-play

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides and deactivate all dots
        slides.forEach((slide) => slide.classList.remove('active'));
        dots.forEach((dot) => dot.classList.remove('active'));

        // Show the current slide and activate the corresponding dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index; // Update the current slide index
    }

    // Function to go to the next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length; // Loop back to the first slide if at the end
        showSlide(currentSlide);
    }

    // Function to go to the previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length; // Loop to the last slide if at the beginning
        showSlide(currentSlide);
    }

    // Event listeners for carousel navigation buttons
    if (nextBtn) { // Check if buttons exist before adding listeners
        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval); // Stop auto-play when manually navigating
            nextSlide();
            startAutoPlay(); // Restart auto-play
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval); // Stop auto-play when manually navigating
            prevSlide();
            startAutoPlay(); // Restart auto-play
        });
    }

    // Event listeners for carousel dot indicators
    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.dataset.slide); // Get the slide index from the data-slide attribute
            clearInterval(slideInterval); // Stop auto-play when manually navigating
            showSlide(slideIndex);
            startAutoPlay(); // Restart auto-play
        });
    });

    // Function to start auto-playing the carousel
    function startAutoPlay() {
        // Clear any existing interval to prevent multiple intervals running
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Initialize the carousel if slides exist
    if (slides.length > 0) {
        showSlide(currentSlide); // Show the first slide initially
        startAutoPlay(); // Start auto-play when the page loads
    }


    // --- Navbar Specific Variables and Functions ---
    const navLinks = document.querySelectorAll('.nav-link');
    // Select all sections that are targets for the navbar links
    // The "Home" link targets the carousel container, so include that too.
    const sections = document.querySelectorAll('section.content-section, #home');

    // --- Smooth Scrolling Functionality for Navbar ---
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor link behavior

            // Get the target section's ID from the href attribute
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Calculate the offset to account for the fixed navbar
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                // Scroll to the target position smoothly
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active Link Highlighting using Intersection Observer ---

    // Options for the Intersection Observer
    const observerOptions = {
        root: null, // Use the viewport as the root
        // rootMargin: '-50% 0px -50% 0px', // When the middle of the section crosses the middle of the viewport
        rootMargin: '-30% 0px -70% 0px', // Adjust margin to activate link when section top is closer to 30% from top
        threshold: 0 // As soon as any part of the section enters the rootMargin
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);

            if (correspondingLink) {
                if (entry.isIntersecting) {
                    // Remove 'active' class from all links first
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Add 'active' class to the current section's link
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle initial active link on page load
    const checkActiveLinkOnLoad = () => {
        let firstActiveFound = false;
        const navbarHeight = document.getElementById('navbar').offsetHeight;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Check if the section is currently visible AND its top is above the navbar's bottom
            // This prioritizes sections that are actively at the top of the content area
            if (rect.top <= navbarHeight && rect.bottom > navbarHeight && !firstActiveFound) {
                const id = section.id;
                const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (correspondingLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                    firstActiveFound = true;
                }
            }
        });
        // If no section is active (e.g., scrolled to very top, or between sections), activate 'Home' if exists
        if (!firstActiveFound && document.querySelector('.nav-link[href="#home"]')) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('.nav-link[href="#home"]').classList.add('active');
        }
    };

    // Run this check immediately and on scroll
    checkActiveLinkOnLoad();
    window.addEventListener('scroll', checkActiveLinkOnLoad);
});

const mainImage = document.getElementById("main-image");
const takeALookBtn = document.getElementById("take-a-look-button");
const thumbnails = document.querySelectorAll(".thumbnail");

thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
        mainImage.src = thumb.src;
        mainImage.alt = thumb.alt;
        takeALookBtn.href = thumb.dataset.url;
    });
});

const toggleBtn = document.getElementById("toggleBtn");
const moreText = document.getElementById("moreText");

let isExpanded = false;

toggleBtn.addEventListener("click", () => {
    isExpanded = !isExpanded;

    if (isExpanded) {
        moreText.classList.remove("max-h-0");
        moreText.classList.add("max-h-[2000px]");
        toggleBtn.textContent = "Read Less";
    } else {
        moreText.classList.remove("max-h-[2000px]");
        moreText.classList.add("max-h-0");
        toggleBtn.textContent = "Read More";
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const body = document.body;

    // Set initial theme based on localStorage
    let savedTheme = localStorage.getItem('theme') || 'light';
    body.classList.add(`${savedTheme}-theme`);
    setIcon(savedTheme);

    toggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            setIcon('dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            setIcon('light');
        }
    });

    function setIcon(theme) {
        icon.innerHTML = theme === 'dark'
            ? `<path d="M17.293 14.293A8 8 0 0112 20a8 8 0 110-16 8 8 0 015.293 13.707z"/>` // Moon icon
            : `<path d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m13.07 5.07l-.71.71M6.34 6.34l-.71.71m0 10.6l.71.71m10.6-10.6l.71.71M12 5a7 7 0 0 0 0 14V5z" />`; // Sun icon
    }
});
