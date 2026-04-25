const fs = require("fs");
const path = require("path");

const patchedPostcssVersion = "8.5.10";
const nextPackagePath = path.join(__dirname, "..", "node_modules", "next", "package.json");

if (!fs.existsSync(nextPackagePath)) {
  process.exit(0);
}

const nextPackage = JSON.parse(fs.readFileSync(nextPackagePath, "utf8"));

if (nextPackage.dependencies?.postcss === patchedPostcssVersion) {
  process.exit(0);
}

if (nextPackage.dependencies?.postcss !== "8.4.31") {
  throw new Error(
    `Unexpected next postcss dependency: ${nextPackage.dependencies?.postcss ?? "missing"}`
  );
}

// Next 15/16 currently pins a vulnerable PostCSS exact version. Keep the
// installed manifest aligned with the Yarn security resolution until upstream
// Next publishes a patched dependency.
nextPackage.dependencies.postcss = patchedPostcssVersion;
fs.writeFileSync(nextPackagePath, `${JSON.stringify(nextPackage, null, 2)}\n`);
