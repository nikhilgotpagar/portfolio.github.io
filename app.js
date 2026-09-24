(function () {
    // Initialize EmailJS (with error handling)
    try {
        if (typeof emailjs !== "undefined") {
            emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Replace with your EmailJS public key
        }
    } catch (error) {
        console.warn("EmailJS not initialized. Contact form may not work until configured.");
    }

    // ===== NAVIGATION CONTROLS WITH SCROLL SYNC =====
    const controls = document.querySelectorAll(".control");
    const sections = document.querySelectorAll("section[id], header[id]");

    [...controls].forEach((button, index) => {
        button.addEventListener("click", function (e) {
            createRipple(this, e);

            const sectionId = this.dataset.id;
            const section = document.getElementById(sectionId);

            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
        button.style.animationDelay = `${index * 0.1}s`;
    });

    // Smooth hash links (e.g. Contact CTA)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const id = anchor.getAttribute("href").slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    window.addEventListener(
        "scroll",
        () => {
            let currentSection = "home";

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 200) {
                    currentSection = section.getAttribute("id");
                }
            });

            controls.forEach((button) => {
                button.classList.remove("active-btn");
                if (button.dataset.id === currentSection) {
                    button.classList.add("active-btn");
                }
            });
        },
        { passive: true }
    );

    function createRipple(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.offsetX - size / 2;
        const y = event.offsetY - size / 2;

        const ripple = document.createElement("span");
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        ripple.classList.add("ripple");
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // ===== THEME TOGGLE SYSTEM (light → professional → gaming) =====
    function initTheme() {
        const themeBtn = document.querySelector(".theme-btn");

        if (!themeBtn) {
            console.error("Theme button not found");
            return;
        }

        let currentTheme = localStorage.getItem("theme") || "light";
        const themes = ["light", "professional", "gaming"];

        if (!themes.includes(currentTheme)) {
            currentTheme = "professional";
        }

        applyTheme(currentTheme);

        function applyTheme(theme) {
            document.body.classList.remove("light-mode", "gaming-mode", "professional-mode");

            if (theme === "light") {
                document.body.classList.add("light-mode");
            } else if (theme === "gaming") {
                document.body.classList.add("gaming-mode");
            } else {
                document.body.classList.add("professional-mode");
            }

            localStorage.setItem("theme", theme);
            currentTheme = theme;
            updateThemeIndicator();
        }

        function updateThemeIndicator() {
            const themeLabels = {
                professional: "Professional Mode — click for Gaming",
                gaming: "Gaming Mode — click for Light",
                light: "Light Mode — click for Professional",
            };
            themeBtn.title = themeLabels[currentTheme] || "Toggle theme";

            const icon = themeBtn.querySelector("i");
            if (icon) {
                if (currentTheme === "light") {
                    icon.className = "fas fa-sun";
                } else if (currentTheme === "gaming") {
                    icon.className = "fas fa-gamepad";
                } else {
                    icon.className = "fas fa-moon";
                }
            }
        }

        function cycleTheme() {
            const currentIndex = themes.indexOf(currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];

            document.body.style.opacity = "0.85";
            setTimeout(() => {
                applyTheme(nextTheme);
                document.body.style.opacity = "1";
            }, 120);
        }

        themeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            cycleTheme();
        });

        themeBtn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                cycleTheme();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTheme);
    } else {
        initTheme();
    }

    document.documentElement.style.scrollBehavior = "smooth";

    // ===== SCROLL REVEALS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                entry.target.style.animation = "slideInUp 0.6s ease-out forwards";
            }
        });
    }, observerOptions);

    document
        .querySelectorAll(
            ".about-item, .timeline-item, .tech-category, .core-skill, .cert-chip"
        )
        .forEach((el) => observer.observe(el));

    // Soft hover — uses theme accent via CSS; avoid hardcoded blue shadows
    document.querySelectorAll(".core-skill, .about-item, .tech-category").forEach((card) => {
        card.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-4px)";
        });
        card.addEventListener("mouseleave", function () {
            this.style.transform = "";
        });
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById("submit-btn");
            const originalText = submitBtn.innerHTML;

            try {
                submitBtn.innerHTML =
                    '<span class="btn-text">Sending...</span><span class="btn-icon"><i class="fas fa-spinner"></i></span>';
                submitBtn.disabled = true;

                const response = await emailjs.sendForm(
                    "YOUR_EMAILJS_SERVICE_ID",
                    "YOUR_EMAILJS_TEMPLATE_ID",
                    contactForm
                );

                if (response.status === 200) {
                    submitBtn.innerHTML =
                        '<span class="btn-text">Sent</span><span class="btn-icon"><i class="fas fa-check"></i></span>';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }
            } catch (error) {
                console.error("Error sending message:", error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                alert("Failed to send message. Please try again or email me directly.");
            }
        });
    }

    // Ambient FX — orbs + pointer spotlight
    function createAmbientFx() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const layer = document.createElement("div");
        layer.className = "fx-layer";
        layer.innerHTML = `
            <div class="fx-orb fx-orb--1"></div>
            <div class="fx-orb fx-orb--2"></div>
            <div class="fx-orb fx-orb--3"></div>
            <div class="fx-spotlight"></div>
        `;
        document.body.insertBefore(layer, document.body.firstChild);

        const spotlight = layer.querySelector(".fx-spotlight");
        let raf = null;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        function tick() {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;
            spotlight.style.transform = `translate(${currentX}px, ${currentY}px)`;
            raf = requestAnimationFrame(tick);
        }

        window.addEventListener(
            "pointermove",
            (e) => {
                document.body.classList.add("is-pointer");
                targetX = e.clientX;
                targetY = e.clientY;
                if (!raf) raf = requestAnimationFrame(tick);
            },
            { passive: true }
        );

        window.addEventListener(
            "pointerleave",
            () => {
                document.body.classList.remove("is-pointer");
            },
            { passive: true }
        );
    }
    createAmbientFx();

    // Theme-colored sparks
    function createParticles() {
        const particleContainer = document.createElement("div");
        particleContainer.className = "particle-container";
        document.body.insertBefore(particleContainer, document.body.firstChild);

        for (let i = 0; i < 16; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.left = Math.random() * 100 + "%";
            particle.style.top = Math.random() * 100 + "%";
            particle.style.animationDelay = Math.random() * 20 + "s";
            particle.style.animationDuration = Math.random() * 16 + 18 + "s";
            particleContainer.appendChild(particle);
        }
    }
    createParticles();

    document.querySelectorAll(".input-control input, .input-control textarea").forEach((input) => {
        input.addEventListener("focus", function () {
            this.style.outline = "1px solid var(--color-secondary)";
        });
        input.addEventListener("blur", function () {
            this.style.outline = "none";
        });
    });
})();
