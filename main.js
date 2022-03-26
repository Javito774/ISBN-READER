const video = document.querySelector("video");

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
        video:  true,
        audio: false
    }

    navigator.mediaDevices.getUserMedia(constraints).then(stream => video.srcObject = stream);
}

//const detector = new barcodeDetector({formats: ['ean_13','upc_a','upc_e']});

let formats;
BarcodeDetector.getSupportedFormats().then(arr => formats=arr);

const barcodeDetector = new BarcodeDetector({formats});

const detectCode = () =>{
    barcodeDetector.detect(video).then(codes=>{
        if(codes.length === 0) return;
        for (const barcode of codes) {
            console.log(barcode);
            window.alert("Genial, tu codigo de barras es: "+barcode);
        }
    }).catch(err => {
        console.error(err);
        window.alert("No se pudo leer el codigo de barras por: "+err);
    })
}

setInterval(detectCode, 100);