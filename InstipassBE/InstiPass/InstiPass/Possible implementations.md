# ABOUT PAGE

{% extends 'base.html' %}
{% block title %}About InstiPass - Smart Student ID Management{% endblock %}

{% block content %}
{% include "navbar.html" %}

<!-- Hero Section -->
<section class="about-hero position-relative py-5">
  <div class="container">
    <div class="row align-items-center min-vh-50">
      <div class="col-lg-6 mb-5 mb-lg-0">
        <h1 class="display-4 fw-bold mb-3 animated-text">About <span class="text-primary">InstiPass</span></h1>
        <p class="lead text-muted mb-4 animated-text-delay">Your one-stop solution for managing institutional passes efficiently with cutting-edge technology.</p>
        <div class="d-flex gap-3">
          <a href="#team" class="btn btn-primary btn-lg px-4 animated-button">Meet Our Team</a>
          <a href="#contact" class="btn btn-outline-primary btn-lg px-4 animated-button-delay">Contact Us</a>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="about-image-container text-center">
          <img src="/api/placeholder/500/400" alt="InstiPass Team" class="img-fluid rounded-lg shadow-lg floating-animation">
        </div>
      </div>
    </div>
  </div>
  <div class="background-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>
</section>

<!-- Our Story Section -->
<section class="py-5 bg-light">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 text-center">
        <h2 class="fw-bold position-relative d-inline-block section-title mb-4">Our Story</h2>
        <div class="timeline-container">
          <div class="timeline-stepper">
            <div class="timeline-step active" data-year="2022">
              <div class="timeline-step-icon"></div>
              <div class="timeline-info">
                <h5>The Beginning</h5>
                <p>InstiPass was founded with a simple idea: make student ID management better.</p>
              </div>
            </div>
            <div class="timeline-step" data-year="2023">
              <div class="timeline-step-icon"></div>
              <div class="timeline-info">
                <h5>Product Launch</h5>
                <p>We launched our first version serving 50 schools across the country.</p>
              </div>
            </div>
            <div class="timeline-step" data-year="2024">
              <div class="timeline-step-icon"></div>
              <div class="timeline-info">
                <h5>AI Integration</h5>
                <p>Introduced AI-powered ID generation and verification systems.</p>
              </div>
            </div>
            <div class="timeline-step" data-year="2025">
              <div class="timeline-step-icon"></div>
              <div class="timeline-info">
                <h5>Global Expansion</h5>
                <p>Now serving 500+ institutions in 15 countries worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Mission & Vision Section -->
<section class="py-5">
  <div class="container">
    <div class="row justify-content-center mb-5">
      <div class="col-lg-8 text-center">
        <h2 class="fw-bold position-relative d-inline-block section-title mb-4">Our Purpose</h2>
        <p class="text-muted">What drives us to create the best student ID management system</p>
      </div>
    </div>
    
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card mission-card h-100 border-0 shadow hover-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-4">
              <div class="icon-box bg-primary text-white me-3">
                <i class="fas fa-bullseye"></i>
              </div>
              <h3 class="card-title fw-bold mb-0">Our Mission</h3>
            </div>
            <div class="card-content">
              <p class="card-text">At InstiPass, our mission is to simplify and streamline the process of managing passes for institutions. We aim to provide a seamless experience for both administrators and users, making ID management efficient, secure, and accessible.</p>
              <p class="card-text">We're committed to reducing administrative burden, enhancing security, and improving the overall experience for institutions and their students through innovative technology solutions.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card vision-card h-100 border-0 shadow hover-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-4">
              <div class="icon-box bg-success text-white me-3">
                <i class="fas fa-binoculars"></i>
              </div>
              <h3 class="card-title fw-bold mb-0">Our Vision</h3>
            </div>
            <div class="card-content">
              <p class="card-text">We envision a future where technology bridges the gap between institutions and their users, making processes more efficient and accessible for everyone. Our goal is to create a world where student identification is seamless, secure, and integrated with the digital ecosystem.</p>
              <p class="card-text">We see InstiPass becoming the global standard for institutional ID management, revolutionizing how schools, universities, and organizations handle identification systems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Core Values Section -->
