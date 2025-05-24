const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")

const isProduction = process.env.NODE_ENV === "production"
const isGitHubPages = process.env.PUBLIC_URL && process.env.PUBLIC_URL !== "/"
const publicPath = isGitHubPages ? process.env.PUBLIC_URL + "/" : "/"

console.log("Build configuration:", {
  isProduction,
  isGitHubPages,
  publicPath,
  PUBLIC_URL: process.env.PUBLIC_URL,
})

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    assetModuleFilename: "assets/[hash][ext][query]",
    publicPath: publicPath,
    clean: true,
  },
  devtool: isProduction ? "source-map" : "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: {
      index: "/index.html",
    },
    port: 3000,
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext][query]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    fallback: {
      punycode: false,
      url: false,
      util: false,
      querystring: false,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        PUBLIC_URL: publicPath,
        NODE_ENV: isProduction ? 'production' : 'development'
      })
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      publicPath: publicPath,
    }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: "styles/[name].[contenthash].css",
        chunkFilename: "styles/[name].[contenthash].css",
      }),
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          to: ".",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
  ].filter(Boolean),
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  ignoreWarnings: [
    {
      module: /node_modules/,
      message: /punycode/,
    },
  ],
}
