(function () {
    // Initialize EmailJS (with error handling)
    try {
        if(typeof emailjs !== 'undefined') {
            emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Replace with your EmailJS public key
        }
    } catch(error) {
        console.warn("EmailJS not initialized. Contact form may not work until configured.");
    }

    // Navigation controls with enhanced effects
    [...document.querySelectorAll(".control")].forEach((button, index) => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        });
        // Stagger animation
        button.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Theme toggle system with multiple themes
    const themeBtn = document.querySelector(".theme-btn");
    let currentTheme = localStorage.getItem("theme") || "professional";

    // Apply saved theme on load
    applyTheme(currentTheme);

    function applyTheme(theme) {
        document.body.classList.remove("light-mode", "gaming-mode", "professional-mode");

        if(theme === "light") {
            document.body.classList.add("light-mode");
        } else if(theme === "gaming") {
            document.body.classList.add("gaming-mode");
        }
        // professional theme is default (no special class needed)

        localStorage.setItem("theme", theme);
        currentTheme = theme;
    }

    themeBtn.addEventListener("click", () => {
        // Cycle through: professional -> gaming -> light -> professional
        const themes = ["professional", "gaming", "light"];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];

        applyTheme(nextTheme);
        updateProgressBarColors(); // Update progress bar colors when theme changes

        // Add a pulse effect
        themeBtn.style.animation = "none";
        setTimeout(() => {
            themeBtn.style.animation = "pulse 0.5s ease-out";
        }, 10);
    });
    
    // Smooth scroll for better UX
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Add animation to progress bars and elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("visible");
                // Trigger animation
                entry.target.style.animation = "slideInUp 0.6s ease-out forwards";
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll(".progress, .skill-item, .about-item, .timeline-item, .portfolio-item, .blog, .tech-category").forEach(el => {
        observer.observe(el);
    });
    
    // Add hover glow effect to cards
    document.querySelectorAll(".skill-item, .about-item, .blog, .timeline-item, .tech-category").forEach(card => {
        card.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-8px)";
        });
        card.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0)";
        });
    });
    
    // Contact Form Handler with better UX
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
                    "YOUR_EMAILJS_SERVICE_ID", // Replace with your service ID
                    "YOUR_EMAILJS_TEMPLATE_ID", // Replace with your template ID
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

    // Add parallax effect to header
    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if(header) {
            header.style.backgroundPosition = `0 ${window.scrollY * 0.5}px`;
        }
    });

    // Animate skill progress bars when visible
    const skillItems = document.querySelectorAll(".progress-ring-fill");
    const circumference = 439.82; // 2 * π * 70
    
    // Function to get color based on percentage using CSS variables
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
    
    // Function to update progress bar colors
    function updateProgressBarColors() {
        skillItems.forEach(circle => {
            const progressPercent = circle.getAttribute('data-progress') || 0;
            const color = getColorByPercentage(progressPercent);
            circle.setAttribute('stroke', color);
        });
    }
    
    skillItems.forEach(circle => {
        // Set initial state
        circle.setAttribute('stroke-dasharray', circumference);
        circle.setAttribute('stroke-dashoffset', circumference);
        
        // Get the progress percentage
        const progressPercent = circle.getAttribute('data-progress') || 0;
        const offset = circumference * (1 - progressPercent / 100);
        
        // Set color based on percentage using CSS variables
        const color = getColorByPercentage(progressPercent);
        circle.setAttribute('stroke', color);

        // Calculate offset for the inline style
        const skillItem = circle.closest('.skill-item');
        if(skillItem) {
            skillItem.style.setProperty('--progress-offset', offset + 'px');
        }
        
        circle.setAttribute('stroke-dashoffset', circumference);
    });
    
    // Animate on scroll
    const observer2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const circle = entry.target;
                const progressPercent = circle.getAttribute('data-progress') || 0;
                const circumference = 439.82;
                const offset = circumference * (1 - progressPercent / 100);
                
                circle.style.strokeDashoffset = offset;
                circle.style.animation = "fillProgress 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards";
                observer2.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => observer2.observe(item));

})();
