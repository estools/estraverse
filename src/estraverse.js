/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function clone(exports) {
    function deepCopy(obj) {
        const ret = {};
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const val = obj[key];
                if (typeof val === 'object' && val !== null) {
                    ret[key] = deepCopy(val);
                } else {
                    ret[key] = val;
                }
            }
        }
        return ret;
    }

    // based on LLVM libc++ upper_bound / lower_bound
    // MIT License

    function upperBound(array, func) {
        let len = array.length;
        let i = 0;

        while (len) {
            const diff = len >>> 1;
            const current = i + diff;
            if (func(array[current])) {
                len = diff;
            } else {
                i = current + 1;
                len -= diff + 1;
            }
        }
        return i;
    }

    const Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        AssignmentPattern: 'AssignmentPattern',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ChainExpression: 'ChainExpression',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
        ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DebuggerStatement: 'DebuggerStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        EmptyStatement: 'EmptyStatement',
        ExportAllDeclaration: 'ExportAllDeclaration',
        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
        ExportNamedDeclaration: 'ExportNamedDeclaration',
        ExportSpecifier: 'ExportSpecifier',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        ForOfStatement: 'ForOfStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        ImportExpression: 'ImportExpression',
        ImportDeclaration: 'ImportDeclaration',
        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
        ImportSpecifier: 'ImportSpecifier',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MetaProperty: 'MetaProperty',
        MethodDefinition: 'MethodDefinition',
        ModuleSpecifier: 'ModuleSpecifier',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        PrivateIdentifier: 'PrivateIdentifier',
        Program: 'Program',
        Property: 'Property',
        PropertyDefinition: 'PropertyDefinition',
        RestElement: 'RestElement',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SpreadElement: 'SpreadElement',
        Super: 'Super',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        TaggedTemplateExpression: 'TaggedTemplateExpression',
        TemplateElement: 'TemplateElement',
        TemplateLiteral: 'TemplateLiteral',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    const VisitorKeys = {
        AssignmentExpression: ['left', 'right'],
        AssignmentPattern: ['left', 'right'],
        ArrayExpression: ['elements'],
        ArrayPattern: ['elements'],
        ArrowFunctionExpression: ['params', 'body'],
        AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
        BlockStatement: ['body'],
        BinaryExpression: ['left', 'right'],
        BreakStatement: ['label'],
        CallExpression: ['callee', 'arguments'],
        CatchClause: ['param', 'body'],
        ChainExpression: ['expression'],
        ClassBody: ['body'],
        ClassDeclaration: ['id', 'superClass', 'body'],
        ClassExpression: ['id', 'superClass', 'body'],
        ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
        ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
        ConditionalExpression: ['test', 'consequent', 'alternate'],
        ContinueStatement: ['label'],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: ['body', 'test'],
        EmptyStatement: [],
        ExportAllDeclaration: ['source'],
        ExportDefaultDeclaration: ['declaration'],
        ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
        ExportSpecifier: ['exported', 'local'],
        ExpressionStatement: ['expression'],
        ForStatement: ['init', 'test', 'update', 'body'],
        ForInStatement: ['left', 'right', 'body'],
        ForOfStatement: ['left', 'right', 'body'],
        FunctionDeclaration: ['id', 'params', 'body'],
        FunctionExpression: ['id', 'params', 'body'],
        GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
        Identifier: [],
        IfStatement: ['test', 'consequent', 'alternate'],
        ImportExpression: ['source'],
        ImportDeclaration: ['specifiers', 'source'],
        ImportDefaultSpecifier: ['local'],
        ImportNamespaceSpecifier: ['local'],
        ImportSpecifier: ['imported', 'local'],
        Literal: [],
        LabeledStatement: ['label', 'body'],
        LogicalExpression: ['left', 'right'],
        MemberExpression: ['object', 'property'],
        MetaProperty: ['meta', 'property'],
        MethodDefinition: ['key', 'value'],
        ModuleSpecifier: [],
        NewExpression: ['callee', 'arguments'],
        ObjectExpression: ['properties'],
        ObjectPattern: ['properties'],
        PrivateIdentifier: [],
        Program: ['body'],
        Property: ['key', 'value'],
        PropertyDefinition: ['key', 'value'],
        RestElement: [ 'argument' ],
        ReturnStatement: ['argument'],
        SequenceExpression: ['expressions'],
        SpreadElement: ['argument'],
        Super: [],
        SwitchStatement: ['discriminant', 'cases'],
        SwitchCase: ['test', 'consequent'],
        TaggedTemplateExpression: ['tag', 'quasi'],
        TemplateElement: [],
        TemplateLiteral: ['quasis', 'expressions'],
        ThisExpression: [],
        ThrowStatement: ['argument'],
        TryStatement: ['block', 'handler', 'finalizer'],
        UnaryExpression: ['argument'],
        UpdateExpression: ['argument'],
        VariableDeclaration: ['declarations'],
        VariableDeclarator: ['id', 'init'],
        WhileStatement: ['test', 'body'],
        WithStatement: ['object', 'body'],
        YieldExpression: ['argument']
    };

    // unique id (convert to symbols once targeted versions supporting?)
    const BREAK = {};
    const SKIP = {};
    const REMOVE = {};

    const VisitorOption = {
        Break: BREAK,
        Skip: SKIP,
        Remove: REMOVE
    };

    class Reference {
        constructor (parent, key) {
            this.parent = parent;
            this.key = key;
        }

        replace (node) {
            this.parent[this.key] = node;
        }

        remove () {
            if (Array.isArray(this.parent)) {
                this.parent.splice(this.key, 1);
                return true;
            } else {
                this.replace(null);
                return false;
            }
        }
    }

    class Element {
        constructor (node, path, wrap, ref) {
            this.node = node;
            this.path = path;
            this.wrap = wrap;
            this.ref = ref;
        }
    }

    function isNode(node) {
        if (node == null) {
            return false;
        }
        return typeof node === 'object' && typeof node.type === 'string';
    }

    function isProperty(nodeType, key) {
        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
    }

    function candidateExistsInLeaveList(leavelist, candidate) {
        for (let i = leavelist.length - 1; i >= 0; --i) {
            if (leavelist[i].node === candidate) {
                return true;
            }
        }
        return false;
    }

    class Controller {

        // API:
        // return property path array from root to current node
        path () {
            function addToPath(result, path) {
                if (Array.isArray(path)) {
                    for (const p of path) {
                        result.push(p);
                    }
                } else {
                    result.push(path);
                }
            }

            // root node
            if (!this.__current.path) {
                return null;
            }

            // first node is sentinel, second node is root element
            const result = [];
            for (let i = 2, iz = this.__leavelist.length; i < iz; ++i) {
                const element = this.__leavelist[i];
                addToPath(result, element.path);
            }
            addToPath(result, this.__current.path);
            return result;
        }

        // API:
        // return type of current node
        type () {
            const node = this.current();
            return node.type || this.__current.wrap;
        }

        // API:
        // return array of parent elements
        parents () {
            // first node is sentinel
            const result = [];
            for (let i = 1, iz = this.__leavelist.length; i < iz; ++i) {
                result.push(this.__leavelist[i].node);
            }

            return result;
        }

        // API:
        // return current node
        current () {
            return this.__current.node;
        }

        __execute (callback, element) {
            const previous = this.__current;
            this.__current = element;
            this.__state = null;

            let result = undefined;
            if (callback) {
                result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
            }
            this.__current = previous;

            return result;
        }

        // API:
        // notify control skip / break
        notify (flag) {
            this.__state = flag;
        }

        // API:
        // skip child nodes of current node
        skip () {
            this.notify(SKIP);
        }

        // API:
        // break traversals
        break () {
            this.notify(BREAK);
        }

        // API:
        // remove node
        remove () {
            this.notify(REMOVE);
        }

        __initialize (root, visitor) {
            this.visitor = visitor;
            this.root = root;
            this.__worklist = [];
            this.__leavelist = [];
            this.__current = null;
            this.__state = null;
            this.__fallback = null;
            if (visitor.fallback === 'iteration') {
                this.__fallback = Object.keys;
            } else if (typeof visitor.fallback === 'function') {
                this.__fallback = visitor.fallback;
            }

            this.__keys = VisitorKeys;
            if (visitor.keys) {
                this.__keys = Object.assign(Object.create(this.__keys), visitor.keys);
            }
        }

        traverse (root, visitor) {
            this.__initialize(root, visitor);

            const sentinel = {};

            // reference
            const worklist = this.__worklist;
            const leavelist = this.__leavelist;

            // initialize
            worklist.push(new Element(root, null, null, null));
            leavelist.push(new Element(null, null, null, null));

            while (worklist.length) {
                let element = worklist.pop();

                let ret;
                if (element === sentinel) {
                    element = leavelist.pop();

                    ret = this.__execute(visitor.leave, element);

                    if (this.__state === BREAK || ret === BREAK) {
                        return;
                    }
                    continue;
                }

                if (element.node) {

                    ret = this.__execute(visitor.enter, element);

                    if (this.__state === BREAK || ret === BREAK) {
                        return;
                    }

                    worklist.push(sentinel);
                    leavelist.push(element);

                    if (this.__state === SKIP || ret === SKIP) {
                        continue;
                    }

                    const { node } = element;
                    const nodeType = node.type || element.wrap;
                    let candidates = this.__keys[nodeType];
                    if (!candidates) {
                        if (this.__fallback) {
                            candidates = this.__fallback(node);
                        } else {
                            throw new Error(`Unknown node type ${  nodeType  }.`);
                        }
                    }

                    let current = candidates.length;
                    while ((current -= 1) >= 0) {
                        const key = candidates[current];
                        const candidate = node[key];
                        if (!candidate) {
                            continue;
                        }

                        if (Array.isArray(candidate)) {
                            let current2 = candidate.length;
                            while ((current2 -= 1) >= 0) {
                                if (!candidate[current2]) {
                                    continue;
                                }

                                if (candidateExistsInLeaveList(leavelist, candidate[current2])) {
                                    continue;
                                }

                                if (isProperty(nodeType, candidates[current])) {
                                    element = new Element(candidate[current2], [key, current2], 'Property', null);
                                } else if (isNode(candidate[current2])) {
                                    element = new Element(candidate[current2], [key, current2], null, null);
                                } else {
                                    continue;
                                }
                                worklist.push(element);
                            }
                        } else if (isNode(candidate)) {
                            if (candidateExistsInLeaveList(leavelist, candidate)) {
                                continue;
                            }

                            worklist.push(new Element(candidate, key, null, null));
                        }
                    }
                }
            }
        }

        replace (root, visitor) {
            function removeElem(element) {
                let i,
                    key,
                    nextElem,
                    parent;

                if (element.ref.remove()) {
                    // When the reference is an element of an array.
                    ({ key, parent } = element.ref);

                    // If removed from array, then decrease following items' keys.
                    i = worklist.length;
                    while (i--) {
                        nextElem = worklist[i];
                        if (nextElem.ref && nextElem.ref.parent === parent) {
                            if  (nextElem.ref.key < key) {
                                break;
                            }
                            --nextElem.ref.key;
                        }
                    }
                }
            }

            this.__initialize(root, visitor);

            const sentinel = {};

            // reference
            const worklist = this.__worklist;
            const leavelist = this.__leavelist;

            // initialize
            const outer = {
                root
            };
            let element = new Element(root, null, null, new Reference(outer, 'root'));
            worklist.push(element);
            leavelist.push(element);

            while (worklist.length) {
                element = worklist.pop();

                if (element === sentinel) {
                    element = leavelist.pop();

                    const target = this.__execute(visitor.leave, element);

                    // node may be replaced with null,
                    // so distinguish between undefined and null in this place
                    if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                        // replace
                        element.ref.replace(target);
                    }

                    if (this.__state === REMOVE || target === REMOVE) {
                        removeElem(element);
                    }

                    if (this.__state === BREAK || target === BREAK) {
                        return outer.root;
                    }
                    continue;
                }

                const target = this.__execute(visitor.enter, element);

                // node may be replaced with null,
                // so distinguish between undefined and null in this place
                if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                    // replace
                    element.ref.replace(target);
                    element.node = target;
                }

                if (this.__state === REMOVE || target === REMOVE) {
                    removeElem(element);
                    element.node = null;
                }

                if (this.__state === BREAK || target === BREAK) {
                    return outer.root;
                }

                // node may be null
                const { node } = element;
                if (!node) {
                    continue;
                }

                worklist.push(sentinel);
                leavelist.push(element);

                if (this.__state === SKIP || target === SKIP) {
                    continue;
                }

                const nodeType = node.type || element.wrap;
                let candidates = this.__keys[nodeType];
                if (!candidates) {
                    if (this.__fallback) {
                        candidates = this.__fallback(node);
                    } else {
                        throw new Error(`Unknown node type ${  nodeType  }.`);
                    }
                }

                let current = candidates.length;
                while ((current -= 1) >= 0) {
                    const key = candidates[current];
                    const candidate = node[key];
                    if (!candidate) {
                        continue;
                    }

                    if (Array.isArray(candidate)) {
                        let current2 = candidate.length;
                        while ((current2 -= 1) >= 0) {
                            if (!candidate[current2]) {
                                continue;
                            }
                            if (isProperty(nodeType, candidates[current])) {
                                element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
                            } else if (isNode(candidate[current2])) {
                                element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
                            } else {
                                continue;
                            }
                            worklist.push(element);
                        }
                    } else if (isNode(candidate)) {
                        worklist.push(new Element(candidate, key, null, new Reference(node, key)));
                    }
                }
            }

            return outer.root;
        }
    }

    function traverse(root, visitor) {
        const controller = new Controller();
        return controller.traverse(root, visitor);
    }

    function replace(root, visitor) {
        const controller = new Controller();
        return controller.replace(root, visitor);
    }

    function extendCommentRange(comment, tokens) {
        let target;

        target = upperBound(tokens, function search(token) {
            return token.range[0] > comment.range[0];
        });

        comment.extendedRange = [comment.range[0], comment.range[1]];

        if (target !== tokens.length) {
            [comment.extendedRange[1]] = tokens[target].range;
        }

        target -= 1;
        if (target >= 0) {
            [, comment.extendedRange[0]] = tokens[target].range;
        }

        return comment;
    }

    function attachComments(tree, providedComments, tokens) {
        // At first, we should calculate extended comment ranges.
        const comments = [];
        let comment, cursor;

        if (!tree.range) {
            throw new Error('attachComments needs range information');
        }

        // tokens array is empty, we attach comments to tree as 'leadingComments'
        if (!tokens.length) {
            if (providedComments.length) {
                for (const providedComment of providedComments) {
                    comment = deepCopy(providedComment);
                    comment.extendedRange = [0, tree.range[0]];
                    comments.push(comment);
                }
                tree.leadingComments = comments;
            }
            return tree;
        }

        for (const providedComment of providedComments) {
            comments.push(extendCommentRange(deepCopy(providedComment), tokens));
        }

        // This is based on John Freeman's implementation.
        cursor = 0;
        traverse(tree, {
            enter (node) {
                let comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (comment.extendedRange[1] > node.range[0]) {
                        break;
                    }

                    if (comment.extendedRange[1] === node.range[0]) {
                        if (!node.leadingComments) {
                            node.leadingComments = [];
                        }
                        node.leadingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        cursor = 0;
        traverse(tree, {
            leave (node) {
                let comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (node.range[1] < comment.extendedRange[0]) {
                        break;
                    }

                    if (node.range[1] === comment.extendedRange[0]) {
                        if (!node.trailingComments) {
                            node.trailingComments = [];
                        }
                        node.trailingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        return tree;
    }

    exports.Syntax = Syntax;
    exports.traverse = traverse;
    exports.replace = replace;
    exports.attachComments = attachComments;
    exports.VisitorKeys = VisitorKeys;
    exports.VisitorOption = VisitorOption;
    exports.Controller = Controller;
    exports.cloneEnvironment = function () { return clone({}); };

    return exports;
}
/* vim: set sw=4 ts=4 et tw=80 : */

const {
    Syntax, traverse, replace, attachComments,
    VisitorKeys, VisitorOption, Controller, cloneEnvironment
} = clone({});

export {
    Syntax, traverse, replace, attachComments,
    VisitorKeys, VisitorOption, Controller, cloneEnvironment
};
