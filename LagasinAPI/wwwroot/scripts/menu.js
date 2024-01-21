const mobileNav = document.querySelector(".navbar ul");
const burgerIcon = document.querySelector(".hamburger");

burgerIcon.addEventListener("click", function () {
  mobileNav.classList.toggle("active");
  burgerIcon.classList.toggle("active");
});
