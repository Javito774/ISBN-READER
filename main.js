const video = document.querySelector("video");

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
        video:  true,
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
        window.alert("No se pudo leer el codigo de barras por: "+err);
    })
}
setInterval(detectCode, 100);

var MediaStreamHelper = {
    _streaming: false,
    _stream: null,
    _deviceId: null,
    _indexSelected: 0,
    getDevices: function() {
        return navigator.mediaDevices.enumerateDevices();
    },
    requestStream: function() {
        console.log("Solicitando nueva información del user media con la camara: "+ this._deviceId);
        this.stopStreaming();
        const videoSource = this._deviceId;
        const constraints = {
            video: {
                deviceId: videoSource ? {exact: videoSource} : undefined
            }
        };
        return navigator.mediaDevices.getUserMedia(constraints);
    },
    stopStreaming: function() {
        clearInterval(intervalo);
        if (this._stream) {
            this._stream.getTracks().forEach(track => {
                track.stop();
            });
        }
    }
};

let videoDevices = null;

function changeCamera() {
    console.log("Cambiando camara");
    MediaStreamHelper.stopStreaming();
    MediaStreamHelper._indexSelected + 1 < videoDevices.length ?
        MediaStreamHelper._indexSelected += 1:
        MediaStreamHelper._indexSelected = 0;
    MediaStreamHelper._deviceId = videoDevices[MediaStreamHelper._indexSelected].deviceId;
    MediaStreamHelper.requestStream().then(function(stream){
        MediaStreamHelper._stream = stream;
        video.srcObject = stream;
    });
}

async function solicitarMedia() {
    const stream = await MediaStreamHelper.requestStream();
    MediaStreamHelper._stream = stream;
    video.srcObject = stream;
}

MediaStreamHelper.getDevices().then(function(devices) {
    videoDevices =  devices.filter(device => device.kind === "videoinput");
    MediaStreamHelper._deviceId = videoDevices[0].deviceId;
    solicitarMedia().then(()=>video.play());
});