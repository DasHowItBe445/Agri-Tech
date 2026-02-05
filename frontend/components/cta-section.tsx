import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
          Ready to Transform Your Harvest?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of farmers already earning fair prices with verified quality credentials.
          Start your first passport in under 2 minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/upload">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
              Create Your First Passport <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
              Browse Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
