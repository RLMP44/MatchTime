import {
  titleize,
  pluralize,
  checkIsPresent,
  range,
  prepTimeForDisplay,
  timeForDisplay,
  convertToMs,
  mergeUpdatedRecord,
  diff,
  updateCatAge
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

  test('mergeUpdatedRecord works', () => {
    const prev = [
      { id: 1, first_name: "Lara", last_name: "Croft", age: 40 },
      { id: 2, first_name: "Ben", last_name: "Stark", age: 44 }
    ];
    const updated = { id: 2, first_name: "Ben", last_name: "Stork", age: 45 };
    const expected = [
      { id: 1, first_name: "Lara", last_name: "Croft", age: 40 },
      { id: 2, first_name: "Ben", last_name: "Stork", age: 45 }
    ];
    expect(mergeUpdatedRecord(prev, updated)).toStrictEqual(expected);
  })

  test('diff compares two objects and returns only what changed', () => {
    const oldObject = { first_name: "Laura", last_name: "Croft", age: 40 };
    const newObject = { first_name: "Lara", last_name: "Croft", age: 40 };
    expect(diff(oldObject, newObject)).toStrictEqual({ first_name: "Lara" });
  });

  test('updateCatAge increases or decreases age', () => {
    expect(updateCatAge({ num: 10, category: 'F30-39', method: '+' })).toBe('F40-49');
  });
});