<section class="py-5 bg-light">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="fw-bold position-relative d-inline-block section-title mb-4">Our Core Values</h2>
      <p class="text-muted">The principles that guide everything we do</p>
    </div>
    
    <div class="values-container">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="value-card text-center p-4 bg-white shadow rounded hover-card">
            <div class="value-icon mb-3">
              <i class="fas fa-shield-alt fa-3x text-primary"></i>
            </div>
            <h4 class="fw-bold mb-3">Security</h4>
            <p class="text-muted">We prioritize the security and privacy of all user data, implementing the highest standards of protection.</p>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="value-card text-center p-4 bg-white shadow rounded hover-card">
            <div class="value-icon mb-3">
              <i class="fas fa-lightbulb fa-3x text-warning"></i>
            </div>
            <h4 class="fw-bold mb-3">Innovation</h4>
            <p class="text-muted">We constantly push boundaries and embrace new technologies to improve our solutions.</p>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="value-card text-center p-4 bg-white shadow rounded hover-card">
            <div class="value-icon mb-3">
              <i class="fas fa-users fa-3x text-success"></i>
            </div>
            <h4 class="fw-bold mb-3">User-Centric</h4>
            <p class="text-muted">We design our systems with the end user in mind, ensuring a seamless experience for all.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Team Section -->
<section id="team" class="py-5">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="fw-bold position-relative d-inline-block section-title mb-4">Our Team</h2>
      <p class="text-muted">Meet the talented people behind InstiPass</p>
    </div>
    
    <div class="row g-4">
      <div class="col-lg-3 col-md-6">
        <div class="team-card text-center hover-card">
          <div class="team-img-container mb-3">
            <img src="/api/placeholder/250/250" class="img-fluid rounded-circle team-img" alt="Team Member">
            <div class="team-social">
              <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
              <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            </div>
          </div>
          <h5 class="fw-bold mb-1">Sarah Johnson</h5>
          <p class="text-primary mb-0">CEO & Founder</p>
        </div>
      </div>
      
      <div class="col-lg-3 col-md-6">
        <div class="team-card text-center hover-card">
          <div class="team-img-container mb-3">
            <img src="/api/placeholder/250/250" class="img-fluid rounded-circle team-img" alt="Team Member">
            <div class="team-social">
              <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
              <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            </div>
          </div>
          <h5 class="fw-bold mb-1">David Chen</h5>
          <p class="text-primary mb-0">CTO</p>
        </div>
      </div>
      
      <div class="col-lg-3 col-md-6">
        <div class="team-card text-center hover-card">
          <div class="team-img-container mb-3">
            <img src="/api/placeholder/250/250" class="img-fluid rounded-circle team-img" alt="Team Member">
            <div class="team-social">
              <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
              <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            </div>
          </div>
          <h5 class="fw-bold mb-1">Maria Rodriguez</h5>
          <p class="text-primary mb-0">Product Manager</p>
        </div>
      </div>
      
      <div class="col-lg-3 col-md-6">
        <div class="team-card text-center hover-card">
          <div class="team-img-container mb-3">
            <img src="/api/placeholder/250/250" class="img-fluid rounded-circle team-img" alt="Team Member">
            <div class="team-social">
              <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
              <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            </div>
          </div>
          <h5 class="fw-bold mb-1">James Wilson</h5>
          <p class="text-primary mb-0">Lead Developer</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Stats Section -->
<section class="py-5 bg-primary text-white">
  <div class="container">
    <div class="row text-center">
      <div class="col-md-3 mb-4 mb-md-0">
        <div class="stats-item">
          <div class="stats-icon mb-2">
            <i class="fas fa-school fa-3x"></i>
          </div>
          <div class="stats-number counter" data-count="500">0</div>
          <div class="stats-label">Schools</div>
        </div>
      </div>
      
      <div class="col-md-3 mb-4 mb-md-0">
        <div class="stats-item">
          <div class="stats-icon mb-2">
            <i class="fas fa-user-graduate fa-3x"></i>
          </div>
          <div class="stats-number counter" data-count="250000">0</div>
          <div class="stats-label">Students</div>
        </div>
      </div>
      
      <div class="col-md-3 mb-4 mb-md-0">
        <div class="stats-item">
          <div class="stats-icon mb-2">
            <i class="fas fa-globe fa-3x"></i>
          </div>
          <div class="stats-number counter" data-count="15">0</div>
          <div class="stats-label">Countries</div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="stats-item">
          <div class="stats-icon mb-2">
            <i class="fas fa-id-card fa-3x"></i>
          </div>
          <div class="stats-number counter" data-count="1000000">0</div>
          <div class="stats-label">IDs Generated</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ Section -->
