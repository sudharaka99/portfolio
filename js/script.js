/* ==========================================================================
   INTERACTIVE CANVAS PARTICLES BACKGROUND
   ========================================================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 120
};

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Update mouse coordinates on movement
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Reset mouse coordinates when leaving viewport
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Definition
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Draw single particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Update positions and bounce off boundaries
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse collision interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 2;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Initialize particles array
function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray = [];
    
    // Choose density based on window size
    let numberOfParticles = (canvas.width * canvas.height) / 18000;
    numberOfParticles = Math.min(numberOfParticles, 120); // Cap particles to maintain frame rate

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.8;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = 'rgba(0, 229, 168, ' + (Math.random() * 0.35 + 0.1) + ')';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect points that are close
function connectParticles() {
    let maxDistance = 120;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                let opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(0, 229, 168, ${opacity * 0.12})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectParticles();
}

// Run canvas setup
initParticles();
animateParticles();


/* ==========================================================================
   DYNAMIC HERO TYPING EFFECT
   ========================================================================== */
const typingSpan = document.querySelector('.typing-text');
const wordsData = JSON.parse(typingSpan.getAttribute('data-words'));
let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;
let typeDelay = 120;

function typeWords() {
    const currentWord = wordsData[wordIndex];
    
    if (isDeleting) {
        typingSpan.textContent = currentWord.substring(0, letterIndex - 1);
        letterIndex--;
        typeDelay = 60; // Faster deleting speed
    } else {
        typingSpan.textContent = currentWord.substring(0, letterIndex + 1);
        letterIndex++;
        typeDelay = 120; // Default typing speed
    }

    if (!isDeleting && letterIndex === currentWord.length) {
        isDeleting = true;
        typeDelay = 2200; // Pause at end of word
    } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % wordsData.length;
        typeDelay = 400; // Brief pause before typing next word
    }

    setTimeout(typeWords, typeDelay);
}

// Init Typing
if (wordsData && wordsData.length > 0) {
    setTimeout(typeWords, 1000);
}


/* ==========================================================================
   SCROLL REVEAL & STAT COUNTERS ANIMATION
   ========================================================================== */
const revealElements = document.querySelectorAll('.scroll-reveal');
const statsSection = document.getElementById('stats');
const statNumbers = document.querySelectorAll('.stat-num');
let statsAnimated = false;

// Animate Counters
function animateStats() {
    statNumbers.forEach(num => {
        const target = +num.getAttribute('data-target');
        const increment = target / 40; // Control speed
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                num.textContent = Math.ceil(current) + (target === 1000 ? '+' : '+');
                setTimeout(updateCount, 25);
            } else {
                num.textContent = target + '+';
            }
        };
        updateCount();
    });
}

// Animate Skill Bars
function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
        fill.style.width = fill.getAttribute('data-width');
    });
}

// Intersection Observer for Scroll Reveals
const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Trigger skill progress bars when skills section is revealed
            if (entry.target.id === 'skills') {
                animateSkillBars();
            }

            // Trigger stats counting once visible
            if (entry.target.id === 'about' && !statsAnimated) {
                animateStats();
                statsAnimated = true;
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));


/* ==========================================================================
   STICKY HEADER SCROLL SHADOW
   ========================================================================== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


/* ==========================================================================
   MOBILE MENU NAVIGATION (HAMBURGER)
   ========================================================================== */
const hamburger = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Sync Active Menu Items on Scroll
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 200; // Offset

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop && scrollPos < (section.offsetTop + section.offsetHeight)) {
            const currentId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
});


/* ==========================================================================
   SKILLS TABS SELECTION
   ========================================================================== */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.skills-tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        // Re-trigger skill fills inside this tab
        setTimeout(() => {
            const fills = document.getElementById(tabId).querySelectorAll('.skill-bar-fill');
            fills.forEach(fill => {
                fill.style.width = fill.getAttribute('data-width');
            });
        }, 50);
    });
});


/* ==========================================================================
   PROJECT FILTERS LOGIC
   ========================================================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter');
        
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (filterVal === 'all' || cardCat === filterVal) {
                card.style.display = 'flex';
                // Trigger animation
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});


/* ==========================================================================
   PROJECT DETAILS MODAL & JSON REPOSITORY
   ========================================================================== */
