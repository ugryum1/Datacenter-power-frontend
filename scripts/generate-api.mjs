import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateApi } from "swagger-typescript-api";
import ts from "typescript";

const spec = JSON.parse(
  await readFile(resolve("../datacenter-power-backend/docs/swagger.json"), "utf8"),
);
spec.paths = Object.fromEntries(
  Object.entries(spec.paths).filter(([path]) => path.startsWith("/datacenter-devices")),
);
await generateApi({
  fileName: "DatacenterPowerApi.ts",
  apiClassName: "DatacenterPowerApi",
  output: resolve("src/api"),
  spec,
  httpClientType: "axios",
  enumStyle: "union",
  hooks: {
    onFormatRouteName: (_, name) => name.startsWith("datacenter")
      ? name
      : `datacenter${name[0].toUpperCase()}${name.slice(1)}`,
  },
});
const path = resolve("src/api/DatacenterPowerApi.ts");
const content = await readFile(path, "utf8");
const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
const printer = ts.createPrinter({ removeComments: true });
await writeFile(path, printer.printFile(source));
