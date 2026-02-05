import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PassportView } from "@/components/passport-view"

export default function PassportPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              My Digital Passports
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              View and manage your verified produce quality certificates.
            </p>
          </div>
          
          <PassportView />
        </div>
      </div>
      <Footer />
    </main>
  )
}