// To get estree.d.ts open Package Manager Console and type:
//    Install-Package estree.TypeScript.DefinitelyTyped
/// <reference path="../../../packages/estree.TypeScript.DefinitelyTyped.0.0.1/Content/Scripts/typings/estree/estree.d.ts" />

declare module ESTree {
    interface JSXIdentifier extends ESTree.Node {
        name: string;
    }

    interface JSXAttribute extends ESTree.Node {
        name: JSXIdentifier;
        value?: ESTree.Literal | ESTree.JSXExpressionContainer;
    }

    interface JSXOpeningElement extends ESTree.Node {
        name: JSXIdentifier;
        selfClosing: boolean;
        attributes: JSXAttribute[];
    }

    interface JSXClosingElement extends ESTree.Node {
        name: JSXIdentifier;
    }

    interface JSXExpressionContainer extends ESTree.Node {
        expression: ESTree.Expression;
    }

    interface JSXElement extends ESTree.Node {
        openingElement: JSXOpeningElement;
        closingElement: JSXClosingElement;
        children: (JSXExpressionContainer | ESTree.Expression)[];
    }
}
