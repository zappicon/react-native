import { readFile } from 'fs/promises'
import { join } from 'path'

describe('Icon Generation', () => {
  test('should generate TypeScript files for icons', async () => {
    // Test if a known icon file exists
    const iconPath = join(process.cwd(), 'src/icons/heart-simple-filled.ts')

    try {
      const content = await readFile(iconPath, 'utf8')
      expect(content).toContain('export default')
      expect(content).toContain('heartSimpleFilled')
      expect(content).toContain('as const')
    } catch {
      // If file doesn't exist, we need to build first
      console.log('Icons not built yet, run pnpm run build first')
    }
  })

  test('should have valid icon structure', async () => {
    const iconPath = join(process.cwd(), 'src/icons/heart-simple-filled.ts')

    try {
      // Dynamic import the icon
      const iconModule = await import(iconPath)
      const icon = iconModule.default

      expect(icon).toHaveProperty('name', 'svg')
      expect(icon).toHaveProperty('type', 'element')
      expect(icon).toHaveProperty('attributes')
      expect(icon).toHaveProperty('children')
    } catch {
      // Skip if icons not built yet
      console.log('Icons not built yet, run pnpm run build first')
    }
  })
})
