import {
  titleize,
  pluralize,
  checkIsPresent,
  range,
  setMinmax_age,
  prepTimeForDisplay,
  timeForDisplay,
  convertToMs
} from "./helpers";


describe('helpers', () => {
  test('titleize to capitalize first letter in a string', () => {
    expect(titleize('roger')).toBe('Roger');
  });

  test('pluralize to work', () => {
    expect(pluralize('category')).toBe('categories');
  });

  test('checkIsPresent returns true when found', () => {
    expect(checkIsPresent({
      array: [{id: 1, bib: 1}, {id: 2, bib: 2}, {id: 3, bib: 3}],
      target: 2,
      type: 'bib' })
    ).toBe(true);
  });

  test('range to return an array of numbers counting up from start to end', () => {
    expect(range(1,6)).toStrictEqual([1,2,3,4,5,6]);
  });

  test('setMinmax_age to set min and max age from category name', () => {
    expect(setMinmax_age({category: 'M30-39', min_age: null, max_age: null}))
      .toStrictEqual({category: 'M30-39', min_age: 30, max_age: 39});
  });

  test('prepTimeForDisplay returns object of padded hrs, mins, sec, and millis', () => {
    expect(prepTimeForDisplay(90500)).toStrictEqual({
      padHours: "00", padMins: "01", padSeconds: "30", padMillis: "50"
    });
  });

  test('timeForDisplay to return formatted time', () => {
    expect(timeForDisplay(90500)).toBe("00:01:30:50");
  });

  test('convertToMs works', () => {
    expect(convertToMs("00:01:30:50")).toBe(90500);
  });
});
