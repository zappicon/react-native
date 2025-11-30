import { resolve } from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [react({ jsxRuntime: "classic" }), dts()],
  build: {
    target: "ES2018",
    lib: {
      name: "zappicon",
      entry: resolve(__dirname, "src/index.ts"),
      fileName: (format, name) => `${name}.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-native-svg", "react-native"],
      input: "./src/index.ts",
      output: [
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "src",
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
        {
          format: "cjs",
          name: "zappicon",
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      ],
    },
  },
})
