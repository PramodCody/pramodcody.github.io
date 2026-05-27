let download_button = document.querySelector("#download button");
let download_signal = document.querySelector("#downloading");

function triggerFadeOut() {
    download_signal.classList.remove('fade-in-out-active');
    void download_signal.offsetWidth;
    download_signal.classList.add('fade-in-out-active');
}
download_button.addEventListener('click', triggerFadeOut);


download_button.onclick = () => {

    // Create a temporary anchor element
    const link = document.createElement('a');
    
    // Set the path to the asset
    link.href = 'assets/Kids_Classium.apk';
    
    // Specify the filename for the download
    link.download = 'Kids Classium.apk';
    
    // Append to body, trigger click, and remove from DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // download_signal.classList.remove('fade-out-active');
};

