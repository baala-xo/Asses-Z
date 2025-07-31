import Link from "next/link"
import { FileText, Shield, Share2, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src="/hero.png?height=120&width=120"
                alt="Notes App Hero Icon"
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            Welcome to note - Z
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The simple, secure, and elegant way to keep track of your thoughts.
          </p>
        </header>

        {/* Features Section */}
        <main className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Features Card */}
            <div className="order-2 md:order-1">
              <div className="p-8 border rounded-2xl bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-card-foreground">Features You'll Love</h2>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">End-to-End Encryption for your privacy.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Create, read, and delete notes & Scribbles with ease.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Share2 className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Share notes & Scribbles securely with a public link.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Clean and modern user interface.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Hero Image */}
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <img
                  src="/vault.png?height=400&width=500"
                  alt="Notes App Interface Preview"
                  className="w-full max-w-md rounded-2xl shadow-2xl border border-border/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </main>

        {/* CTA Section */}
        <footer className="text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <Link
              href="/notes"
              className="group relative px-8 py-4 text-lg font-bold rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Try Now</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <p className="text-sm text-muted-foreground"> Accelerate or Die</p>
          </div>
        </footer>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
