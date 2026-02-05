import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Leaf, 
  Calendar, 
  Hash, 
  Scale, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ExternalLink,
  Download,
  Share2
} from 'lucide-react';
import { mintPassport } from '../../services/blockchain';

const QualityCard = ({ analysisResult, onBack, onMintComplete }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [error, setError] = useState(null);

  // Extract data from analysis result
  const {
    passport_id,
    timestamp,
    analysis,
    quality_metrics,
    blockchain_status,
    uploadData
  } = analysisResult;

  const grade = analysis?.final_grade || 'Unknown';
  const freshnessScore = quality_metrics?.freshness_score || 0;

  // Determine grade color and icon
  const getGradeInfo = (grade) => {
    const gradeUpper = grade.toUpperCase();
    if (gradeUpper.includes('GRADE A') || gradeUpper.includes('EXPORT')) {
      return {
        color: 'emerald',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-500',
        icon: CheckCircle,
        label: 'Premium Quality'
      };
    } else if (gradeUpper.includes('GRADE B') || gradeUpper.includes('MEDIUM')) {
      return {
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-500',
        icon: AlertTriangle,
        label: 'Good Quality'
      };
    } else {
      return {
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-500',
        icon: XCircle,
        label: 'Needs Improvement'
      };
    }
  };

  const gradeInfo = getGradeInfo(grade);

  // Get freshness color
  const getFreshnessColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handle minting to blockchain
  const handleMint = async () => {
    setIsMinting(true);
    setError(null);

    try {
      const passportData = {
        produceType: uploadData.produceType,
        quantity: uploadData.quantity,
        qualityGrade: grade,
        freshnessScore: Math.round(freshnessScore),
        passportId: passport_id,
        timestamp: timestamp,
      };

      const result = await mintPassport(passportData);
      setMintResult(result);
      
      if (onMintComplete) {
        onMintComplete(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsMinting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-emerald-600 p-3 rounded-full">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Digital Passport Generated
          </h1>
          <p className="text-gray-600">
            Your produce has been analyzed and certified
          </p>
        </motion.div>

        {/* Main Certificate Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden mb-8"
        >
          
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Krishi Pramaan Certificate</h2>
                <p className="text-emerald-100">Digital Produce Passport</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-emerald-100 mb-1">
                  <Hash className="w-4 h-4 mr-1" />
                  <span className="text-sm font-mono">{passport_id}</span>
                </div>
                <div className="flex items-center text-emerald-100">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">{formatDate(timestamp)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Quality Grade */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`inline-flex items-center px-6 py-3 rounded-full border-2 ${gradeInfo.bgColor} ${gradeInfo.textColor} ${gradeInfo.borderColor} mb-4`}>
                    {React.createElement(gradeInfo.icon, { className: "w-6 h-6 mr-2" })}
                    <span className="font-bold text-lg">{grade}</span>
                  </div>
                  <p className={`text-sm font-semibold ${gradeInfo.textColor}`}>
                    {gradeInfo.label}
                  </p>
                </div>

                {/* Freshness Score */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke={freshnessScore >= 80 ? '#10b981' : freshnessScore >= 60 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - freshnessScore / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getFreshnessColor(freshnessScore)}`}>
                          {Math.round(freshnessScore)}%
                        </div>
                        <div className="text-xs text-gray-500">Freshness</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Leaf className="w-5 h-5 text-emerald-600 mr-2" />
                      <span className="font-semibold text-gray-700">Produce Type</span>
                    </div>
                    <p className="text-lg text-gray-900">{uploadData.produceType}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Scale className="w-5 h-5 text-emerald-600 mr-2" />
                      <span className="font-semibold text-gray-700">Quantity</span>
                    </div>
                    <p className="text-lg text-gray-900">{uploadData.quantity} kg</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                      <span className="font-semibold text-gray-700">Blockchain Status</span>
                    </div>
                    <p className="text-lg text-emerald-600 font-semibold">{blockchain_status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {!mintResult ? (
            <button
              onClick={handleMint}
              disabled={isMinting}
              className={`w-full h-16 text-xl font-bold rounded-xl transition-all transform ${
                isMinting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isMinting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Minting to Blockchain...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Leaf className="w-6 h-6 mr-3" />
                  Mint to Blockchain
                </div>
              )}
            </button>
          ) : (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-xl font-bold text-emerald-800">Successfully Minted!</h3>
              </div>
              <div className="space-y-2 text-sm text-emerald-700">
                <p><strong>Transaction Hash:</strong> <span className="font-mono">{mintResult.transactionHash}</span></p>
                <p><strong>Block Number:</strong> {mintResult.blockNumber}</p>
                <p><strong>Gas Used:</strong> {mintResult.gasUsed}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <XCircle className="w-6 h-6 text-red-600 mr-3" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onBack}
              className="h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all"
            >
              Scan Another
            </button>
            
            <button className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>
            
            <button className="h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center">
              <Share2 className="w-5 h-5 mr-2" />
              Share Certificate
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QualityCard;