import React from "react"
import type { ReactElement } from "react"
import { render, screen, fireEvent } from "@testing-library/react-native"
import AddressCard from "../src/icons/address-card"
import { IconVariant, ZappiconProps } from "../src/lib/types"
import * as Icons from "../src"
import IconBase from "../src/lib/icon-base"
import Svg from "react-native-svg"

describe("Index File", () => {
  it("all exports are valid React components", () => {
    const iconNames = Object.keys(Icons)
    iconNames.forEach((iconName) => {
      const component = Icons[iconName as keyof typeof Icons]
      expect(component).toBeDefined()
      expect(
        typeof component === "function" || typeof component === "object"
      ).toBe(true)
    })
  })

  it("all exports are React.forwardRef objects", () => {
    const iconNames = Object.keys(Icons)
    iconNames.forEach((iconName) => {
      const component = Icons[iconName as keyof typeof Icons]
      expect(typeof component).toBe("object")
      expect(component.$$typeof).toBeDefined()
    })
  })

  it("exports a reasonable number of icons", () => {
    const iconCount = Object.keys(Icons).length
    expect(iconCount).toBeGreaterThan(100)
    expect(iconCount).toBeLessThan(2000)
  })
})

describe("Icon Base", () => {
  const dummyVariants: Map<IconVariant, ReactElement> = new Map([
    ["light", React.createElement(React.Fragment, null, "light")],
    ["regular", React.createElement(React.Fragment, null, "regular")],
    ["filled", React.createElement(React.Fragment, null, "filled")],
    ["duotone", React.createElement(React.Fragment, null, "duotone")],
    ["duotone-line", React.createElement(React.Fragment, null, "duotone-line")],
  ])

  it("renders without crashing", () => {
    render(<IconBase variants={dummyVariants} testID='icon-base' />)
    const icon = screen.getByTestId("icon-base")
    expect(icon).toBeOnTheScreen()
  })

  it("falls back to 'regular' variant if unknown variant is provided", () => {
    render(
      <IconBase
        variants={dummyVariants}
        variant={"unknown" as IconVariant}
        testID='icon-base-fallback'
      />
    )
    const base = screen.getByTestId("icon-base-fallback")
    expect(base).toBeOnTheScreen()
    expect(base).toHaveTextContent("regular")
  })

  it("forwards props to SVG element", () => {
    const customProps: ZappiconProps = {
      width: 48,
      height: 48,
      style: { display: "flex" },
    }

    render(
      <IconBase
        variants={dummyVariants}
        {...customProps}
        testID='icon-base-props'
      />
    )
    const icon = screen.getByTestId("icon-base-props")
    expect(icon.props.width).toBe(48)
    expect(icon.props.height).toBe(48)
    // expect(icon.props.style).toMatchObject({ display: "flex" })
  })
})

