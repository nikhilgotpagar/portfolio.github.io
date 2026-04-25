(function () {
    // Initialize EmailJS (with error handling)
    try {
        if(typeof emailjs !== 'undefined') {
            emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Replace with your EmailJS public key
        }
    } catch(error) {
        console.warn("EmailJS not initialized. Contact form may not work until configured.");
    }

    // Navigation controls
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    
    // Theme toggle
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    });
    
    // Persist theme preference
    if(localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }
    
    // Smooth scroll for better UX
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Add animation to progress bars on scroll
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);
    
    document.querySelectorAll(".progress").forEach(el => observer.observe(el));
    
    // Contact Form Handler
    const contactForm = document.getElementById("contact-form");
    if(contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById("submit-btn");
            const originalText = submitBtn.innerHTML;
            
            try {
                submitBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon"><i class="fas fa-spinner"></i></span>';
                submitBtn.disabled = true;
                
                const response = await emailjs.sendForm(
                    "YOUR_EMAILJS_SERVICE_ID", // Replace with your service ID
                    "YOUR_EMAILJS_TEMPLATE_ID", // Replace with your template ID
                    contactForm
                );
                
                if(response.status === 200) {
                    alert("Message sent successfully! I'll get back to you soon.");
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch(error) {
                console.error("Error sending message:", error);
                alert("Failed to send message. Please try again or email me directly.");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
})();
