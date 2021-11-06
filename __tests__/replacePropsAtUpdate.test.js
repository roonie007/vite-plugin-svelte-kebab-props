const { replacePropsAtUpdate } = require('../src/main');

describe('replacePropsAtUpdate', () => {
  it('should replace the props correctly', () => {
    const variables = [
      { camel: 'thisIsKebabVariable', kebab: 'this-is-kebab-variable' },
      {
        camel: 'thisIsAnotherKebabVariableWithSingleQuote',
        kebab: 'this-is-another-kebab-variable-with-single-quote',
      },
    ];

    const str = `test0 = new Test({
      props: {
        thisIsKebabVariable: "test",
        thisIsAnotherKebabVariableWithSingleQuote: "new-tag-new-new"
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

    const { code, variables: returnedVariables } = replacePropsAtUpdate({ code: str, variables });

    expect(returnedVariables).toEqual(expect.arrayContaining(variables));

    expect(code).toEqual(expectStr);
  });

  it('should not transform code if there are no variables', () => {
    const str = `test0 = new Test({
      props: {
        thisIsKebabVariable: "test",
        thisIsAnotherKebabVariableWithSingleQuote: "new-tag-new-new"
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

    const { code, variables } = replacePropsAtUpdate({ code: str, variables: [] });

    expect(code).toEqual(str);
    expect(variables).toBeUndefined();
  });
});
