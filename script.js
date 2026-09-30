document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // CTA Button interaction
    const ctaBtn = document.querySelector(".cta-btn");
    if (ctaBtn) {
        ctaBtn.addEventListener("click", function() {
            alert("Thank you for your interest in SoftGen! We will contact you shortly.");
        });
    }

    // Add entrance animation to service cards
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
            card.style.transition = "opacity 0.5s, transform 0.5s";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 100 + 200);
    });
});
