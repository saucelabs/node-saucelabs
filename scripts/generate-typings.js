const fs = require("fs");
const changeCase = require("change-case");
const CodeGen = require("swagger-typescript-codegen").CodeGen;

const file = "./apis/sauce.json";
const swagger = JSON.parse(fs.readFileSync(file, "UTF-8"));
const tsSourceCode = CodeGen.getTypescriptCode({
    className: "SauceLabs",
    swagger,
    template: {
        class: fs.readFileSync("./scripts/class.mustache", "utf-8"),
        method: fs.readFileSync("./scripts/method.mustache", "utf-8"),
    }
});

const caseChangedSource = tsSourceCode
    .replace(/~~~(.*)~~~/g, (_, group) => changeCase.camel(group));

fs.writeFileSync("build/index.d.ts", caseChangedSource, { encoding: "utf-8" })
