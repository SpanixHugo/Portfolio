// Mobile nav toggle
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

// document.addEventListener("DOMContentLoaded", () => {
//   fetch("images.json")
//     .then(res => res.json())
//     .then(data => {
//       const container = document.getElementById("publications-card");

//       data.books.forEach(book => {
//         const card = document.createElement("div");
//         card.classList.add("publication-card");

//         card.innerHTML = `
//           <div class="publication-image">
//             <img src="${book.image || "placeholder.jpg"}" alt="${book.title} Cover">
//           </div>
//           <div class="publication-details">
//             <h3 class="publication-title">${book.title}</h3>
//             <span class="publication-year">Published: ${book.year}</span>
//             <p class="publication-description">${book.description || "No description available yet."}</p>
//             <a href="${book.link}" class="publication-link"><i class="fas fa-eye"></i> View Details</a>
//           </div>
//         `;

//         container.appendChild(card);
//       });
//     })
//     .catch(err => console.error("Error loading JSON:", err));
// });

document.addEventListener("DOMContentLoaded", () => {
fetch("images.json")
    .then(res => res.json())
    .then(data => {
    const container = document.getElementById("publications-card");

    data.books.forEach(book => {
        const card = document.createElement("div");
        card.classList.add("publication-card");

        // control length (e.g., 100 chars preview)
        const maxLength = 100;
        let description = book.description || "No description available yet.";
        let shortText = description.length > maxLength ? description.slice(0, maxLength) + "..." : description;

        card.innerHTML = `
        <div class="publication-image">
            <img src="${book.image}" alt="${book.title} Cover">
        </div>
        <div class="publication-details">
            <h3 class="publication-title">${book.title}</h3>
            <span class="publication-year">Published: ${book.year}</span>
            <p class="publication-description" data-full="${description}">
            ${shortText}
            </p>
            ${description.length > maxLength ? `<span class="see-more">See more</span>` : ""}
            <a href="${book.link}" class="publication-link"><i class="fas fa-eye"></i> View Details</a>
        </div>
        `;

        container.appendChild(card);
    });

    // handle see more/less toggle
    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("see-more")) {
        const desc = e.target.previousElementSibling;
        if (e.target.textContent === "See more") {
            desc.textContent = desc.dataset.full;
            e.target.textContent = "See less";
        } else {
            const fullText = desc.dataset.full;
            desc.textContent = fullText.slice(0, 100) + "...";
            e.target.textContent = "See more";
        }
        }
    });
    });
});