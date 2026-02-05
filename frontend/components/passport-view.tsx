"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Calendar, 
  MapPin, 
  Package, 
  Download, 
  Share2, 
  QrCode,
  Leaf,
  Clock,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check
} from "lucide-react"

interface PassportData {
  id: string
  cropType: string
  harvestDate: string
  quantity: string
  location?: string
  grade: "A" | "B" | "C"
  confidence: number
  qualityScore: number
  freshness: "Fresh" | "Moderate" | "Aging"
  defects: string[]
  recommendations: string[]
  createdAt: string
}

const samplePassports: PassportData[] = [
  {
    id: "KP-2026-001234",
    cropType: "Tomatoes",
    harvestDate: "2026-02-03",
    quantity: "250 kg",
    location: "Nashik, Maharashtra",
    grade: "A",
    confidence: 94,
    qualityScore: 92,
    freshness: "Fresh",
    defects: [],
    recommendations: ["Store at 12-15°C", "Best before 7 days", "Premium market grade"],
    createdAt: "2026-02-03T10:30:00Z",
  },
  {
    id: "KP-2026-001198",
    cropType: "Onions",
    harvestDate: "2026-02-01",
    quantity: "500 kg",
    location: "Nashik, Maharashtra",
    grade: "B",
    confidence: 88,
    qualityScore: 78,
    freshness: "Moderate",
    defects: ["Minor size variation"],
    recommendations: ["Store in dry area", "Best before 14 days", "Wholesale suitable"],
    createdAt: "2026-02-01T14:20:00Z",
  },
]

export function PassportView() {
  const [passports, setPassports] = useState<PassportData[]>(samplePassports)
  const [selectedPassport, setSelectedPassport] = useState<PassportData | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("latestPassport")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const existingIndex = passports.findIndex((p) => p.id === parsed.id)
        if (existingIndex === -1) {
          setPassports([parsed, ...passports])
          setSelectedPassport(parsed)
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-primary text-primary-foreground"
      case "B": return "bg-secondary text-secondary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case "Fresh": return "text-primary"
      case "Moderate": return "text-secondary-foreground"
      default: return "text-destructive"
    }
  }

  if (passports.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-accent-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">
            No Passports Yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start by uploading your first produce batch to generate a verified digital quality passport.
          </p>
          <Link href="/upload">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              Upload Produce <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Recent Passports</h3>
          <Link href="/upload">
            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
              <Package className="w-4 h-4" /> New
            </Button>
          </Link>
        </div>
        
        {passports.map((passport) => (
          <Card 
            key={passport.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPassport?.id === passport.id 
                ? "ring-2 ring-primary bg-accent" 
                : "bg-card"
            }`}
            onClick={() => setSelectedPassport(passport)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-card-foreground">{passport.cropType}</p>
                  <p className="text-sm text-muted-foreground">{passport.quantity}</p>
                </div>
                <Badge className={getGradeColor(passport.grade)}>
                  Grade {passport.grade}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(passport.harvestDate)}
                </span>
                {passport.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {passport.location.split(",")[0]}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="lg:col-span-2">
        {selectedPassport ? (
          <Card className="bg-card border-border overflow-hidden">
            <div className="bg-sidebar p-6 text-sidebar-foreground">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sidebar-primary rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">KrishiPramaan</h2>
                    <p className="text-sm text-sidebar-foreground/70">Digital Quality Passport</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sidebar-primary" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-sidebar-foreground/70">Passport ID:</span>
                <code className="bg-sidebar-accent px-2 py-1 rounded text-sidebar-accent-foreground">
                  {selectedPassport.id}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(selectedPassport.id)}
                  className="p-1 hover:bg-sidebar-accent rounded transition-colors"
                >
                  {copiedId === selectedPassport.id ? (
                    <Check className="w-4 h-4 text-sidebar-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold ${getGradeColor(selectedPassport.grade)}`}>
                      {selectedPassport.grade}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quality Grade</p>
                      <p className="text-2xl font-bold text-card-foreground">Grade {selectedPassport.grade}</p>
                      <p className="text-sm text-muted-foreground">{selectedPassport.confidence}% AI confidence</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Quality Score</span>
                      <span className="font-semibold text-card-foreground">{selectedPassport.qualityScore}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${selectedPassport.qualityScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Crop Type</p>
                      <p className="font-semibold text-card-foreground">{selectedPassport.cropType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Freshness Status</p>
                      <p className={`font-semibold ${getFreshnessColor(selectedPassport.freshness)}`}>
                        {selectedPassport.freshness}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="font-semibold text-card-foreground">{selectedPassport.quantity}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Harvest Date</p>
                      <p className="font-semibold text-card-foreground">{formatDate(selectedPassport.harvestDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPassport.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedPassport.location}</span>
                </div>
              )}

              {selectedPassport.recommendations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-card-foreground mb-3">Recommendations</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {selectedPassport.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-accent rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-accent-foreground mt-0.5 shrink-0" />
                        <span className="text-sm text-accent-foreground">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <QrCode className="w-4 h-4" /> Generate QR
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
                <Link href="/marketplace" className="ml-auto">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    List on Marketplace <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border h-full flex items-center justify-center">
            <CardContent className="p-12 text-center">
              <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a passport to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
