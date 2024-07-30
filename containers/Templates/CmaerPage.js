// // // import React from 'react';
// // // import { useState, useEffect, useRef, useCallback } from 'react';
// // // function CmaerPage() {
// // //     // Your code here
// // //     const webcamRef = useRef(null);
// // //     const [scriptLoaded, setScriptLoaded] = useState(false);
// // //     const [cameraOpen, setCameraOpen] = useState(false);
// // //     const resultRef = useRef(null);

// // //     const loadWebcamScript = useCallback(() => {
// // //         const script = document.createElement('script');
// // //         script.src = 'https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.26/webcam.min.js';
// // //         script.onload = () => {
// // //             setScriptLoaded(true);
// // //             setCameraOpen(true); // Set camera open state after script is loaded
// // //         };
// // //         document.body.appendChild(script);
// // //     }, [scriptLoaded]);

// // //     useEffect(() => {
// // //         if (cameraOpen && webcamRef.current) {
// // //             // Initialize the webcam after the element is available
// // //             window.Webcam.set({
// // //                 width: 1280,
// // //                 height: 720,
// // //                 image_format: 'jpeg', // Change to 'jpeg' if you prefer JPEG
// // //                 jpeg_quality: 100, // Use if format is 'jpeg'
// // //                 png_quality: 1, // Use if format is 'png'
// // //                 focus: true,
// // //                 fps:60,

// // //             });
// // //             window.Webcam.attach(webcamRef.current, function (err) {
// // //                 if (err) {
// // //                     console.error('Webcam attach error:', err);
// // //                 }
// // //             });
// // //         }

// // //         return () => {
// // //             if (cameraOpen) {
// // //                 window.Webcam.reset();
// // //             };
// // //         };
// // //     }, [cameraOpen]);

// // //     const capturePhoto = (event) => {
// // //         event.preventDefault();
// // //         window.Webcam.snap((data_uri) => {
// // //             if (data_uri) {
// // //                 resultRef.current.innerHTML = `<img src="${data_uri}"/>`;
// // //                 // window.Webcam.reset(); // after capturing the photo reseting the webcam();
// // //             } else {
// // //                 console.error('Failed to capture photo, data_uri is null');
// // //             };
// // //         });
// // //     };


// // //     return (
// // //         // JSX code goes here
// // //         <div>
// // //             <h1>Capture High-Quality Photo with Webcam.js in React</h1>
// // //             <button onClick={loadWebcamScript}>Open Camera</button>
// // //             {cameraOpen && <div ref={webcamRef} style={{ width: '800px', height: '600px' }} id="my_camera"></div>}
// // //             {cameraOpen && <button onClick={capturePhoto}>Take Snapshot</button>}
// // //             <div ref={resultRef} id="results"></div>
// // //         </div>
// // //     );
// // // }

// // // export default CmaerPage;

// // import React, { useState, useEffect, useRef, useCallback } from 'react';

// // function CameraPage() {
// //     const webcamRef = useRef(null);
// //     const [cameraOpen, setCameraOpen] = useState(false);
// //     const resultRef = useRef(null);

// //     const loadWebcamScript = useCallback(() => {
// //         const script = document.createElement('script');
// //         script.src = 'https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.26/webcam.min.js';
// //         script.onload = () => {
// //             setCameraOpen(true); // Set camera open state after script is loaded
// //         };
// //         document.body.appendChild(script);
// //     }, []);

// //     useEffect(() => {
// //         if (cameraOpen && webcamRef.current) {
// //             navigator.mediaDevices.getUserMedia({
// //                 video: {
// //                     facingMode: 'user', // Start with rear camera
// //                     width: { exact:  1280 },
// //                     height: { exact: 720 }
// //                 },
// //             }).then((stream) => {
// //                 webcamRef.current.srcObject = stream;
// //                 window.Webcam.attach(webcamRef.current, (err) => {
// //                     if (err) {
// //                         console.error('Webcam attach error:', err);
// //                     }
// //                 });
// //             }).catch((error) => {
// //                 console.error('Error accessing the camera:', error);
// //             });
// //         }

// //         return () => {
// //             if (cameraOpen) {
// //                 window.Webcam.reset();
// //             };
// //         };
// //     }, [cameraOpen]);

// //     const capturePhoto = (event) => {
// //         event.preventDefault();
// //         window.Webcam.snap((data_uri) => {
// //             if (data_uri) {
// //                 console.log(data_uri);
// //                 resultRef.current.innerHTML = `<img src="${data_uri}"/>`;
// //             } else {
// //                 console.error('Failed to capture photo, data_uri is null');
// //             };
// //         });
// //     };

// //     const toggleFacingMode = () => {
// //         const newFacingMode = webcamRef.current.videoConstraints.facingMode === 'user' ? 'environment' : 'user';
// //         navigator.mediaDevices.getUserMedia({
// //             video: {
// //                 facingMode: newFacingMode,
// //                 width: { exact:  1280 },
// //                 height: { exact: 720 }
// //             },
// //         }).then((stream) => {
// //             webcamRef.current.srcObject = stream;
// //             window.Webcam.reset();
// //             window.Webcam.attach(webcamRef.current, (err) => {
// //                 if (err) {
// //                     console.error('Webcam attach error:', err);
// //                 }
// //             });
// //         }).catch((error) => {
// //             console.error('Error switching camera:', error);
// //         });
// //     };

