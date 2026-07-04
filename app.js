(function () {
    // Initialize EmailJS (with error handling)
    try {
        if(typeof emailjs !== 'undefined') {
            emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Replace with your EmailJS public key
        }
    } catch(error) {
        console.warn("EmailJS not initialized. Contact form may not work until configured.");
    }

    // ===== INTERACTIVE CURSOR EFFECT ===== (DISABLED - using default cursor)
    // Removed custom cursor effect - using default system cursor instead


    // ===== NAVIGATION CONTROLS WITH SCROLL SYNC =====
    const controls = document.querySelectorAll(".control");
    const sections = document.querySelectorAll("section[id]");
    
    [...controls].forEach((button, index) => {
        button.addEventListener("click", function(e) {
            // Add ripple effect
            createRipple(this, e);
            
            // Smooth scroll to section
            const sectionId = this.dataset.id;
            const section = document.getElementById(sectionId);
            
            if(section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        button.style.animationDelay = `${index * 0.1}s`;
    });

    // ===== SCROLL SYNC FOR NAVIGATION BUTTONS =====
    window.addEventListener("scroll", () => {
        let currentSection = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if(window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute("id");
            }
        });
        
        // Update active button
        controls.forEach(button => {
            button.classList.remove("active-btn");
            if(button.dataset.id === currentSection) {
                button.classList.add("active-btn");
            }
        });
    }, { passive: true });

    // Ripple effect for buttons
    function createRipple(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.offsetX - size / 2;
        const y = event.offsetY - size / 2;

        const ripple = document.createElement('span');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // ===== THEME TOGGLE SYSTEM =====
    function initTheme() {
        const themeBtn = document.querySelector(".theme-btn");

        if(!themeBtn) {
            console.error("❌ Theme button not found!");
            return;
        } else {
            console.log("✅ Theme button found");
        }

        let currentTheme = localStorage.getItem("theme") || "light";
        const themes = ["light", "professional", "gaming"];

        applyTheme(currentTheme);

        function applyTheme(theme) {
            console.log("🎨 Applying theme:", theme);
            // Remove all theme classes
            document.body.classList.remove("light-mode", "gaming-mode", "professional-mode");

            // Add the appropriate theme class
            if(theme === "light") {
                document.body.classList.add("light-mode");
                console.log("✅ Added light-mode class");
            } else if(theme === "gaming") {
                document.body.classList.add("gaming-mode");
                console.log("✅ Added gaming-mode class");
            } else {
                document.body.classList.add("professional-mode");
                console.log("✅ Added professional-mode class");
            }

            localStorage.setItem("theme", theme);
            currentTheme = theme;
            updateProgressBarColors();
            updateThemeIndicator();

            console.log("✅ Theme changed to:", theme);
            console.log("Body classes:", document.body.className);
        }

        function updateThemeIndicator() {
            // Update theme button title/tooltip to show current theme
            const themeBtnRef = document.querySelector('.theme-btn');
            if(themeBtnRef) {
                const themeLabels = {
                    professional: 'Professional Mode',
                    gaming: 'Gaming Mode',
                    light: 'Light Mode'
                };
                themeBtnRef.title = themeLabels[currentTheme];
                
                // Also update button visual representation
                const icon = themeBtnRef.querySelector('i');
                if(icon) {
                    if(currentTheme === 'light') {
                        icon.className = 'fas fa-sun';
                    } else if(currentTheme === 'gaming') {
                        icon.className = 'fas fa-gamepad';
                    } else {
                        icon.className = 'fas fa-moon';
                    }
                }
            }
        }

        themeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log("🖱️ Theme button clicked");
            console.log("Current theme:", currentTheme);

            const currentIndex = themes.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            const nextTheme = themes[nextIndex];

            console.log("Cycling from:", currentTheme, "to:", nextTheme);

            // Add transition animation
            document.body.style.opacity = '0.7';
            setTimeout(() => {
                applyTheme(nextTheme);
                document.body.style.opacity = '1';
            }, 150);

            themeBtn.style.animation = "none";
            setTimeout(() => {
                themeBtn.style.animation = "pulse 0.6s ease-out";
            }, 10);
        });
    }

    // Initialize theme when DOM is ready
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    // ===== SMOOTH SCROLL =====
    document.documentElement.style.scrollBehavior = "smooth";
    
    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("visible");
                entry.target.style.animation = "slideInUp 0.6s ease-out forwards";
            }
        });
    }, observerOptions);
    
    document.querySelectorAll(".progress, .skill-item, .about-item, .timeline-item, .portfolio-item, .blog, .tech-category").forEach(el => {
        observer.observe(el);
    });
    
    // ===== ENHANCED HOVER EFFECTS ON CARDS =====
    document.querySelectorAll(".skill-item, .about-item, .blog, .timeline-item, .tech-category").forEach(card => {
        card.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-10px) scale(1.02)";
            this.style.boxShadow = "0 20px 40px rgba(59, 130, 246, 0.2)";
        });
        card.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0) scale(1)";
            this.style.boxShadow = "";
        });
    });

    // ===== PORTFOLIO ITEM ADVANCED HOVER =====
    document.querySelectorAll(".portfolio-item").forEach(item => {
        item.addEventListener("mouseenter", function() {
            this.style.transform = "scale(1.05) rotateY(-5deg)";
            this.style.boxShadow = "0 30px 60px rgba(59, 130, 246, 0.3)";
        });
        item.addEventListener("mouseleave", function() {
            this.style.transform = "scale(1) rotateY(0)";
            this.style.boxShadow = "";
        });
    });
    
    // ===== CONTACT FORM HANDLER =====
    const contactForm = document.getElementById("contact-form");
    if(contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById("submit-btn");
            const originalText = submitBtn.innerHTML;
            
            try {
                submitBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon"><i class="fas fa-spinner"></i></span>';
                submitBtn.disabled = true;
                submitBtn.style.animation = "pulse 1s infinite";
                
                const response = await emailjs.sendForm(
                    "YOUR_EMAILJS_SERVICE_ID",
                    "YOUR_EMAILJS_TEMPLATE_ID",
                    contactForm
                );
                
                if(response.status === 200) {
                    submitBtn.style.animation = "none";
                    submitBtn.innerHTML = '<span class="btn-text">✓ Sent!</span><span class="btn-icon"><i class="fas fa-check"></i></span>';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }
            } catch(error) {
                console.error("Error sending message:", error);
                submitBtn.style.animation = "none";
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                alert("Failed to send message. Please try again or email me directly.");
            }
        });
    }

    // ===== PARALLAX EFFECT ON SCROLL =====
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        
        // Profile image parallax
        const profileImage = document.querySelector(".header-content .left-header .image");
        if(profileImage) {
            profileImage.style.transform = `translateY(${scrolled * 0.2}px) scale(${Math.max(0.9, 1 - scrolled / 8000)})`;
        }
        
        // Header fade effect
        const header = document.querySelector("header");
        if(header) {
            header.style.opacity = Math.max(0.3, 1 - scrolled / 800);
        }
    }, { passive: true });

    // ===== SKILL PROGRESS CIRCLES ANIMATION =====
    const skillItems = document.querySelectorAll(".progress-ring-fill");
    const circumference = 439.82;

    function getColorByPercentage(percent) {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        
        if (percent <= 20) return styles.getPropertyValue('--progress-color-1').trim();
        if (percent <= 40) return styles.getPropertyValue('--progress-color-2').trim();
        if (percent <= 60) return styles.getPropertyValue('--progress-color-3').trim();
        if (percent <= 75) return styles.getPropertyValue('--progress-color-4').trim();
        if (percent <= 85) return styles.getPropertyValue('--progress-color-5').trim();
        return styles.getPropertyValue('--progress-color-6').trim();
    }
    
    function updateProgressBarColors() {
        skillItems.forEach(circle => {
            const progressPercent = circle.getAttribute('data-progress') || 0;
            const color = getColorByPercentage(progressPercent);
            circle.setAttribute('stroke', color);
        });
    }
    
    skillItems.forEach(circle => {
        circle.setAttribute('stroke-dasharray', circumference);
        circle.setAttribute('stroke-dashoffset', circumference);
        
        const progressPercent = circle.getAttribute('data-progress') || 0;
        const offset = circumference * (1 - progressPercent / 100);
        
        const color = getColorByPercentage(progressPercent);
        circle.setAttribute('stroke', color);

        const skillItem = circle.closest('.skill-item');
        if(skillItem) {
            skillItem.style.setProperty('--progress-offset', offset + 'px');
        }
    });
    
    const observer2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const circle = entry.target;
                const progressPercent = circle.getAttribute('data-progress') || 0;
                const circumference = 439.82;
                const offset = circumference * (1 - progressPercent / 100);
                
                // Animate from 0 (full) to offset (filled)
                circle.style.transition = "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 100);
                observer2.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => observer2.observe(item));

    // ===== FLOATING PARTICLES BACKGROUND ANIMATION =====
    function createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        document.body.insertBefore(particleContainer, document.body.firstChild);

        for(let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 20 + 20) + 's';
            particleContainer.appendChild(particle);
        }
    }
    createParticles();

    // ===== FORM INPUT ANIMATIONS =====
    document.querySelectorAll(".input-control input, .input-control textarea").forEach(input => {
        input.addEventListener("focus", function() {
            this.parentElement.style.borderBottom = "2px solid var(--color-secondary)";
            this.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.2)";
        });

        input.addEventListener("blur", function() {
            this.parentElement.style.borderBottom = "none";
            this.style.boxShadow = "none";
        });
    });

})();
