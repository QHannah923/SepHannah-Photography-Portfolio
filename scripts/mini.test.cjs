const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { createRequire } = require("node:module");
const calendar = require("../miniprogram/utils/calendar");
const catalog = require("../miniprogram/utils/catalog");
const selection = require("../miniprogram/utils/selection");
function page(file, overrides = {}, storage = new Map()) {
  const abs = path.resolve("miniprogram/pages", file);
  let definition;
  const api = {
    monthKey: () => "2026-09",
    timeLabel: (iso) =>
      new Date(Date.parse(iso) + 36000000)
        .toISOString()
        .slice(0, 16)
        .replace("T", " "),
    ...overrides,
  };
  const wx = {
    getStorageSync: (key) => storage.get(key),
    setStorageSync: (key, value) => storage.set(key, value),
    removeStorageSync: (key) => storage.delete(key),
  };
  const app = { globalData: { selection: {} } };
  wx.switchTab = (options) => {
    app.navigation = options.url;
  };
  const local = createRequire(abs);
  const selectionMock = {
    ...selection,
    read: () => [],
    write: (ids) => selection.clean(ids),
  };
  vm.runInNewContext(fs.readFileSync(abs, "utf8"), {
    require: (name) =>
      name === "../../utils/api"
        ? api
        : name === "../../utils/selection"
          ? selectionMock
          : local(name),
    Page: (d) => (definition = d),
    wx,
    getApp: () => app,
    console,
    Date,
  });
  return {
    ...definition,
    _app: app,
    data: JSON.parse(JSON.stringify(definition.data)),
    setData(patch) {
      Object.assign(this.data, patch);
    },
  };
}
test("Brisbane month groups UTC boundary slots on the correct local date", () => {
  const slots = [
    {
      id: "next",
      starts_at: "2026-09-30T15:00:00Z",
      ends_at: "2026-09-30T16:00:00Z",
    },
    {
      id: "past",
      starts_at: "2026-08-30T12:00:00Z",
      ends_at: "2026-08-30T13:00:00Z",
    },
  ];
  const grid = calendar.buildMonth(
    "2026-10",
    slots,
    Date.parse("2026-09-01T00:00:00Z"),
  );
  assert.equal(grid.cells.find((c) => c.key === "2026-10-01").available, 1);
  assert.equal(grid.slots.length, 1);
  assert.equal(calendar.shiftMonth("2026-12", 1), "2027-01");
});
test("Leap year and Monday-first calendar without implying unlisted days are available", () => {
  const cells = calendar.buildMonth(
    "2028-02",
    [],
    Date.parse("2028-01-01"),
  ).cells;
  assert.equal(cells.filter((c) => !c.blank).length, 29);
  assert.equal(cells[0].blank, true);
  assert.ok(cells.filter((c) => !c.blank).every((c) => c.disabled));
});
test("Photo references accept only known unique works, at most six, and use studio URLs", () => {
  const ids = catalog.photos.map((p) => p.id);
  assert.equal(selection.clean([...ids, ...ids, "unknown"]).length, 6);
  const message = selection.message("我的想法", [ids[0], "unknown"]);
  assert.ok(message.includes(catalog.photos[0].src));
  assert.ok(!message.includes("unknown"));
});
test("Older same-month availability response cannot overwrite a newer refresh", async () => {
  const pending = [];
  const p = page("booking/booking.js", {
    request: () => new Promise((resolve) => pending.push(resolve)),
  });
  const first = p.loadDates(),
    second = p.loadDates();
  pending[1]({ slots: [] });
  await second;
  pending[0]({
    slots: [
      {
        id: "stale",
        starts_at: "2026-09-30T01:00:00Z",
        ends_at: "2026-09-30T02:00:00Z",
      },
    ],
  });
  await first;
  assert.equal(p.data.slots.length, 0);
  assert.equal(p.data.loading, false);
});
test("A removed slot is cleared after refresh and cannot be submitted silently", async () => {
  const p = page("booking/booking.js", {
    request: async () => ({ slots: [] }),
  });
  p.data.slotId = "removed";
  p.data.slotLabel = "old time";
  await p.loadDates();
  assert.equal(p.data.slotId, "");
  assert.ok(p.data.error.includes("不可用"));
});
test("Lost submit response retries same request ID, suppresses double taps, and sends chosen works", async () => {
  const storage = new Map();
  let calls = 0,
    uuids = 0,
    payload;
  const p = page(
    "booking/booking.js",
    {
      uuid: async () => {
        uuids++;
        return "a3c07361-a174-4b88-b326-27693b6ac779";
      },
      remember: (token) => storage.set("saved", token),
      request: async (url, method, body) => {
        calls++;
        payload = body;
        if (calls === 1) throw Error("network");
        return { trackingToken: "a".repeat(64) };
      },
    },
    storage,
  );
  p.onLoad();
  Object.assign(p.data, {
    name: "客户",
    wechat: "test-contact",
    consent: true,
    references: selection.describe(["wedding2"]),
    message: "喜欢自然光",
  });
  const pending = p.submit();
  await p.submit();
  await pending;
  assert.equal(calls, 1);
  const id = payload.requestId;
  await p.submit();
  assert.equal(calls, 2);
  assert.equal(payload.requestId, id);
  assert.equal(uuids, 1);
  assert.equal(payload.source, "miniprogram");
  assert.ok(payload.message.includes("/images/wedding2.jpg"));
  assert.equal(p.data.success, true);
  assert.equal(storage.has("studioDraft"), false);
});
test("Storage failure stops submission so a lost request cannot create duplicates", async () => {
  let calls = 0;
  const storage = {
    get: () => undefined,
    set: () => {
      throw Error("full");
    },
  };
  const p = page(
    "booking/booking.js",
    {
      uuid: async () => "a3c07361-a174-4b88-b326-27693b6ac779",
      request: async () => {
        calls++;
      },
    },
    storage,
  );
  p.onLoad();
  Object.assign(p.data, { name: "客户", wechat: "test", consent: true });
  await p.submit();
  assert.equal(calls, 0);
  assert.equal(p.data.sending, false);
  assert.ok(p.data.error.includes("草稿"));
});
test("Reference-only booking does not change a previously chosen session to portraits", () => {
  const p = page("gallery/gallery.js");
  p.setData({ collection: "all", style: "all" });
  p.book();
  assert.equal(p._app.globalData.selection.session, undefined);
  assert.equal(p._app.navigation, "/pages/booking/booking");
  p.setData({ collection: "graduation", style: "film" });
  p.book();
  assert.equal(p._app.globalData.selection.session, "graduation");
  assert.equal(p._app.globalData.selection.style, "film");
});
