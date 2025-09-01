# Zappicon React Native

[![npm version](https://badge.fury.io/js/%40zappicon%2Freact-native.svg)](https://badge.fury.io/js/%40zappicon%2Freact-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://zappicon.com/license)

Free & premium UI icons library, crafted to simplify workflows for designers, developers and creators.

- 11,00+ Free icons (220+ Icons × 5 Styles).
- 5 Styles Available (Light, Regular, Filled, Duotone, Duotone Line).
- Unified keyline shapes on a 24×24 px grid.
- Easy customization of colors, sizes, and styles.

## Features

- Full TypeScript support with proper type definitions.
- Easy customization of style with CSS.
- Built with React 19+ and modern best practices.
- Optimized for React Native with native components.
- SVG-based icons that scale perfectly on any device.
- Tree-shakeable icons let you import only what you use.

## Installation

```bash
# Using npm
npm install @zappicon/react-native

# Using yarn
yarn add @zappicon/react-native

# Using pnpm
pnpm add @zappicon/react-native
```

## How to use

Zappicon uses ES Modules for full tree-shaking, so your bundle only includes the icons you import.

```tsx
import { Star } from "@zappicon/react"

// usage
function App() {
  return (
    <View>
      <Star />
    </View>
  )
}
```

## Props

| Name    | Type   | Default      | Possible Values                                                 |
| ------- | ------ | ------------ | --------------------------------------------------------------- |
| size    | number | 24           | Any number (pixels)                                             |
| color   | string | currentColor | Any valid color string                                          |
| variant | string | "regular"    | "filled" \| "regular" \| "light" \| "duotone" \| "duotone-line" |
| style   | object | undefined    | React Native style object                                       |

### Example

```tsx
import { Star } from "@zappicon/react-native"

function App() {
  return (
    <View>
      <Star variant='filled' size={48} color='#ff9900' style={{ margin: 8 }} />
    </View>
  )
}
```

### variant

Each icon comes in 5 styles:

| Style        | Variant value          |
| ------------ | ---------------------- |
| Filled       | variant='filled'       |
| Regular      | variant='regular'      |
| Light        | variant='light'        |
| Duotone      | variant='duotone'      |
| Duotone Line | variant='duotone-line' |

**Example:**

```tsx
// One Variant
import { Star } from "@zappicon/react-native"

function IconShowcase() {
  return (
    <View>
      <Star variant='regular' />
    </View>
  )
}

// Different Variants
import { Star } from "@zappicon/react-native"

function IconShowcase() {
  return (
    <View>
      <Star variant='light' />
      <Star variant='regular' />
      <Star variant='filled' />
      <Star variant='duotone' />
      <Star variant='duotone-line' />
    </View>
  )
}
```

### style

Use the `style` prop to apply custom styles using React Native's StyleSheet or inline styles.

```tsx
<Star
  variant='regular'
  style={{ width: 32, height: 32, tintColor: "#007AFF" }}
/>
```

## Support

- **Bug Reports**: [GitHub Issues](https://github.com/zappicon/react-native/issues)
- **Website**: [zappicon.com](https://zappicon.com)
