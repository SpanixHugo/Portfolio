// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Tab functionality
function opentab(tabname) {
    const tablinks = document.getElementsByClassName('tab-links');
    const tabcontents = document.getElementsByClassName('tab-contents');
    
    for (let tablink of tablinks) {
        tablink.classList.remove('active-link');
    }
    
    for (let tabcontent of tabcontents) {
        tabcontent.classList.remove('active-tab');
    }
    
    event.currentTarget.classList.add('active-link');
    document.getElementById(tabname).classList.add('active-tab');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});


// Testimonial Slider
const track = document.querySelector('.testimonial-track');
const dots = document.querySelectorAll('.testimonial-dot');
let currentSlide = 0;

function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto-rotate testimonials
setInterval(() => {
    currentSlide = (currentSlide + 1) % dots.length;
    updateSlider();
}, 5000);

document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('click', function () {
      console.log('Book clicked:', this.querySelector('h3').textContent);
    });
});
  

document.addEventListener('DOMContentLoaded', function() {
    // Get modal element
    const modal = document.getElementById('worksModal');
    
    // Get open modal button
    const openModalBtn = document.getElementById('openModal');
    
    // Get close button
    const closeBtn = document.getElementsByClassName('close')[0];
    
    // Function to open modal
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    }
    
    // Listen for open click
    openModalBtn.addEventListener('click', openModal);
    
    // Listen for close click
    closeBtn.addEventListener('click', closeModal);
    
    // Listen for outside click
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});

function toggleText(id, button) {
    const expandable = document.getElementById(id);
    const isExpanded = expandable.classList.contains('expanded');
    
    if (isExpanded) {
        expandable.classList.remove('expanded');
        expandable.classList.add('collapsed');
        button.innerHTML = '<i class="fas fa-chevron-down"></i> See More';
    } else {
        expandable.classList.remove('collapsed');
        expandable.classList.add('expanded');
        button.innerHTML = '<i class="fas fa-chevron-up"></i> See Less';
    }
}

function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-contents');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active-tab');
    }
    
    // Remove active class from all tab links
    const tabLinks = document.getElementsByClassName('tab-links');
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active-link');
    }
    
    // Show the selected tab and set the tab link as active
    document.getElementById(tabName).classList.add('active-tab');
    
    // Find and activate the clicked tab link
    event.currentTarget.classList.add('active-link');
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("images.json")
    .then(res => res.json())
    .then(data => {
      const images = data.images;
      const mainGallery = document.getElementById("gallery-grid");
      const modalGallery = document.getElementById("gallery-modal-grid");

      // First 8 images → main gallery
      images.slice(0, 8).forEach(src => {
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.innerHTML = `<img src="${src}" alt="Gallery Image">`;
        mainGallery.appendChild(div);
      });

      // Remaining images → modal gallery
      images.slice(8).forEach(src => {
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.innerHTML = `<img src="${src}" alt="Gallery Image">`;
        modalGallery.appendChild(div);
      });

      // Enable click-to-enlarge inside modal
      const lightbox = document.getElementById("lightbox");
      const lightboxImg = document.getElementById("lightbox-img");
      const lightboxClose = document.querySelector(".lightbox-close");

      modalGallery.addEventListener("click", e => {
        if (e.target.tagName === "IMG") {
          lightbox.style.display = "flex";
          lightboxImg.src = e.target.src;
        }
      });

      lightboxClose.onclick = () => (lightbox.style.display = "none");
      lightbox.onclick = e => {
        if (e.target === lightbox) lightbox.style.display = "none";
      };
    });

  // Modal handling
  const modal = document.getElementById("galleryModal");
  const btn = document.getElementById("openGalleryModal");
  const span = document.querySelector(".close");

  btn.onclick = () => (modal.style.display = "block");
  span.onclick = () => (modal.style.display = "none");
  window.onclick = e => {
    if (e.target == modal) modal.style.display = "none";
  };
});

// const modal = document.getElementById("applicationModal");
// const openBtn = document.getElementById("openApplicationForm");
// const closeBtn = document.querySelector(".close-modal");

// openBtn.addEventListener("click", () => {
//     modal.style.display = "flex";
// });

// closeBtn.addEventListener("click", () => {
//     modal.style.display = "none";
// });

// window.addEventListener("click", (e) => {
//     if (e.target === modal) {
//         modal.style.display = "none";
//     }
// });

// document.getElementById("applicationForm").addEventListener("submit", function (e) {
//     e.preventDefault();
//     alert("Application submitted successfully!");
//     modal.style.display = "none";
//     this.reset();
// });

 // Modal functionality
document.addEventListener('DOMContentLoaded', function() {
const modal = document.getElementById('applicationModal');
const openBtn = document.getElementById('openApplicationForm');
const closeBtn = document.querySelector('.close-modal');
const form = document.getElementById('applicationForm');

// Open modal
openBtn.addEventListener('click', function() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
});

// Close modal
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simple form validation
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const program = document.getElementById('program').value;
    
    if (!fullname || !email || !phone || !program) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // In a real application, you would send this data to a server
    alert(`Thank you, ${fullname}! Your application for ${program} has been received. We will contact you soon.`);
    
    // Reset form and close modal
    form.reset();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});
});