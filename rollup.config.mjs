import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"
import dts from "rollup-plugin-dts"
import path from "path"
import { glob } from "glob"

const inputs = glob.sync("src/icons/*.tsx").reduce((acc, file) => {
  const name = path.basename(file, ".tsx")
  acc[`icons/${name}`] = file
  return acc
}, {})

const external = ["react-native", "react-native-svg"]

const tsPlugin = typescript({
  tsconfig: "./tsconfig.json",
  exclude: ["**/*.test.tsx", "**/*.test.ts", "**/*.stories.ts"],
  declaration: false,
  declarationMap: false,
})

const basePlugins = [
  resolve({
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    skip: ["react-native"],
  }),
  commonjs(),
  tsPlugin,
]

export default [
  // 1) Main bundle (index.ts → dist/cjs + dist/esm)
  {
    input: "src/index.ts",
    output: [
      { file: "dist/cjs/index.js", format: "cjs", sourcemap: false },
      { file: "dist/esm/index.js", format: "esm", sourcemap: false },
    ],
    plugins: basePlugins,
    external,
  },

  // 2) Individual icon JS bundles
  {
    input: inputs,
    output: [
      {
        dir: "dist/cjs",
        format: "cjs",
        entryFileNames: "[name].js",
        sourcemap: false,
        preserveModules: true,
        preserveModulesRoot: "src",
      },
      {
        dir: "dist/esm",
        format: "esm",
        entryFileNames: "[name].js",
        sourcemap: false,
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    ],
    plugins: basePlugins,
    external,
  },

  // 3) Main type definitions (index.d.ts)
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "esm",
      },
    ],
    plugins: [dts()],
    external,
  },

  // 4) Individual icon type definitions
  {
    input: { ...inputs },
    output: {
      dir: "dist/esm",
      format: "esm",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [dts()],
    external,
  },
]
