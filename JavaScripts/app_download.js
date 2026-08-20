/* ==========================================================
   app_download.js
   Downloads the correct Kids Classium build based on whichever
   platform button (Android / Windows / Linux) is currently
   selected in #platform_toggle.

   Depends on markup from index.html:
     - buttons: .platform-btn[data-platform="android|windows|linux"]
       inside #platform_toggle, toggled via aria-checked
     - download trigger: #download_bar (wraps a real <a id="download_link">)
   ========================================================== */

(function () {
    "use strict";

    // Map each platform to its GitHub release asset
    const RELEASE_BASE =
        "https://github.com/PramodCody/Kids_Classium/releases/latest/download/";

    const APP_FILES = {
        android: RELEASE_BASE + "Kids.Classium.apk",
        windows: RELEASE_BASE + "Kids.Classium.exe",
        linux: RELEASE_BASE + "Kids.Classium.x86_64",
    };

    const DEFAULT_PLATFORM = "android";

    const platformToggle = document.getElementById("platform_toggle");
    const downloadBar = document.getElementById("download_bar");
    const downloadingSignal = document.getElementById("downloading");

    if (!platformToggle || !downloadBar) return;

    // ---- Get or create the persistent download link -------------
    // A real <a> that lives in the DOM the whole time. We just keep
    // its href in sync with the selected platform. Letting the user
    // click a genuine anchor (rather than a JS-synthesized one that
    // gets created/clicked/removed in the same tick) is the most
    // reliable way to get a clean browser-native download handoff.
    let downloadLink = document.getElementById("download_link");
    if (!downloadLink) {
        downloadLink = document.createElement("a");
        downloadLink.id = "download_link";
        downloadLink.rel = "noreferrer"; // don't send a Referer header to GitHub
        downloadLink.style.display = "contents"; // don't affect layout
        // Move the existing button(s) inside the bar into this anchor
        // so the whole clickable area is a real link.
        while (downloadBar.firstChild) {
            downloadLink.appendChild(downloadBar.firstChild);
        }
        downloadBar.appendChild(downloadLink);
    }

    // ---- Track the currently selected platform -----------------
    function getSelectedPlatform() {
        const activeBtn = platformToggle.querySelector(
            '.platform-btn[aria-checked="true"]'
        );
        return (activeBtn && activeBtn.dataset.platform) || DEFAULT_PLATFORM;
    }

    // ---- Keep the link's href pointed at the right file ----------
    function updateDownloadLink() {
        const platform = getSelectedPlatform();
        const fileUrl = APP_FILES[platform];

        if (!fileUrl) {
            console.warn(`app_download.js: no file mapped for "${platform}"`);
            downloadLink.removeAttribute("href");
            return;
        }

        downloadLink.href = fileUrl;
    }

    function triggerFadeOut() {
        if (!downloadingSignal) return;
        downloadingSignal.classList.remove("fade-in-out-active");
        void downloadingSignal.offsetWidth; // force reflow to restart animation
        downloadingSignal.classList.add("fade-in-out-active");
    }

    // ---- Wire up platform switching to keep href fresh -----------
    platformToggle.addEventListener("click", updateDownloadLink);

    // ---- Show the fade cue on real click, don't block navigation -
    downloadLink.addEventListener("click", () => {
        triggerFadeOut();
        // No preventDefault(): let the browser handle the anchor
        // click natively, straight to its download manager.
    });

    // ---- Set the initial href on page load ------------------------
    updateDownloadLink();
})();