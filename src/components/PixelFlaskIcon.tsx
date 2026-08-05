interface PixelFlaskIconProps {
  className?: string
  title?: string
}

export function PixelFlaskIcon({
  className,
  title,
}: PixelFlaskIconProps) {
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
      <rect x="6" y="1" width="4" height="1" />
      <rect x="7" y="2" width="2" height="3" />

      <rect x="6" y="4" width="1" height="2" />
      <rect x="9" y="4" width="1" height="2" />

      <rect x="5" y="6" width="1" height="2" />
      <rect x="10" y="6" width="1" height="2" />

      <rect x="4" y="8" width="1" height="2" />
      <rect x="11" y="8" width="1" height="2" />

      <rect x="3" y="10" width="1" height="3" />
      <rect x="12" y="10" width="1" height="3" />

      <rect x="4" y="13" width="8" height="1" />

      <path
        className="pixel-flask-icon__liquid"
        d="
          M4 10
          H12
          V13
          H4
          Z
        "
      />

      <rect
        className="pixel-flask-icon__bubble"
        x="6"
        y="10"
        width="1"
        height="1"
      />

      <rect
        className="pixel-flask-icon__bubble"
        x="9"
        y="11"
        width="1"
        height="1"
      />
    </svg>
  )
}