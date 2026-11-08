import test from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/api.js";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("1. GET request tra ve du lieu JSON thanh cong", async () => {
  globalThis.fetch = async (url, options) => {
    assert.match(url, /\/sections$/);
    assert.equal(options.method, "GET");
    return {
      status: 200,
      ok: true,
      text: async () => JSON.stringify([{ class_id: "WEB-01", remaining: 1 }]),
    };
  };

  const data = await api("/sections");
  assert.deepEqual(data, [{ class_id: "WEB-01", remaining: 1 }]);
});

test("2. POST request gui dung header va body JSON", async () => {
  globalThis.fetch = async (url, options) => {
    assert.match(url, /\/enrollments$/);
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.equal(
      options.body,
      JSON.stringify({ student_id: "22000004", class_section_id: "WEB-01" }),
    );
    return {
      status: 201,
      ok: true,
      text: async () => JSON.stringify({ message: "Created" }),
    };
  };

  const data = await api("/enrollments", {
    method: "POST",
    body: { student_id: "22000004", class_section_id: "WEB-01" },
  });
  assert.deepEqual(data, { message: "Created" });
});

test("3. DELETE thanh cong tra ve HTTP 204 va ket qua null", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(options.method, "DELETE");
    return {
      status: 204,
      ok: true,
    };
  };

  const data = await api("/enrollments/22000004/WEB-01", { method: "DELETE" });
  assert.equal(data, null);
});

test("4. HTTP loi (404/409) voi detail chuoi nem error dung status va message", async () => {
  globalThis.fetch = async () => ({
    status: 409,
    ok: false,
    text: async () => JSON.stringify({ detail: "Lop hoc phan da het cho" }),
  });

  await assert.rejects(
    async () => api("/enrollments", { method: "POST" }),
    (err) => {
      assert.equal(err.status, 409);
      assert.match(err.message, /HTTP 409: Lop hoc phan da het cho/);
      return true;
    },
  );
});

test("5. HTTP 422 voi detail mang cac loi duoc ghep thanh chuoi", async () => {
  globalThis.fetch = async () => ({
    status: 422,
    ok: false,
    text: async () =>
      JSON.stringify({
        detail: [{ msg: "field required" }, { msg: "invalid length" }],
      }),
  });

  await assert.rejects(
    async () => api("/enrollments", { method: "POST" }),
    (err) => {
      assert.equal(err.status, 422);
      assert.match(err.message, /HTTP 422: field required; invalid length/);
      return true;
    },
  );
});

test("6. Phan hoi loi khong phai JSON nem error thong bao dinh dang", async () => {
  globalThis.fetch = async () => ({
    status: 502,
    ok: false,
    text: async () => "Bad Gateway HTML",
  });

  await assert.rejects(
    async () => api("/sections"),
    (err) => {
      assert.match(err.message, /HTTP 502: phản hồi không phải JSON\./);
      return true;
    },
  );
});

test("7. Loi mang / khong ket noi duoc backend nem thong bao tieng Viet huong dan CORS/Backend", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };

  await assert.rejects(
    async () => api("/sections"),
    (err) => {
      assert.match(
        err.message,
        /Không nhận được phản hồi API\. Kiểm tra Backend\/CORS/,
      );
      return true;
    },
  );
});

test("8. AbortError duoc re-throw de xu ly cleanup", async () => {
  const abortErr = new Error("The operation was aborted");
  abortErr.name = "AbortError";

  globalThis.fetch = async () => {
    throw abortErr;
  };

  await assert.rejects(
    async () => api("/sections"),
    (err) => {
      assert.equal(err.name, "AbortError");
      return true;
    },
  );
});

