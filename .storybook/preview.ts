import type { Preview } from '@storybook/vue3'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    options: {
      // Sort the Home page before anything else. Then, sort by the type of documentation (docs or story).
      // Finally, just pass through in import order.
      // The `a` and `b` arguments in this function have a type of `import('@storybook/types').IndexEntry`,
      // But Storybook doesn't like it if we use that type.
      storySort: (a, b) => {
        if (a.id === 'grapoza-vue-tree-home--docs') {
          return -1;
        }
        if (b.id === 'grapoza-vue-tree-home--docs') {
          return 1;
        }

        if (a.type !== b.type) {
          return a.type === 'docs' ? -1 : 1;
        }

        return 0;
      },
    },
  },
};

export default preview;