(function () {
    // Initialize EmailJS (with error handling)
    try {
        if (typeof emailjs !== "undefined") {
            emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Replace with your EmailJS public key
        }
    } catch (error) {
        console.warn("EmailJS not initialized. Contact form may not work until configured.");
    }

    // ===== TOP NAV + SCROLL SYNC =====
    const navLinks = document.querySelectorAll(".top-nav__link");
    const homeRailLinks = document.querySelectorAll(".home-nav-rail a");
    const sections = document.querySelectorAll("section[id], header[id]");
    const topNav = document.querySelector(".top-nav");
    const visitThanks = document.querySelector("#visit-thanks");
    const navToggle = document.querySelector(".top-nav__toggle");
    const navMenu = document.querySelector(".top-nav__menu");
    let visitThanksShown = false;

    function updateScrollProgress() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
        if (topNav) topNav.style.setProperty("--scroll-progress", progress.toString());
        if (maxScroll > 0 && progress >= 0.995) showVisitThanks();
    }

    function showVisitThanks() {
        if (!visitThanks || visitThanksShown) return;
        visitThanksShown = true;
        visitThanks.setAttribute("aria-hidden", "false");

        const confetti = visitThanks.querySelector(".visit-thanks__confetti");
        if (confetti) {
            const colors = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#a78bfa"];
            for (let i = 0; i < 28; i++) {
                const piece = document.createElement("span");
                const angle = ((200 + (i * 140) / 27) * Math.PI) / 180;
                const distance = 85 + ((i * 37) % 90);
                piece.style.setProperty("--burst-x", `${Math.round(Math.cos(angle) * distance)}px`);
                piece.style.setProperty("--burst-y", `${Math.round(Math.sin(angle) * distance)}px`);
                piece.style.setProperty("--burst-rotation", `${(i * 137) % 720}deg`);
                piece.style.setProperty("--burst-delay", `${(i % 7) * 18}ms`);
                piece.style.setProperty("--burst-color", colors[i % colors.length]);
                confetti.appendChild(piece);
            }
        }

        visitThanks.classList.add("is-visible");
        window.setTimeout(() => {
            visitThanks.classList.add("is-hiding");
            window.setTimeout(() => {
                visitThanks.classList.remove("is-visible");
                visitThanks.classList.remove("is-hiding");
                visitThanks.setAttribute("aria-hidden", "true");
                if (confetti) confetti.replaceChildren();
            }, 250);
        }, 3500);
    }

    function setActiveNav(sectionId) {
        navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.dataset.id === sectionId);
        });
        homeRailLinks.forEach((link) => {
            link.classList.toggle("is-active", link.dataset.homeSection === sectionId);
        });
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const open = navMenu.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
            navToggle.querySelector("i").className = open ? "fas fa-times" : "fas fa-bars";
        });
    }

    // Smooth hash links (nav + in-page CTAs)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const id = anchor.getAttribute("href").slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                if (navMenu) {
                    navMenu.classList.remove("is-open");
                    if (navToggle) {
                        navToggle.setAttribute("aria-expanded", "false");
                        navToggle.setAttribute("aria-label", "Open menu");
                        const icon = navToggle.querySelector("i");
                        if (icon) icon.className = "fas fa-bars";
                    }
                }
            }
        });
    });

    window.addEventListener(
        "scroll",
        () => {
            updateScrollProgress();
            let currentSection = "home";

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 200) {
                    currentSection = section.getAttribute("id");
                }
            });

            setActiveNav(currentSection);
        },
        { passive: true }
    );
    window.addEventListener("resize", updateScrollProgress, { passive: true });
    updateScrollProgress();

    // ===== THEME TOGGLE SYSTEM (light → professional → gaming) =====
    function initTheme() {
        const themeBtn = document.querySelector(".theme-btn");

        if (!themeBtn) {
            console.error("Theme button not found");
            return;
        }

        let currentTheme = localStorage.getItem("theme") || "professional";
        const themes = ["professional", "gaming", "light"];

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
                professional: "Dark Blue — click for Gaming",
                gaming: "Gaming — click for Light",
                light: "Light — click for Dark Blue",
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

    function initGenAiPreview() {
        const preview = document.querySelector(".genai-preview");
        const prompt = document.querySelector(".genai-preview__prompt");
        const answer = document.querySelector(".genai-preview__answer");
        if (!preview || !prompt || !answer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const examples = [
            {
                prompt: "Tell me about scaling a high-throughput system.",
                answer: "At JPMorganChase, I built Java services on AWS for distributed card systems handling millions of transactions daily.",
            },
            {
                prompt: "How have you applied GenAI to a financial workflow?",
                answer: "I built a FastAPI document pipeline with Docling and Azure OpenAI, validating ledger data with business rules and JSON Schema.",
            },
            {
                prompt: "Describe your cloud migration experience.",
                answer: "I led an on-prem-to-AWS migration and used blue-green deployments to release services without downtime.",
            },
            {
                prompt: "How have you used Kafka in distributed systems?",
                answer: "I used Kafka for asynchronous, high-volume events and built REST and GraphQL APIs for client-driven data retrieval.",
            },
            {
                prompt: "What measurable impact have you delivered?",
                answer: "At Cybage, I automated supply-chain workflows, reducing manual operational effort by 75%.",
            },
        ];

        function typeText(element, text, speed, onComplete) {
            const characters = Array.from(text);
            let index = 0;
            element.textContent = "";
            element.classList.add("is-generating");

            function typeNext() {
                element.textContent = characters.slice(0, index + 1).join("");
                index += 1;
                if (index < characters.length) {
                    window.setTimeout(typeNext, speed);
                } else {
                    element.classList.remove("is-generating");
                    onComplete();
                }
            }

            typeNext();
        }

        let exampleIndex = 0;
        function playExample() {
            const example = examples[exampleIndex];
            preview.classList.add("is-transitioning");
            window.setTimeout(() => {
                prompt.textContent = "";
                answer.textContent = "";
                preview.classList.remove("is-transitioning");
                typeText(prompt, example.prompt, 24, () => {
                    typeText(answer, example.answer, 18, () => {
                        exampleIndex = (exampleIndex + 1) % examples.length;
                        window.setTimeout(playExample, 4200);
                    });
                });
            }, 300);
        }

        window.setTimeout(playExample, 800);
    }

    initGenAiPreview();
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

    function initHomeAmbient() {
        const hero = document.querySelector(".home-cyber");
        const canvas = document.querySelector(".home-ambient");
        if (!hero || !canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const particles = [];
        let width = 0;
        let height = 0;
        let pixelRatio = 1;
        let previousTime = 0;
        let frameId = 0;
        let pointerX = -1000;
        let pointerY = -1000;
        let pointerFrame = 0;

        function resize() {
            const rect = hero.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            particles.length = 0;
            const count = width < 700 ? 12 : width < 1100 ? 20 : 32;
            for (let index = 0; index < count; index += 1) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.13,
                    vy: (Math.random() - 0.5) * 0.1,
                    radius: 0.7 + Math.random() * 1.1,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }

        function draw(timestamp = performance.now()) {
            const delta = previousTime ? Math.min(timestamp - previousTime, 40) / 16.67 : 1;
            previousTime = timestamp;
            context.clearRect(0, 0, width, height);
            const styles = getComputedStyle(hero);
            const color = styles.getPropertyValue("--home-cyan").trim() || "#38bdf8";

            particles.forEach((particle, index) => {
                if (!reduceMotion) {
                    particle.x += particle.vx * delta;
                    particle.y += particle.vy * delta;
                    if (particle.x < 0) particle.x = width;
                    if (particle.x > width) particle.x = 0;
                    if (particle.y < 0) particle.y = height;
                    if (particle.y > height) particle.y = 0;
                }

                const dx = particle.x - pointerX;
                const dy = particle.y - pointerY;
                const distanceToPointer = Math.hypot(dx, dy);
                const pointerBoost = finePointer ? Math.max(0, 1 - distanceToPointer / 170) : 0;
                const pulse = 0.35 + (Math.sin(timestamp / 3400 + particle.phase) + 1) * 0.16;
                const alpha = pulse + pointerBoost * 0.38;
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius + pointerBoost * 0.6, 0, Math.PI * 2);
                context.fillStyle = colorToRgba(color, Math.min(alpha, 0.9));
                context.shadowColor = color;
                context.shadowBlur = pointerBoost > 0 ? 8 : 3;
                context.fill();
                context.shadowBlur = 0;

                for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
                    const other = particles[otherIndex];
                    const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
                    if (distance > 112) continue;
                    context.beginPath();
                    context.moveTo(particle.x, particle.y);
                    context.lineTo(other.x, other.y);
                    context.strokeStyle = colorToRgba(color, (1 - distance / 112) * 0.12);
                    context.lineWidth = 0.65;
                    context.stroke();
                }
            });

            if (!reduceMotion) frameId = requestAnimationFrame(draw);
        }

        function colorToRgba(color, alpha) {
            const hex = color.trim().replace("#", "");
            if (/^[\da-f]{6}$/i.test(hex)) {
                const red = parseInt(hex.slice(0, 2), 16);
                const green = parseInt(hex.slice(2, 4), 16);
                const blue = parseInt(hex.slice(4, 6), 16);
                return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
            }
            const values = color.match(/\d+/g);
            if (values && values.length >= 3) return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
            return `rgba(56, 189, 248, ${alpha})`;
        }

        function onPointerMove(event) {
            if (reduceMotion) return;
            const bounds = hero.getBoundingClientRect();
            pointerX = event.clientX - bounds.left;
            pointerY = event.clientY - bounds.top;
            if (pointerFrame) return;
            pointerFrame = requestAnimationFrame(() => {
                pointerFrame = 0;
                hero.style.setProperty("--pointer-x", `${pointerX}px`);
                hero.style.setProperty("--pointer-y", `${pointerY}px`);
                const parallaxX = ((pointerX / width) - 0.5) * 10;
                const parallaxY = ((pointerY / height) - 0.5) * 8;
                hero.style.setProperty("--parallax-dash-x", `${-parallaxX * 0.035}px`);
                hero.style.setProperty("--parallax-dash-y", `${-parallaxY * 0.035}px`);
                hero.style.setProperty("--parallax-text-x", `${parallaxX * 0.06}px`);
                hero.style.setProperty("--parallax-text-y", `${parallaxY * 0.06}px`);
                hero.style.setProperty("--parallax-portrait-x", `${parallaxX * 0.14}px`);
                hero.style.setProperty("--parallax-portrait-y", `${parallaxY * 0.14}px`);
                hero.style.setProperty("--parallax-globe-x", `${parallaxX * 0.28}px`);
                hero.style.setProperty("--parallax-globe-y", `${parallaxY * 0.28}px`);
                hero.style.setProperty("--grid-x", `${((pointerX / width) - 0.5) * -4}px`);
                hero.style.setProperty("--grid-y", `${((pointerY / height) - 0.5) * -3}px`);
            });
        }

        function resetPointer() {
            pointerX = -1000;
            pointerY = -1000;
            hero.style.setProperty("--pointer-x", "50%");
            hero.style.setProperty("--pointer-y", "35%");
            hero.style.setProperty("--parallax-dash-x", "0px");
            hero.style.setProperty("--parallax-dash-y", "0px");
            hero.style.setProperty("--parallax-text-x", "0px");
            hero.style.setProperty("--parallax-text-y", "0px");
            hero.style.setProperty("--parallax-portrait-x", "0px");
            hero.style.setProperty("--parallax-portrait-y", "0px");
            hero.style.setProperty("--parallax-globe-x", "0px");
            hero.style.setProperty("--parallax-globe-y", "0px");
            hero.style.setProperty("--grid-x", "0px");
            hero.style.setProperty("--grid-y", "0px");
        }

        resize();
        draw();
        window.addEventListener("resize", () => {
            resize();
            if (reduceMotion) draw();
        }, { passive: true });
        if (finePointer && !reduceMotion) {
            hero.addEventListener("pointermove", onPointerMove, { passive: true });
            hero.addEventListener("pointerleave", resetPointer, { passive: true });
        }
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(frameId);
            } else if (!reduceMotion) {
                frameId = requestAnimationFrame(draw);
            }
        });
    }
    initHomeAmbient();

    function initArchitectureTransitions() {
        const home = document.querySelector(".home-cyber");
        const architecture = home?.querySelector(".home-architecture");
        if (!home || !architecture || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && window.scrollY > 40) {
                home.classList.add("is-architecture-focus");
            } else if (entry.boundingClientRect.top > window.innerHeight * 0.8) {
                home.classList.remove("is-architecture-focus");
            }
        }, { threshold: 0.12, rootMargin: "0px 0px -12% 0px" });

        observer.observe(architecture);
    }
    initArchitectureTransitions();

    document.querySelectorAll(".input-control input, .input-control textarea").forEach((input) => {
        input.addEventListener("focus", function () {
            this.style.outline = "1px solid var(--color-secondary)";
        });
        input.addEventListener("blur", function () {
            this.style.outline = "none";
        });
    });

    // ===== Rotating wireframe Earth (theme-aware) =====
    function initEarthGlobe() {
        const canvas = document.getElementById("earth-globe");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let rotation = 0;
        let rafId = null;
        let globeHovered = false;
        let activeSystem = "";
        let lastFrameTime = 0;
        const rotationSpeed = 0.18;
        let pointerRotation = 0;
        let currentPointerRotation = 0;
        let pointerTilt = 0;
        let currentPointerTilt = 0;
        let pointerX = -1000;
        let pointerY = -1000;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let viewW = 0;
        let viewH = 0;

        // Hub cities (lat, lon) for glowing nodes + arcs
        const hubs = [
            { lat: 39, lon: -77.5, region: "us-east-1", service: "AWS" }, // Northern Virginia
            { lat: 51.5, lon: -0.1, region: "eu-west-2", service: "API" }, // London
            { lat: 19.1, lon: 72.9, region: "ap-south-1", service: "KAFKA" }, // Mumbai
            { lat: 1.3, lon: 103.8, service: "ECS" }, // Singapore
            { lat: 35.7, lon: 139.7 }, // Tokyo
            { lat: -33.9, lon: 151.2, service: "DB" }, // Sydney
            { lat: 37.8, lon: -122.4 }, // SF
            { lat: 52.5, lon: 13.4 }, // Berlin
        ];
        const globe = canvas.closest(".home-globe");
        const hero = canvas.closest(".home-hero");

        if (hero) {
            const setActiveSystem = (element) => {
                const [system] = element.dataset.system.split(/\s+/);
                activeSystem = system;
                hero.dataset.focusSystem = system;
                if (reduceMotion) frame();
            };

            hero.querySelectorAll("[data-system]").forEach((element) => {
                element.addEventListener("pointerenter", () => {
                    setActiveSystem(element);
                });
                element.addEventListener("pointerleave", (event) => {
                    if (event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return;
                    activeSystem = "";
                    delete hero.dataset.focusSystem;
                    if (reduceMotion) frame();
                });
            });

            hero.querySelectorAll(".home-architecture__node[data-system]").forEach((node) => {
                node.addEventListener("focus", () => setActiveSystem(node));
                node.addEventListener("blur", (event) => {
                    const nextNode = event.relatedTarget;
                    if (nextNode instanceof HTMLElement && nextNode.matches(".home-architecture__node[data-system]")) {
                        setActiveSystem(nextNode);
                        return;
                    }
                    activeSystem = "";
                    delete hero.dataset.focusSystem;
                    if (reduceMotion) frame();
                });
            });
        }

        if (globe) {
            globe.addEventListener("pointerenter", () => {
                globeHovered = true;
                if (reduceMotion) frame();
            });
            globe.addEventListener("pointerleave", () => {
                globeHovered = false;
                pointerRotation = 0;
                pointerTilt = 0;
                pointerX = -1000;
                pointerY = -1000;
                if (reduceMotion) frame();
            });
            globe.addEventListener("pointermove", (event) => {
                if (reduceMotion) return;
                const rect = canvas.getBoundingClientRect();
                pointerX = event.clientX - rect.left;
                pointerY = event.clientY - rect.top;
                pointerRotation = ((pointerX / rect.width) - 0.5) * 0.3;
                pointerTilt = (0.5 - (pointerY / rect.height)) * 0.12;
            }, { passive: true });
        }

        const arcs = [
            [0, 1],
            [0, 2],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [0, 6],
            [1, 7],
            [6, 3],
        ];
        const serviceLinks = [
            { hub: 0, x: 0.18, y: 0.19, service: "aws", offset: 0 },
            { hub: 1, x: 0.88, y: 0.32, service: "api", offset: 0.19 },
            { hub: 2, x: 0.2, y: 0.72, service: "kafka", offset: 0.38 },
            { hub: 3, x: 0.83, y: 0.82, service: "ecs", offset: 0.57 },
            { hub: 7, x: 0.69, y: 0.12, service: "graphql", offset: 0.76 },
        ];

        // Sparse land dots (approx continents) — lat, lon
        const land = [];
        function seedLand() {
            const patches = [
                // N America
                { lat0: 15, lat1: 55, lon0: -125, lon1: -70, n: 90 },
                // S America
                { lat0: -40, lat1: 10, lon0: -80, lon1: -40, n: 55 },
                // Europe
                { lat0: 36, lat1: 70, lon0: -10, lon1: 40, n: 70 },
                // Africa
                { lat0: -35, lat1: 35, lon0: -20, lon1: 50, n: 80 },
                // Asia
                { lat0: 5, lat1: 70, lon0: 45, lon1: 145, n: 140 },
                // Australia
                { lat0: -40, lat1: -12, lon0: 112, lon1: 154, n: 35 },
            ];
            patches.forEach((p) => {
                for (let i = 0; i < p.n; i++) {
                    land.push({
                        lat: p.lat0 + Math.random() * (p.lat1 - p.lat0),
                        lon: p.lon0 + Math.random() * (p.lon1 - p.lon0),
                    });
                }
            });
        }
        seedLand();

        function sizeCanvas(force) {
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(180, Math.floor(rect.width) || canvas.clientWidth || 280);
            const h = Math.max(180, Math.floor(rect.height) || canvas.clientHeight || 280);
            const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
            if (!force && w === viewW && h === viewH && nextDpr === dpr) {
                return { w: viewW, h: viewH };
            }
            viewW = w;
            viewH = h;
            dpr = nextDpr;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            return { w, h };
        }

        function readColors() {
            const themeRoot = document.querySelector(".home-cyber") || document.body;
            const styles = getComputedStyle(themeRoot);
            const accent =
                getComputedStyle(globe || themeRoot).getPropertyValue("--globe-accent").trim() ||
                styles.getPropertyValue("--home-cyan").trim() ||
                "#00d4ff";
            const mesh =
                styles.getPropertyValue("--globe-mesh").trim() ||
                accent;
            return { accent, mesh, light: document.body.classList.contains("light-mode") };
        }

        function project(lat, lon, rot, R, cx, cy) {
            const phi = ((90 - lat) * Math.PI) / 180;
            const theta = ((lon + 180) * Math.PI) / 180 + rot;
            const x = -R * Math.sin(phi) * Math.cos(theta);
            const y = -R * Math.cos(phi);
            const z = R * Math.sin(phi) * Math.sin(theta);
            const tiltedY = y * Math.cos(currentPointerTilt) - z * Math.sin(currentPointerTilt);
            const tiltedZ = z * Math.cos(currentPointerTilt) + y * Math.sin(currentPointerTilt);
            return { x: cx + x, y: cy + tiltedY, z: tiltedZ, visible: tiltedZ > -R * 0.05 };
        }

        function drawMeridians(rot, R, cx, cy, color) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.9;
            for (let lon = -180; lon < 180; lon += 20) {
                ctx.beginPath();
                let started = false;
                for (let lat = -90; lat <= 90; lat += 4) {
                    const p = project(lat, lon, rot, R, cx, cy);
                    if (p.z < 0) {
                        started = false;
                        continue;
                    }
                    if (!started) {
                        ctx.moveTo(p.x, p.y);
                        started = true;
                    } else {
                        ctx.lineTo(p.x, p.y);
                    }
                }
                ctx.stroke();
            }
        }

        function drawParallels(rot, R, cx, cy, color) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            for (let lat = -60; lat <= 60; lat += 20) {
                ctx.beginPath();
                let started = false;
                for (let lon = -180; lon <= 180; lon += 4) {
                    const p = project(lat, lon, rot, R, cx, cy);
                    if (p.z < 0) {
                        started = false;
                        continue;
                    }
                    if (!started) {
                        ctx.moveTo(p.x, p.y);
                        started = true;
                    } else {
                        ctx.lineTo(p.x, p.y);
                    }
                }
                ctx.stroke();
            }
        }

        function drawArc(a, b, rot, R, cx, cy, color, timestamp, showPacket, highlighted) {
            const p1 = project(a.lat, a.lon, rot, R, cx, cy);
            const p2 = project(b.lat, b.lon, rot, R, cx, cy);
            if (p1.z < 0 && p2.z < 0) return;

            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            const lift = R * 0.35;
            const midZ = (p1.z + p2.z) / 2;
            const cx2 = mx + (mx - cx) * 0.15;
            const cy2 = my - lift * (0.4 + midZ / (2 * R));

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.quadraticCurveTo(cx2, cy2, p2.x, p2.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = highlighted ? 2 : 1.2;
            ctx.globalAlpha = highlighted ? 1 : activeSystem ? 0.2 : 0.72;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;

            if ((showPacket || highlighted) && !reduceMotion) {
                const progress = (((timestamp / 4200) + (a.lat + b.lon) * 0.013) % 1 + 1) % 1;
                const inverse = 1 - progress;
                const x = inverse * inverse * p1.x + 2 * inverse * progress * cx2 + progress * progress * p2.x;
                const y = inverse * inverse * p1.y + 2 * inverse * progress * cy2 + progress * progress * p2.y;
                ctx.beginPath();
                ctx.arc(x, y, 2.1, 0, Math.PI * 2);
                ctx.fillStyle = "#ffffff";
                ctx.shadowColor = color;
                ctx.shadowBlur = 9;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function drawServiceConnections(rot, R, cx, cy, w, h, color, timestamp) {
            const pulses = new Array(hubs.length).fill(0);
            serviceLinks.forEach((link) => {
                const destination = project(hubs[link.hub].lat, hubs[link.hub].lon, rot, R, cx, cy);
                if (destination.z < 0) return;

                const startX = link.x * w;
                const startY = link.y * h;
                const midX = (startX + destination.x) / 2;
                const midY = (startY + destination.y) / 2;
                const bend = Math.min(w, h) * 0.12;
                const controlX = midX + (midX - cx) * 0.08;
                const controlY = midY + (startY < cy ? bend : -bend);
                const progress = ((timestamp / 12500 + link.offset) % 1 + 1) % 1;
                const linkProximity = globeHovered
                    ? Math.max(0, 1 - Math.hypot(pointerX - destination.x, pointerY - destination.y) / 52)
                    : 0;
                const highlighted = activeSystem === link.service || linkProximity > 0.25;

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(controlX, controlY, destination.x, destination.y);
                ctx.strokeStyle = hexToRgba(color, activeSystem === link.service ? 0.64 : 0.28 + linkProximity * 0.2);
                ctx.lineWidth = activeSystem === link.service ? 1.2 : 0.8 + linkProximity * 0.3;
                ctx.shadowColor = color;
                ctx.shadowBlur = activeSystem === link.service ? 7 : 3 + linkProximity * 3;
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.beginPath();
                ctx.arc(startX, startY, 1.15, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(color, 0.68);
                ctx.shadowColor = color;
                ctx.shadowBlur = 4;
                ctx.fill();
                ctx.shadowBlur = 0;

                const inverse = 1 - progress;
                const packetX = inverse * inverse * startX + 2 * inverse * progress * controlX + progress * progress * destination.x;
                const packetY = inverse * inverse * startY + 2 * inverse * progress * controlY + progress * progress * destination.y;
                if (!reduceMotion && (progress < 0.28 || highlighted)) {
                    ctx.beginPath();
                    ctx.arc(packetX, packetY, highlighted ? 2 : 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = "#e1f6ff";
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 7;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }

                const arrivalPulse = reduceMotion ? 0 : Math.exp(-Math.pow((progress - 0.96) / 0.025, 2));
                pulses[link.hub] = Math.max(pulses[link.hub], arrivalPulse);
            });
            return pulses;
        }

        function drawRegionLabel(point, label, cx, cy, w, h, color, light) {
            const labelWidth = 76;
            const labelHeight = 19;
            const direction = point.x < cx ? 1 : -1;
            const left = Math.max(4, Math.min(w - labelWidth - 4, point.x + direction * 12 - (direction < 0 ? labelWidth : 0)));
            const top = Math.max(4, Math.min(h - labelHeight - 4, point.y - labelHeight / 2));
            const lineEndX = direction > 0 ? left : left + labelWidth;

            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(lineEndX, top + labelHeight / 2);
            ctx.strokeStyle = hexToRgba(color, 0.9);
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = light ? "rgba(248, 251, 255, 0.96)" : "rgba(6, 18, 30, 0.92)";
            ctx.fillRect(left, top, labelWidth, labelHeight);
            ctx.beginPath();
            ctx.rect(left, top, labelWidth, labelHeight);
            ctx.strokeStyle = hexToRgba(color, 0.8);
            ctx.stroke();

            ctx.fillStyle = light ? "#17449b" : "#ffffff";
            ctx.font = "600 10px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, left + labelWidth / 2, top + labelHeight / 2);
        }

        function frame(timestamp = performance.now()) {
            const { w, h } = sizeCanvas(false);
            const { accent, light } = readColors();
            const elapsed = lastFrameTime ? Math.min(timestamp - lastFrameTime, 50) / 1000 : 0;
            lastFrameTime = timestamp;
            if (!reduceMotion) {
                const response = Math.min(1, elapsed * 4);
                currentPointerRotation += (pointerRotation - currentPointerRotation) * response;
                currentPointerTilt += (pointerTilt - currentPointerTilt) * response;
            }
            const cx = w / 2;
            const cy = h / 2;
            const R = Math.min(w, h) * 0.42;
            const globeRotation = rotation + currentPointerRotation;

            ctx.clearRect(0, 0, w, h);

            const atmosphere = ctx.createRadialGradient(cx, cy, R * 0.76, cx, cy, R * 1.3);
            atmosphere.addColorStop(0, hexToRgba(accent, light ? 0.14 : 0.2));
            atmosphere.addColorStop(0.56, hexToRgba(accent, light ? 0.06 : 0.09));
            atmosphere.addColorStop(1, hexToRgba(accent, 0));
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = atmosphere;
            ctx.fill();

            // Keep the globe as a dark holographic surface, not a photographic Earth.
            const grad = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.34, R * 0.04, cx, cy, R);
            grad.addColorStop(0, light ? "rgba(255, 255, 255, 0.78)" : hexToRgba(accent, 0.18));
            grad.addColorStop(0.5, light ? "rgba(218, 235, 255, 0.36)" : "rgba(4, 20, 43, 0.78)");
            grad.addColorStop(1, light ? "rgba(183, 211, 246, 0.18)" : "rgba(3, 12, 29, 0.94)");
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Outer rim + halo
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.strokeStyle = hexToRgba(accent, 0.98);
            ctx.lineWidth = 2;
            ctx.shadowColor = accent;
            ctx.shadowBlur = 21;
            ctx.stroke();
            ctx.shadowBlur = 0;

            drawMeridians(globeRotation, R, cx, cy, hexToRgba(accent, 0.62));
            drawParallels(globeRotation, R, cx, cy, hexToRgba(accent, 0.56));

            // Land dots
            land.forEach((pt, index) => {
                const p = project(pt.lat, pt.lon, globeRotation, R, cx, cy);
                if (p.z < 0) return;
                const depth = (p.z / R + 1) / 2;
                const pulse = reduceMotion ? 0 : (Math.sin(timestamp / 1250 + index * 0.73) + 1) * 0.07;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.1 + depth * 1.05, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(accent, 0.48 + depth * 0.43 + pulse);
                ctx.fill();
            });

            // Connection arcs
            arcs.forEach(([i, j], index) => {
                const focus = activeSystem.toUpperCase();
                const highlighted = Boolean(focus) && [hubs[i].service, hubs[j].service].includes(focus);
                drawArc(hubs[i], hubs[j], globeRotation, R, cx, cy, accent, timestamp, index % 3 === 0, highlighted);
            });
            const connectionPulses = drawServiceConnections(globeRotation, R, cx, cy, w, h, accent, timestamp);

            // Hub nodes
            hubs.forEach((hub, hubIndex) => {
                const p = project(hub.lat, hub.lon, globeRotation, R, cx, cy);
                if (p.z < 0) return;
                const isFocusedService = activeSystem && hub.service === activeSystem.toUpperCase();
                const proximity = Math.max(0, 1 - Math.hypot(pointerX - p.x, pointerY - p.y) / 46);
                const isNearby = globeHovered && proximity > 0;
                const isAwsRegion = ((globeHovered && proximity > 0.45) || activeSystem === "aws") && Boolean(hub.region);
                const pulse = 0.5 + (Math.sin(timestamp / 900 + hub.lat) + 1) * 0.25;
                const arrivalPulse = connectionPulses[hubIndex];
                ctx.beginPath();
                ctx.arc(p.x, p.y, isFocusedService || isAwsRegion ? 4.4 : 3 + pulse * 0.8 + proximity * 1.7 + arrivalPulse * 1.6, 0, Math.PI * 2);
                ctx.fillStyle = isFocusedService || isAwsRegion || isNearby ? accent : "#ffffff";
                ctx.shadowColor = accent;
                ctx.shadowBlur = isFocusedService || isAwsRegion ? 20 : 8 + pulse * 5 + proximity * 10 + arrivalPulse * 12;
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, isFocusedService || isAwsRegion ? 9.5 : 6.5 + pulse * 1.5 + arrivalPulse * 3, 0, Math.PI * 2);
                ctx.strokeStyle = hexToRgba(accent, isFocusedService || isAwsRegion ? 1 : 0.35 + pulse * 0.35 + arrivalPulse * 0.4);
                ctx.lineWidth = isFocusedService || isAwsRegion ? 1.8 : 1;
                ctx.stroke();

                if (isAwsRegion && hub.region) {
                    drawRegionLabel(p, hub.region, cx, cy, w, h, accent, light);
                }
            });

            if (!reduceMotion) {
                rotation = (rotation + rotationSpeed * elapsed) % (Math.PI * 2);
                rafId = requestAnimationFrame(frame);
            }
        }

        function hexToRgba(color, alpha) {
            // Accept #rgb, #rrggbb, or already rgba()/rgb()
            const c = color.trim();
            if (c.startsWith("rgba") || c.startsWith("rgb")) {
                if (c.startsWith("rgba")) {
                    return c.replace(/rgba?\(([^)]+)\)/, (_, inner) => {
                        const parts = inner.split(",").map((s) => s.trim());
                        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
                    });
                }
                return c.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
            }
            let hex = c.replace("#", "");
            if (hex.length === 3) {
                hex = hex
                    .split("")
                    .map((ch) => ch + ch)
                    .join("");
            }
            if (hex.length !== 6) {
                return `rgba(0, 212, 255, ${alpha})`;
            }
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        // Restart on theme change so colors refresh immediately
        const themeBtn = document.querySelector(".theme-btn");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                // next paint after class swap
                requestAnimationFrame(() => {
                    if (reduceMotion) frame();
                });
            });
        }

        window.addEventListener(
            "resize",
            () => {
                sizeCanvas(true);
                if (reduceMotion) frame();
            },
            { passive: true }
        );
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(rafId);
            } else if (reduceMotion) {
                frame();
            } else {
                lastFrameTime = 0;
                rafId = requestAnimationFrame(frame);
            }
        });

        let started = false;
        function start() {
            if (started) {
                sizeCanvas(true);
                return;
            }
            started = true;
            sizeCanvas(true);
            frame();
            // Re-measure after layout/fonts settle (fixes blank globe on first paint)
            setTimeout(() => sizeCanvas(true), 120);
            setTimeout(() => sizeCanvas(true), 400);
        }

        requestAnimationFrame(start);
        if (document.readyState !== "complete") {
            window.addEventListener("load", start, { once: true });
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }

    initEarthGlobe();
})();
