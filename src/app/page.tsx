import Link from 'next/link'
import Image from 'next/image'
import { PawPrint, Sparkles, Zap, Users, BarChart3, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="OpenPaws" width={40} height={40} className="animate-paw-squeeze" />
              <span className="text-xl font-bold text-gray-900">OpenPaws</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-orange-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-orange-500 transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-orange-500 transition-colors">Pricing</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-gray-600 hover:text-orange-500 font-medium">Sign In</Link>
              <Link href="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Powered by Autonomous AI Agents
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
            Your Social Media,{' '}
            <span className="text-orange-500">Autopilot.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            OpenPaws uses intelligent AI agents that learn your brand, optimize posting schedules, 
            and continuously improve your content strategy — so you can focus on your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how-it-works" className="border border-gray-300 hover:border-orange-500 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Watch Demo
            </Link>
          </div>
          
          {/* Paw Print Decoration */}
          <div className="mt-16 flex justify-center gap-4 opacity-30">
            <PawPrint className="w-8 h-8 text-orange-400 animate-float" style={{ animationDelay: '0s' }} />
            <PawPrint className="w-12 h-12 text-orange-400 animate-float" style={{ animationDelay: '0.5s' }} />
            <PawPrint className="w-8 h-8 text-orange-400 animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              More Than Just a Scheduler
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most tools are reactive — you create, they schedule. OpenPaws is proactive. 
              Our agents work 24/7 to optimize your social presence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Memory</h3>
              <p className="text-gray-600">
                Upload your brand guidelines, voice examples, and past content. 
                Our agents remember and apply your brand identity forever.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Self-Optimizing Schedule</h3>
              <p className="text-gray-600">
                Agents learn when YOUR specific audience engages most and automatically 
                adjust your posting times for maximum reach.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Evolution</h3>
              <p className="text-gray-600">
                Agents analyze your top-performing posts and automatically generate 
                new variations that compound on what works.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitor Intelligence</h3>
              <p className="text-gray-600">
                Agents monitor your competitors and surface insights to help you 
                create counter-content that wins attention.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <PawPrint className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cross-Platform Reasoning</h3>
              <p className="text-gray-600">
                Agents understand each platform's nuances — LinkedIn's professionalism, 
                Instagram's visual focus, Twitter's brevity — and adapt accordingly.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Autonomous Engagement</h3>
              <p className="text-gray-600">
                Agents can engage with comments, follow relevant accounts, and 
                nurture your community while you sleep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How OpenPaws Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to your autonomous social media presence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Accounts</h3>
              <p className="text-gray-600">
                Link your Instagram, LinkedIn, Twitter, and other platforms in one click.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Your Brand</h3>
              <p className="text-gray-600">
                Upload guidelines, examples, and goals. Our agents learn your voice.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Let Agents Run</h3>
              <p className="text-gray-600">
                Watch your presence grow while agents create, optimize, and engage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free, scale as you grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-4">For individuals</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> 1 social account
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> 50 posts/month
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> Basic templates
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> Brand memory
                </li>
              </ul>
              <Link href="/signup" className="block w-full text-center border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 rounded-lg font-medium transition-colors">
                Start Free
              </Link>
            </div>

            {/* Pro - Featured */}
            <div className="p-8 rounded-2xl border-2 border-orange-500 bg-orange-50 relative">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-4">For growing brands</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$79</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> 5 social accounts
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> Unlimited posts
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> AI repurposing
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> API access
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> Self-optimizing schedule
                </li>
              </ul>
              <Link href="/signup" className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors">
                Start Free Trial
              </Link>
            </div>

            {/* Agency */}
            <div className="p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Agency</h3>
              <p className="text-gray-600 mb-4">For marketing teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$199</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> Unlimited clients
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> White-label branding
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> Team seats
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> Client reports
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-orange-500">✓</span> Priority support
                </li>
              </ul>
              <Link href="/signup" className="block w-full text-center border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 rounded-lg font-medium transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Let AI Run Your Social?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Join thousands of brands already growing with OpenPaws
          </p>
          <Link href="/signup" className="inline-block bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="OpenPaws" width={32} height={32} />
              <span className="text-white font-semibold">OpenPaws</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p>© 2026 OpenPaws. Built by HAAIS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
