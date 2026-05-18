const download_button = document.getElementById("download_apk_button");

download_button.addEventListener('click', function(){
    console.log("button_working")
    
    const download_file = "assests/Kids_Classium.apk";
    const download_file_name = "Kids_Classium.apk";

    const download_link = document.createElement('a'); //a storage space created
    download_link.href = download_file; //href = file location
    download_link.download = download_file_name; //download = file name

    document.body.appendChild(download_link); //storage given to website
    download_link.click(); //the thing at storage gets dowloaded
    document.body.removeChild(download_link); //now no, need to that storage, so delete
});