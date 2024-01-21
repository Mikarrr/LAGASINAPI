let mouseCursor = document.querySelector(".cursor");
let mouseCursorDot = document.querySelector(".dot_cursor");
let transText = document.querySelectorAll(".transText .anim, .transText h1");
let changeIndex = document.querySelectorAll(".changeIndex");
let allhref = document.querySelectorAll("body a");
let mainContentGallery = document.querySelector(".main_content_gallery");
let mainContentAnimCon = document.querySelector(".animation-container");
window.addEventListener("mousemove", cursor);

function cursor(e) {
  const posX = e.clientX;
  const posY = e.clientY;

  mouseCursor.style.left = `${posX}px`;
  mouseCursor.style.top = `${posY}px`;
  mouseCursorDot.style.left = `${posX}px`;
  mouseCursorDot.style.top = `${posY}px`;

  mouseCursor.animate(
    {
      left: `${posX}px`,
      top: `${posY}px`,
    },
    { duration: 200, fill: "forwards" }
  );
}

allhref.forEach((link) => {
  link.addEventListener("mouseleave", () => {
    mouseCursorDot.classList.remove("scaleTextHref");
  });
  link.addEventListener("mouseover", () => {
    mouseCursorDot.classList.add("scaleTextHref");
  });
});

mainContentGallery.addEventListener("mouseenter", () => {
  mouseCursorDot.style.backgroundColor = "black";
  mouseCursor.style.borderColor = "black";
});

mainContentGallery.addEventListener("mouseleave", () => {
  mouseCursorDot.style.backgroundColor = "white";
  mouseCursor.style.borderColor = "white";
});

mainContentAnimCon.addEventListener("mouseenter", () => {
  mouseCursorDot.style.backgroundColor = "black";
  mouseCursor.style.borderColor = "black";
});

mainContentAnimCon.addEventListener("mouseleave", () => {
  mouseCursorDot.style.backgroundColor = "white";
  mouseCursor.style.borderColor = "white";
});
