import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Scan, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-accent-foreground">Transforming Agricultural Trade</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground leading-tight text-balance">
              Digital Produce
              <br />
              <span className="text-primary">Quality Passport</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Turn a simple smartphone photo into irrefutable proof of quality and freshness. 
              Empowering farmers with transparent, AI-verified credentials.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/upload">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
                  Start Grading <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10 bg-transparent">
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Fair Pricing</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-card rounded-2xl shadow-2xl p-6 border border-border">
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold">
                Grade A
              </div>
              
              <div className="aspect-square bg-muted rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-primary/30 rounded-full flex items-center justify-center mb-4">
                      <Scan className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Sample Produce Image</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quality Score</span>
                  <span className="font-bold text-primary">94%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-primary rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Freshness</p>
                    <p className="font-semibold text-foreground">Fresh</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Harvest Date</p>
                    <p className="font-semibold text-foreground">Today</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Market Value</p>
                  <p className="font-bold text-foreground">+23% Higher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
