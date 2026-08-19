/* ==========================================================
   app_download.js
   Downloads the correct Kids Classium build based on whichever
   platform button (Android / Windows / Linux) is currently
   selected in #platform_toggle.

   Depends on markup from index.html:
     - buttons: .platform-btn[data-platform="android|windows|linux"]
       inside #platform_toggle, toggled via aria-checked
     - download trigger: #download_bar button (or #download)
   ========================================================== */

(function () {
    "use strict";

    // Map each platform to its file in assets/apps/
    const APP_FILES = {
        android: "assets/apps/Kids Classium.apk",
        windows: "assets/apps/Kids Classium.exe",
        linux: "assets/apps/Kids Classium.x86_64",
    };

    const DEFAULT_PLATFORM = "android";

    const platformToggle = document.getElementById("platform_toggle");
    const downloadBar = document.getElementById("download_bar");
    const downloadingSignal = document.getElementById("downloading");

    if (!platformToggle || !downloadBar) return;

    // ---- Track the currently selected platform -----------------
    function getSelectedPlatform() {
        const activeBtn = platformToggle.querySelector(
            '.platform-btn[aria-checked="true"]'
        );
        return (activeBtn && activeBtn.dataset.platform) || DEFAULT_PLATFORM;
    }

    // ---- "Wait a second..." fade animation (Android only) -------
    // Android APKs take a moment to prep/download, so we show a
    // fade-in-out cue. Windows/Linux downloads start immediately,
    // so no signal is needed for them.
    function triggerFadeOut() {
        if (!downloadingSignal) return;
        downloadingSignal.classList.remove("fade-in-out-active");
        void downloadingSignal.offsetWidth; // force reflow to restart animation
        downloadingSignal.classList.add("fade-in-out-active");
        console.log("fade in out")
    }
    

    // ---- Trigger a file download --------------------------------
    function downloadApp(platform) {
        const filePath = APP_FILES[platform];

        if (!filePath) {
            console.warn(`app_download.js: no file mapped for "${platform}"`);
            return;
        }

        if (platform === "android") {
            triggerFadeOut();
        }

        const link = document.createElement("a");
        link.href = encodeURI(filePath);
        link.download = filePath.substring(filePath.lastIndexOf("/") + 1);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    // ---- Wire up the "Get The App" button ------------------------
    downloadBar.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;

        const platform = getSelectedPlatform();
        downloadApp(platform);
    });
})();