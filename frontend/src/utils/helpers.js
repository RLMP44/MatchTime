export function titleize(string) {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
};

export function pluralize(string) {
  return string.at(-1) === 'y' ? string.replace('y', 'ies') : string + "s";
};

// checks if the current target is present in a given array
export function checkIsPresent({ array: records, target: target, type: type }) {
  const userRecord = records.find((record) => {
    return record[type] === target;
  });
  return userRecord !== undefined;
};

// returns array
export function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
