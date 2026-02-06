"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, Upload, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface QualityDisputeFormProps {
  orderId: string
  farmerName: string
}

type IssueType = 
  | "chemical_taste" 
  | "artificial_coloring" 
  | "wax_coating" 
  | "rotten_damaged"

const issueTypeOptions = [
  { value: "chemical_taste", label: "Chemical / Metallic Taste" },
  { value: "artificial_coloring", label: "Artificial Coloring / Stains" },
  { value: "wax_coating", label: "Unnatural Wax Coating" },
  { value: "rotten_damaged", label: "Rotten / Physically Damaged" },
] as const

export function QualityDisputeForm({ orderId, farmerName }: QualityDisputeFormProps) {
  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [description, setDescription] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ]
      
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload an image or video.")
        return
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        toast.error("File too large. Maximum size is 50MB.")
        return
      }

      setProofFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!issueType) {
      toast.error("Please select an issue type")
      return
    }

    if (!description.trim()) {
      toast.error("Please describe the defect")
      return
    }

    if (!proofFile) {
      toast.error("Please upload photo/video proof")
      return
    }

    setIsLoading(true)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append("orderId", orderId)
      formData.append("issueType", issueType)
      formData.append("description", description)
      formData.append("proof", proofFile)

      // Make API call
      const response = await fetch("/api/dispute/create", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit dispute")
      }

      // Success
      toast.success("Dispute registered successfully")
      setIsSuccess(true)
    } catch (error) {
      console.error("Dispute submission error:", error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to submit dispute. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Dispute Registered
            </h3>
            <p className="text-green-800">
              If verified, the penalty will be redistributed to honest farmers.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Form state
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <span>Report Quality Issue</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Order #{orderId} from {farmerName}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="issueType" className="text-card-foreground">
              Issue Type *
            </Label>
            <Select
              value={issueType}
              onValueChange={(value) => setIssueType(value as IssueType)}
            >
              <SelectTrigger id="issueType" className="bg-background">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">
              Describe the defect *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about the quality issue..."
              className="bg-background min-h-[120px] resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/1000 characters
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="proof" className="text-card-foreground">
              Upload Photo/Video Proof *
            </Label>
            <div className="relative">
              <Input
                id="proof"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="bg-background cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {proofFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  <span className="truncate">{proofFile.name}</span>
                  <span className="text-xs">
                    ({(proofFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Accepted formats: JPG, PNG, WEBP, MP4, WEBM (Max 50MB)
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading || !issueType || !description.trim() || !proofFile}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Dispute...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Submit Dispute
                </>
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> False disputes may result in penalties. 
              Please ensure all information is accurate and evidence is genuine.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}