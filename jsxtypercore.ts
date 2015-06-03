// Uses esprima-fb to generate syntax tree of supplied JSX file, then traverses
// the syntax tree to generate TypeScript interfaces for props and state.

/// <reference path="Scripts/typings/node/node.d.ts" />

// To get estree.d.ts open Package Manager Console and type:
//    Install-Package estree.TypeScript.DefinitelyTyped
/// <reference path="packages/estree.TypeScript.DefinitelyTyped.0.0.1/Content/Scripts/typings/estree/estree.d.ts" />

/// <reference path="Scripts/typings/estree/jsxtree.d.ts" />

var fs = require('fs'),
    esprima = require('esprima-fb'),
    estraverse = require('estraverse-fb');

// ------------------------------------------------------------------------------------------------
// Find React.createClass() statements.
// ------------------------------------------------------------------------------------------------

function traverseProgram(program: ESTree.Program): void {
    for (var i = 0; i < program.body.length; i++) {
        // Look for statements of the form: var MyClass = React.createClass({ ... });
        if (program.body[i].type === "VariableDeclaration") {
            var statement = <ESTree.VariableDeclaration>program.body[i];
            var declarator = statement.declarations[0];
            if (declarator.init.type == "CallExpression") {
                var callExpression = <ESTree.CallExpression>declarator.init;
                if (calleeIsReactCreateClass(callExpression.callee)) {
                    var id = <ESTree.Identifier>declarator.id;
                    addComponentClass(id.name);
                    traverseCreateClassCallExpression(callExpression);
                }
            }
        }
    }
}

/** Checks whether callee is React.createClass */
function calleeIsReactCreateClass(callee: ESTree.Expression): boolean {
    if (callee.type != "MemberExpression") {
        return false;
    }
    var memberExpression = <ESTree.MemberExpression>callee;
    if (memberExpression.object.type != "Identifier" || memberExpression.property.type != "Identifier") {
        return false;
    }
    var objIdentifier = <ESTree.Identifier>memberExpression.object;
    var propIdentifier = <ESTree.Identifier>memberExpression.property;
    if (objIdentifier.name != "React" || propIdentifier.name != "createClass") {
        return false;
    }
    return true;
}

function traverseCreateClassCallExpression(callExpression: ESTree.CallExpression): void {
    if (callExpression.arguments.length < 1 || callExpression.arguments[0].type != "ObjectExpression") {
        throw constructError(302, "React.createClass() must be passed an object expression.", callExpression.loc);
    }
    var objectExpression = <ESTree.ObjectExpression>callExpression.arguments[0];
    traverse(objectExpression);
    extractCssNames(objectExpression);
}

function extractCssNames(node: ESTree.Node): void {
    estraverse.traverse(node, {
        enter: node => {
            if (node.type === 'JSXElement') {
                var jsxElement = <ESTree.JSXElement>node;
                var attributes = jsxElement.openingElement.attributes;
                for (var i = 0; i < attributes.length; i++) {
                    if (!attributes[i].name) {
                        continue;
                    }
                    var attrName = attributes[i].name.name;
                    if (attrName === 'class') {
                        throw constructError(303, "Use 'className' to specify css class, not 'class'.", attributes[i].name.loc);
                    }
                    else if (attrName === 'className' && attributes[i].value.type === "Literal") {
                        var literal = <ESTree.Literal>attributes[i].value;
                        addCssClassNames(<string>literal.value);
                    }
                }
            }
        }
    });
}

// ------------------------------------------------------------------------------------------------
// Traverse various types of nodes.
// The actual traverse happens in estraverse library. We only eavesdrop on that traverse here.
// ------------------------------------------------------------------------------------------------

function traverse(ast: ESTree.Node): void {
    estraverse.traverse(ast, {
        enter: node => {
            switch (node.type) {
                case 'MemberExpression':
                case 'CallExpression':
                    var memberPath = traverseMemberExpression(node);
                    addMemberPath(memberPath);
                    return estraverse.VisitorOption.Skip;

                case 'VariableDeclaration':
                    traverseVariableDeclaration(node);
                    return estraverse.VisitorOption.Skip;

                case 'FunctionDeclaration':
                case 'FunctionExpression':
                    pushScope();
                    break;
            }
        },
        leave: node => {
            switch (node.type) {
                case 'FunctionDeclaration':
                case 'FunctionExpression':
                    popScope();
                    break;
            }
        }
    });
}

