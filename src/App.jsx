import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Play, Square, AlertCircle, CheckCircle2, Info } from "lucide-react";

const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detector, setDetector] = useState(null);
  const [alert, setAlert] = useState(null);
  const detectIntervalRef = useRef(null);

  const showAlert = (type, title, message) => {
    setAlert({ type, title, message });
    // Clear alert after 5 seconds
    setTimeout(() => setAlert(null), 5000);
  };

  const initializeDetector = async () => {
    try {
      setIsLoading(true);
      showAlert("info", "Initializing", "Setting up the face detection model...");
      
      const model = facemesh.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'tfjs',
        refineLandmarks: false,
        maxFaces: 1
      };

      await tf.ready();
      const faceDetector = await facemesh.createDetector(model, detectorConfig);
      setDetector(faceDetector);
      showAlert("success", "Ready", "Face detector initialized successfully!");
    } catch (error) {
      console.error("Error initializing face detector:", error.message);
      showAlert("error", "Error", "Failed to initialize face detector. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const detect = async () => {
    if (
      detector &&
      webcamRef.current?.video?.readyState === 4
    ) {
      try {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const predictions = await detector.estimateFaces(video, {
          flipHorizontal: false,
          predictIrises: false
        });

        if (predictions.length > 0) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, videoWidth, videoHeight);
          
          requestAnimationFrame(() => {
            drawMesh(predictions, ctx);
          });
        }
      } catch (error) {
        console.error("Error during face detection:", error);
        showAlert("error", "Detection Error", "An error occurred during face detection.");
        stopDetection();
      }
    }
  };

  const startDetection = () => {
    setIsDetecting(true);
    detectIntervalRef.current = setInterval(detect, 100);
    showAlert("success", "Detection Started", "Face detection is now active.");
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (detectIntervalRef.current) {
      clearInterval(detectIntervalRef.current);
      detectIntervalRef.current = null;
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    showAlert("info", "Detection Stopped", "Face detection has been stopped.");
  };

  useEffect(() => {
    tf.setBackend('webgl').then(() => {
      console.log("WebGL backend initialized");
      initializeDetector();
    }).catch(error => {
      console.error("Error initializing WebGL backend:", error.message);
      showAlert("error", "Backend Error", "Failed to initialize WebGL backend.");
    });

    return () => {
      stopDetection();
    };
  }, []);

  const getAlertStyles = (type) => {
    switch (type) {
      case 'error':
        return 'border-red-500 bg-red-500/10 text-red-500';
      case 'success':
        return 'border-green-500 bg-green-500/10 text-green-500';
      case 'info':
        return 'border-blue-500 bg-blue-500/10 text-blue-500';
      default:
        return '';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 p-8">
      <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white">
            Face Mesh Detection
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time detection of 468 facial landmarks using TensorFlow.js
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {alert && (
              <Alert className={`transition-all duration-300 ${getAlertStyles(alert.type)}`}>
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type)}
                  <AlertTitle>{alert.title}</AlertTitle>
                </div>
                <AlertDescription className="mt-1">
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center gap-4">
              <Button
                onClick={startDetection}
                disabled={isLoading || isDetecting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Detection
              </Button>
              <Button
                onClick={stopDetection}
                disabled={isLoading || !isDetecting}
                variant="destructive"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Detection
              </Button>
            </div>

            {isLoading && (
              <div className="text-center text-white">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-gray-700" />
                <p className="mt-2">Initializing face detector...</p>
              </div>
            )}

            <div className="relative w-[640px] h-[480px] mx-auto rounded-lg overflow-hidden">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default App;