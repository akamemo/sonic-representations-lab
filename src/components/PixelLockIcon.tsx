interface PixelLockIconProps {
  className?: string
  title?: string
}

export function PixelLockIcon({
  className,
  title,
}: PixelLockIconProps) {
  const isDecorative = !title

  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      role={isDecorative ? undefined : 'img'}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={title}
      shapeRendering="crispEdges"
    >
      <rect x="5" y="3" width="6" height="1" />
      <rect x="4" y="4" width="1" height="4" />
      <rect x="11" y="4" width="1" height="4" />
      <rect x="5" y="7" width="6" height="1" />

      <rect x="3" y="8" width="10" height="6" />

      <rect
        className="pixel-lock-icon__keyhole"
        x="7"
        y="10"
        width="2"
        height="2"
      />

      <rect
        className="pixel-lock-icon__keyhole"
        x="7"
        y="12"
        width="2"
        height="1"
      />
    </svg>
  )
}