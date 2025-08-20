'use client'

import dynamic from 'next/dynamic'
import { FeaturesSection } from "@/components/home/features-section"
import { StatsSection } from "@/components/home/stats-section"
import { CtaSection } from "@/components/home/cta-section"

const HeroSection = dynamic(() => import("@/components/home/hero-section").then(mod => ({ default: mod.HeroSection })), {
  ssr: false,
  loading: () => (
    <div className="relative overflow-hidden min-h-screen flex items-center">
      <div className="container relative mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-xl sm:rounded-2xl mx-auto animate-pulse" />
            <div className="space-y-4 sm:space-y-6">
              <div className="h-16 sm:h-24 bg-gray-300 rounded animate-pulse mx-auto max-w-lg" />
              <div className="w-24 sm:w-32 h-1 bg-gray-300 mx-auto rounded-full animate-pulse" />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="h-8 sm:h-12 bg-gray-300 rounded animate-pulse mx-auto max-w-2xl" />
              <div className="h-20 sm:h-24 bg-gray-300 rounded animate-pulse mx-auto max-w-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CtaSection />
    </div>
  )
}
