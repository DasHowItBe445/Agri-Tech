import { Card, CardContent } from "@/components/ui/card"
import { Camera, Brain, Clock, Shield, Store, Banknote } from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "Simple Photo Upload",
    description: "Capture your produce with any smartphone. Our interface is designed for ease of use in the field.",
  },
  {
    icon: Brain,
    title: "AI-Powered Grading",
    description: "Advanced computer vision analyzes color, size, defects, and uniformity to assign accurate grades.",
  },
  {
    icon: Clock,
    title: "Freshness Tracking",
    description: "Science-backed freshness scores calculated from harvest timestamp and storage conditions.",
  },
  {
    icon: Shield,
    title: "Blockchain Verified",
    description: "Immutable digital passports with optional blockchain hash for tamper-proof verification.",
  },
  {
    icon: Store,
    title: "Direct Marketplace",
    description: "Connect directly with buyers who value quality. No middlemen, just fair transactions.",
  },
  {
    icon: Banknote,
    title: "Fair Pricing",
    description: "Transparent quality data enables confident, value-based negotiations for both parties.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why KrishiPramaan?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete ecosystem that transforms how agricultural produce is verified, traded, and valued.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:shadow-lg transition-shadow bg-card border-border">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
