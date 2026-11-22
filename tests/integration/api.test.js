// Integration tests: real HTTP requests to the PHP API, which talks to a real MySQL database.
// Needs the PHP server running first, e.g.  php -S 127.0.0.1:8000 -t api
const BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

// POST a JSON body and parse the reply. If PHP prints an error instead of JSON,
// fail with the raw response so the CI log shows what went wrong.
async function postJson(endpoint, payload) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`${endpoint} did not return valid JSON. Raw response:\n${text}`);
  }
  return { res, body };
}

describe("Login.php", () => {
  test("valid login returns 200, JSON, and the user's info", async () => {
    const { res, body } = await postJson("Login.php", {
      login: "testuser",
      password: "testpass",
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/application\/json/);
    expect(body).toEqual({
      id: expect.any(Number),
      firstName: "Test",
      lastName: "User",
      error: "",
    });
    expect(body.id).toBeGreaterThan(0);
  });

  test("wrong password returns id 0 and an error message", async () => {
    const { body } = await postJson("Login.php", {
      login: "testuser",
      password: "wrong",
    });

    expect(body.id).toBe(0);
    expect(body.error).toBe("No Records Found");
  });
});

describe("SearchColors.php and AddColor.php", () => {
  let userId;

  beforeAll(async () => {
    const { body } = await postJson("Login.php", {
      login: "testuser",
      password: "testpass",
    });
    userId = body.id;
  });

  test("search returns a results array of strings", async () => {
    const { res, body } = await postJson("SearchColors.php", { search: "Blue", userId });

    expect(res.status).toBe(200);
    expect(body.error).toBe("");
    expect(Array.isArray(body.results)).toBe(true);
    body.results.forEach((name) => expect(typeof name).toBe("string"));
    expect(body.results).toEqual(expect.arrayContaining(["Blue", "Light Blue"]));
  });

  test("search with no matches returns an error message", async () => {
    const { body } = await postJson("SearchColors.php", { search: "zzz-no-match", userId });

    expect(body.error).toBe("No Records Found");
  });

  test("a color added with AddColor.php can then be found by search", async () => {
    const newColor = `CI Color ${Date.now()}`;

    const added = await postJson("AddColor.php", { color: newColor, userId });
    expect(added.res.status).toBe(200);
    expect(added.body).toEqual({ error: "" });

    const found = await postJson("SearchColors.php", { search: newColor, userId });
    expect(found.body.results).toContain(newColor);
  });
});
