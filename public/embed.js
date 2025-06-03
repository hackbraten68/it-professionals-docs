document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("embed") === "true") {
    const selectorsToHide = [
      "header",
      "nav",
      "aside",
      "footer",
      ".sl-sidebar",
      ".sl-navbar",
      ".sl-toc",
      ".sl-hero",
      ".sl-bottom-navigation",
    ];

    for (const selector of selectorsToHide) {
      document.querySelectorAll(selector).forEach(el => el.style.display = "none");
    }

    document.body.style.margin = "0";
    const main = document.querySelector("main");
    if (main) {
      main.style.padding = "1rem";
      main.style.maxWidth = "100%";
    }
  }
});
