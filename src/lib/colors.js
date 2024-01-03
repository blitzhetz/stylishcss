import configPromise from "../config/stylish.config.js";

const styles = {};

configPromise.then((config) => {
  Object.entries(config.theme.colors).forEach(([colorGroupName, colorGroup]) => {
    Object.entries(colorGroup).forEach(([colorName, colorValue]) => {
      const name = `${colorName}`;
      styles[`.text-${name}`] = { color: colorValue };
      styles[`.text-hover-${name}:hover`] = { color: colorValue };
      styles[`.text-decoration-${name}`] = { "text-decoration-color": colorValue };
      styles[`.bg-${name}`] = { "background-color": colorValue };
      styles[`.bg-hover-${name}:hover`] = { "background-color": colorValue };
      styles[`.border-${name}`] = { "border-color": colorValue };
      styles[`.border-hover-${name}:hover`] = { "border-color": colorValue };
      styles[`.outline-${name}`] = { "outline-color": colorValue };
      styles[`.outline-hover-${name}:hover`] = { "outline-color": colorValue };
    });
  });
});

export default styles;
