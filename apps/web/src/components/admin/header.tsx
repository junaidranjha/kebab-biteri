export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-amber-200/60 bg-white/90 backdrop-blur-md px-6 lg:flex shadow-sm">
      <div>
        <h1 className="font-sans text-lg font-black text-zinc-950">Kebab Biteri Admin</h1>
        <p className="text-xs font-semibold text-zinc-500">Live Restaurant Operations & Analytics</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live KDS
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4BE2C] text-sm font-black text-zinc-950 shadow-sm border border-amber-300">
          A
        </div>
      </div>
    </header>
  )
}
