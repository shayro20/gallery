const apiKey = "39686306-37f7eeccf90467f6db7fc9cee";
const baseUrl = "https://pixabay.com/api/";

const perPage = 200;
let pageNumber = 1;
let query = "";
let apiUrl = "";

const input = document.querySelector("input");
const btn = document.querySelector("button");
const pictures = document.getElementById("pics");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

async function searchImage(event) {
  event.preventDefault();
  query = input.value;
  pageNumber = 1;
  apiUrl = buildApiUrl(query);
  const images = await getImages(apiUrl);
  if (images) {
    sendImages(images.hits);
  }
}

async function nextPage() {
  if (pageNumber === 1) {
    prevBtn.disabled = true;
  }
  pageNumber++;
  apiUrl = buildApiUrl(query);
  const isLastPage = await getImages(lastPageCheck());
  if (!isLastPage) {
    nextBtn.disabled = true;
  }
  const images = await getImages(apiUrl);
  if (images) {
    sendImages(images.hits);
    prevBtn.disabled = false;
  } else {
    pageNumber--;
    nextBtn.disabled = true;
  }
}
async function prevPage() {
  if (pageNumber === 2) {
    prevBtn.disabled = true;
  }
  pageNumber--;
  apiUrl = buildApiUrl(query);
  const images = await getImages(apiUrl);
  if (images) {
    sendImages(images.hits);
    nextBtn.disabled = false;
  } else {
    prevBtn.disabled = true;
  }
}

function buildApiUrl(query) {
  const queryParams = {
    key: apiKey,
    per_page: perPage,
    page: pageNumber,
    q: query,
  };
  return `${baseUrl}?${new URLSearchParams(queryParams).toString()}`;
}

function lastPageCheck() {
  const queryParams = {
    key: apiKey,
    per_page: perPage,
    page: pageNumber + 1,
    q: query,
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

function sendImages(images) {
  pictures.innerHTML = "";
  images.forEach((image) => {
    const img = document.createElement("img");
    img.src = image.webformatURL;
    img.className = "pic";
    const div = document.createElement("div");
    div.className = "img-container";
    div.appendChild(img);
    pictures.appendChild(div);
  });
  prevBtn.hidden = false;
  nextBtn.hidden = false;
}

btn.addEventListener("click", searchImage);
prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);
