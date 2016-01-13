// Copyright (C) 2014 Ingvar Stepanyan <me@rreverser.com>
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


import { replace, VisitorOption } from '..';
import { expect } from 'chai';

describe('replace', function() {
    it('can simplify expressions', function() {
        let tree = {
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'Literal',
                        value: 2
                    },
                    right: {
                        type: 'Literal',
                        value: 3
                    }
                }
            }]
        };

        tree = replace(tree, {
            enter(node) {
                if (node.type === 'BinaryExpression' && node.left.type === 'Literal' && node.right.type === 'Literal') {
                    return {
                        type: 'Literal',
                        value: eval(JSON.stringify(node.left.value) + node.operator + JSON.stringify(node.right.value))
                    };
                }
            }
        });

        expect(tree).to.be.eql({
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'Literal',
                    value: 6
                }
            }]
        });
    });

    it('can remove nodes', function() {
        let tree = {
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'ArrayExpression',
                    elements: [
                        {type: 'Literal', value: 1},
                        {type: 'Literal', value: 2},
                        {type: 'Literal', value: 3},
                        {type: 'Literal', value: 4}
                    ]
                }
            }]
        };

        tree = replace(tree, {
            enter(node) {
                if (node.type === 'Identifier' && node.name === 'a') {
                    this.remove();
                }
                if (node.type === 'Literal' && node.value === 2) {
                    return VisitorOption.Remove;
                }
            }
        });

        expect(tree).to.be.eql({
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: null,
                value: {
                    type: 'ArrayExpression',
                    elements: [
                        {type: 'Literal', value: 1},
                        {type: 'Literal', value: 3},
                        {type: 'Literal', value: 4}
                    ]
                }
            }]
        });
    });

    it('can remove all nodes in an array in enter phase', function() {
        let tree = {
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'ArrayExpression',
                    elements: [
                        {type: 'Literal', value: 1},
                        {type: 'Literal', value: 2},
                        {type: 'Literal', value: 3},
                        {type: 'Literal', value: 4}
                    ]
                }
            }]
        };

        tree = replace(tree, {
            enter(node) {
                if (node.type === 'Literal') {
                    return this.remove();
                }
            }
        });

        expect(tree).to.be.eql({
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'ArrayExpression',
                    elements: []
                }
            }]
        });

        tree = {
            type: 'FunctionExpression',
            id: {
                type: 'Identifier',
                name: 'foo'
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'debug'
                        },
                        arguments: [{
                            type: 'Literal',
                            value: 'foo',
                            raw: '"foo"'
                        }]
                    }
                },
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'debug'
                        },
                        arguments: [{
                            type: 'Literal',
                            value: 'bar',
                            raw: '"bar"'
                        }]
                    }
                }]
            },
            rest: null,
            generator: false,
            expression: false
        };

        tree = replace(tree, {
            enter(node) {
                if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' && node.expression.callee.name === 'debug') {
                    return this.remove();
                }
            }
        });

        expect(tree).to.be.eql({
            type: 'FunctionExpression',
            id: {
                type: 'Identifier',
                name: 'foo'
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: []
            },
            rest: null,
            generator: false,
            expression: false
        });
    });

    it('can remove all nodes in an array in leave phase', function() {
        let tree = {
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'ArrayExpression',
                    elements: [
                        {type: 'Literal', value: 1},
                        {type: 'Literal', value: 2},
                        {type: 'Literal', value: 3},
                        {type: 'Literal', value: 4}
                    ]
                }
            }]
        };

        tree = replace(tree, {
            leave(node) {
                if (node.type === 'Literal') {
                    return this.remove();
                }
            }
        });

        expect(tree).to.be.eql({
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'ArrayExpression',
                    elements: []
                }
            }]
        });

        tree = {
            type: 'FunctionExpression',
            id: {
                type: 'Identifier',
                name: 'foo'
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'debug'
                        },
                        arguments: [{
                            type: 'Literal',
                            value: 'foo',
                            raw: '"foo"'
                        }]
                    }
                },
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'debug'
                        },
                        arguments: [{
                            type: 'Literal',
                            value: 'bar',
                            raw: '"bar"'
                        }]
                    }
                }]
            },
            rest: null,
            generator: false,
            expression: false
        };

        tree = replace(tree, {
            leave(node) {
                if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' && node.expression.callee.name === 'debug') {
                    this.remove();
                }
            }
        });

        expect(tree).to.be.eql({
            type: 'FunctionExpression',
            id: {
                type: 'Identifier',
                name: 'foo'
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: []
            },
            rest: null,
            generator: false,
            expression: false
        });
    });

    it('respects skip', function() {
        let tree = {
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'Literal',
                        value: 2
                    },
                    right: {
                        type: 'Literal',
                        value: 3
                    }
                }
            }]
        };

        const old = JSON.parse(JSON.stringify(tree));

        tree = replace(tree, {
            enter(node) {
                switch (node.type) {
                    case 'ObjectExpression':
                        return VisitorOption.Skip;
                    case 'BinaryExpression':
                        return VisitorOption.Remove;
                }
            }
        });

        expect(tree).to.be.eql(old);
    });

    it('can remove unknown nodes', function() {
        let tree = {
            type: 'XXXExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'ArrayExpression',
                    elements: [
                        {type: 'Literal', value: 1},
                        {type: 'Literal', value: 2},
                        {type: 'Literal', value: 3},
                        {type: 'Literal', value: 4}
                    ]
                }
            }]
        };

        tree = replace(tree, {
            enter(node) {
                if (node.type === 'Identifier' && node.name === 'a') {
                    this.remove();
                }
                if (node.type === 'Literal' && node.value === 2) {
                    return VisitorOption.Remove;
                }
            },
            fallback: 'iteration'
        });

        expect(tree).to.be.eql({
            type: 'XXXExpression',
            properties: [{
                type: 'Property',
                key: null,
                value: {
                    type: 'ArrayExpression',
                    elements: [
                        {type: 'Literal', value: 1},
                        {type: 'Literal', value: 3},
                        {type: 'Literal', value: 4}
                    ]
                }
            }]
        });
    });

    it('throw unkown node type error when unknown nodes', function() {
        const tree = {
            type: 'XXXExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'ArrayExpression',
                    elements: [
                        {type: 'Literal', value: 1},
                        {type: 'Literal', value: 2},
                        {type: 'Literal', value: 3},
                        {type: 'Literal', value: 4}
                    ]
                }
            }]
        };

        expect(() => replace(tree, {
                enter(node) {
                    if (node.type === 'Identifier' && node.name === 'a') {
                        this.remove();
                    }
                    if (node.type === 'Literal' && node.value === 2) {
                        return VisitorOption.Remove;
                    }
                }
            })
        ).to.throw('Unknown node type XXXExpression.');
    });
});