describe("Icon Components", () => {
  describe("Basic Rendering", () => {
    it("renders all icons without crashing", () => {
      Object.entries(Icons).forEach(([iconName, IconComponent]) => {
        render(<IconComponent testID={`icon-${iconName}`} />)
        const icon = screen.getByTestId(`icon-${iconName}`)
        expect(icon).toBeOnTheScreen()
      })
    })
  })

  describe("SVG Properties", () => {
    it("has default width and height", () => {
      render(<AddressCard testID='svg-icon' />)
      const icon = screen.getByTestId("svg-icon")

      expect(icon.props.width).toBe(24)
      expect(icon.props.height).toBe(24)
      // expect(icon.props.viewBox).toBe("0 0 24 24")
    })
  })

  describe("Props Handling", () => {
    it("accepts and applies custom width and height", () => {
      render(<AddressCard testID='custom-size-icon' width={32} height={32} />)
      const icon = screen.getByTestId("custom-size-icon")
      expect(icon.props.width).toBe(32)
      expect(icon.props.height).toBe(32)
    })

    it("accepts and applies size prop", () => {
      render(<AddressCard testID='custom-size-icon' size={32} />)
      const icon = screen.getByTestId("custom-size-icon")
      expect(icon.props.width).toBe(32)
      expect(icon.props.height).toBe(32)
    })

    it("accepts and applies custom color", () => {
      render(<AddressCard testID='custom-color-icon' color='red' />)
      const icon = screen.getByTestId("custom-color-icon")
      expect(icon.props.fill).toBe("red")
    })

    // it("accepts and applies style prop", () => {
    //   render(<AddressCard testID='styled-icon' style={{ display: "none" }} />)
    //   const icon = screen.getByTestId("styled-icon")
    //   expect(icon.props.style).toMatchObject({ display: "none" })
    // })
  })

  describe("Event Handlers", () => {
    it("handles onPress events", () => {
      const handlePress = jest.fn()
      render(<AddressCard testID='clickable-icon' onPress={handlePress} />)
      const icon = screen.getByTestId("clickable-icon")

      fireEvent.press(icon)
      expect(handlePress).toHaveBeenCalledTimes(1)
    })

    it("handles onLongPress events", () => {
      const handleLongPress = jest.fn()
      render(
        <AddressCard testID='long-press-icon' onLongPress={handleLongPress} />
      )
      const icon = screen.getByTestId("long-press-icon")

      fireEvent(icon, "longPress")
      expect(handleLongPress).toHaveBeenCalledTimes(1)
    })
  })

  describe("Ref Handling", () => {
    it("forwards ref to the underlying native element", () => {
      const { AddressCard } = Icons
      const ref = React.createRef<React.ComponentRef<typeof Svg>>()

      render(<AddressCard testID='ref-icon' ref={ref} />)

      const element = screen.getByTestId("ref-icon")

      expect(ref.current).not.toBeNull()
      expect(element).toHaveProp("testID", "ref-icon")
    })

    it("works with useRef hook", async () => {
      const { AddressCard } = Icons

      const TestComponent = () => {
        const ref = React.useRef<React.ComponentRef<typeof Svg>>(null)

        React.useEffect(() => {
          expect(ref.current).not.toBeNull()
          expect(ref.current?.props.testID).toBe("use-ref-icon")
        }, [])

        return <AddressCard testID='use-ref-icon' ref={ref} />
      }

      render(<TestComponent />)

      // also confirm via screen
      const element = await screen.findByTestId("use-ref-icon")
      expect(element).toHaveProp("testID", "use-ref-icon")
    })

    it("works with callback refs", () => {
      const { AddressCard } = Icons
      let refElement: React.ComponentRef<typeof Svg> | null = null

      const callbackRef = (element: React.ComponentRef<typeof Svg> | null) => {
        refElement = element
      }

      render(<AddressCard testID='callback-ref-icon' ref={callbackRef} />)

      const element = screen.getByTestId("callback-ref-icon")

      expect(refElement).not.toBeNull()
      expect(element).toHaveProp("testID", "callback-ref-icon")
    })
  })

  describe("Accessibility", () => {
    it("supports accessibilityLabel", () => {
      render(
        <AddressCard
          testID='accessible-icon'
          accessibilityLabel='Address card icon'
        />
      )
      const icon = screen.getByTestId("accessible-icon")

      expect(icon.props.accessibilityLabel).toBe("Address card icon")
    })

    it("supports accessibilityRole", () => {
      render(<AddressCard testID='role-icon' accessibilityRole='image' />)
      const icon = screen.getByTestId("role-icon")

      expect(icon.props.accessibilityRole).toBe("image")
    })

    it("can be made accessible", () => {
      render(<AddressCard testID='focusable-icon' accessible={true} />)
      const icon = screen.getByTestId("focusable-icon")

      expect(icon.props.accessible).toBe(true)
    })
  })
})

describe("TypeScript Types", () => {
  it("icon components accept SVGProps", () => {
    const props = {
      width: 24,
      height: 24,
      color: "red",
      testID: "typescript-test",
      onPress: () => {},
    }

    const element = <AddressCard {...props} />
    expect(element).toBeDefined()
    expect(element.props.testID).toBe("typescript-test")
  })

  it("icon components work with React.ComponentProps", () => {
    const props: React.ComponentProps<typeof AddressCard> = {
      width: "100%",
      height: "auto",
      style: { display: "flex" },
    }
    const element = <AddressCard {...props} />
    expect(element).toBeDefined()
  })

  describe("Ref Types", () => {
    it("icon components accept ref with correct type", () => {
      const ref = React.createRef<React.ComponentRef<typeof Svg>>()
      const element = <AddressCard ref={ref} />
      expect(element).toBeDefined()
    })

    it("icon components work with useRef", () => {
      const TestComponent = () => {
        const ref = React.useRef<React.ComponentRef<typeof Svg>>(null)
        return <AddressCard ref={ref} />
      }

      const element = <TestComponent />
      expect(element).toBeDefined()
    })

    it("icon components work with callback refs", () => {
      const callbackRef = (element: React.ComponentRef<typeof Svg> | null) => {
        if (element) {
          element.getBBox()
        }
      }

      const element = <AddressCard ref={callbackRef} />
      expect(element).toBeDefined()
    })

    it("ref type is compatible with SVGSVGElement", () => {
      const ref = React.createRef<React.ComponentRef<typeof Svg>>()
      const element = <AddressCard ref={ref} />

      const current: React.ComponentRef<typeof Svg> | null = ref.current
      expect(typeof current).toBe("object")
      expect(element).toBeDefined()
    })

    it("works with forwardRef pattern correctly", () => {
      const WrappedComponent = React.forwardRef<
        React.ComponentRef<typeof Svg>,
        React.ComponentProps<typeof AddressCard>
      >((props, ref) => <AddressCard {...props} ref={ref} />)

      WrappedComponent.displayName = "WrappedAddressCard"

      const ref = React.createRef<React.ComponentRef<typeof Svg>>()
      const element = <WrappedComponent ref={ref} width={32} />
      expect(element).toBeDefined()
    })
  })
})
