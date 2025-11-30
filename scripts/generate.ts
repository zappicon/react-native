import icons from "../core/src/index.ts"
import process from "process"
import path from "node:path"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { execSync } from "child_process"
import { fileURLToPath } from "node:url"
import { readFileSync } from "node:fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SVG_ICONS_DIR = path.join(__dirname, "../core/icons")
const ICONS_OUTPUT_DIR = path.join(__dirname, "../src/icons")
const VARIANTS_OUTPUT_DIR = path.join(__dirname, "../src/variants")
const VARIANTS = ["light", "regular", "filled", "duotone", "duotone-line"]

function updateGitSubmodules() {
  try {
    console.log("Updating git submodules...")
    execSync("git submodule update --remote --init --force --recursive", {
      stdio: "inherit",
    })
    console.log("✅ Git submodules updated!")
  } catch (error) {
    console.error("Error updating git submodules:", error)
    process.exit(1)
  }
}

async function generateIcons() {
  try {
    await mkdir(ICONS_OUTPUT_DIR, { recursive: true })
    for (const icon of icons) {
      const iconFileContent = `import * as React from "react"
import variants from "../variants/${icon.name}"
import type { Icon } from "../lib/types"
import IconBase from "../lib/icon-base"

/**
 * ${VARIANTS.map((variant) => {
   const file = path.join(variant, `${icon.name}.svg`)
   if (!file) return `@${variant} (missing)`
   const svgPath = join(SVG_ICONS_DIR, file)
   const svgContent = readFileSync(svgPath, "utf8")
   return `@${variant} ${getBase64Svg(svgContent)}`
 }).join("\n * ")}
*/

const ${toPascalCase(icon.name)}: Icon = React.forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} variants={variants} />
))

${toPascalCase(icon.name)}.displayName = '${toPascalCase(icon.name)}'

export default ${toPascalCase(icon.name)}
`

      await writeFile(
        join(ICONS_OUTPUT_DIR, `${icon.name}.tsx`),
        iconFileContent
      )
    }

    console.log(`✅ Generated icon files for ${icons.length} icons!`)
  } catch (error) {
    console.error("Error generating icon files:", error)
    process.exit(1)
  }
}

async function generateIndex() {
  try {
    const indexPath = join(__dirname, "../src/index.ts")

    const indexFileContent = icons
      .map(
        (icon) =>
          `export { default as ${toPascalCase(icon.name)} } from './icons/${
            icon.name
          }';`
      )
      .join("\n")

    await writeFile(indexPath, indexFileContent)

    console.log(`✅ Generated index file!`)
  } catch (error) {
    console.error("Error generating index file:", error)
    process.exit(1)
  }
}

async function generateVariants() {
  try {
    await mkdir(VARIANTS_OUTPUT_DIR, { recursive: true })

    for (const icon of icons) {
      const variantEntries: string[] = []

      const iconVariants = icon.variants
      iconVariants.map((v) => {
        const elementCode = renderSvgToCreateElement(v.svg, "  ")
        variantEntries.push(`["${v.variant}", <>${elementCode}</>]`)
      })

      const variantsMapContent = `import * as React from "react"
import * as SVG from "react-native-svg"
import type { IconVariant } from "../lib/types"

export default new Map<IconVariant, React.ReactElement>([
${variantEntries.join(",\n")}
])
`
      await writeFile(
        path.join(VARIANTS_OUTPUT_DIR, `${icon.name}.tsx`),
        variantsMapContent
      )
    }

    console.log(
      `✅ Generated variants for ${icons.length} icons from core/src/index.ts!`
    )
  } catch (error) {
    console.error("Error generating variant files:", error)
    process.exit(1)
  }
}

type SvgChild = {
  name: string
  svg?: {
    children: readonly SvgChild[]
  }
  attributes?: Record<string, string>
  children?: readonly SvgChild[]
  type?: string
  value?: string
  parent?: SvgChild | null
}

function renderSvgToCreateElement(node: SvgChild, indent = ""): string {
  if (!node) return "null"

  const { name, type, value, attributes = {}, children = [] } = node

  // Text node
  if (type === "text") {
    return value ? value : ""
  }

  if (type !== "element") return "null"

  // root <svg>: unwrap and render children directly
  if (name === "svg") {
    const childrenCode = children
      .map((child) => renderSvgToCreateElement(child, indent + "  "))
      .filter((c) => c !== "null")

    return childrenCode.length === 1 ? childrenCode[0] : childrenCode.join("\n")
  }

  //
  // Build JSX props
  //
  const props: string[] = []

  Object.entries(attributes).forEach(([k, v]) => {
    if (k === "fill") return // strip fill always
    const reactName = convertAttributeToReactProp(k)
    props.push(`${reactName}="${v}"`)
  })

  const propsString = props.length > 0 ? " " + props.join(" ") : ""

  //
  // No children → self-closing JSX
  //
  if (!children.length) {
    return `<SVG.${uppercaseFirstLetter(name)}${propsString} />`
  }

  //
  // Has children
  //
  const childrenString = children
    .map((child) => renderSvgToCreateElement(child, indent + "  "))
    .filter((c) => c !== "null")
    .join("\n" + indent)

  return `<SVG.${uppercaseFirstLetter(
    name
  )}${propsString}>\n${indent}${childrenString}\n</SVG.${uppercaseFirstLetter(
    name
  )}>`
}

function convertAttributeToReactProp(attr: string): string {
  const specialCases: Record<string, string> = {
    class: "className",
    for: "htmlFor",
    tabindex: "tabIndex",
    readonly: "readOnly",
    maxlength: "maxLength",
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable",
  }
  if (specialCases[attr]) {
    return specialCases[attr]
  }
  return toCamelCase(attr)
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

function toCamelCase(str: string): string {
  return str
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1)
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join("")
}

function getBase64Svg(svg: string): string {
  svg = svg.replace(/<svg([^>]*)>/, (_, attrs) => {
    const newAttrs = attrs
      .replace(/\swidth="[^"]*"/g, "")
      .replace(/\sheight="[^"]*"/g, "")
    return `<svg${newAttrs} width="20" height="20"><rect width="100%" height="100%" fill="white" rx="2" ry="2"/>`
  })

  const baseURI = Buffer.from(svg, "utf8").toString("base64")
  return `![img](data:image/svg+xml;base64,${baseURI})`
}

function uppercaseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

updateGitSubmodules()
generateIcons()
generateIndex()
generateVariants()
