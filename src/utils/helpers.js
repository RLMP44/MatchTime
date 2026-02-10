export function titleize(string) {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
};

export function pluralize(string) {
  return string[-1] === 'y' ? string.replace('y', 'ies') : string + "s";
};
