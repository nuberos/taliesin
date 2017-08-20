module.exports = {
  "extends": ["node"],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true
    }
  },
  env: {
    node: true
  },
  rules: {
    "no-console": "off"
  },
  plugins: [
    "node"
  ]
}
