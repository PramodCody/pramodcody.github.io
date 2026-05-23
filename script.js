const download_button = document.getElementById("download_apk_button");

download_button.addEventListener('click', function(){

    const download_link = document.createElement('a'); //a storage space created
    download_link.href = "assets/Kids_Classium.apk"; //href = file location
    download_link.download = "Kids_Classium.apk"; //download = file name
    download_link.click();

});