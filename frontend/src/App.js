import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import UploadComponent from './components/Upload';
import CameraComponent from './components/Camera';
import QualityCard from './components/QualityCard';
import './App.css';

// App states
const STEPS = {
  UPLOAD: 'UPLOAD',
  SCANNING: 'SCANNING', 
  RESULT: 'RESULT'
};

function App() {
  const [currentStep, setCurrentStep] = useState(STEPS.UPLOAD);
  const [uploadData, setUploadData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle starting the scanning process
  const handleStartScanning = (data) => {
    console.log('🚀 Starting analysis with data:', data);
    setUploadData(data);
    setCurrentStep(STEPS.SCANNING);
    setError(null);
  };

  // Handle analysis completion
  const handleAnalysisComplete = (result) => {
    console.log('✅ Analysis completed:', result);
    setAnalysisResult(result);
    setCurrentStep(STEPS.RESULT);
  };

  // Handle analysis error
  const handleAnalysisError = (errorMessage) => {
    console.error('❌ Analysis failed:', errorMessage);
    setError(errorMessage);
    setCurrentStep(STEPS.UPLOAD);
  };

  // Handle going back to upload
  const handleBackToUpload = () => {
    setCurrentStep(STEPS.UPLOAD);
    setUploadData(null);
    setAnalysisResult(null);
    setError(null);
  };

  // Handle mint completion
  const handleMintComplete = (mintResult) => {
    console.log('🌱 Mint completed:', mintResult);
    // Could show a success message or redirect
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {currentStep === STEPS.UPLOAD && (
          <UploadComponent
            key="upload"
            onStartScanning={handleStartScanning}
            error={error}
          />
        )}
        
        {currentStep === STEPS.SCANNING && uploadData && (
          <CameraComponent
            key="scanning"
            uploadData={uploadData}
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleAnalysisError}
          />
        )}
        
        {currentStep === STEPS.RESULT && analysisResult && (
          <QualityCard
            key="result"
            analysisResult={analysisResult}
            onBack={handleBackToUpload}
            onMintComplete={handleMintComplete}
          />
        )}
      </AnimatePresence>

      {/* Global Error Display */}
      {error && currentStep === STEPS.UPLOAD && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm font-mono z-50">
          <div>Step: {currentStep}</div>
          <div>Upload Data: {uploadData ? '✓' : '✗'}</div>
          <div>Analysis Result: {analysisResult ? '✓' : '✗'}</div>
          <div>Error: {error ? '✓' : '✗'}</div>
        </div>
      )}
    </div>
  );
}

export default App;