function traverseVariableDeclaration(declaration: ESTree.VariableDeclaration): void {
    for (var i = 0; i < declaration.declarations.length; i++) {
        var declarator = declaration.declarations[i];
        if (declarator.id.type === 'Identifier' && declarator.init &&
            (declarator.init.type === 'MemberExpression' ||
                declarator.init.type === 'CallExpression')) {
            var identifer = <ESTree.Identifier>declarator.id;
            var memberExpression = <ESTree.MemberExpression>declarator.init;
            var memberPath = traverseMemberExpression(memberExpression);
            processVariableDeclaration(identifer, memberPath);
        }
        else if (declarator.init) {
            traverse(declarator.init);
        }
    }
}

function traverseMemberExpression(expression: ESTree.MemberExpression): MemberPath {
    var members: Member[] = [];
    for (var node = <ESTree.Expression>expression; ;) {
        if (node.type === 'MemberExpression') {
            var memberExpression = <ESTree.MemberExpression>node;
            if (memberExpression.computed) {
                traverse(memberExpression.property);
            }
            members.unshift(new Member(memberExpression.property, memberExpression.computed));
            node = memberExpression.object;
        }
        else if (node.type === 'CallExpression') {
            members.unshift(new Member(node));
            var callExpression = <ESTree.CallExpression>node;

            if (callExpression.callee.type === 'FunctionExpression') {
                var functionExpression = <ESTree.FunctionExpression>callExpression.callee;
                pushScope();
                traverse(functionExpression.body);
                popScope();
            }

            for (var i = 0; i < callExpression.arguments.length; i++) {
                traverse(callExpression.arguments[i]);
            }
            node = callExpression.callee;
        }
        else {
            members.unshift(new Member(node));
            break;
        }
    }
    return new MemberPath(members);
}

// ------------------------------------------------------------------------------------------------

/** Represents a node in a member expression path */
class Member {
    constructor(public node: ESTree.Expression, public isComputed = false) {
    }

    public isArrayIndexer(): boolean {
        if (this.isComputed) {
            return !isLiteralString(this.node);
        }
        else {
            return false;
        }
    }
}

/** Represents a member expression path */
class MemberPath {
    constructor(public path: Member[]) {
    }

    /** This is very limited, but works for the common case of copying an array element to a temp variable. */
    public resolvePath(): Member[] {
        if (this.path.length && this.path[0].node.type == 'Identifier') {
            var identifier = <ESTree.Identifier>this.path[0].node;
            var memberPath = resolve(identifier.name);
            if (memberPath) {
                var p = this.path.slice(1);
                return memberPath.path.concat(p);
            }
        }
        return this.path;
    }

    /** (For debugging) Reconstructs source code for the member path. */
    public debug_getCode(): string {
        var path = this.resolvePath();

        var output: string[] = [];
        for (var i = 0; i < path.length; i++) {
            var node = path[i].node;
            if (path[i].isComputed) {
                if (path[i].isArrayIndexer()) {
                    output.push('[]');
                }
                else {
                    break;
                }
            }
            else {
                switch (node.type) {
                    case 'Identifier':
                        var identifier = <ESTree.Identifier>node;
                        output.push(identifier.name);
                        break;
                    case 'ThisExpression':
                        output.push('this');
                        break;
                    case 'CallExpression':
                        output.push('()');
                        break;
                    default:
                        output.push('~' + node.type + '~');
                        break;
                }
            }
            if (i < path.length - 1) {
                var nextMember = path[i + 1];
                if (nextMember.node.type !== 'CallExpression' && !nextMember.isComputed) {
                    output.push('.');
                }
            }
        }
        return output.join('');
    }

    public addToFieldDict(propsDict: Field, stateDict: Field): void {
        var path = this.resolvePath();

        if (path.length >= 3 &&
            path[0].node.type === 'ThisExpression' &&
            path[1].node.type === 'Identifier') {

            var identifier = <ESTree.Identifier>path[1].node;
            var d: Field;
            if (identifier.name === 'props')
                d = propsDict;
            else if (identifier.name === 'state')
                d = stateDict;
            else
                return;

            var key: string;
            var field: Field;
            for (var i = 2; i < path.length; i++) {
                var node = path[i].node;
                if (path[i].isComputed) {
                    if (path[i].isArrayIndexer()) {
                        key = 'Indexer';
                        field = { "nodeType": nodeTypes.Indexer };
                    }
                    else {
                        break;
                    }
                }
                else {
                    switch (node.type) {
                        case 'Identifier':
                            var identifier = <ESTree.Identifier>node;
                            key = '.' + identifier.name;
                            field = { "nodeType": nodeTypes.Identifier };
                            break;
                        case 'CallExpression':
                            key = 'CallExpression';
                            field = { "nodeType": nodeTypes.CallExpression };
                            break;
                    }
                }
                d = d[key] || (d[key] = field);
            }
        }
    }
}

