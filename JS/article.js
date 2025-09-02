// Toggle menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = nav.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  fetch("images.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("publications-grid");
      const maxLength = 150; // limit for preview

        data.articles.forEach(article => {
            const card = document.createElement("div");
            card.classList.add("publication-card");

            card.innerHTML = `
           
            <div class="publication-details">
                <h3 class="publication-title">${article.title}</h3>
                <div class="publication-meta">
                    <span>Published: ${article.date}</span>
                    
                </div>
                <p class="publication-description" data-full="${article.description}">
                    ${article.description}
                </p>
                <span class="see-more">See more</span>
                <a href="${article.link}" class="publication-link">
                    <i class="fas fa-eye"></i> Read Article
                </a>
            </div>
            `;

            container.appendChild(card);

            // Apply see more/less
            const desc = card.querySelector(".publication-description");
            const seeMore = card.querySelector(".see-more");
            const fullText = article.description;

            if (fullText.length > maxLength) {
            desc.textContent = fullText.slice(0, maxLength) + "...";
            seeMore.addEventListener("click", () => {
                if (seeMore.textContent === "See more") {
                desc.textContent = fullText;
                seeMore.textContent = "See less";
                } else {
                desc.textContent = fullText.slice(0, maxLength) + "...";
                seeMore.textContent = "See more";
                }
            });
            } else {
            seeMore.style.display = "none";
            }
        });
    });
});
 // <div class="publication-image">
//     <img src="${article.image}" alt="${article.title} Cover">
// </div>
{/* <span>${article.readTime}</span> */}