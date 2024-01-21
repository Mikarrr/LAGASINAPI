const archivesHTML = archives
  .map(
    (archive) => `
  <hr />
  <div class="main_content_comming_soon_container">
    <p class="name">${archive.name}</p>
    <p class="data">${archive.data}</p>
    <p class="location">${archive.location}</p>
  </div>
`
  )
  .join("");

const archivesContainer = document.querySelector(".js-archives");
archivesContainer.innerHTML = archivesHTML;

console.log(archivesHTML);
