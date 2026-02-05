"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  MapPin, 
  Calendar, 
  Shield, 
  Package,
  TrendingUp,
  Clock,
  Filter,
  MessageCircle,
  Heart,
  Eye
} from "lucide-react"

interface Listing {
  id: string
  cropType: string
  variety?: string
  quantity: string
  pricePerUnit: number
  unit: string
  location: string
  farmerName: string
  harvestDate: string
  grade: "A" | "B" | "C"
  qualityScore: number
  freshness: "Fresh" | "Moderate" | "Aging"
  passportId: string
  verified: boolean
  views: number
  inquiries: number
  featured?: boolean
}

const sampleListings: Listing[] = [
  {
    id: "L001",
    cropType: "Tomatoes",
    variety: "Roma",
    quantity: "500 kg",
    pricePerUnit: 45,
    unit: "kg",
    location: "Nashik, Maharashtra",
    farmerName: "Ramesh Patil",
    harvestDate: "2026-02-03",
    grade: "A",
    qualityScore: 94,
    freshness: "Fresh",
    passportId: "KP-2026-001234",
    verified: true,
    views: 156,
    inquiries: 12,
    featured: true,
  },
  {
    id: "L002",
    cropType: "Onions",
    variety: "Red",
    quantity: "1000 kg",
    pricePerUnit: 32,
    unit: "kg",
    location: "Nashik, Maharashtra",
    farmerName: "Suresh Kumar",
    harvestDate: "2026-02-01",
    grade: "B",
    qualityScore: 82,
    freshness: "Moderate",
    passportId: "KP-2026-001198",
    verified: true,
    views: 89,
    inquiries: 5,
  },
  {
    id: "L003",
    cropType: "Potatoes",
    variety: "Kufri Jyoti",
    quantity: "2000 kg",
    pricePerUnit: 28,
    unit: "kg",
    location: "Agra, Uttar Pradesh",
    farmerName: "Vijay Singh",
    harvestDate: "2026-02-02",
    grade: "A",
    qualityScore: 91,
    freshness: "Fresh",
    passportId: "KP-2026-001256",
    verified: true,
    views: 234,
    inquiries: 18,
    featured: true,
  },
  {
    id: "L004",
    cropType: "Mangoes",
    variety: "Alphonso",
    quantity: "300 kg",
    pricePerUnit: 180,
    unit: "kg",
    location: "Ratnagiri, Maharashtra",
    farmerName: "Anil Deshmukh",
    harvestDate: "2026-02-04",
    grade: "A",
    qualityScore: 97,
    freshness: "Fresh",
    passportId: "KP-2026-001289",
    verified: true,
    views: 412,
    inquiries: 34,
    featured: true,
  },
  {
    id: "L005",
    cropType: "Rice",
    variety: "Basmati",
    quantity: "5000 kg",
    pricePerUnit: 85,
    unit: "kg",
    location: "Karnal, Haryana",
    farmerName: "Harpreet Kaur",
    harvestDate: "2026-01-28",
    grade: "A",
    qualityScore: 93,
    freshness: "Fresh",
    passportId: "KP-2026-001145",
    verified: true,
    views: 178,
    inquiries: 9,
  },
  {
    id: "L006",
    cropType: "Apples",
    variety: "Kashmiri",
    quantity: "800 kg",
    pricePerUnit: 120,
    unit: "kg",
    location: "Shimla, Himachal Pradesh",
    farmerName: "Deepak Sharma",
    harvestDate: "2026-02-01",
    grade: "B",
    qualityScore: 85,
    freshness: "Fresh",
    passportId: "KP-2026-001178",
    verified: true,
    views: 145,
    inquiries: 11,
  },
]

const cropFilters = ["All", "Tomatoes", "Onions", "Potatoes", "Mangoes", "Rice", "Apples"]
const gradeFilters = ["All", "A", "B", "C"]

export function MarketplaceView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("All")
  const [selectedGrade, setSelectedGrade] = useState("All")
  const [sortBy, setSortBy] = useState("featured")

  const filteredListings = sampleListings
    .filter((listing) => {
      const matchesSearch = 
        listing.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCrop = selectedCrop === "All" || listing.cropType === selectedCrop
      const matchesGrade = selectedGrade === "All" || listing.grade === selectedGrade
      return matchesSearch && matchesCrop && matchesGrade
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        case "price-low":
          return a.pricePerUnit - b.pricePerUnit
        case "price-high":
          return b.pricePerUnit - a.pricePerUnit
        case "quality":
          return b.qualityScore - a.qualityScore
        case "recent":
          return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime()
        default:
          return 0
      }
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
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

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by crop, location, or farmer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-[140px] bg-background">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Crop" />
                </SelectTrigger>
                <SelectContent>
                  {cropFilters.map((crop) => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[120px] bg-background">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeFilters.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade === "All" ? "All Grades" : `Grade ${grade}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="quality">Quality Score</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredListings.length} verified listings
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card 
            key={listing.id} 
            className={`bg-card border-border hover:shadow-lg transition-all group ${
              listing.featured ? "ring-2 ring-secondary" : ""
            }`}
          >
            <CardContent className="p-0">
              <div className="relative aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                  <Package className="w-16 h-16 text-primary/40" />
                </div>
                
                {listing.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-secondary text-secondary-foreground">
                      <TrendingUp className="w-3 h-3 mr-1" /> Featured
                    </Badge>
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className={getGradeColor(listing.grade)}>
                    Grade {listing.grade}
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                  {listing.verified && (
                    <Badge variant="secondary" className="bg-card/90 text-card-foreground backdrop-blur-sm">
                      <Shield className="w-3 h-3 mr-1 text-primary" /> Verified
                    </Badge>
                  )}
                  <Badge variant="secondary" className={`bg-card/90 backdrop-blur-sm ${getFreshnessColor(listing.freshness)}`}>
                    <Clock className="w-3 h-3 mr-1" /> {listing.freshness}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display font-semibold text-card-foreground">
                      {listing.cropType}
                      {listing.variety && <span className="font-normal text-muted-foreground"> ({listing.variety})</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground">{listing.quantity} available</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">
                      Rs. {listing.pricePerUnit}
                    </p>
                    <p className="text-xs text-muted-foreground">per {listing.unit}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Harvested {formatDate(listing.harvestDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 py-2 border-t border-b border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    <span>{listing.views} views</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="w-3 h-3" />
                    <span>{listing.inquiries} inquiries</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Score: </span>
                    <span className="font-semibold text-card-foreground">{listing.qualityScore}%</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-1">
                    <MessageCircle className="w-4 h-4" /> Contact
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  by {listing.farmerName}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">
              No listings found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search filters to find more produce.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
