const video = document.querySelector("video");

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
        video:  {
            width: {
                min: 1280,
                ideal: 1920,
                max: 2560,
            },
            height: {
                min: 720,
                ideal: 1080,
                max: 1440
            },
            facingMode: {
                exact: 'environment'
            }
        },
        audio: false
    }

    navigator.mediaDevices.getUserMedia(constraints).then(stream => video.srcObject = stream);
}

const detector = new BarcodeDetector({formats: ['ean_13','upc_a','upc_e']});

if (detector) {
    console.log('Barcode Detector supported!');
} else {
    console.log('Barcode Detector is not supported by this browser.');
}
/*let formats;
BarcodeDetector.getSupportedFormats().then(arr => formats=arr);

const barcodeDetector = new BarcodeDetector({formats});*/

const detectCode =  ()=> {
    detector.detect(video).then(codes=>{
        if(codes.length === 0) return;
        for (const barcode of codes) {
            console.log(barcode);
            window.alert("Genial, tu codigo de barras es: "+barcode);
        }
    }).catch(err => {
        console.error(err);
    })
}
setInterval(detectCode, 100);