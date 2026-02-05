import React, { useState, useRef } from 'react';
import { Upload, Camera, Scale, Leaf } from 'lucide-react';

const UploadComponent = ({ onStartScanning }) => {
  const [quantity, setQuantity] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ file: 'Please select a valid image file (JPG, PNG, or WEBP)' });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors({ file: 'Image file too large. Please select a file smaller than 10MB.' });
      return;
    }

    setSelectedFile(file);
    setErrors({ ...errors, file: null });
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle quantity input
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Only allow positive numbers with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setQuantity(value);
      if (parseFloat(value) > 0) {
        setErrors({ ...errors, quantity: null });
      }
    }
  };

  // Validate and start scanning
  const handleStartScanning = () => {
    const newErrors = {};

    // Validate quantity
    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity greater than 0';
    }

    // Validate file
    if (!selectedFile) {
      newErrors.file = 'Please select an image of your produce';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Start the scanning process
    onStartScanning({
      file: selectedFile,
      quantity: parseFloat(quantity),
      produceType: 'Tomato', // Default for now - could be detected or selected
    });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-emerald-600 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Krishi Pramaan
          </h1>
          <p className="text-xl text-gray-600">
            Generate Digital Passport for Your Produce
          </p>
        </div>

        {/* Quantity Input */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            <Scale className="inline w-5 h-5 mr-2" />
            Quantity (kg)
          </label>
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="Enter quantity in kg (e.g., 25.5)"
            className={`w-full h-16 px-6 text-xl border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all ${
              errors.quantity 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 focus:border-emerald-600'
            }`}
          />
          {errors.quantity && (
            <p className="mt-2 text-red-600 text-sm">{errors.quantity}</p>
          )}
        </div>

        {/* File Upload Area */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            <Camera className="inline w-5 h-5 mr-2" />
            Upload Produce Image
          </label>
          
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-emerald-600 bg-emerald-50'
                : errors.file
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-emerald-600 hover:bg-emerald-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-emerald-600 rounded-full flex items-center justify-center">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-emerald-600">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="text-sm text-gray-500 hover:text-red-600 underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG, WEBP (max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {errors.file && (
            <p className="mt-2 text-red-600 text-sm">{errors.file}</p>
          )}
        </div>

        {/* Scan Button */}
        <button
          onClick={handleStartScanning}
          disabled={!selectedFile || !quantity || parseFloat(quantity) <= 0}
          className={`w-full h-16 text-xl font-bold rounded-xl transition-all transform ${
            selectedFile && quantity && parseFloat(quantity) > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Camera className="inline w-6 h-6 mr-3" />
          Scan Produce
        </button>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Camera className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600">Advanced computer vision analyzes your produce quality</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Scale className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality Grading</h3>
            <p className="text-sm text-gray-600">Get certified quality grades for better market prices</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Blockchain Verified</h3>
            <p className="text-sm text-gray-600">Immutable digital passport for traceability</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadComponent;