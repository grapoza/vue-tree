module.exports = {
  "stories": [
    "../src/**/Home.stories.mdx",
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "core": {
    builder: "webpack5",
    disableTelemetry: true,
  },
  "framework": "@storybook/vue3",
  staticDirs: [ // Copy the data used in examples so they can be directly linked from story descriptions
    { from: '../src/stories/data', to: "assets_data" },
    { from: '../src/stories/css', to: 'assets_css' }
  ],
};
