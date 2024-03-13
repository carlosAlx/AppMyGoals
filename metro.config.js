const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

const config = getDefaultConfig(__dirname)

// @ts-ignore
module.exports = withNativeWind(config, { input: "./src/styles/global.css" })
