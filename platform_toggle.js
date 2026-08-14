// ===================================================================
// platform_toggle.js
// Handles the Android / Windows / Linux toggle above the download bar.
//
// - Auto-detects the visitor's OS and selects it by default
// - Marks the clicked button as active (rounded-rectangle highlight,
//   styled in download_bar.css)
// - Logs the selected platform to console — replace the console.log
//   lines with your real download-link logic later.
//
// No download-button / "Get The App" handling here — that's covered
// by your own script.
// ===================================================================

const platformButtons = document.querySelectorAll('.platform-btn');

// Auto-detect the visitor's OS from the user agent string.
// Falls back to "android" since this is primarily a mobile app.
function detectPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('win')) return 'windows';
  if (ua.includes('linux') && !ua.includes('android')) return 'linux';
  return 'android';
}

// Marks the given platform's button as active and un-marks the rest.
function setActivePlatform(platform) {
  platformButtons.forEach(btn => {
    const isActive = btn.dataset.platform === platform;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive);
  });
}

// Click handling: select the button + log the platform.
platformButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const platform = btn.dataset.platform;
    setActivePlatform(platform);

    switch (platform) {
      case 'android':
        console.log('Platform selected: Android — ready to fetch .apk download link');
        break;
      case 'windows':
        console.log('Platform selected: Windows — ready to fetch .exe download link');
        break;
      case 'linux':
        console.log('Platform selected: Linux — ready to fetch .AppImage/.deb download link');
        break;
    }
  });
});

// Set the default selection on page load based on detected OS.
setActivePlatform(detectPlatform());