<section class="py-5">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="fw-bold position-relative d-inline-block section-title mb-4">Frequently Asked Questions</h2>
      <p class="text-muted">Find answers to common questions about InstiPass</p>
    </div>
    
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="accordion faq-accordion" id="faqAccordion">
          <!-- FAQ Item 1 -->
          <div class="accordion-item border-0 shadow-sm mb-3">
            <h3 class="accordion-header" id="headingOne">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                How does InstiPass work?
              </button>
            </h3>
            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
              <div class="accordion-body">
                InstiPass simplifies the student ID process by allowing institutions to set up templates and requirements, while students submit their information and photos through our secure platform. Our AI system then generates professional IDs that administrators can approve with a single click.
              </div>
            </div>
          </div>
          
          <!-- FAQ Item 2 -->
          <div class="accordion-item border-0 shadow-sm mb-3">
            <h3 class="accordion-header" id="headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Is student data secure with InstiPass?
              </button>
            </h3>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
              <div class="accordion-body">
                Absolutely. We implement enterprise-grade security measures including end-to-end encryption, secure data storage, and regular security audits. We are fully compliant with all data protection regulations, ensuring your students' information is always protected.
              </div>
            </div>
          </div>
          
          <!-- FAQ Item 3 -->
          <div class="accordion-item border-0 shadow-sm mb-3">
            <h3 class="accordion-header" id="headingThree">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                Can we customize the ID design for our institution?
              </button>
            </h3>
            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
              <div class="accordion-body">
                Yes! InstiPass offers extensive customization options. You can upload your institution's logo, select custom colors that match your branding, choose from various ID layouts, and specify which information fields to include on the IDs.
              </div>
            </div>
          </div>
          
          <!-- FAQ Item 4 -->
          <div class="accordion-item border-0 shadow-sm">
            <h3 class="accordion-header" id="headingFour">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                How much does InstiPass cost?
              </button>
            </h3>
            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
              <div class="accordion-body">
                InstiPass offers flexible pricing plans starting at $49/month for small institutions. Our Pro plan at $99/month includes unlimited students and additional features. For larger organizations with specific needs, we offer custom Enterprise plans. Check our pricing page for more details.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Contact Section -->
<section id="contact" class="py-5 bg-light">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 text-center">
        <h2 class="fw-bold position-relative d-inline-block section-title mb-4">Get In Touch</h2>
        <p class="text-muted mb-5">Have questions or want to learn more? We'd love to hear from you!</p>
      </div>
    </div>
    
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card contact-card border-0 shadow">
          <div class="card-body p-4 p-md-5">
            <div class="row mb-4">
              <div class="col-md-4 text-center mb-4 mb-md-0">
                <div class="contact-info-item">
                  <div class="contact-icon text-primary mb-3">
                    <i class="fas fa-map-marker-alt fa-2x"></i>
                  </div>
                  <h5 class="fw-bold">Address</h5>
                  <p class="text-muted">123 Tech Street, Suite 456<br>San Francisco, CA 94107</p>
                </div>
              </div>
              
              <div class="col-md-4 text-center mb-4 mb-md-0">
                <div class="contact-info-item">
                  <div class="contact-icon text-primary mb-3">
                    <i class="fas fa-envelope fa-2x"></i>
                  </div>
                  <h5 class="fw-bold">Email</h5>
                  <p class="text-muted">info@instipass.com<br>support@instipass.com</p>
                </div>
              </div>
              
              <div class="col-md-4 text-center">
                <div class="contact-info-item">
                  <div class="contact-icon text-primary mb-3">
                    <i class="fas fa-phone fa-2x"></i>
                  </div>
                  <h5 class="fw-bold">Phone</h5>
                  <p class="text-muted">+1 (555) 123-4567<br>+1 (555) 987-6543</p>
                </div>
              </div>
            </div>
            
            <form id="contactForm" class="contact-form">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="name" placeholder="Your Name" required>
                    <label for="name">Your Name</label>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="email" placeholder="Your Email" required>
                    <label for="email">Your Email</label>
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <select class="form-select" id="subject" required>
                      <option value="" selected disabled>Choose a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="demo">Request a Demo</option>
                      <option value="sales">Sales Question</option>
                    </select>
                    <label for="subject">Subject</label>
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <textarea class="form-control" id="message" placeholder="Your Message" style="height: 150px" required></textarea>
                    <label for="message">Your Message</label>
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="d-grid">
                    <button type="submit" id="submitBtn" class="btn btn-primary btn-lg">
                      <span class="submit-text">Send Message</span>
                      <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            
            <div id="formMessage" class="alert alert-success mt-4 text-center" style="display: none;">
              <i class="fas fa-check-circle me-2"></i> Thank you! Your message has been sent successfully.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Map Section -->
