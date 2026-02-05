import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Zap, Eye, Brain } from 'lucide-react';

const CameraComponent = ({ uploadData, onAnalysisComplete, onError }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const analysisSteps = [
    { icon: Eye, text: 'Capturing Image Details...', duration: 2000 },
    { icon: Brain, text: 'AI Analyzing Freshness...', duration: 3000 },
    { icon: Zap, text: 'Processing Quality Metrics...', duration: 2500 },
    { icon: Leaf, text: 'Generating Digital Passport...', duration: 2000 },
  ];

  useEffect(() => {
    // Import the API function and start analysis
    const startAnalysis = async () => {
      try {
        const { analyzeProduceImage } = await import('../../services/api');
        
        // Simulate step progression
        let stepIndex = 0;
        const stepInterval = setInterval(() => {
          if (stepIndex < analysisSteps.length - 1) {
            stepIndex++;
            setCurrentStep(stepIndex);
          }
        }, 2500);

        // Update progress
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 1;
          });
        }, 100);

        // Call the actual API
        const result = await analyzeProduceImage(uploadData.file, uploadData.quantity);
        
        // Clear intervals
        clearInterval(stepInterval);
        clearInterval(progressInterval);
        
        // Complete the analysis
        setProgress(100);
        setCurrentStep(analysisSteps.length - 1);
        
        // Wait a moment before transitioning
        setTimeout(() => {
          onAnalysisComplete({
            ...result,
            uploadData, // Include original upload data
          });
        }, 1000);

      } catch (error) {
        console.error('Analysis failed:', error);
        onError(error.message || 'Failed to analyze produce');
      }
    };

    startAnalysis();
  }, [uploadData, onAnalysisComplete, onError]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
        
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Scanning Lines */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                style={{ top: `${20 + i * 15}%` }}
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'linear',
                }}
              />
            ))}
          </motion.div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
              {[...Array(144)].map((_, i) => (
                <motion.div
                  key={i}
                  className="border border-emerald-400"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: (i % 12) * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-2xl">
          
          {/* Produce Icon with Scanning Effect */}
          <div className="relative mb-12">
            <motion.div
              className="w-32 h-32 mx-auto bg-emerald-600 rounded-full flex items-center justify-center relative overflow-hidden"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 20px rgba(16, 185, 129, 0.3)',
                  '0 0 40px rgba(16, 185, 129, 0.6)',
                  '0 0 20px rgba(16, 185, 129, 0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Leaf className="w-16 h-16 text-white z-10" />
              
              {/* Scanning Beam */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>

            {/* Radar Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 border-emerald-400 rounded-full"
                style={{
                  width: `${160 + i * 40}px`,
                  height: `${160 + i * 40}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.2],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Current Step Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                {React.createElement(analysisSteps[currentStep].icon, {
                  className: "w-8 h-8 text-emerald-400 mr-3"
                })}
                <h2 className="text-2xl font-bold text-white">
                  {analysisSteps[currentStep].text}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-emerald-400 text-lg font-semibold">
              {progress}% Complete
            </p>
          </div>

          {/* Analysis Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analysisSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  index <= currentStep
                    ? 'border-emerald-400 bg-emerald-900 bg-opacity-30'
                    : 'border-gray-600 bg-gray-800 bg-opacity-30'
                }`}
                animate={{
                  scale: index === currentStep ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center">
                  {React.createElement(step.icon, {
                    className: `w-6 h-6 mb-2 ${
                      index <= currentStep ? 'text-emerald-400' : 'text-gray-500'
                    }`
                  })}
                  <p className={`text-xs text-center ${
                    index <= currentStep ? 'text-emerald-400' : 'text-gray-500'
                  }`}>
                    {step.text.split(' ').slice(0, 2).join(' ')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Upload Info */}
          <div className="mt-12 p-6 bg-black bg-opacity-50 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Processing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-gray-300">
                <span className="text-emerald-400">File:</span> {uploadData.file.name}
              </div>
              <div className="text-gray-300">
                <span className="text-emerald-400">Quantity:</span> {uploadData.quantity} kg
              </div>
              <div className="text-gray-300">
                <span className="text-emerald-400">Type:</span> {uploadData.produceType}
              </div>
              <div className="text-gray-300">
                <span className="text-emerald-400">Size:</span> {(uploadData.file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraComponent;