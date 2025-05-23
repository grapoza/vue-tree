// This is used to get tables in MDX
import remarkGfm from 'remark-gfm';

import type { StorybookConfig } from '@storybook/vue3-vite';

import { join, dirname } from "path"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@chromatic-com/storybook'),
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  "framework": {
    "name": getAbsolutePath('@storybook/vue3-vite'),
    "options": {}
  },
  "core": {
    disableTelemetry: true,
  },
  staticDirs: [ // Copy the data used in examples so they can be directly linked from story descriptions
    { from: '../src/stories/assets/data', to: "assets_data" },
    { from: '../src/stories/assets/css', to: 'assets_css' }
  ],
};
export default config;