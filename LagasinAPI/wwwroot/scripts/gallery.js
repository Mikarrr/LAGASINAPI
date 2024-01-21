const galleryItems = document.querySelectorAll(".js-gallery-anim li a");
const animPhotos = document.querySelector(".js-anim-photos");
const photosContainer = document.querySelector(".js-photos");
const gallery = document.querySelectorAll(".js-gallery-anim");

const imagePaths = {
  action1: "../photos/main_img.jpg",
  action2: "../photos/sec_img.jpg",
  action3: "../photos/th_img.jpg",
  action4: "../photos/main_img.jpg",
};

function setGalleryImage(imageUrl, transformValue) {
  photosContainer.style.backgroundImage = `url(${imageUrl})`;
  setTimeout(() => {
    photosContainer.style.opacity = "1";
    animPhotos.style.transform = transformValue;
  }, 100);
}

function handleMouseEnter(action, item) {
  const imageUrl = imagePaths[action];
  if (imageUrl) {
    setGalleryImage(imageUrl, "translateX(3000px)");
    resetGalleryItemOpacity();
    setGalleryItemOpacity(item);
  } else {
    handleMouseLeave();
  }
}

function handleMouseLeave() {
  setTimeout(() => {
    animPhotos.style.opacity = "0";
    animPhotos.style.transform = "translateX(-4000px)";
  }, 100);

  setTimeout(() => {
    animPhotos.style.opacity = "1";
    animPhotos.style.transform = "translateX(0px)";
  }, 700);
  resetGalleryItemOpacity();
}

function resetGalleryItemOpacity() {
  galleryItems.forEach((item) => (item.style.opacity = "1"));
}
function setGalleryItemOpacity(exceptItem) {
  galleryItems.forEach((item) => {
    if (item !== exceptItem) {
      item.style.opacity = "0.4";
    }
  });
}

galleryItems.forEach((item) => {
  const action = item.getAttribute("data-action");
  item.addEventListener("mouseenter", () => {
    handleMouseEnter(action, item);
  });
});

gallery.forEach((item) => {
  item.addEventListener("mouseleave", () => {
    handleMouseLeave();
  });
});

resetGalleryItemOpacity();
