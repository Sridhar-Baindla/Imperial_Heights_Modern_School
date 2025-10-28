document.getElementById('year').textContent = new Date().getFullYear();
// footer.js or main.js

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Preload all images used on your website
  const imageUrls = [
    "../assets/assets_facilities/Smart-classroom1.jpg",
    "../assets/assets_facilities/Smart-classroom2.jpg",
    "../assets/assets_facilities/computer-lab1.jpg",
    "../assets/assets_facilities/computer-lab2.jpg",
    "../assets/assets_facilities/library1.jpg",
    "../assets/assets_facilities/library2.jpg",
    "../assets/assets_facilities/playground1.jpg",
    "../assets/assets_facilities/playground2.jpg",
    "../assets/assets_facilities/cafeteria1.jpg",
    "../assets/assets_facilities/cafeteria2.jpg",
    "../assets/assets_facilities/smart-classes.mp4"
  ];

  preloadImages(imageUrls);
});

/**
 * Preloads all given images to make them instantly available in cache.
 * @param {string[]} urls
 */
function preloadImages(urls) {
  if (!("caches" in window)) {
    // fallback for older browsers
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
    return;
  }

  // For modern browsers – use Cache Storage
  caches.open("school-site-cache-v1").then(cache => {
    urls.forEach(url => {
      fetch(url)
        .then(response => {
          if (response.ok) cache.put(url, response.clone());
        })
        .catch(err => console.warn("Failed to cache:", url, err));
    });
  });
}
