import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketplaceView } from "@/components/marketplace-view"

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Produce Marketplace
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse verified produce with transparent quality credentials. Trade with confidence.
            </p>
          </div>
          
          <MarketplaceView />
        </div>
      </div>
      <Footer />
    </main>
  )
}