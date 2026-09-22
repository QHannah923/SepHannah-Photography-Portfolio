const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve("miniprogram");
const config = JSON.parse(fs.readFileSync(path.join(root, "app.json")));
let handlers = 0;
for (const route of config.pages) {
  for (const ext of ["js", "json", "wxml"])
    assert.ok(
      fs.existsSync(path.join(root, route + "." + ext)),
      route + "." + ext,
    );
  JSON.parse(fs.readFileSync(path.join(root, route + ".json")));
  const source = fs.readFileSync(path.join(root, route + ".js"), "utf8");
  new vm.Script(source, { filename: route });
  const markup = fs.readFileSync(path.join(root, route + ".wxml"), "utf8");
  for (const match of markup.matchAll(
    /(?:bind|catch)(?:tap|input|change|submit|error|load)="([A-Za-z]\w*)"/g,
  )) {
    assert.ok(
      new RegExp("\\b" + match[1] + "\\s*\\(").test(source),
      "Missing handler " + route + ":" + match[1],
    );
    handlers++;
  }
  assert.ok(
    !/<br\s*\//.test(markup),
    "Use native WXML text/view instead of HTML br",
  );
  assert.ok(
    !/onShareAppMessage/.test(source) || !route.includes("requests"),
    "Private requests must not be shared",
  );
}
for (const tab of config.tabBar.list)
  assert.ok(config.pages.includes(tab.pagePath));
for (const file of fs
  .readdirSync(path.join(root, "utils"))
  .filter((f) => f.endsWith(".js")))
  new vm.Script(fs.readFileSync(path.join(root, "utils", file), "utf8"), {
    filename: file,
  });
const project = JSON.parse(
  fs.readFileSync(path.join(root, "project.config.json")),
);
assert.equal(project.setting.urlCheck, true);
console.log(
  `PASS: ${config.pages.length} page bundles, ${handlers} event bindings, JS/JSON syntax and domain checking enabled.`,
);
console.log(
  project.appid === "touristappid"
    ? "RELEASE BLOCKER: real AppID, approved domains and WeChat device verification still required."
    : "AppID present: still verify account ownership, domains, privacy and device behaviour before release.",
);
console.log("This source check is not a WeChat compiler or device test.");