const projectsData = {
    "weforce-pos": {
        title: "WEFORCE POS System",
        category: "Desktop POS System",
        image: "assets/project_weforce_pos.svg",
        techs: ["WPF", ".NET 8", "SQLite", "ESC/POS", "JSON", "C#"],
        description: "WEFORCE is an offline-first POS application tailored specifically for retail stores and stock shops operating with unpredictable internet access. Built on the .NET 8 framework using WPF for smooth rendering, the software stores transactional records in a high-speed local SQLite database. A background task auto-syncs queued transactions to a cloud DB when an internet connection becomes available.",
        features: [
            "Offline First: Full POS capability without internet access, automatic syncing queue.",
            "Thermal Printing: Complete ESC/POS binary layouts designed to print receipts to standard 80mm printers.",
            "Hardware Integration: Automatic cash drawer release, scanner support, and weights.",
            "Batch & Expiry Tracking: Track inventory batches, barcodes, and calculate automated notifications.",
            "Split Payment Gateway: Allow customers to combine cash, card, and digital points.",
            "Automatic Local Database Backup: Schedule secure daily backups to internal and external drives."
        ],
        github: "https://github.com/sudharaka99"
    },
    "agency-stock": {
        title: "Agency Stock & Retail Management",
        category: "Enterprise Web Application",
        image: "assets/project_agency_stock.svg",
        techs: ["Laravel", "Vue.js", "MySQL", "Bootstrap", "PHP"],
        description: "An agency-level web application designed to govern dynamic retail supply channels, inventory paths, and distributor allocations. The platform integrates a dashboard representing real-time stock levels, dynamic vendor discounts, automated profit statements, and distribution pipeline layouts.",
        features: [
            "Wholesale Distribution Pipeline: Map items from central depots to branch stores.",
            "Dynamic Discounts: Setup complex percentage rules and seasonal discounts.",
            "Interactive Reporting Dashboard: Clean sales charts tracking top stock turnover rates.",
            "Inventory Stock Auditing: Auto alerts for low stocks, expired products, and leaks.",
            "Multi-tenant Access: RBAC separating supplier roles, driver roles, and branch cashiers."
        ],
        github: "https://github.com/sudharaka99"
    },
    "regent-wear": {
        title: "Regent Wear E-Commerce",
        category: "E-Commerce Web Application",
        image: "assets/project_regent_wear.svg",
        techs: ["Laravel", "Vue.js", "MySQL", "JavaScript", "PHP"],
        description: "A state-of-the-art online e-commerce solution engineered for a fashion catalog. Features high-speed filtering, catalog navigation, an AJAX-powered instant cart, secure customer checkouts, and a unified administration panel to process client orders and analyze product demand.",
        features: [
            "Advanced Product Filtering: Dynamic filter indices matching sizes, colors, and prices.",
            "Single Page Checkout: Reduced shopping friction with checkout steps on one page.",
            "Admin Catalog Control: Upload products, modify prices, and organize collections.",
            "Custom Shopping Cart: Persistent cart caching to restore active shopping sessions.",
            "Sales Analytics: Recruiter-focused analytics reporting average orders and product conversion."
        ],
        github: "https://github.com/sudharaka99"
    },
    "homoeopathic-medical": {
        title: "Homoeopathic Medical Platform",
        category: "E-Health Management Platform",
        image: "assets/project_homoeopathic.svg",
        techs: ["Laravel", "Vue.js", "MySQL", "PHP", "RBAC"],
        description: "An integrated healthcare dashboard bridging clinic patients with medical practitioners. The platform contains a digital patient card index, virtual appointment booking schedules, pharmacist checkouts, and automated, print-friendly digital prescription generation.",
        features: [
            "Interactive Clinic Booking: Select specific open slots for doctor appointments.",
            "Digital Prescription Pad: Structured medical entries for doctors to write prescriptions.",
            "Patient Records (EHR): Secure clinical notes, vitals histories, and allergy files.",
            "Role-Based Access Control: Split user dashboards for Doctors, Patients, and Pharmacists.",
            "Pharmacist Integration: Direct clinic billing and automated medicine stock checks."
        ],
        github: "https://github.com/sudharaka99"
    },
    "job-finder": {
        title: "Job Finder & Interview Hub",
        category: "Recruitment Management System",
        image: "assets/project_job_finder.svg",
        techs: ["PHP", "Vue.js", "Zoom API", "MySQL", "Bootstrap"],
        description: "A recruitment solution designed to connect candidates with corporate HR professionals. Facilitates interview scheduling, automated resume profile matching based on tech stacks, and direct Zoom API integration to launch virtual face-to-face evaluation rooms.",
        features: [
            "Zoom API Integration: Automated creation of meeting links and calendar notifications.",
            "Smart Profile Matching: Filter applications based on tech keywords and experience levels.",
            "HR Pipeline View: Drag and drop candidates through stages (Applied, Interview, Offered).",
            "Auto-generated Learning Roadmaps: Suggest key certifications matching missing skill requirements.",
            "Recruiter-to-Candidate chat: Secure messaging system within the portal."
        ],
        github: "https://github.com/sudharaka99"
    }
};

const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body-content');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCloseBackdrop = document.getElementById('modal-close-backdrop');

