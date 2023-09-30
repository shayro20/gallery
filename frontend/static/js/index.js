const links = document.querySelectorAll("nav a");
const contentDiv = document.getElementById("content");

function loadContent(hash) {
  if (hash === "") {
    contentDiv.innerHTML = "<h2>Welcome to the Home Page</h2>";
  } else if (hash === "#gallery") {
    contentDiv.innerHTML = "<h2>Gallery Page</h2><p>We are a cool SPA!</p>";
  } else {
    contentDiv.innerHTML = "<h2>Page not found</h2>";
  }
}

window.addEventListener("hashchange", () => {
  const currentHash = window.location.hash;
  loadContent(currentHash);
});

loadContent(window.location.hash);
