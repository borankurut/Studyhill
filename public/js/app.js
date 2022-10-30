window.onload = () => {
  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach((element) => {
    element.classList.add("show");
  });

  const hiddenHeader = document.querySelector(".hidden-header");
  hiddenHeader.classList.add("show");
};
