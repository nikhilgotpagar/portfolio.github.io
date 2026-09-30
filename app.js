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

    // ===== Rotating wireframe Earth (theme-aware) =====
    function initEarthGlobe() {
        const canvas = document.getElementById("earth-globe");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let rotation = 0;
        let rafId = null;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let viewW = 0;
        let viewH = 0;

        // Hub cities (lat, lon) for glowing nodes + arcs
        const hubs = [
            { lat: 40.7, lon: -74 }, // NYC / finance
            { lat: 51.5, lon: -0.1 }, // London
            { lat: 19.1, lon: 72.9 }, // Mumbai
            { lat: 1.3, lon: 103.8 }, // Singapore
            { lat: 35.7, lon: 139.7 }, // Tokyo
            { lat: -33.9, lon: 151.2 }, // Sydney
            { lat: 37.8, lon: -122.4 }, // SF
            { lat: 52.5, lon: 13.4 }, // Berlin
        ];

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
            const w = Math.max(240, Math.floor(rect.width));
            const h = Math.max(240, Math.floor(rect.height));
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
            const styles = getComputedStyle(document.querySelector(".home-cyber") || document.body);
            const accent =
                styles.getPropertyValue("--globe-accent").trim() ||
                styles.getPropertyValue("--home-cyan").trim() ||
                "#00d4ff";
            const mesh =
                styles.getPropertyValue("--globe-mesh").trim() ||
                accent;
            return { accent, mesh };
        }

        function project(lat, lon, rot, R, cx, cy) {
            const phi = ((90 - lat) * Math.PI) / 180;
            const theta = ((lon + 180) * Math.PI) / 180 + rot;
            const x = -R * Math.sin(phi) * Math.cos(theta);
            const y = -R * Math.cos(phi);
            const z = R * Math.sin(phi) * Math.sin(theta);
            return { x: cx + x, y: cy + y, z, visible: z > -R * 0.05 };
        }

        function drawMeridians(rot, R, cx, cy, color) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.7;
            for (let lon = -180; lon < 180; lon += 30) {
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
            ctx.lineWidth = 0.6;
            for (let lat = -60; lat <= 60; lat += 30) {
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

        function drawArc(a, b, rot, R, cx, cy, color) {
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
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = 0.55;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        function frame() {
            const { w, h } = sizeCanvas(false);
            const { accent } = readColors();
            const cx = w / 2;
            const cy = h / 2;
            const R = Math.min(w, h) * 0.38;

            ctx.clearRect(0, 0, w, h);

            // Soft sphere fill
            const grad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.1, cx, cy, R);
            grad.addColorStop(0, hexToRgba(accent, 0.18));
            grad.addColorStop(0.55, hexToRgba(accent, 0.06));
            grad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Outer rim
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.strokeStyle = hexToRgba(accent, 0.55);
            ctx.lineWidth = 1.5;
            ctx.stroke();

            drawMeridians(rotation, R, cx, cy, hexToRgba(accent, 0.28));
            drawParallels(rotation, R, cx, cy, hexToRgba(accent, 0.22));

            // Land dots
            land.forEach((pt) => {
                const p = project(pt.lat, pt.lon, rotation, R, cx, cy);
                if (p.z < 0) return;
                const depth = (p.z / R + 1) / 2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.1 + depth * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(accent, 0.25 + depth * 0.55);
                ctx.fill();
            });

            // Connection arcs
            arcs.forEach(([i, j]) => {
                drawArc(hubs[i], hubs[j], rotation, R, cx, cy, accent);
            });

            // Hub nodes
            hubs.forEach((hub) => {
                const p = project(hub.lat, hub.lon, rotation, R, cx, cy);
                if (p.z < 0) return;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
                ctx.fillStyle = accent;
                ctx.shadowColor = accent;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
                ctx.strokeStyle = hexToRgba(accent, 0.35);
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            if (!reduceMotion) {
                rotation += 0.0045;
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

        requestAnimationFrame(() => {
            sizeCanvas(true);
            frame();
        });

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }

    initEarthGlobe();
})();
