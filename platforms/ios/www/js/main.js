function serializeCanvas(paintCanvas) {
    return paintCanvas.toDataURL();
}

function deserializeCanvas(data, paintCanvas) {
    var image = new Image();
    image.onload = function() {
        paintCanvas.getContext("2d").drawImage(image, 0, 0);
    };
    
    image.src = data;
}

function saveImage(){

    
    window.canvas2ImagePlugin.saveImageDataToLibrary(
                                                     function(msg){
                                                     console.log(msg);
                                                     },
                                                     function(err){
                                                     console.log(err);
                                                     },
                                                     document.getElementById('canvas')
                                                     );
}

function showToast(msg){
    window.plugins.toast.showShortBottom(msg, function(a){console.log('toast success: ' + a)}, function(b){console.log('toast error: ' + b)});
}

function shareImage(image){
    window.plugins.socialsharing.share('Message here', null, image, null)
}