import { createElement, forwardRef } from "react"
import { IconVariant, ZappiconProps } from "./types"
import Svg from "react-native-svg"

interface IconBaseProps extends ZappiconProps {
  variants: Map<IconVariant, React.ReactNode>
}

const IconBase = forwardRef<React.ComponentRef<typeof Svg>, IconBaseProps>(
  (props, ref) => {
    const { color, size, variant, variants, children, ...rest } = props

    const selectedVariant =
      children || variants.get(variant ?? "regular") || variants.get("regular")

    return createElement(
      Svg,
      {
        ref,
        width: size ?? 24,
        height: size ?? 24,
        fill: color ?? "currentColor",
        viewBox: "0 0 24 24",
        ...rest,
      },
      selectedVariant
    )
  }
)

IconBase.displayName = "IconBase"

export default IconBase
