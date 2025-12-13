import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test file patterns
    include: ["tests/**/*.test.ts"],
    
    // Global test timeout
    testTimeout: 10000,
    
    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["examples/**/*.ts"],
      exclude: ["node_modules", "tests"],
    },
    
    // Environment
    environment: "node",
    
    // Globals (describe, it, expect without imports)
    globals: false,
    
    // Reporter options
    reporters: ["verbose"],
    
    // Watch mode options
    watch: false,
  },
});
