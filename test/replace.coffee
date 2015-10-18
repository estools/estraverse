# Copyright (C) 2014 Ingvar Stepanyan <me@rreverser.com>
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
#   * Redistributions of source code must retain the above copyright
#     notice, this list of conditions and the following disclaimer.
#   * Redistributions in binary form must reproduce the above copyright
#     notice, this list of conditions and the following disclaimer in the
#     documentation and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
# DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
# THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

'use strict'

{replace, VisitorOption} = require '..'
{expect} = require 'chai'

describe 'replace', ->
    it 'can simplify expressions', ->
        tree =
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'BinaryExpression'
                    operator: '*'
                    left:
                        type: 'Literal'
                        value: 2
                    right:
                        type: 'Literal'
                        value: 3
            }]

        tree = replace tree,
            enter: (node) ->
                if node.type is 'BinaryExpression' and node.left.type is 'Literal' and node.right.type is 'Literal'
                    type: 'Literal'
                    value: eval(JSON.stringify(node.left.value) + node.operator + JSON.stringify(node.right.value))

        expect(tree).to.be.eql
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'Literal'
                    value: 6
            }]

    it 'can remove nodes', ->
        tree =
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'ArrayExpression'
                    elements: [
                        {type: 'Literal', value: 1}
                        {type: 'Literal', value: 2}
                        {type: 'Literal', value: 3}
                        {type: 'Literal', value: 4}
                    ]
            }]

        tree = replace tree,
            enter: (node) ->
                if node.type is 'Identifier' and node.name is 'a'
                    this.remove()
                if node.type is 'Literal' and node.value is 2
                    VisitorOption.Remove

        expect(tree).to.be.eql
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key: null
                value:
                    type: 'ArrayExpression'
                    elements: [
                        {type: 'Literal', value: 1}
                        {type: 'Literal', value: 3}
                        {type: 'Literal', value: 4}
                    ]
            }]

    it 'can remove all nodes in an array in enter phase', ->
        tree =
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'ArrayExpression'
                    elements: [
                        {type: 'Literal', value: 1}
                        {type: 'Literal', value: 2}
                        {type: 'Literal', value: 3}
                        {type: 'Literal', value: 4}
                    ]
            }]

        tree = replace tree,
            enter: (node) ->
                if node.type is 'Literal'
                    return @remove()

        expect(tree).to.be.eql
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'ArrayExpression'
                    elements: [
                    ]
            }]

        tree =
            type: 'FunctionExpression'
            id:
                type: 'Identifier'
                name: 'foo'
            params: []
            defaults: []
            body:
                type: 'BlockStatement'
                body: [{
                    type: 'ExpressionStatement'
                    expression:
                        type: 'CallExpression'
                        callee:
                            type: 'Identifier'
                            name: 'debug'
                        arguments: [{
                            type: 'Literal'
                            value: 'foo'
                            raw: '"foo"'
                        }]
                }
                {
                    type: 'ExpressionStatement'
                    expression:
                        type: 'CallExpression'
                        callee:
                            type: 'Identifier'
                            name: 'debug'
                        arguments: [{
                            type: 'Literal'
                            value: 'bar'
                            raw: '"bar"'
                        }]
                }]
            rest: null,
            generator: false,
            expression: false

        tree = replace tree,
            enter: (node) ->
                if node.type is 'ExpressionStatement' and node.expression.type is 'CallExpression' and node.expression.callee.name is 'debug'
                    return @remove()

        expect(tree).to.be.eql
            type: 'FunctionExpression'
            id:
                type: 'Identifier'
                name: 'foo'
            params: []
            defaults: []
            body:
                type: 'BlockStatement'
                body: []
            rest: null,
            generator: false,
            expression: false

    it 'can remove all nodes in an array in leave phase', ->
        tree =
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'ArrayExpression'
                    elements: [
                        {type: 'Literal', value: 1}
                        {type: 'Literal', value: 2}
                        {type: 'Literal', value: 3}
                        {type: 'Literal', value: 4}
                    ]
            }]

        tree = replace tree,
            leave: (node) ->
                if node.type is 'Literal'
                    return @remove()

        expect(tree).to.be.eql
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'ArrayExpression'
                    elements: [
                    ]
            }]

        tree =
            type: 'FunctionExpression'
            id:
                type: 'Identifier'
                name: 'foo'
            params: []
            defaults: []
            body:
                type: 'BlockStatement'
                body: [{
                    type: 'ExpressionStatement'
                    expression:
                        type: 'CallExpression'
                        callee:
                            type: 'Identifier'
                            name: 'debug'
                        arguments: [{
                            type: 'Literal'
                            value: 'foo'
                            raw: '"foo"'
                        }]
                }
                {
                    type: 'ExpressionStatement'
                    expression:
                        type: 'CallExpression'
                        callee:
                            type: 'Identifier'
                            name: 'debug'
                        arguments: [{
                            type: 'Literal'
                            value: 'bar'
                            raw: '"bar"'
                        }]
                }]
            rest: null,
            generator: false,
            expression: false

        tree = replace tree,
            leave: (node) ->
                if node.type is 'ExpressionStatement' and node.expression.type is 'CallExpression' and node.expression.callee.name is 'debug'
                    return @remove()

        expect(tree).to.be.eql
            type: 'FunctionExpression'
            id:
                type: 'Identifier'
                name: 'foo'
            params: []
            defaults: []
            body:
                type: 'BlockStatement'
                body: []
            rest: null,
            generator: false,
            expression: false

    it 'respects skip', ->
        tree =
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'BinaryExpression'
                    operator: '*'
                    left:
                        type: 'Literal'
                        value: 2
                    right:
                        type: 'Literal'
                        value: 3
            }]

        old = JSON.parse JSON.stringify tree

        tree = replace tree,
            enter: (node) ->
                switch node.type
                    when 'ObjectExpression'
                        return VisitorOption.Skip
                    when 'BinaryExpression'
                        return VisitorOption.Remove

        expect(tree).to.be.eql old

    it 'can remove unknown nodes', ->
        tree =
            type: 'XXXExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'ArrayExpression'
                    elements: [
                        {type: 'Literal', value: 1}
                        {type: 'Literal', value: 2}
                        {type: 'Literal', value: 3}
                        {type: 'Literal', value: 4}
                    ]
            }]

        tree = replace tree,
            enter: (node) ->
                if node.type is 'Identifier' and node.name is 'a'
                    this.remove()
                if node.type is 'Literal' and node.value is 2
                    VisitorOption.Remove
            fallback: 'iteration'

        expect(tree).to.be.eql
            type: 'XXXExpression'
            properties: [{
                type: 'Property'
                key: null
                value:
                    type: 'ArrayExpression'
                    elements: [
                        {type: 'Literal', value: 1}
                        {type: 'Literal', value: 3}
                        {type: 'Literal', value: 4}
                    ]
            }]

    it 'throw unkown node type error when unknown nodes', ->
        tree =
            type: 'XXXExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'ArrayExpression'
                    elements: [
                        {type: 'Literal', value: 1}
                        {type: 'Literal', value: 2}
                        {type: 'Literal', value: 3}
                        {type: 'Literal', value: 4}
                    ]
            }]

        expect ->
            replace tree,
                enter: (node) ->
                    if node.type is 'Identifier' and node.name is 'a'
                        this.remove()
                    if node.type is 'Literal' and node.value is 2
                        VisitorOption.Remove
        .to.throw('Unknown node type XXXExpression.')

    it 'supports recur without remove/replace', ->
        log = ""
        tree =
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'BinaryExpression'
                    operator: '*'
                    left:
                        type: 'Literal'
                        value: 2
                    right:
                        type: 'Literal'
                        value: 3
            }]

        tree = replace tree,
            recur: (node) ->
                log += node.type + "\n"

        expect(log).to.be.equal """
            Property
            BinaryExpression
            
        """