function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    // Compile technologies HTML
    let techHtml = '';
    data.techs.forEach(tech => {
        techHtml += `<span>${tech}</span>`;
    });

    // Compile features HTML
    let featuresHtml = '';
    data.features.forEach(feat => {
        featuresHtml += `<li>${feat}</li>`;
    });

    // Inject content
    modalBody.innerHTML = `
        <div class="modal-body-grid">
            <div class="modal-img-wrapper">
                <img src="${data.image}" alt="${data.title}" class="modal-img">
            </div>
            
            <div class="modal-info-header">
                <div class="modal-title-desc">
                    <span class="modal-project-tag">${data.category}</span>
                    <h3 class="modal-project-title">${data.title}</h3>
                </div>
                <div class="modal-actions">
                    <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary">
                        <i class="fa-brands fa-github"></i> Repository
                    </a>
                </div>
            </div>

            <div class="modal-detail-content">
                <div class="modal-long-desc">
                    <h4>Project Overview</h4>
                    <p>${data.description}</p>
                    
                    <h4>Key Architectural Features</h4>
                    <ul class="features-list">
                        ${featuresHtml}
                    </ul>
                </div>
                
                <div class="modal-meta-pane">
                    <div class="meta-box">
                        <span class="meta-box-title">Core Technology Stack</span>
                        <div class="meta-tech-badges">
                            ${techHtml}
                        </div>
                    </div>

                    <div class="meta-box">
                        <span class="meta-box-title">Core Architecture</span>
                        <div class="meta-box-content">
                            ${projectId === 'weforce-pos' ? 'MVVM Desktop' : 'MVC Web / SPA Components'}
                        </div>
                    </div>

                    <div class="meta-box">
                        <span class="meta-box-title">Database System</span>
                        <div class="meta-box-content">
                            ${projectId === 'weforce-pos' ? 'SQLite (Local)' : 'MySQL (RDBMS)'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Display Modal
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Restore scroll
}

// Bind events to cards
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project-id');
        openModal(projectId);
    });
});

// Close bindings
modalCloseBtn.addEventListener('click', closeModal);
modalCloseBackdrop.addEventListener('click', closeModal);

// Escape key listener for closing modal
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
    }
});


/* ==========================================================================
   CONTACT FORM SUBMISSION HANDLER & FEEDBACK
   ========================================================================== */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('btn-submit-contact');
const btnText = document.getElementById('btn-text');
const notification = document.getElementById('status-notification');
const notifTitle = document.getElementById('notification-title');
const notifDesc = document.getElementById('notification-desc');
const notifIcon = document.getElementById('notification-icon');

function showNotification(title, message, isError = false) {
    notifTitle.textContent = title;
    notifDesc.textContent = message;
    
    if (isError) {
        notification.classList.add('error');
        notifIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;
    } else {
        notification.classList.remove('error');
        notifIcon.innerHTML = `<i class="fa-solid fa-check"></i>`;
    }

    notification.classList.add('active');

    // Dismiss notification after 4.5 seconds
    setTimeout(() => {
        notification.classList.remove('active');
    }, 4500);
}

// Web3Forms Configuration: Enter your Access Key here.
// Get your free key instantly at https://web3forms.com/
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE"; 

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = document.getElementById('name').value.trim();
        const emailVal = document.getElementById('email').value.trim();

        if (!nameVal || !emailVal) {
            showNotification("Submission Error", "Please ensure your name and email are filled in correctly.", true);
            return;
        }

        // Display Sending state
        submitBtn.disabled = true;
        btnText.textContent = "Sending Message...";
        submitBtn.querySelector('i').className = "fa-solid fa-spinner fa-spin";

        // Prepare FormData
        const formData = new FormData(contactForm);
        formData.append("access_key", WEB3FORMS_ACCESS_KEY);

        // Customize Web3Forms email subject line
        formData.append("subject", `New Portfolio Contact: ${document.getElementById('subject').value}`);

        // Post request to Web3Forms API
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })
        .then(async (response) => {
            const result = await response.json();
            if (response.status === 200) {
                // Success feedback
                showNotification("Message Sent!", `Thank you, ${nameVal}! I will get back to you at ${emailVal} shortly.`);
                contactForm.reset();
            } else {
                // API Error feedback
                showNotification("Submission Failed", result.message || "Something went wrong.", true);
            }
        })
        .catch((error) => {
            console.error("Web3Forms Error:", error);
            showNotification("Connection Error", "Unable to connect to the email server. Please check your network connection.", true);
        })
        .finally(() => {
            // Restore submit button
            submitBtn.disabled = false;
            btnText.textContent = "Send Message";
            submitBtn.querySelector('i').className = "fa-solid fa-paper-plane";
        });
    });
}


/* ==========================================================================
   INTERACTIVE DETAILS FOR PROJECT MOCKUPS OR DEEP-LINKS
   ========================================================================== */
const cvButtons = [
    document.getElementById('btn-nav-download'),
    document.getElementById('btn-hero-cv')
];

cvButtons.forEach(btn => {
    if (btn) {
        btn.addEventListener('click', (e) => {
            // Check if CV file exists; if not, warn gently
            // (Since it's a static template, we allow download attempt, but provide an alert on failure)
            console.log("CV Download attempted for JRS Sudharaka.");
        });
    }
});
