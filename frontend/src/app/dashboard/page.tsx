import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { RecentWordsCard } from "@/components/dashboard/recent-words-card"
import { UpcomingReviewsCard } from "@/components/dashboard/upcoming-reviews-card"
import { DashboardActions } from "@/components/dashboard/dashboard-actions"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-indigo-900/10">
        <div className="container mx-auto py-8 space-y-8">
          <DashboardHeader />
          <StatsGrid />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <RecentWordsCard />
            <UpcomingReviewsCard />
          </div>
          <DashboardActions />
        </div>
      </div>
    </ProtectedRoute>
  )
}