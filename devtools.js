chrome.devtools.panels.create(
  "Davids A11y Tools", // Title of the panel
  "", // Path to an icon (optional)
  "devtools.html", // Path to the HTML page for the panel
  function (panel) {
    console.log("a11y panel created");
  }
);
