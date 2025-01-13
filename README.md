# Face Mesh Detection App

A real-time facial landmark detection application built with React, TensorFlow.js, and Face Landmarks Detection model. This application can detect and visualize 468 facial landmarks in real-time using your webcam.

## Features

- Real-time face detection using webcam
- Visualization of 468 facial landmarks
- Start/Stop detection controls
- Status alerts for system feedback
- Modern UI with dark theme
- Loading indicators
- Responsive design

## Technologies Used

- React
- TensorFlow.js
- Face Landmarks Detection Model
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Vite

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm or yarn
- A modern web browser
- A webcam

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Sandeepa200/ai-face-landmark-detector.git
cd face-detection-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install required shadcn/ui components:
```bash
npx shadcn-ui@latest add card alert button
```

## Required Dependencies

Add these dependencies to your project:
```bash
npm install @tensorflow/tfjs @tensorflow-models/face-landmarks-detection react-webcam lucide-react
```

## Development

To run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## Usage

1. Allow webcam access when prompted by the browser
2. Wait for the face detection model to initialize
3. Click the "Start Detection" button to begin face detection
4. The app will display facial landmarks overlay on your face
5. Click "Stop Detection" to pause the detection

## Project Structure

```
face-detection-app/
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── utils/
│   │   └── drawMesh.js  # Facial landmark drawing utilities
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Performance Considerations

- The application uses WebGL backend for optimal performance
- Detection interval is set to 100ms for smooth visualization
- The app is configured to detect one face at a time
- Webcam feed is mirrored for natural interaction

## Browser Support

The application works best in modern browsers with WebGL support:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request

## Known Issues

- Face detection may be slower on devices without WebGL support
- Multiple face detection is currently disabled for performance
- Some browsers may require HTTPS for webcam access

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow.js team for the machine learning framework
- MediaPipe team for the face landmark detection model
- shadcn/ui for the beautiful UI components
- Lucide for the icon set
