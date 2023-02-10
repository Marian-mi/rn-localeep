const fs = require("fs");
const prettier = require("prettier");
const { parse } = require("@babel/parser")

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
        parser: 'babel',
        tabWidth: 4,
        printWidth: 130,
        arrowParens: "always",
        semi: false,
        filepath: "./src/on.js"
    });
}

function createNode(scriptString, line) {
    const node = parse(scriptString, { sourceType: "module", plugins: ["jsx"] }).program.body[0]
    
    node.loc.start.line = line;
    node.loc.end.line = line;

    return node;
}

function createKeyContainer(line, i18Object, value) {
    return createNode(`<Text>{strings.${i18Object[value]}}</Text>`, line).expression.children[0]
}

module.exports = {
    recursiveReadDir,
    format,
    createNode,
    createKeyContainer,
};
