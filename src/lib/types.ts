import Svg, { SvgProps } from "react-native-svg"

export type IconVariant =
  | "light"
  | "regular"
  | "filled"
  | "duotone"
  | "duotone-line"

export interface ZappiconProps extends SvgProps {
  variant?: IconVariant
  size?: string | number
  color?: string
}

export type Icon = React.ForwardRefExoticComponent<
  ZappiconProps & React.RefAttributes<React.ComponentRef<typeof Svg>>
>
