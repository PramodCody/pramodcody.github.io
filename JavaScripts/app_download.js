/* ==========================================================
   app_download.js
   Downloads the correct Kids Classium build based on whichever
   platform button (Android / Windows / Linux) is currently
   selected in #platform_toggle.
   ========================================================== */

(function () {
    "use strict";

    const RELEASE_BASE =
        "https://github.com/PramodCody/Kids_Classium/releases/latest/download/";

    // Store both the URL and the target filename for the Blob download
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
        
        // FIX: If no button is active on load, default to the first one available
        if (!activeBtn) {
            activeBtn = platformToggle.querySelector('.platform-btn');
            if (activeBtn) {
                activeBtn.setAttribute('aria-checked', 'true');
            }
        }
        
        return activeBtn ? activeBtn.dataset.platform : "android"; // Fallback to android
    }

    // ---- Fetch file as Blob to bypass cross-origin redirects ---
    function triggerBlobDownload(url, fileName) {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("Network response failed");
                return response.blob();
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const tempLink = document.createElement("a");
                tempLink.href = blobUrl;
                tempLink.download = fileName;
                document.body.appendChild(tempLink);
                tempLink.click();
                
                // Cleanup
                document.body.removeChild(tempLink);
                URL.revokeObjectURL(blobUrl);
            })
            .catch(err => {
                console.error("Download failed, falling back to direct link:", err);
                window.location.href = url; // Fallback Native routing
            });
    }

    function triggerFadeOut() {
        if (!downloadingSignal) return;
        downloadingSignal.classList.remove("fade-in-out-active");
        void downloadingSignal.offsetWidth; // force reflow
        downloadingSignal.classList.add("fade-in-out-active");
    }

    // ---- Show fade cue and intercept the real click -------------
    downloadLink.addEventListener("click", (e) => {
        e.preventDefault(); // Stop standard <a> navigation
        triggerFadeOut();
        
        const platform = getSelectedPlatform();
        const fileData = APP_FILES[platform];

        if (fileData) {
            triggerBlobDownload(fileData.url, fileData.fileName);
        } else {
            console.warn(`No mapped file for platform: ${platform}`);
        }
    });

    // ---- Initialize the UI state on load ------------------------
    // Ensure the default button is marked correctly on initialization
    getSelectedPlatform(); 
})();