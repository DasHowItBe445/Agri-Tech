import { Upload, Cpu, FileCheck, ShoppingCart } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Produce",
    description: "Capture photos and enter basic info like crop type, harvest date, and quantity using our mobile-friendly interface.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description: "Our computer vision instantly analyzes visual parameters and assigns a Grade (A/B/C) with confidence score.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Get Digital Passport",
    description: "Receive a beautiful, verifiable digital credential with freshness score, quality grade, and blockchain verification.",
  },
  {
    icon: ShoppingCart,
    step: "04",
    title: "Sell with Confidence",
    description: "List your produce on the marketplace with attached passport. Buyers trust transparent data for fair negotiations.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps from harvest to sale, all powered by cutting-edge technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative bg-card rounded-2xl p-6 border border-border text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold">
                  {step.step}
                </div>
                
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mt-4 mb-4">
                  <step.icon className="w-8 h-8 text-accent-foreground" />
                </div>
                
                <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
