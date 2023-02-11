const parser = require("@babel/parser");
const generator = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const fs = require("fs");
const { format, createNode, recursiveReadDir, createKeyContainer, createKeyContainerForLogicalExp, persianAlphabetCodes, reviseText } = require("./util");

function translateDirector(path, i18Object) {
    const files = recursiveReadDir(path, /.js$/);

    files.forEach((file) => {
        const ast = createTree(file);

        const hasReplacedAny = replaceTexts(ast, i18Object);

        if (hasReplacedAny == false) return;

        inject(ast);

        astToCode(ast);
    });
}

function createTree(path) {
    return parser.parse(fs.readFileSync(path, { encoding: "utf-8" }), {
        plugins: ["jsx"],
        sourceType: "module",
    });
}

function replaceTexts(ast, i18Object) {
    let any = false;

    traverse(ast, {
        JSXElement: (item) => {
            if (item.node.openingElement.name.name !== "Text") return;

            let ModifiedNodeArr = [];
            let repalcedNodesCount = 0;
            item.node.children.forEach((child, ind) => {
                if (child.type === "JSXText") {
                    const { result, extra } = reviseText(child.value);
                    if (i18Object.hasOwnProperty(result)) {
                        ModifiedNodeArr = ModifiedNodeArr.concat(createKeyContainer(child.loc.start.line, i18Object[result], extra));
                        repalcedNodesCount++;
                    } else ModifiedNodeArr.push(child);
                }

                if (child.type === "JSXExpressionContainer") {
                    if (child.expression.type === "StringLiteral") {
                        const { result, extra } = reviseText(child.expression.value);
                        if (i18Object.hasOwnProperty(result)) {
                            ModifiedNodeArr = ModifiedNodeArr.concat(createKeyContainer(child.loc.start.line, i18Object[result], extra));
                            repalcedNodesCount++;
                        } else ModifiedNodeArr.push(child);
                    }
                    if (child.expression.type === "LogicalExpression" && child.expression.operator.match(/^\?\?$|^\&\&$/)) {
                        if (i18Object.hasOwnProperty(child.expression.right.value)) {
                            ModifiedNodeArr = ModifiedNodeArr.concat(createKeyContainerForLogicalExp(i18Object, child.expression));
                            repalcedNodesCount++;
                        } else ModifiedNodeArr.push(child);
                    }
                }
            });

            if (repalcedNodesCount > 0) any = true;

            item.node.children = ModifiedNodeArr;
        },
        JSXAttribute: (item) => {
            if (item.node.value.type === "StringLiteral") {
                const { result, extra } = reviseText(item.node.value.value);
                if (i18Object.hasOwnProperty(result)) {
                    item.node.value = createKeyContainer(item.node.loc.start.line, i18Object[result], extra)[0];
                    any = true;
                }
            }
            if (item.node.value.type === "JSXExpressionContainer") {
                const { result, extra } = reviseText(item.node.value.expression.value);
                if (i18Object.hasOwnProperty(result)) {
                    item.node.value = createKeyContainer(item.node.loc.start.line, i18Object[result], extra)[0];
                    any = true;
                }
            }
        },
    });

    return any;
}

function inject(ast) {
    traverse(ast, {
        Program: (item) => {
            let i = 0;

            while (item.node.body[i].type === "ImportDeclaration") {
                lastImportDec = item.node.body[i];
                i++;
            }

            insertAt = lastImportDec.loc.end.line;

            const importHookNode = createNode("import { useLocalized } from 'react'", insertAt);

            item.node.body.splice(insertAt, 0, importHookNode);

            const exportDefaultDeclarationName = item.node.body.find((x) => x.type === "ExportDefaultDeclaration").declaration.name;

            const mainFunctionNode = item.node.body.find((x) => {
                if (x.type !== "VariableDeclaration") return false;

                const declaration = x.declarations[0];

                if (declaration === null) return false;

                if (declaration.id.name === exportDefaultDeclarationName) return true;

                return false;
            });

            const mainFunctionBlock = mainFunctionNode.declarations[0].init.body;

            const useHookNode = createNode("const { strings } = useLocalized()", mainFunctionBlock.loc.start.line + 1);

            mainFunctionBlock.body.splice(0, 0, useHookNode);
        },
    });
}

function astToCode(ast, path) {
    const { code } = generator(ast, {
        retainLines: true,
        retainFunctionParens: true,
    });

    fs.writeFileSync("./src/out.js", format(code), { encoding: "utf-8" });
}

module.exports = {
    default: translateDirector,
}