const config = {
  entry: "./src/index.jsx",
  output: {
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "babel-preset-env",
              "babel-preset-react",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".jsx"],
  },
}

module.exports = config
