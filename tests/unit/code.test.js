// Front-end unit tests: pure functions from public/js/code.js, no browser or server needed.
const {
  parseCookie,
  isValidColorName,
  formatColorList,
} = require("../../public/js/code.js");

describe("parseCookie", () => {
  test("reads first name, last name and user id", () => {
    expect(parseCookie("firstName=Ann,lastName=Lee,userId=7")).toEqual({
      firstName: "Ann",
      lastName: "Lee",
      userId: 7,
    });
  });

  test("returns userId -1 when the cookie is empty (logged out)", () => {
    expect(parseCookie("").userId).toBe(-1);
  });

  test("returns userId -1 when userId is not a number", () => {
    expect(parseCookie("firstName=Ann,userId=abc").userId).toBe(-1);
  });
});

describe("isValidColorName", () => {
  test.each(["Blue", "  Sea Green  ", "a".repeat(50)])("accepts %p", (name) => {
    expect(isValidColorName(name)).toBe(true);
  });

  test.each(["", "   ", "a".repeat(51), null, undefined, 42])("rejects %p", (name) => {
    expect(isValidColorName(name)).toBe(false);
  });
});

describe("formatColorList", () => {
  test("joins colors with line breaks", () => {
    expect(formatColorList(["Red", "Blue"])).toBe("Red<br />\r\nBlue");
  });

  test("returns an empty string for no results", () => {
    expect(formatColorList([])).toBe("");
  });
});