function isLiteralString(node: ESTree.Expression): boolean {
    if (node.type === 'Literal') {
        var literal = <ESTree.Literal>node;
        return (typeof literal.value === 'string');
    }
    return false;
}

var nodeTypes = {
    Identifier: 'Identifier',
    CallExpression: 'CallExpression',
    Indexer: 'Indexer'
};

interface Field {
    nodeType?: string;
    identifier?: string;
}

interface FieldDict { [fieldName: string]: FieldDict; };

function constructError(errorCode: number, errorMessage: string, loc?: ESTree.SourceLocation): Error {
    if (loc) {
        return new Error(`Error ${errorCode} near line ${loc.start.line}, column ${loc.start.column}: ${errorMessage}`);
    }
    else {
        return new Error(`Error ${errorCode}: ${errorMessage}`);
    }
}

// ------------------------------------------------------------------------------------------------
// Simple scope implementation 
// Intended to handle the common case of copying an array element to a temp variable.
// ------------------------------------------------------------------------------------------------

interface Scope { [symbol: string]: MemberPath };

var scopeChain: Scope[] = [{}];

function pushScope(): void {
    scopeChain.push({});
}

function popScope(): void {
    scopeChain.pop();
}

function addToCurrentScope(name: string, value: MemberPath): void {
    var scope = scopeChain[scopeChain.length - 1];
    scope[name] = value;
}

function resolve(name: string): MemberPath {
    for (var i = scopeChain.length - 1; i >= 0; i--) {
        if (name in scopeChain[i]) {
            return scopeChain[i][name];
        }
    }
    return null;
}

function debug_printScopeChain(): void {
    console.log();
    for (var i = 0; i < scopeChain.length; i++) {
        var scope = scopeChain[i];
        console.log("scope");
        console.log("=====");
        for (var symbol in scope) {
            console.log(symbol + " = " + scope[symbol].debug_getCode());
        }
        console.log();
    }
}

// ------------------------------------------------------------------------------------------------
// TypeScript generation
// ------------------------------------------------------------------------------------------------

enum FieldType { Object, Scalar, FunctionCall };

interface ComponentClass {
    className: string;
    propsDict: FieldDict;
    stateDict: FieldDict;
    cssClassNames: { [cssClass: string]: string };
}

var componentClasses: ComponentClass[] = [];

function addComponentClass(className: string): void {
    componentClasses.push({
        className: className,
        propsDict: {},
        stateDict: {},
        cssClassNames: {}
    });
}

function addMemberPath(memberPath: MemberPath): void {
    var c = componentClasses[componentClasses.length - 1];
    memberPath.addToFieldDict(c.propsDict, c.stateDict);
}

function processVariableDeclaration(identifier: ESTree.Identifier, memberPath: MemberPath) {
    addToCurrentScope(identifier.name, memberPath);
    var c = componentClasses[componentClasses.length - 1];
    memberPath.addToFieldDict(c.propsDict, c.stateDict);
}

function addCssClassNames(cssClassNames: string): void {
    var c = componentClasses[componentClasses.length - 1];
    var names = cssClassNames.split(' ');
    for (var i = 0; i < names.length; i++) {
        c.cssClassNames[names[i]] = '';
    }
}

function getFieldType(dict: any): FieldType {
    if (dict.CallExpression) {
        return FieldType.FunctionCall;
    }
    var fieldCount = 0;
    for (var key in dict) {
        if (key[0] === '.') {
            fieldCount++;
        }
    }
    return fieldCount > 0 ? FieldType.Object : FieldType.Scalar;
}

function findArrayIndexerKey(dict: any): string {
    for (var key in dict) {
        var field = <Field>dict[key];
        if (field.nodeType === nodeTypes.Indexer) {
            return key;
        }
    }
    return null;
}

