import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UploadForm } from "@/components/upload-form"

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Upload Your Produce
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Capture a photo of your harvest and let our AI generate a verified quality passport.
            </p>
          </div>
          
          <UploadForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}