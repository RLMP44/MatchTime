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

export function setMinMaxAge(category) {
  const integers = /\d+/;
  const splitCat = category.category.split('-');
  const minAge = parseInt(splitCat[0].match(integers));
  const maxAge = parseInt(splitCat[1]);
  category.minAge = minAge;
  category.maxAge = maxAge;
  return category;
};

export function timeForDisplay(milliseconds) {
  const hours = Math.floor(milliseconds / 3_600_000);
  const mins = Math.floor((milliseconds % 3_600_000) / 60_000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millis = (Math.floor(milliseconds % 1000) / 10).toFixed(0);

  const padHours = hours.toString().padStart(2, "0");
  const padMins = mins.toString().padStart(2, "0");
  const padSeconds = seconds.toString().padStart(2, "0");
  const padMillis = millis.toString().padStart(2, "0");

  return { padHours, padMins, padSeconds, padMillis };
};