function constructCssNameForTS(cssClassName: string): string {
    var parts = cssClassName.split('-');
    for (var i = 1; i < parts.length; i++) {
        parts[i] = parts[i].substr(0, 1).toUpperCase() + parts[i].substr(1);
    }
    return parts.join('');
}

function outputInterfaces(output: string[], component: ComponentClass): void {
    // Uncomment next two lines for debugging.
    // console.log('props = ' + JSON.stringify(component.propsDict));
    // console.log('state = ' + JSON.stringify(component.stateDict));
    output.push(`interface ${component.className}Props {`);
    outputFields(output, component.propsDict, 1);
    output.push(`}`);
    output.push('');
    output.push(`interface ${component.className}State {`);
    outputFields(output, component.stateDict, 1);
    output.push(`}`);
    output.push('');
    output.push(`declare var ${component.className}: React.ComponentClass<${component.className}Props>;`);
    output.push('');

    output.push(`var ${component.className}Selectors = {`);
    var cssClassNames = Object.keys(component.cssClassNames);
    for (var i = 0; i < cssClassNames.length; i++) {
        var cssName = cssClassNames[i];
        var tsName = constructCssNameForTS(cssName);
        var sep = (i < cssClassNames.length - 1) ? ',' : '';
        output.push(`    ${tsName}: '.${cssName}'${sep}`);
    }
    output.push('};');

    output.push('');
}

function outputFields(output: string[], dict: FieldDict, indentationLevel: number): void {
    for (var key in dict) {
        if (key[0] !== '.') {
            continue;
        }
        var indent = '';
        for (var i = 0; i < indentationLevel; i++) {
            indent = indent + '    ';
        }
        var field = <Field>dict[key];
        var name = key.substr(1);
        var arrayIndexerKey = findArrayIndexerKey(dict[key]);
        var arrayNotation = arrayIndexerKey ? '[]' : '';
        var fieldsDict = dict[key];
        if (arrayIndexerKey) {
            fieldsDict = fieldsDict[arrayIndexerKey];
        }
        var fieldType = getFieldType(fieldsDict);
        if (fieldType === FieldType.Object) {
            output.push(`${indent}${name}: {`);
            outputFields(output, fieldsDict, indentationLevel + 1);
            output.push(`${indent}}${arrayNotation};`);
        }
        else if (fieldType === FieldType.FunctionCall) {
            var returnType = getFunctionReturnType(fieldsDict['CallExpression']);
            output.push(`${indent}${name}: { (...args: any[]): ${returnType} }${arrayNotation};`);
        }
        else if (fieldType === FieldType.Scalar) {
            output.push(`${indent}${name}: any${arrayNotation};`);
        }
    }
}

function getFunctionReturnType(dict: FieldDict): string {
    var arrayNotation = '';
    var arrayIndexerKey = findArrayIndexerKey(dict);
    if (arrayIndexerKey) {
        dict = dict[arrayIndexerKey];
        arrayNotation = '[]';
    }

    var returnType = getFieldType(dict);
    if (returnType === FieldType.Scalar) {
        return `any${arrayNotation}`;
    }
    else if (returnType === FieldType.FunctionCall) {
        return `{ (...args: any[]): any }${arrayNotation}`;
    }
    else {
        var output: string[] = [];
        output.push('{');
        outputFields(output, dict, -1000);
        output.push(`}${arrayNotation}`);
        return output.join(' ');
    }
}

function generateTypeScript(jsxText: string, callback: (err: Error, tsText: string) => void): void {
    try {
        var program = esprima.parse(jsxText, { loc: true });
    }
    catch (ex) {
        callback(new Error(`parser error: ${ex.message}`), null);
        return;
    }
    try {
        traverseProgram(program);
    }
    catch (ex) {
        callback(ex, null);
        return;
    }

    var output: string[] = [];
    output.push('// This file was automatically generated by jsxtyper. Do not modify by hand!');
    output.push('');
    var count = 0;
    for (var i = 0; i < componentClasses.length; i++) {
        if (componentClasses[i].className) {
            outputInterfaces(output, componentClasses[i]);
            count++;
        }
    }
    if (!count) {
        var messages = <string[]>[];
        messages.push("Did not find any valid React components.");
        messages.push("Only class definitions in the following format are recognized: ");
        messages.push("   var MyClass = React.createClass({ ... });");
        messages.push("");
        callback(new Error(messages.join('\n')), null);
    }
    else {
        callback(null, output.join('\n'));
    }
}

module.exports.generateTypeScript = generateTypeScript;
