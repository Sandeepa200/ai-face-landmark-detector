import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utils";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let detectInterval = null;

  const runFacemesh = async () => {
    try {
      // Load the face landmarks model
      const model = facemesh.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'tfjs', // Changed from 'mediapipe' to 'tfjs'
        refineLandmarks: false,
        maxFaces: 1
      };

      await tf.ready(); // Ensure TensorFlow.js is ready
      const detector = await facemesh.createDetector(model, detectorConfig);
      console.log("Face detector initialized successfully");

      if (detector) {
        // Start detection loop
        detectInterval = setInterval(() => {
          detect(detector);
        }, 100);
      }
    } catch (error) {
      console.error("Error initializing face detector:", error.message);
    }
  };

  const detect = async (detector) => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      try {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
  
        // Set dimensions
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
  
        // Get predictions
        const predictions = await detector.estimateFaces(video, {
          flipHorizontal: false,
          predictIrises: false  // Add this to ensure we get the basic face mesh
        });
  
        if (predictions.length > 0) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, videoWidth, videoHeight);
          
          // Log the first prediction to see its structure
          console.log("Face prediction structure:", predictions[0]);
          
          requestAnimationFrame(() => {
            drawMesh(predictions, ctx);
          });
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }
    }
  };

  useEffect(() => {
    // Initialize TensorFlow.js backend
    tf.setBackend('webgl').then(() => {
      console.log("WebGL backend initialized");
      runFacemesh();
    }).catch(error => {
      console.error("Error initializing WebGL backend:", error.message);
    });

    // Cleanup function
    return () => {
      if (detectInterval) {
        clearInterval(detectInterval);
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-900">
      <div className="p-4">
        <h1 className="text-white text-2xl text-center">
          Face Mesh Detection
        </h1>
        <p className="text-white text-center">Detect 468 facial landmarks</p>
      </div>
      <div className="relative w-[640px] h-[480px] mx-auto">
        <Webcam
          ref={webcamRef}
          className="absolute top-0 left-0 z-10 w-full h-full"
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-20 w-full h-full"
        />
      </div>
    </div>
  );
}

export default App;