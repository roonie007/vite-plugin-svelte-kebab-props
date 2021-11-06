const camelcase = require('camelcase');

const propsRegex = /props:\s{0,}\{[^}]*\s{0,}\},/gim;
const kebabCaseRegex = /("|')([a-z][a-z0-9]*)(-[a-z0-9]+)*("|'):/gim;

const replaceAll = (str, find, replace) => {
  return str.split(find).join(replace);
};

// Initialization
const replacePropsAtInitialization = strCode => {
  const foundVariables = [];
  let codeToTransform = strCode;

  const propsArr = codeToTransform.match(propsRegex);
  if (!propsArr) {
    return { code: strCode };
  }

  for (const propsStr of propsArr) {
    let code = propsStr;

    const variables = code.match(kebabCaseRegex) || [];
    if (variables.length > 0) {
      for (const variable of variables) {
        const cleanKebabName = variable.replace(/['":]/gim, '');
        const camelCaseName = camelcase(cleanKebabName);

        // Save props name in kebab case for later use
        foundVariables.push({ kebab: cleanKebabName, camel: camelCaseName });

        code = code.replace(variable, `${camelCaseName}:`);
      }
    }

    codeToTransform = codeToTransform.replace(propsStr, code);
  }

  return { code: codeToTransform, variables: foundVariables };
};

// Reactivity
const replacePropsAtUpdate = ({ code, variables }) => {
  if (variables && variables.length) {
    // Replace reactive props name
    let newCode = code;
    for (const { kebab, camel } of variables) {
      newCode = replaceAll(newCode, `changes["${kebab}"]`, `changes.${camel}`);
      newCode = replaceAll(newCode, `changes['${kebab}']`, `changes.${camel}`);
      newCode = replaceAll(newCode, `changes[\`${kebab}\`]`, `changes.${camel}`);
    }

    return { code: newCode, variables };
  }

  return { code };
};

function vitePluginSvelteKebabProps() {
  return {
    name: 'svelte-kebab-props',
    transform(src, id) {
      if (id.trim().toLowerCase().endsWith('.svelte')) {
        const replacedPropsAtInitialization = replacePropsAtInitialization(src);
        const { code } = replacePropsAtUpdate(replacedPropsAtInitialization);

        return {
          code,
          map: null,
        };
      }

      return {
        code: src,
        map: null,
      };
    },
  };
}

module.exports = {
  replaceAll,
  replacePropsAtInitialization,
  replacePropsAtUpdate,
  vitePluginSvelteKebabProps,
};
