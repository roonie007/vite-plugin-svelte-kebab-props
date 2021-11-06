const plugin = require('../');

describe('vitePluginSvelteKebabProps', () => {
  it('should return the correct plugin name', () => {
    expect(plugin().name).toEqual('svelte-kebab-props');
  });

  it('should not transform the code if the id does not end with .svelte', () => {
    const str = 'this is a code';

    const id1 = 'something.js';
    const id2 = 'something.ts';
    const id3 = 'something.css';
    const id4 = 'something.svelt';

    expect(plugin().transform(str, id1)).toEqual(expect.objectContaining({ code: str, map: null }));
    expect(plugin().transform(str, id2)).toEqual(expect.objectContaining({ code: str, map: null }));
    expect(plugin().transform(str, id3)).toEqual(expect.objectContaining({ code: str, map: null }));
    expect(plugin().transform(str, id4)).toEqual(expect.objectContaining({ code: str, map: null }));
  });

  it('should transform the code even if id is not lowercase', () => {
    const str = `test0 = new Test({
      props: {
        "this-is-kebab-variable": "test",
        'this-is-another-kebab-variable-with-single-quote': "new-tag-new-new"
      },
      $$inline: true
    });`;
    const expectStr = `test0 = new Test({
      props: {
        thisIsKebabVariable: "test",
        thisIsAnotherKebabVariableWithSingleQuote: "new-tag-new-new"
      },
      $$inline: true
    });`;

    const id1 = 'something.SVELTE';
    const id2 = 'something.SvelTe';
    const id3 = 'something.sveltE';
    const id4 = 'something.SVeLTe';

    expect(plugin().transform(str, id1)).toEqual(expect.objectContaining({ code: expectStr, map: null }));
    expect(plugin().transform(str, id2)).toEqual(expect.objectContaining({ code: expectStr, map: null }));
    expect(plugin().transform(str, id3)).toEqual(expect.objectContaining({ code: expectStr, map: null }));
    expect(plugin().transform(str, id4)).toEqual(expect.objectContaining({ code: expectStr, map: null }));
  });

  it('should correctly transform the code', () => {
    const id = 'this-is-a-svelte-component-filename.svelte';
    const variables = [
      { camel: 'thisIsKebabVariable', kebab: 'this-is-kebab-variable' },
      {
        camel: 'thisIsAnotherKebabVariableWithSingleQuote',
        kebab: 'this-is-another-kebab-variable-with-single-quote',
      },
    ];

    const str = `test0 = new Test({
      props: {
        "this-is-kebab-variable": "test",
        'this-is-another-kebab-variable-with-single-quote': "new-tag-new-new"
      },
      $$inline: true
    });

    p: function update(ctx, [dirty]) {
      const test1_changes = {};
      if (dirty & /*thisIs*/ 1) test1_changes["this-is-kebab-variable"] = /*thisIs*/ ctx[0];
      test1.$set(test1_changes);
      const test2_changes = {};
      if (dirty & /*thisIs*/ 1) test2_changes['this-is-another-kebab-variable-with-single-quote'] = /*thisIs*/ ctx[0];
      test2.$set(test2_changes);
    },`;

    const expectStr = `test0 = new Test({
      props: {
        thisIsKebabVariable: "test",
        thisIsAnotherKebabVariableWithSingleQuote: "new-tag-new-new"
      },
      $$inline: true
    });

    p: function update(ctx, [dirty]) {
      const test1_changes = {};
      if (dirty & /*thisIs*/ 1) test1_changes.thisIsKebabVariable = /*thisIs*/ ctx[0];
      test1.$set(test1_changes);
      const test2_changes = {};
      if (dirty & /*thisIs*/ 1) test2_changes.thisIsAnotherKebabVariableWithSingleQuote = /*thisIs*/ ctx[0];
      test2.$set(test2_changes);
    },`;

    expect(plugin().transform(str, id)).toEqual(expect.objectContaining({ code: expectStr, map: null }));
  });
});