// //     return (
// //         <div>
// //             <h1>Capture High-Quality Photo with Webcam.js in React</h1>
// //             <button onClick={loadWebcamScript}>Open Camera</button>
// //             {cameraOpen && (
// //                 <div>
// //                     <div style={{ width: '800px', height: '600px', position: 'relative' }}>
// //                         <video ref={webcamRef} autoPlay playsInline style={{ width: '100%', height: '100%' }} />
// //                     </div>
// //                     <br />
// //                     <button onClick={capturePhoto}>Take Snapshot</button>
// //                     <button onClick={toggleFacingMode}>Switch Camera</button>
// //                 </div>
// //             )}
// //             <div ref={resultRef} height="600px" width="800px" id="results"></div>
// //         </div>
// //     );
// // }

// // export default CameraPage;


// import React, { useState, useEffect, useRef, useCallback } from 'react';

// function CameraPage() {
//     const webcamRef = useRef(null);
//     const [cameraOpen, setCameraOpen] = useState(false);
//     const resultRef = useRef(null);

//     const loadFrontCamera = useCallback(async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 video: {
//                     facingMode: 'user', // Use front camera
//                     width: { exact: 1280 },
//                     height: { exact: 720 },
//                 },
//             });

//             if (webcamRef.current) {
//                 webcamRef.current.srcObject = stream;
//                 setCameraOpen(true);
//             }
//         } catch (err) {
//             console.error('Error accessing the front camera:', err);
//         }
//     }, []);

//     useEffect(() => {
//         if (cameraOpen) {
//             loadFrontCamera();
//         }

//         return () => {
//             if (webcamRef.current) {
//                 webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
//             }
//         };
//     }, [cameraOpen, loadFrontCamera]);

//     const capturePhoto = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = webcamRef.current.videoWidth;
//         canvas.height = webcamRef.current.videoHeight;

//         const context = canvas.getContext('2d');
//         context.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);

//         const dataURI = canvas.toDataURL('image/jpeg');
//         console.log(dataURI);
//         resultRef.current.innerHTML = `<img src="${dataURI}"/>`;
//     };

//     return (
//         <div>
//             <h1>Capture High-Quality Photo with getUserMedia in React (Front Camera)</h1>
//             <button onClick={() => setCameraOpen(true)}>Open Front Camera</button>
//             {cameraOpen && (
//                 <div>
//                     <video ref={webcamRef} autoPlay playsInline style={{ width: '800px', height: '600px' }} />
//                     <br />
//                     <button onClick={capturePhoto}>Take Snapshot</button>
//                 </div>
//             )}
//             <div ref={resultRef} id="results"></div>
//         </div>
//     );
// }

// export default CameraPage;

import React, { useEffect, useRef, useState } from 'react';

const CameraComponent = () => {
    const [frontCameraStream, setFrontCameraStream] = useState(null);
    const [backCameraStream, setBackCameraStream] = useState(null);
    const frontVideoRef = useRef(null);
    const backVideoRef = useRef(null);

    useEffect(() => {
        const loadWebcamJs = () => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.26/webcam.min.js';
            script.onload = () => {
                setupWebcams();
            };
            document.body.appendChild(script);
        };

        const setupWebcams = () => {
            setupWebcam('user', setFrontCameraStream, frontVideoRef);
            setupWebcam('environment', setBackCameraStream, backVideoRef);
        };

        loadWebcamJs();

        return () => {
            if (frontCameraStream) {
                frontCameraStream.getTracks().forEach(track => track.stop());
            }
            if (backCameraStream) {
                backCameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [frontCameraStream, backCameraStream]);

    const setupWebcam = (facingMode, setStream, videoRef) => {
        navigator.mediaDevices.getUserMedia({
            video: {
                width: { exact: 1280 },
                height: { exact: 720 },
                facingMode: facingMode
            }
        }).then(stream => {
            setStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        }).catch(err => {
            console.error(`Error accessing ${facingMode} camera: `, err);
        });
    };

    const capturePhoto = (videoRef) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg', 1.0);
        const results = document.getElementById('results');
        results.innerHTML += `<img src="${dataUri}" alt="Captured Photo" style="width: 320px; height: 240px; margin: 10px;"/>`;
    };

    return (
        <div>
            <video ref={frontVideoRef} style={{ display: 'inline-block', width: '320px', height: '240px', margin: '10px' }}></video>
            <video ref={backVideoRef} style={{ display: 'inline-block', width: '320px', height: '240px', margin: '10px' }}></video>
            <button onClick={() => capturePhoto(frontVideoRef)}>Capture Front Camera</button>
            <button onClick={() => capturePhoto(backVideoRef)}>Capture Back Camera</button>
            <div id="results" style={{ display: 'flex', flexDirection: 'column' }}></div>
        </div>
    );
};

export default CameraComponent;
