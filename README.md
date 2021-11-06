# vite-plugin-svelte-kebab-props

Vite 2.x plugin to support kebab case props within Svelte components.

![npm](https://img.shields.io/npm/v/vite-plugin-svelte-kebab-props)

```svelte
<!-- $lib/components/MyImage.svelte -->
<script lang="ts">
  export let thisIsMyPicture: string = '';
</script>

<img src={thisIsMyPicture} alt="alt-pic" />

```

```svelte
<!-- index.svelte -->
<script lang="ts">
  import MyImage from '$lib/components/MyImage.svelte';
  const cat = 'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png';
</script>

<MyImage this-is-my-picture={cat} />

```

### Additionally, it works with reactive variables.

```svelte
<!-- $lib/components/MyText.svelte -->
<script lang="ts">
  export let thisIsMyText: string = '';
</script>

<div>{thisIsMyText}</div>

```

```svelte
<!-- index.svelte -->
<script>
  import MyText from '$lib/components/MyText.svelte';
  let text = 'some text';
  $: {
    setInterval(() => {
      text = Date.now().toString();
    }, 3000);
  }
</script>

<MyText this-is-my-text={text} />
```

## Install

**Yarn**

```
yarn add --dev vite-plugin-svelte-kebab-props
```

**NPM**

```
npm install vite-plugin-svelte-kebab-props --save-dev
```

**pnpm**

```
pnpm add -D vite-plugin-svelte-kebab-props
```

## Setup

### `svelte.config.cjs`

```svelte
import preprocess from 'svelte-preprocess';
import svelteKebabProps from 'vite-plugin-svelte-kebab-props';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [preprocess()],

  kit: {
    target: '#svelte',
    vite: {
      plugins: [svelteKebabProps()]
    }
  }
};

export default config;
```

## License

MIT
