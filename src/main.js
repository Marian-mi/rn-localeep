const parser = require("@babel/parser");
const generator = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const fs = require("fs");
const { format, createNode, recursiveReadDir, createKeyContainer } = require("./util");

function translate(path, i18Object) {
    translateDirector(path, i18Object);
}

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

            item.node.children.forEach((child, ind) => {
                if (child.type === "JSXText") {
                    if (i18Object.hasOwnProperty(child.value)) {
                        item.node.children[ind] = createKeyContainer(child.loc.start.line, i18Object, child.value);
                        any = true;
                    }
                }
        
                if (child.type === "JSXExpressionContainer") {
                    if (i18Object.hasOwnProperty(child.expression.value)) {
                        if (i18Object.hasOwnProperty(child.expression.value)) {
                            item.node.children[ind] = createKeyContainer(child.loc.start.line, i18Object, child.expression.value);
                            any = true;
                        }
                    }
                }
            });
        },
        JSXAttribute: (item) => {
            if (item.node.value.type === "StringLiteral") {
                if (i18Object.hasOwnProperty(item.node.value.value)) {
                    item.node.value = createKeyContainer(item.node.loc.start.line, i18Object, item.node.value.value);
                    any = true;
                }
            }
            if (item.node.value.type === "JSXExpressionContainer") {
                if (i18Object.hasOwnProperty(item.node.value.expression.value)) {
                    item.node.value = createKeyContainer(item.node.loc.start.line, i18Object, item.node.value.expression.value);
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

const i18Objectt = {
    "افزودن به سبد خرید": "addToCart",
    "محصولات مشابه": "relatedProducts",
    "محصولات مرتبط": "similarProducts"
};

translate("./src/tapo", i18Objectt);
