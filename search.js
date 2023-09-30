const apiKey = "39686306-37f7eeccf90467f6db7fc9cee";
const baseUrl = "https://pixabay.com/api/";

const PER_PAGE = 200;
let PAGE_NUMBER = 1;
let QUERY = "";
let API_URL = "";
let CATEGORY = "";

const favoriteState = [];

const input = document.querySelector("input");
const btn = document.querySelector("button");
const pictures = document.getElementById("pics");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

function buildApiUrl(query) {
  const queryParams = {
    key: apiKey,
    per_page: PER_PAGE,
    page: PAGE_NUMBER,
    q: query,
    category: CATEGORY.trim(),
  };
  return `${baseUrl}?${new URLSearchParams(queryParams).toString()}`;
}

async function searchImage(event) {
  event.preventDefault();
  QUERY = input.value;
  PAGE_NUMBER = 1;
  API_URL = buildApiUrl(QUERY);
  const images = await getImages(API_URL);
  if (images) {
    sendImages(images.hits);
  }
}

async function nextPage() {
  if (PAGE_NUMBER === 1) {
    prevBtn.disabled = true;
  }
  PAGE_NUMBER++;
  API_URL = buildApiUrl(QUERY);
  const isLastPage = await getImages(lastPageCheck());
  if (!isLastPage) {
    nextBtn.disabled = true;
  }
  const images = await getImages(API_URL);
  if (images) {
    sendImages(images.hits);
    prevBtn.disabled = false;
  } else {
    PAGE_NUMBER--;
    nextBtn.disabled = true;
  }
}
async function prevPage() {
  if (PAGE_NUMBER === 2) {
    prevBtn.disabled = true;
  }
  PAGE_NUMBER--;
  API_URL = buildApiUrl(QUERY);
  const images = await getImages(API_URL);
  if (images) {
    sendImages(images.hits);
    nextBtn.disabled = false;
  } else {
    prevBtn.disabled = true;
  }
}

function lastPageCheck() {
  const queryParams = {
    key: apiKey,
    per_page: PER_PAGE,
    page: PAGE_NUMBER + 1,
    q: QUERY,
    category: CATEGORY,
  };
  return `${baseUrl}?${new URLSearchParams(queryParams).toString()}`;
}

async function getImages(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

async function sendImages(images) {
  if (images.length === 0) {
    pictures.innerHTML = "No images found";
    return;
  }
  if (images.length < 200) {
    nextBtn.disabled = true;
  }
  pictures.innerHTML = "";
  const favoriteIds = sessionStorage.getItem("likes");
  images.forEach((image) => {
    const isFavorite = favoriteIds.includes(image.id);
    const favoriteIcon = document.createElement("span");
    favoriteIcon.className = isFavorite
      ? "favorite-icon favorited"
      : "favorite-icon";
    favoriteIcon.innerHTML = isFavorite ? "❤️" : "🤍";
    favoriteIcon.id = `${image.id}`;
    favoriteIcon.addEventListener("click", toggleFavorite);

    const additionalInfo = document.createElement("div");
    additionalInfo.className = "additional-info";
    const userInfo = document.createElement("p");
    userInfo.innerHTML = `User: ${image.user}`;
    additionalInfo.appendChild(userInfo);

    const img = document.createElement("img");
    img.src = image.webformatURL;
    img.className = "image-thumbnail pic";
    img.id = `image-${image.id}`;

    const div = document.createElement("div");
    div.className = "img-container";
    img.addEventListener("click", () => openImageModal(image));
    additionalInfo.addEventListener("click", () => openImageModal(image));

    div.appendChild(img);
    div.appendChild(additionalInfo);
    div.appendChild(favoriteIcon);
    pictures.appendChild(div);
  });
}
btn.addEventListener("click", searchImage);
prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

function openImageModal(imageData) {
  const imageModal = document.getElementById("image-modal");
  const imageModalImage = document.getElementById("image-modal-image");
  const imageModalTags = document.getElementById("image-modal-tags");
  const imageModaltype = document.getElementById("image-modal-type");
  const imageModalHeight = document.getElementById("image-modal-height");
  const imageModalWidth = document.getElementById("image-modal-width");
  const imageModalViews = document.getElementById("image-modal-views");
  const imageModalDownloads = document.getElementById("image-modal-downloads");
  const imageModalLikes = document.getElementById("image-modal-likes");
  const imageModalComments = document.getElementById("image-modal-comments");

  // imageModalImage.src = imageData.webformatURL;
  imageModalTags.innerHTML = imageData.tags;
  imageModaltype.innerHTML = imageData.type;
  imageModalHeight.innerHTML = imageData.imageHeight;
  imageModalWidth.innerHTML = imageData.imageWidth;
  imageModalViews.innerHTML = imageData.views;
  imageModalDownloads.innerHTML = imageData.downloads;
  imageModalLikes.innerHTML = imageData.likes;
  imageModalComments.innerHTML = imageData.comments;
  imageModal.style.display = "block";
}

function closeImageModal() {
  const imageModal = document.getElementById("image-modal");
  imageModal.style.display = "none";
}

const closeButton = document.getElementById("image-modal-close");
closeButton.addEventListener("click", closeImageModal);

const modalBackground = document.getElementById("image-modal");
modalBackground.addEventListener("click", (e) => {
  if (e.target === modalBackground) {
    closeImageModal();
  }
});

function toggleFavorite(event) {
  const icon = event.target;
  const isFavorited = icon.classList.toggle("favorited");
  icon.textContent = isFavorited ? "❤️" : "🤍";
  if (isFavorited) {
    favoriteState.push(icon.id);
  } else {
    const index = favoriteState.indexOf(icon.id);
    favoriteState.splice(index, 1);
  }

  sessionStorage.setItem("likes", favoriteState);
}

const tagsBtns = document.querySelectorAll(".tags-btn");
tagsBtns.forEach((btn) => btn.addEventListener("click", addTags));

async function addTags() {
  this.classList.toggle("tags-btn-active");
  const tagId = this.id;
  buildCategory(this);
  API_URL = buildApiUrl(QUERY);
  const images = await getImages(API_URL);
  if (images) {
    sendImages(images.hits);
  }
  const isLastPage = await getImages(lastPageCheck());
  if (isLastPage.hits.length === 0) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

function buildCategory(btn) {
  if (CATEGORY === "") {
    CATEGORY = btn.id;
    return;
  }
  if (btn.classList.contains("tags-btn-active")) {
    CATEGORY += " " + btn.id;
  } else {
    CATEGORY = CATEGORY.replace(btn.id, "");
  }
}
