// Toggle Navbar
const hamburgerButton = document.querySelector(".hamburger-button");
hamburgerButton.addEventListener("click", () => {
  const hiddenElement = document.querySelector(".hidden");
  hiddenElement.classList.toggle("show");
});

const closePopupButton = document.getElementById("close-pop-up");
const openPopupButton = document.getElementById("open-popup");
const popupDiv = document.querySelector(".hide-popup");

closePopupButton.addEventListener("click", () => {
  popupDiv.classList.remove("show-popup");
});

openPopupButton.addEventListener("click", () => {
  console.log(popupDiv);
  popupDiv.classList.add("show-popup");
});
