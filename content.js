(async () => {
  const src = chrome.runtime.getURL("axe.min.js");
  await import(src);
  console.log("axe-core loaded", window.axe);
  runAxe();
})();

const runAxe = async () => {
  if (window.axe) {
    await window.axe.run(
      {
        iframes: true,
        elementRef: true,
        reporter: "v2",
        absolutePaths: true,
        preload: true,
        runOnly: {
          type: "tag",
          values: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22a",
            "wcag22aa",
            "best-practice",
          ],
        },
      },
      (err, results) => {
        if (err) throw err;
        console.clear();
        console.log("violations", results.violations);
        let violationCount = results.violations.length;

        console.log("Results:", results);

        //get a count of all the nodes in each of the violations

        const totalNodeCount = results.violations.reduce(
          (count, { nodes }) => count + nodes.length,
          0
        );

        violationCount = totalNodeCount;
        console.log("------------------");
        console.log("Violating Nodes");
        console.log("------------------");

        // document.querySelectorAll("*").forEach((element) => {
        //   element.style.outline = "unset";
        //   element.style.outlineOffset = "unset";
        // });

        results.violations.forEach(({ description, nodes, tags }) =>
          nodes.forEach(({ element }) => {
            console.log(description, element);
            element.setAttribute("title", "(" + tags + "): " + description);
            element.style.outline = "5px dashed red";
            element.style.outlineOffset = "-5px";
          })
        );
        console.log("");

        chrome.runtime.sendMessage({
          action: "updateBadge",
          count: violationCount,
          backgroundColor: "#ff0000",
          textColor: "#ffffff",
        });
      }
    );
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "runAxe") {
    console.log("Running Axe from", sender);
    runAxe();
  }
});

window.addEventListener("load", runAxe);
