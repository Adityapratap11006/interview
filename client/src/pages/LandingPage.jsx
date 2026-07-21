import { motion } from 'framer-motion'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import AISection from '../components/landing/AISection'
import AnalyticsPreview from '../components/landing/AnalyticsPreview'
import Testimonials from '../components/landing/Testimonials'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Navbar />
      <Hero />
      <Features />
      <AISection />
      <AnalyticsPreview />
      <Testimonials />
      <CTASection />
      <Footer />
    </motion.div>
  )
}

export default LandingPage
