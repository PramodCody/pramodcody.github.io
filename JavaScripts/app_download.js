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
    }

    // ---- Trigger a file download --------------------------------
    function downloadApp(platform) {
        const fileUrl = APP_FILES[platform];

        if (!fileUrl) {
            console.warn(`app_download.js: no file mapped for "${platform}"`);
            return;
        }

        triggerFadeOut();

        // GitHub release assets are served from a different origin
        // and already send Content-Disposition: attachment, so a
        // plain link click is enough to trigger the download.
        const link = document.createElement("a");
        link.href = fileUrl;
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