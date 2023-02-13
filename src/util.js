const fs = require("fs");
const prettier = require("prettier");
const { parse } = require("@babel/parser");

const recursiveReadDir = (path, match) => {
    const result = [];
    const pathStack = [path];

    recurse = () => {
        for (const file of fs.readdirSync(pathStack.join("/"))) {
            if (file.includes(".") == false) {
                pathStack.push(file);
                recurse();
                pathStack.pop();
            } else if (file.match(match)) result.push(pathStack.join("/") + "/" + file);
        }
    };

    recurse();

    return result;
};

function format(source) {
    return prettier.format(source, {
        parser: "babel",
        tabWidth: 4,
        printWidth: 130,
        arrowParens: "always",
        semi: false,
        filepath: "./src/on.js",
    });
}

function createNode(scriptString, line) {
    const node = parse(scriptString, { sourceType: "module", plugins: ["jsx"] }).program.body[0];

    node.loc.start.line = line;
    node.loc.end.line = line;

    return node;
}

function createKeyContainer(line, value, extra) {
    const isValidation = value.endsWith("_v");

    if (isValidation) value = value.replace("_v", "");

    const nodes = createNode(
        `<Text>${extra.prep}{strings.${isValidation ? "validation." : ""}${value}${
            extra.required ? "+ ' ' + strings.required}" : "}"
        }${extra.app}</Text>`,
        line
    ).expression.children;

    return nodes;
}

function createKeyContainerForLogicalExp(i18Object, expression) {
    return parse(`<Text>{${expression.left.name} ${expression.operator} strings.${i18Object[expression.right.value]}}</Text>`, {
        plugins: ["jsx"],
    }).program.body[0].expression.children;
}

const reviseText = function (val) {
    try {
        const extra = { prep: "", app: "", required: false };

        if (val === undefined) return { result: "", extra };

        let value = val.toString().trim();

        if (value.includes("الزامی")) {
            extra.required = true;
            value = value.replace("(الزامی)", "").trim();
        }

        const strrr = value.split("").reduce((pv, cv, ind) => {
            if (cv === " " || persianAlphabetCodes.includes(cv.charCodeAt(0))) {
                pv += cv;
            } else if (ind > extra.prep.length) extra.app += cv;
            else extra.prep += cv;

            return pv;
        }, "");

        return { result: strrr?.trim() ?? "", extra };
    } catch (err) {
        console.log(err);
    }
};

const persianAlphabetCodes = [
    1570, 1575, 1576, 1662, 1578, 1579, 1580, 1670, 1581, 1582, 1583, 1584, 1585, 1586, 1688, 1587, 1588, 1589, 1590, 1591, 1592,
    1593, 1594, 1601, 1602, 1705, 1711, 1604, 1605, 1606, 1608, 1607, 1740,
];

module.exports = {
    recursiveReadDir,
    format,
    createNode,
    createKeyContainer,
    createKeyContainerForLogicalExp,
    reviseText,
    persianAlphabetCodes,
};
