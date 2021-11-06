const { replacePropsAtInitialization } = require('../src/main');

describe('replacePropsAtInitialization', () => {
  it('should replace the props correctly', () => {
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

    const { code, variables } = replacePropsAtInitialization(str);

    expect(variables).toEqual(
      expect.arrayContaining([
        { camel: 'thisIsKebabVariable', kebab: 'this-is-kebab-variable' },
        {
          camel: 'thisIsAnotherKebabVariableWithSingleQuote',
          kebab: 'this-is-another-kebab-variable-with-single-quote',
        },
      ]),
    );

    expect(code).toEqual(expectStr);
  });

  it('should not transform if no matching props', () => {
    const str = `no props in code`;

    const { code, variables } = replacePropsAtInitialization(str);

    expect(code).toEqual(str);
    expect(variables).toBeUndefined();
  });
});