<section class="map-section">
  <div class="container-fluid p-0">
    <div class="map-container">
      <div class="map-placeholder bg-light d-flex align-items-center justify-content-center py-5">
        <div class="text-center">
          <i class="fas fa-map-marked-alt fa-4x text-primary mb-3"></i>
          <h4 class="fw-bold">Our Office Location</h4>
          <p class="text-muted">123 Tech Street, Suite 456, San Francisco, CA 94107</p>
          <button class="btn btn-outline-primary mt-2">View on Google Maps</button>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
// Timeline Steps
document.querySelectorAll('.timeline-step').forEach(step => {
  step.addEventListener('click', function() {
    document.querySelectorAll('.timeline-step').forEach(s => s.classList.remove('active'));
    this.classList.add('active');
  });
});

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Show loading spinner
  const submitButton = document.getElementById('submitBtn');
  submitButton.disabled = true;
  submitButton.querySelector('.submit-text').style.display = 'none';
  submitButton.querySelector('.spinner-border').classList.remove('d-none');
  
  // Simulate form submission (replace with actual form handling)
  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.querySelector('.submit-text').style.display = 'inline';
    submitButton.querySelector('.spinner-border').classList.add('d-none');
    
    // Show success message
    document.getElementById('formMessage').style.display = 'block';
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
      document.getElementById('formMessage').style.display = 'none';
    }, 5000);
  }, 1500);
});

// Counter Animation
function animateCounter() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200;
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    const increment = target / speed;
    
    let current = 0;
    const updateCounter = () => {
      current += increment;
      counter.innerText = Math.ceil(current).toLocaleString();
      
      if (current < target) {
        setTimeout(updateCounter, 1);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    
    updateCounter();
  });
}

// Initialize counter animation when element is in viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-number');
if (statsSection) {
  observer.observe(statsSection);
}

// Process Step Animation
document.querySelectorAll('.process-step').forEach(step => {
  step.addEventListener('click', function() {
    document.querySelectorAll('.process-step').forEach(s => {
      s.classList.remove('active');
    });
    this.classList.add('active');
  });
});
</script>

<style>
/* General Styles */
:root {
  --primary-color: #0d6efd;
  --hover-color: #0b5ed7;
  --light-color: #f8f9fa;
  --dark-color: #212529;
  --transition: all 0.3s ease;
}

body {
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
}

.section-title {
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 3px;
  background-color: var(--primary-color);
}

/* Hero Section */
.about-hero {
  position: relative;
  padding: 80px 0;
  background-color: var(--light-color);
  overflow: hidden;
}

.animated-text {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}

.animated-text-delay {
  animation-delay: 0.3s;
}

.animated-button {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease 0.6s forwards;
}

.animated-button-delay {
  animation-delay: 0.9s;
}

.floating-animation {
  animation: floating 6s ease-in-out infinite;
}

.background-shapes .shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  z-index: 0;
}

.shape-1 {
  width: 150px;
  height: 150px;
  background-color: var(--primary-color);
  top: -50px;
  left: -50px;
}

.shape-2 {
  width: 100px;
  height: 100px;
  background-color: #ffc107;
  top: 30%;
  right: 10%;
}

.shape-3 {
  width: 80px;
  height: 80px;
  background-color: #198754;
  bottom: 10%;
  left: 20%;
}

/* Timeline */
.timeline-container {
  padding: 40px 0;
}

.timeline-stepper {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.timeline-stepper::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #dee2e6;
  z-index: 0;
}

.timeline-step {
  position: relative;
  z-index: 1;
  cursor: pointer;
  text-align: center;
  width: 25%;
}

.timeline-step-icon {
  width: 60px;
  height: 60px;
  background-color: white;
  border: 2px solid #dee2e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  transition: var(--transition);
}

.timeline-step-icon::before {
  content: attr(data-year);
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  color: var(--primary-color);
}

.timeline-step.active .timeline-step-icon {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
}

.timeline-info {
  padding-top: 20px;
  max-width: 200px;
  margin: 0 auto;
  opacity: 0.7;
  transition: var(--transition);
}

.timeline-step.active .timeline-info {
  opacity: 1;
}

/* Cards */
.hover-card {
  transition: var(--transition);
  border-bottom: 3px solid transparent;
}

.hover-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  border-bottom: 3px solid var(--primary-color);
}

