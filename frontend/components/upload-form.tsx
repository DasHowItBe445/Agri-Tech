"use client"

import React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Camera, X, Loader2, CheckCircle2, FileText } from "lucide-react"

const cropTypes = [
  "Tomatoes",
  "Potatoes",
  "Onions",
  "Rice",
  "Wheat",
  "Mangoes",
  "Apples",
  "Bananas",
  "Carrots",
  "Cabbage",
  "Cauliflower",
  "Green Peas",
  "Other",
]

type AnalysisStage = "idle" | "uploading" | "analyzing" | "grading" | "complete"

interface GradingResult {
  grade: "A" | "B" | "C"
  confidence: number
  qualityScore: number
  freshness: "Fresh" | "Moderate" | "Aging"
  defects: string[]
  recommendations: string[]
}

export function UploadForm() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [kisanPehchaanImage, setKisanPehchaanImage] = useState<string | null>(null)
  const [labReportImage, setLabReportImage] = useState<string | null>(null)
  const [cropType, setCropType] = useState("")
  const [harvestDate, setHarvestDate] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("kg")
  const [location, setLocation] = useState("")
  const [stage, setStage] = useState<AnalysisStage>("idle")
  const [result, setResult] = useState<GradingResult | null>(null)
  const [dragActiveProduct, setDragActiveProduct] = useState(false)
  const [dragActiveKisanPehchaan, setDragActiveKisanPehchaan] = useState(false)
  const [dragActiveLabReport, setDragActiveLabReport] = useState(false)

  const handleDragProduct = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveProduct(true)
    } else if (e.type === "dragleave") {
      setDragActiveProduct(false)
    }
  }, [])

  const handleDragKisanPehchaan = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveKisanPehchaan(true)
    } else if (e.type === "dragleave") {
      setDragActiveKisanPehchaan(false)
    }
  }, [])

  const handleDragLabReport = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveLabReport(true)
    } else if (e.type === "dragleave") {
      setDragActiveLabReport(false)
    }
  }, [])

  const handleDropProduct = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveProduct(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0], "product")
    }
  }, [])

  const handleDropKisanPehchaan = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveKisanPehchaan(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0], "kisanPehchaan")
    }
  }, [])

  const handleDropLabReport = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveLabReport(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0], "labReport")
    }
  }, [])

  const handleFile = (file: File, type: "product" | "kisanPehchaan" | "labReport") => {
    if (type === "labReport") {
      // Accept both images and PDFs for lab reports
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        const reader = new FileReader()
        reader.onload = (e) => {
          setLabReportImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    } else if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === "product") {
          setSelectedImage(e.target?.result as string)
        } else if (type === "kisanPehchaan") {
          setKisanPehchaanImage(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0], "product")
    }
  }

  const handleFileInputKisanPehchaan = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0], "kisanPehchaan")
    }
  }

  const handleFileInputLabReport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0], "labReport")
    }
  }

  const simulateAnalysis = async () => {
    setStage("uploading")
    await new Promise((r) => setTimeout(r, 1000))
    
    setStage("analyzing")
    await new Promise((r) => setTimeout(r, 1500))
    
    setStage("grading")
    await new Promise((r) => setTimeout(r, 1200))

    const grades: Array<"A" | "B" | "C"> = ["A", "B", "C"]
    const freshness: Array<"Fresh" | "Moderate" | "Aging"> = ["Fresh", "Moderate", "Aging"]
    
    const mockResult: GradingResult = {
      grade: grades[Math.floor(Math.random() * 2)],
      confidence: 85 + Math.floor(Math.random() * 12),
      qualityScore: 78 + Math.floor(Math.random() * 20),
      freshness: freshness[Math.floor(Math.random() * 2)],
      defects: Math.random() > 0.5 ? ["Minor surface blemishes detected"] : [],
      recommendations: [
        "Store in cool, dry place",
        "Best consumed within 5 days",
        "Suitable for retail and wholesale markets",
      ],
    }

    setResult(mockResult)
    setStage("complete")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage || !kisanPehchaanImage || !cropType || !harvestDate || !quantity) return
    await simulateAnalysis()
  }

  const handleViewPassport = () => {
    const passportData = {
      cropType,
      harvestDate,
      quantity: `${quantity} ${unit}`,
      location,
      ...result,
      id: `KP-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    
    localStorage.setItem("latestPassport", JSON.stringify(passportData))
    router.push("/passport")
  }

  const resetForm = () => {
    setSelectedImage(null)
    setKisanPehchaanImage(null)
    setLabReportImage(null)
    setCropType("")
    setHarvestDate("")
    setQuantity("")
    setLocation("")
    setStage("idle")
    setResult(null)
  }

  if (stage !== "idle" && stage !== "complete") {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
            <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">
              {stage === "uploading" && "Uploading Image..."}
              {stage === "analyzing" && "Analyzing Visual Parameters..."}
              {stage === "grading" && "Generating Quality Grade..."}
            </h3>
            <p className="text-muted-foreground">
              {stage === "uploading" && "Securely transferring your produce image"}
              {stage === "analyzing" && "AI is examining color, size, defects, and uniformity"}
              {stage === "grading" && "Calculating freshness score and final grade"}
            </p>
            
            <div className="mt-8 max-w-xs mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className={stage === "uploading" ? "text-primary font-medium" : "text-muted-foreground"}>Upload</span>
                <span className={stage === "analyzing" ? "text-primary font-medium" : "text-muted-foreground"}>Analyze</span>
                <span className={stage === "grading" ? "text-primary font-medium" : "text-muted-foreground"}>Grade</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ 
                    width: stage === "uploading" ? "33%" : stage === "analyzing" ? "66%" : "100%" 
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (stage === "complete" && result) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-card-foreground mb-2">
              Analysis Complete!
            </h3>
            <p className="text-muted-foreground">
              Your produce has been graded and a digital passport is ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {selectedImage && (
                <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                  <img 
                    src={selectedImage || "/placeholder.svg"} 
                    alt="Uploaded produce" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-foreground ${
                  result.grade === "A" ? "bg-primary" : result.grade === "B" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {result.grade}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quality Grade</p>
                  <p className="text-2xl font-bold text-card-foreground">Grade {result.grade}</p>
                  <p className="text-sm text-muted-foreground">{result.confidence}% confidence</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Quality Score</span>
                    <span className="font-semibold text-card-foreground">{result.qualityScore}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${result.qualityScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Freshness</span>
                  <span className={`font-semibold ${
                    result.freshness === "Fresh" ? "text-primary" : 
                    result.freshness === "Moderate" ? "text-secondary-foreground" : "text-destructive"
                  }`}>{result.freshness}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Crop Type</span>
                  <span className="font-semibold text-card-foreground">{cropType}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-semibold text-card-foreground">{quantity} {unit}</span>
                </div>
              </div>

              {result.defects.length > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-medium text-card-foreground mb-1">Notes:</p>
                  <ul className="text-sm text-muted-foreground">
                    {result.defects.map((defect, i) => (
                      <li key={i}>• {defect}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              onClick={handleViewPassport}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View Digital Passport
            </Button>
            <Button 
              variant="outline" 
              onClick={resetForm}
              className="flex-1 bg-transparent"
            >
              Grade Another Batch
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-card border-border">
        <CardContent className="p-6 sm:p-8">
          {/* Image Upload Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Product Image Upload */}
            <div>
              <Label className="text-card-foreground mb-2 block font-medium">
                Product Image *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Upload a clear photo of your produce
              </p>
              
              {selectedImage ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  <img 
                    src={selectedImage || "/placeholder.svg"} 
                    alt="Selected produce" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <X className="w-4 h-4 text-card-foreground" />
                  </button>
                </div>
              ) : (
                <div
                  onDragEnter={handleDragProduct}
                  onDragLeave={handleDragProduct}
                  onDragOver={handleDragProduct}
                  onDrop={handleDropProduct}
                  className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragActiveProduct 
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputProduct}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label htmlFor="product-image-upload" className="cursor-pointer text-center p-4">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <p className="font-medium text-card-foreground text-sm mb-1">
                      Drop image here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Kisan Pehchaan Patra Upload */}
            <div>
              <Label className="text-card-foreground mb-2 block font-medium">
                Kisan Pehchaan Patra *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Official farmer identity document
              </p>
              
              {kisanPehchaanImage ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  <img 
                    src={kisanPehchaanImage || "/placeholder.svg"} 
                    alt="Kisan Pehchaan Patra" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setKisanPehchaanImage(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <X className="w-4 h-4 text-card-foreground" />
                  </button>
                </div>
              ) : (
                <div
                  onDragEnter={handleDragKisanPehchaan}
                  onDragLeave={handleDragKisanPehchaan}
                  onDragOver={handleDragKisanPehchaan}
                  onDrop={handleDropKisanPehchaan}
                  className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragActiveKisanPehchaan 
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputKisanPehchaan}
                    className="hidden"
                    id="kisan-pehchaan-upload"
                  />
                  <label htmlFor="kisan-pehchaan-upload" className="cursor-pointer text-center p-4">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <p className="font-medium text-card-foreground text-sm mb-1">
                      Drop document here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Lab Report Upload */}
            <div>
              <Label className="text-card-foreground mb-2 block font-medium">
                Lab Report (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Quality testing lab report
              </p>
              
              {labReportImage ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  <img 
                    src={labReportImage || "/placeholder.svg"} 
                    alt="Lab Report" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setLabReportImage(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <X className="w-4 h-4 text-card-foreground" />
                  </button>
                </div>
              ) : (
                <div
                  onDragEnter={handleDragLabReport}
                  onDragLeave={handleDragLabReport}
                  onDragOver={handleDragLabReport}
                  onDrop={handleDropLabReport}
                  className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragActiveLabReport 
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*,application/pdf,.pdf"
                    onChange={handleFileInputLabReport}
                    className="hidden"
                    id="lab-report-upload"
                  />
                  <label htmlFor="lab-report-upload" className="cursor-pointer text-center p-4">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <p className="font-medium text-card-foreground text-sm mb-1">
                      Drop PDF/image here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF or image files accepted
                    </p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="cropType" className="text-card-foreground mb-2 block font-medium">
                Crop Type *
              </Label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger id="cropType" className="bg-background">
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map((crop) => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="harvestDate" className="text-card-foreground mb-2 block font-medium">
                Harvest Date *
              </Label>
              <Input
                id="harvestDate"
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="bg-background"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <Label htmlFor="quantity" className="text-card-foreground mb-2 block font-medium">
                Quantity *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="bg-background flex-1"
                  min="0"
                />
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-24 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="quintal">quintal</SelectItem>
                    <SelectItem value="ton">ton</SelectItem>
                    <SelectItem value="pieces">pieces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-card-foreground mb-2 block font-medium">
                Farm Location (Optional)
              </Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Village, District, State"
                className="bg-background"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Button 
              type="submit" 
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!selectedImage || !kisanPehchaanImage || !cropType || !harvestDate || !quantity}
            >
              Analyze & Generate Passport
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Your data is processed securely. Images are analyzed locally and not stored without permission.
            </p>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
