export function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* deep navy base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 82% 0%, #081663 0%, #04093a 48%, #02061f 100%)',
        }}
      />
      {/* single soft periwinkle glow, top-right */}
      <div
        className="absolute -right-32 -top-40 h-[460px] w-[460px] rounded-full blur-[150px]"
        style={{ background: 'rgba(137,159,254,0.18)' }}
      />
    </div>
  )
}
