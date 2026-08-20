/* ==========================================================
   app_download.js
   Downloads the correct Kids Classium build based on whichever
   platform button (Android / Windows / Linux) is currently
   selected in #platform_toggle.

   FIX: Previously this fetched the file as a Blob before
   triggering the download. That created a delay between the
   user's click and the actual save-to-disk step, which caused
   Brave (and some mobile browsers) to treat the synthetic click
   as no longer "user-initiated" — the fetch would finish (100%)
   but the file would never actually save. This version triggers
   the download natively, directly on the click, with no async
   gap in between.
   ========================================================== */

(function () {
    "use strict";

    const RELEASE_BASE =
        "https://github.com/PramodCody/Kids_Classium/releases/latest/download/";

    // Store both the URL and the target filename
    const APP_FILES = {
        android: { url: RELEASE_BASE + "Kids.Classium.apk", fileName: "Kids.Classium.apk" },
        windows: { url: RELEASE_BASE + "Kids.Classium.exe", fileName: "Kids.Classium.exe" },
        linux: { url: RELEASE_BASE + "Kids.Classium.x86_64", fileName: "Kids.Classium.x86_64" },
    };

    const platformToggle = document.getElementById("platform_toggle");
    const downloadBar = document.getElementById("download_bar");
    const downloadingSignal = document.getElementById("downloading");

    if (!platformToggle || !downloadBar) return;

    // ---- Get or create the persistent download link -------------
    let downloadLink = document.getElementById("download_link");
    if (!downloadLink) {
        downloadLink = document.createElement("a");
        downloadLink.id = "download_link";
        downloadLink.style.display = "contents";

        while (downloadBar.firstChild) {
            downloadLink.appendChild(downloadBar.firstChild);
        }
        downloadBar.appendChild(downloadLink);
    }

    // ---- Track the currently selected platform -----------------
    function getSelectedPlatform() {
        let activeBtn = platformToggle.querySelector(
            '.platform-btn[aria-checked="true"]'
        );

        // If no button is active on load, default to the first one available
        if (!activeBtn) {
            activeBtn = platformToggle.querySelector('.platform-btn');
            if (activeBtn) {
                activeBtn.setAttribute('aria-checked', 'true');
            }
        }

        return activeBtn ? activeBtn.dataset.platform : "android"; // Fallback to android
    }

    // ---- Trigger a native browser download ----------------------
    // No fetch/blob buffering here on purpose: keeping this call
    // synchronous with the click event preserves the browser's
    // "user gesture" so Brave/Chrome/Safari don't block or stall it.
    function triggerNativeDownload(url, fileName) {
        const tempLink = document.createElement("a");
        tempLink.href = url;
        tempLink.download = fileName; // hint only; ignored cross-origin, browser falls back to native download UI
        tempLink.rel = "noopener";
        tempLink.style.display = "none";
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    }

    function triggerFadeOut() {
        if (!downloadingSignal) return;
        downloadingSignal.classList.remove("fade-in-out-active");
        void downloadingSignal.offsetWidth; // force reflow
        downloadingSignal.classList.add("fade-in-out-active");
    }

    // ---- Show fade cue and handle the real click -----------------
    downloadLink.addEventListener("click", (e) => {
        e.preventDefault(); // Stop standard <a> navigation
        triggerFadeOut();

        const platform = getSelectedPlatform();
        const fileData = APP_FILES[platform];

        if (fileData) {
            triggerNativeDownload(fileData.url, fileData.fileName);
        } else {
            console.warn(`No mapped file for platform: ${platform}`);
        }
    });

    // ---- Initialize the UI state on load ------------------------
    // Ensure the default button is marked correctly on initialization
    getSelectedPlatform();
})();