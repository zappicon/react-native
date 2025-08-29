import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { fileURLToPath } from 'url'
import { parse } from 'svgson'
import { optimize } from 'svgo'
import { join } from 'path'
import process from 'process'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SVG_ICONS_DIR = path.join(__dirname, '../icons')
const OUTPUT_DIR = path.join(__dirname, '../src')
const VARIANTS = ['light', 'regular', 'filled', 'duotone', 'duotone-line']

async function convertSvgToTs() {
  try {
    await mkdir(OUTPUT_DIR, { recursive: true })

    const iconsMap = {}

    for (const variant of VARIANTS) {
      const variantDir = path.join(SVG_ICONS_DIR, variant)
      let files
      try {
        files = await readdir(variantDir)
      } catch {
        console.warn(`Variant folder not found: ${variantDir}`)
        continue
      }

      for (const file of files) {
        if (!file.endsWith('.svg')) continue
        const iconName = file.replace('.svg', '')
        const svgPath = join(variantDir, file)
        const svgContent = await readFile(svgPath, 'utf8')
        const optimizedSvg = optimize(svgContent.toString()).data
        const jsonObj = await parse(optimizedSvg)
        if (!iconsMap[iconName]) iconsMap[iconName] = {}

        iconsMap[iconName][variant] = jsonObj
      }
    }

    const iconNames = Object.keys(iconsMap)
    console.log(`Converting ${iconNames.length} icons to TypeScript objects with variants...`)

    let iconsArrayContent = 'export default [\n'

    for (const iconName of iconNames) {
      const variantsArr = []
      for (const variant of VARIANTS) {
        if (iconsMap[iconName][variant]) {
          variantsArr.push({
            variant: variant,
            svg: iconsMap[iconName][variant],
          })
        }
      }

      let variantsStr = JSON.stringify(variantsArr, null, 2)
      variantsStr = variantsStr.replace(/"(\w+)":/g, '$1:') // remove quotes from keys
      variantsStr = variantsStr.replace(/variant: (\w+)/g, 'variant: "$1"') // keep variant as string

      iconsArrayContent += `  {\n    name: "${iconName}",\n    variants: ${variantsStr}\n  },\n`
    }

    iconsArrayContent += '] as const;\n'

    const indexTsPath = join(OUTPUT_DIR, 'index.ts')
    await writeFile(indexTsPath, iconsArrayContent)
    console.log(`✅ Converted ${iconNames.length} icons successfully and exported to index.ts!`)
  } catch (error) {
    console.error('Error converting files:', error)
    process.exit(1)
  }
}

export function toCamelCase(str) {
  return str
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1)
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join('')
}

convertSvgToTs()
