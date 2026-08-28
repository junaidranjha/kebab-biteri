import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { OnlineStatus } from '@/components/online-status'
import { PwaInstallPrompt } from '@/components/pwa-install-prompt'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { DesktopHeader } from '@/components/desktop-header'

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#FFFDF2] text-zinc-950">
      <OnlineStatus />
      
      {/* Desktop Fixed Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64 min-h-dvh flex flex-col">
        {/* Desktop Sticky Header */}
        <DesktopHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 pb-bottom-nav safe-bottom lg:pb-12">
          {children}
        </main>
      </div>

      <PwaInstallPrompt />
      {/* Mobile Bottom Navigation Bar (hidden on desktop) */}
      <MobileBottomNav />
    </div>
  )
}