.icon-box {
  width: 50px;
  height: 50px;
  border-radius

 {% endblock %}

# Home page
{% extends 'base.html' %}
{% block title %}InstiPass - Smart Student ID Management{% endblock %}

{% block content %}
{% include "navbar.html" %}

<!-- Hero Section with Animation -->
<section class="hero-section position-relative overflow-hidden">
  <div class="container position-relative z-index-2 py-5">
    <div class="row align-items-center min-vh-75">
      <div class="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
        <h1 class="display-3 fw-bold mb-3 animated-text">Welcome to <span class="text-primary">InstiPass</span></h1>
        <p class="lead text-muted mb-4 animated-text-delay">Your all-in-one solution for seamless student ID management, powered by AI.</p>
        <div class="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start">
          <a href="student" class="btn btn-primary btn-lg px-4 me-sm-3 mb-3 mb-sm-0 animated-button">Get Started</a>
          <a href="institution" class="btn btn-outline-primary btn-lg px-4 animated-button-delay">Institution Dashboard</a>
        </div>
      </div>
      <div class="col-lg-6 d-none d-lg-block">
        <div class="hero-image-container">
          <img src="/api/placeholder/500/400" alt="Student ID Card" class="img-fluid rounded-lg shadow-lg floating-animation">
        </div>
      </div>
    </div>
  </div>
  <div class="background-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
    <div class="shape shape-4"></div>
  </div>
</section>

<!-- Features Section with Hover Effects -->
<section class="py-5">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="fw-bold position-relative d-inline-block section-title">Key Features</h2>
      <p class="text-muted mt-3">Everything you need to modernize your student ID system</p>
    </div>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="feature-card p-4 bg-white shadow rounded hover-card text-center">
          <div class="icon-circle mb-4 mx-auto">
            <i class="fas fa-id-card"></i>
          </div>
          <h5 class="fw-bold">AI-Generated Student IDs</h5>
          <p class="text-muted">Generate smart, personalized IDs automatically with AI.</p>
          <a href="#" class="stretched-link feature-link">Learn more</a>
        </div>
      </div>
      <div class="col-md-4">
        <div class="feature-card p-4 bg-white shadow rounded hover-card text-center">
          <div class="icon-circle bg-success mb-4 mx-auto">
            <i class="fas fa-layer-group"></i>
          </div>
          <h5 class="fw-bold">Multi-Institution Management</h5>
          <p class="text-muted">Handle multiple schools from a single, easy-to-use platform.</p>
          <a href="#" class="stretched-link feature-link">Learn more</a>
        </div>
      </div>
      <div class="col-md-4">
        <div class="feature-card p-4 bg-white shadow rounded hover-card text-center">
          <div class="icon-circle bg-warning mb-4 mx-auto">
            <i class="fas fa-bell"></i>
          </div>
          <h5 class="fw-bold">Real-Time Notifications</h5>
          <p class="text-muted">Stay updated with alerts on approvals, rejections, and statuses.</p>
          <a href="#" class="stretched-link feature-link">Learn more</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- How It Works Section with Animation -->
<section class="bg-light py-5">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="fw-bold position-relative d-inline-block section-title">How It Works</h2>
      <p class="text-muted mt-3">Four simple steps to modernize your student ID system</p>
    </div>
    <div class="process-timeline">
      <div class="row">
        <div class="col-md-3">
          <div class="process-step active" data-step="1">
            <div class="process-icon">
              <i class="fas fa-school"></i>
            </div>
            <h6 class="fw-bold mt-4">Register Institution</h6>
            <p class="text-muted">Upload preferences and set up templates.</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="process-step" data-step="2">
            <div class="process-icon">
              <i class="fas fa-user-plus"></i>
            </div>
            <h6 class="fw-bold mt-4">Student Profiles</h6>
            <p class="text-muted">Students submit details and photos securely.</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="process-step" data-step="3">
            <div class="process-icon">
              <i class="fas fa-magic"></i>
            </div>
            <h6 class="fw-bold mt-4">AI ID Creation</h6>
            <p class="text-muted">Automatically generate polished, official IDs.</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="process-step" data-step="4">
            <div class="process-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <h6 class="fw-bold mt-4">Approve & Issue</h6>
            <p class="text-muted">Admins approve and release IDs with one click.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Interactive Counter Section -->
<section class="py-5 bg-primary text-white">
  <div class="container">
    <div class="row text-center">
      <div class="col-md-4 mb-4 mb-md-0">
        <div class="counter-item">
          <div class="counter-number" data-count="500">0</div>
          <div class="counter-text">Institutions</div>
        </div>
      </div>
      <div class="col-md-4 mb-4 mb-md-0">
        <div class="counter-item">
          <div class="counter-number" data-count="250000">0</div>
          <div class="counter-text">Student IDs</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="counter-item">
          <div class="counter-number" data-count="98">0</div>
          <div class="counter-text">% Satisfaction</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Testimonials Section with Carousel -->
<section class="py-5">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="fw-bold position-relative d-inline-block section-title">What Our Users Say</h2>
      <p class="text-muted mt-3">Hear from our satisfied customers</p>
    </div>
    <div id="testimonialsCarousel" class="carousel slide testimonial-carousel" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="testimonial-card text-center p-5 shadow rounded bg-white">
                <div class="testimonial-avatar mb-4">
                  <img src="/api/placeholder/80/80" alt="Avatar" class="rounded-circle">
                </div>
                <blockquote class="blockquote mb-0">
                  <p>"InstiPass transformed how we manage student IDs. The AI-powered system saves us hours of work each week and our students love the modern, secure IDs they receive."</p>
                  <footer class="blockquote-footer mt-3">Sarah Johnson, <cite>School Administrator</cite></footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="testimonial-card text-center p-5 shadow rounded bg-white">
                <div class="testimonial-avatar mb-4">
                  <img src="/api/placeholder/80/80" alt="Avatar" class="rounded-circle">
                </div>
                <blockquote class="blockquote mb-0">
                  <p>"As a student, I love how easy it is to track my ID status. The app notifies me when my ID is ready and I can access a digital version instantly on my phone."</p>
                  <footer class="blockquote-footer mt-3">Michael Chen, <cite>Student User</cite></footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="testimonial-card text-center p-5 shadow rounded bg-white">
                <div class="testimonial-avatar mb-4">
                  <img src="/api/placeholder/80/80" alt="Avatar" class="rounded-circle">
                </div>
                <blockquote class="blockquote mb-0">
                  <p>"No more long lines or paperwork. InstiPass is a game-changer for parents too. I can easily submit my child's information and track the whole process online."</p>
                  <footer class="blockquote-footer mt-3">Lisa Martinez, <cite>Parent</cite></footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#testimonialsCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#testimonialsCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
      <div class="carousel-indicators position-static mt-4">
        <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
    </div>
  </div>
</section>

<!-- Pricing Section with Interactive Toggle -->
<section class="bg-light py-5">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="fw-bold position-relative d-inline-block section-title">Pricing Plans</h2>
      <p class="text-muted mt-3">Choose the right plan for your institution</p>
      <div class="pricing-toggle mt-4">
        <span class="me-3">Monthly</span>
        <div class="form-check form-switch d-inline-block">
          <input class="form-check-input" type="checkbox" id="pricingToggle">
          <label class="form-check-label" for="pricingToggle"></label>
        </div>
        <span class="ms-3">Annual <span class="badge bg-success">Save 20%</span></span>
      </div>
    </div>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="pricing-card p-4 bg-white shadow rounded text-center h-100">
          <div class="pricing-header mb-4">
            <h4 class="fw-bold">Starter</h4>
            <div class="pricing-value">
              <span class="currency">$</span>
              <span class="price monthly">49</span>
              <span class="price annual d-none">39</span>
              <span class="period">/month</span>
            </div>
            <p class="text-muted">Perfect for small institutions</p>
          </div>
          <ul class="list-unstyled pricing-features mb-4">
            <li class="mb-2">✔ Up to 500 students</li>
            <li class="mb-2">✔ Basic ID templates</li>
            <li class="mb-2">✔ Email support</li>
            <li class="mb-2">✔ Digital ID cards</li>
            <li class="mb-2 text-muted">❌ Custom branding</li>
            <li class="mb-2 text-muted">❌ Priority support</li>
          </ul>
          <button class="btn btn-outline-primary btn-lg w-100">Choose Plan</button>
        </div>
      </div>
      <div class="col-md-4">
        <div class="pricing-card p-4 bg-primary text-white shadow rounded text-center h-100 popular-plan">
          <div class="popular-badge">Most Popular</div>
          <div class="pricing-header mb-4">
            <h4 class="fw-bold">Pro</h4>
            <div class="pricing-value">
              <span class="currency">$</span>
              <span class="price monthly">99</span>
              <span class="price annual d-none">79</span>
              <span class="period">/month</span>
            </div>
            <p>Ideal for medium/large institutions</p>
          </div>
          <ul class="list-unstyled pricing-features mb-4">
            <li class="mb-2">✔ Unlimited students</li>
            <li class="mb-2">✔ Premium ID templates</li>
            <li class="mb-2">✔ Priority support</li>
            <li class="mb-2">✔ Digital ID cards</li>
            <li class="mb-2">✔ Custom branding</li>
            <li class="mb-2 text-muted">❌ Dedicated account manager</li>
          </ul>
          <button class="btn btn-light text-primary btn-lg w-100">Choose Plan</button>
        </div>
      </div>
      <div class="col-md-4">
        <div class="pricing-card p-4 bg-white shadow rounded text-center h-100">
          <div class="pricing-header mb-4">
            <h4 class="fw-bold">Enterprise</h4>
            <div class="pricing-value">
              <span class="custom-price">Custom</span>
            </div>
            <p class="text-muted">For large organizations with specific needs</p>
          </div>
          <ul class="list-unstyled pricing-features mb-4">
            <li class="mb-2">✔ Unlimited students</li>
            <li class="mb-2">✔ Custom ID solutions</li>
            <li class="mb-2">✔ 24/7 premium support</li>
            <li class="mb-2">✔ Digital ID cards</li>
            <li class="mb-2">✔ Custom branding</li>
            <li class="mb-2">✔ Dedicated account manager</li>
          </ul>
          <button class="btn btn-outline-primary btn-lg w-100">Contact Sales</button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Contact Section -->
<section class="py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="text-center mb-5">
          <h2 class="fw-bold position-relative d-inline-block section-title">Get in Touch</h2>
          <p class="text-muted mt-3">Have questions? We're here to help!</p>
        </div>
        <form id="contactForm" class="contact-form p-4 bg-white shadow rounded">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" id="nameInput" placeholder="Your Name">
                <label for="nameInput">Your Name</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="email" class="form-control" id="emailInput" placeholder="Your Email">
                <label for="emailInput">Your Email</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-3">
                <select class="form-select" id="subjectSelect">
                  <option value="" selected disabled>Choose a subject</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="demo">Request a Demo</option>
                  <option value="other">Other</option>
                </select>
                <label for="subjectSelect">Subject</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-3">
                <textarea class="form-control" placeholder="Your Message" id="messageTextarea" style="height: 150px"></textarea>
                <label for="messageTextarea">Your Message</label>
              </div>
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary btn-lg w-100">Send Message</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-5 bg-primary text-white">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-8 text-center text-lg-start mb-4 mb-lg-0">
        <h3 class="fw-bold">Ready to modernize your student ID system?</h3>
        <p class="mb-0">Join hundreds of institutions already using InstiPass.</p>
      </div>
      <div class="col-lg-4 text-center text-lg-end">
        <a href="student" class="btn btn-light text-primary btn-lg">Get Started Now</a>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="bg-dark text-white pt-5 pb-4">
  <div class="container">
    <div class="row g-4">
      <div class="col-lg-4 col-md-6">
        <h5 class="fw-bold mb-3">InstiPass</h5>
        <p class="mb-3">Your all-in-one solution for seamless student ID management, powered by AI.</p>
        <div class="social-links">
          <a href="#" class="text-white me-3"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="text-white me-3"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-white me-3"><i class="fab fa-instagram"></i></a>
          <a href="#" class="text-white me-3"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>
      <div class="col-lg-2 col-md-6">
        <h5 class="fw-bold mb-3">Quick Links</h5>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="#" class="text-white text-decoration-none">Home</a></li>
          <li class="mb-2"><a href="#" class="text-white text-decoration-none">Features</a></li>
          <li class="mb-2"><a href="#" class="text-white text-decoration-none">Pricing</a></li>
          <li class="mb-2"><a href="#" class="text-white text-decoration-none">Contact</a></li>
        </ul>
      </div>
      <div class="col-lg-2 col-md-6">
        <h5 class="fw-bold mb-3">Resources</h5>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="#" class="text-white text-decoration-none">Blog</a></li>
          <li class="mb-2"><a href="#" class="text-white text-decoration-none">Help Center</a></li>
          <li class="mb-2"><a href="#" class="text-white text-decoration-none">API Docs</a></li>
          <li class="mb-2"><a href="#" class="text-white text-decoration-none">Partners</a></li>
        </ul>
      </div>
      <div class="col-lg-4 col-md-6">
        <h5 class="fw-bold mb-3">Subscribe to our newsletter</h5>
        <p class="mb-3">Get the latest news and updates from InstiPass.</p>
        <div class="input-group mb-3">
          <input type="email" class="form-control" placeholder="Your email address" aria-label="Your email address" aria-describedby="subscribe-button">
          <button class="btn btn-primary" type="button" id="subscribe-button">Subscribe</button>
        </div>
      </div>
    </div>
    <hr class="mt-4 mb-3">
    <div class="row">
      <div class="col-md-6 text-center text-md-start">
        <p class="mb-0">&copy; 2025 InstiPass. All rights reserved.</p>
      </div>
      <div class="col-md-6 text-center text-md-end">
        <a href="#" class="text-white text-decoration-none me-3">Privacy Policy</a>
        <a href="#" class="text-white text-decoration-none">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>

<button id="back-to-top" class="btn btn-primary btn-lg back-to-top" title="Back to Top">
  <i class="fas fa-arrow-up"></i>
</button>

<style>
  /* General Styles */
  :root {
    --primary-color: #0d6efd;
    --hover-color: #0b5ed7;
    --light-color: #f8f9fa;
    --dark-color: #212529;
    --transition: all 0.3s ease;
  }
  
  body {
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
  }
  
  .section-title {
    position: relative;
    padding-bottom: 15px;
  }
  
  .section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 3px;
    background-color: var(--primary-color);
  }
  
  /* Hero Section */
  .hero-section {
    position: relative;
    padding: 100px 0;
    background-color: var(--light-color);
  }
  
  .animated-text {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease forwards;
  }
  
  .animated-text-delay {
    animation-delay: 0.3s;
  }
  
  .animated-button {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease 0.6s forwards;
  }
  
  .animated-button-delay {
    animation-delay: 0.9s;
  }
  
  .floating-animation {
    animation: floating 6s ease-in-out infinite;
  }
  
  .background-shapes .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    z-index: 0;
  }
  
  .shape-1 {
    width: 150px;
    height: 150px;
    background-color: var(--primary-color);
    top: -50px;
    left: -50px;
  }
  
  .shape-2 {
    width: 100px;
    height: 100px;
    background-color: #ffc107;
    top: 30%;
    right: 10%;
  }
  
  .shape-3 {
    width: 80px;
    height: 80px;
    background-color: #198754;
    bottom: 10%;
    left: 20%;
  }
  
  .shape-4 {
    width: 120px;
    height: 120px;
    background-color: #dc3545;
    bottom: -40px;
    right: -40px;
  }
  
  /* Features Section */
  .feature-card {
    transition: var(--transition);
    position: relative;
    overflow: hidden;
    border-bottom: 3px solid transparent;
  }
  
  .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    border-bottom: 3px solid var(--primary-color);
  }
  
  .icon-circle {
    width: 70px;
    height: 70px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: var(--transition);
  }
  
  .feature-card:hover .icon-circle {
    transform: scale(1.1);
  }
  
  .feature-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    opacity: 0;
    transition: var(--transition);
  }
  
  .feature-card:hover .feature-link {
    opacity: 1;
  }
  
  /* Process Timeline */
  .process-timeline {
    position: relative;
    padding: 20px 0;
  }
  
  .process-timeline::before {
    content: '';
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 2px;
    background-color: #e9ecef;
    z-index: 0;
  }
  
  .process-step {
    position: relative;
    text-align: center;
    z-index: 1;
    transition: var(--transition);
    cursor: pointer;
  }
  
  .process-icon {
    width: 80px;
    height: 80px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin: 0 auto;
    color: var(--primary-color);
    border: 2px solid #e9ecef;
    position: relative;
    transition: var(--transition);
    z-index: 2;
  }
  
  .process-icon::before {
    content: attr(data-step);
    position: absolute;
    top: -10px;
    right: -10px;
    width: 25px;
    height: 25px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .process-step:hover .process-icon,
  .process-step.active .process-icon {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: scale(1.1);
  }
  
  /* Counter Section */
  .counter-item {
    transition: var(--transition);
  }
  
  .counter-number {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .counter-text {
    font-size: 1.2rem;
    font-weight: 500;
    opacity: 0.8;
  }
  
  /* Testimonials */
  .testimonial-avatar img {
    width: 80px;
    height: 80px;
    border: 3px solid var(--primary-color);
  }
  
  .testimonial-card {
    transition: var(--transition);
  }
  
  .testimonial-card:hover {
    transform: translateY(-5px);
  }
  
  .carousel-indicators [data-bs-target] {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary-color);
    opacity: 0.5;
  }
  
  .carousel-indicators .active {
    opacity: 1;
  }
  
  /* Pricing Section */
  .pricing-card {
    transition: var(--transition);
    border-top: 3px solid transparent;
  }
  
  .pricing-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px

 {% endblock %}   


http://127.0.0.1:8000/accounts/google/login/callback/?state=sTeZkmz1GXmwEk4U&code=4%2F0AUJR-x4JESCILn3DH7bhdw9r_6RQZ5gyhP2CGhtdyH_F7c-2ezDi2wmqKSq2zfdWLrC8gQ&scope=profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile