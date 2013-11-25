# Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>
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

Dumper = require './dumper'
expect = require('chai').expect

describe 'object expression', ->
    it 'properties', ->
        tree =
            type: 'ObjectExpression'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'Identifier'
                    name: 'a'
            }]

        expect(Dumper.dump(tree)).to.be.equal """
            enter - ObjectExpression
            enter - Property
            enter - Identifier
            leave - Identifier
            enter - Identifier
            leave - Identifier
            leave - Property
            leave - ObjectExpression
        """

    it 'properties without type', ->
        tree =
            type: 'ObjectExpression'
            properties: [{
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'Identifier'
                    name: 'a'
            }]

        expect(Dumper.dump(tree)).to.be.equal """
            enter - ObjectExpression
            enter - undefined
            enter - Identifier
            leave - Identifier
            enter - Identifier
            leave - Identifier
            leave - undefined
            leave - ObjectExpression
        """

describe 'object pattern', ->
    it 'properties', ->
        tree =
            type: 'ObjectPattern'
            properties: [{
                type: 'Property'
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'Identifier'
                    name: 'a'
            }]

        expect(Dumper.dump(tree)).to.be.equal """
            enter - ObjectPattern
            enter - Property
            enter - Identifier
            leave - Identifier
            enter - Identifier
            leave - Identifier
            leave - Property
            leave - ObjectPattern
        """

    it 'properties without type', ->
        tree =
            type: 'ObjectPattern'
            properties: [{
                key:
                    type: 'Identifier'
                    name: 'a'
                value:
                    type: 'Identifier'
                    name: 'a'
            }]

        expect(Dumper.dump(tree)).to.be.equal """
            enter - ObjectPattern
            enter - undefined
            enter - Identifier
            leave - Identifier
            enter - Identifier
            leave - Identifier
            leave - undefined
            leave - ObjectPattern
        """

describe 'try statement', ->
    it 'old interface', ->
        tree =
            type: 'TryStatement'
            handlers: [{
                type: 'BlockStatement'
                body: []
            }]
            finalizer:
                type: 'BlockStatement'
                body: []

        expect(Dumper.dump(tree)).to.be.equal """
            enter - TryStatement
            enter - BlockStatement
            leave - BlockStatement
            enter - BlockStatement
            leave - BlockStatement
            leave - TryStatement
        """

    it 'new interface', ->
        tree =
            type: 'TryStatement'
            handler: [{
                type: 'BlockStatement'
                body: []
            }]
            guardedHandlers: null
            finalizer:
                type: 'BlockStatement'
                body: []

        expect(Dumper.dump(tree)).to.be.equal """
            enter - TryStatement
            enter - BlockStatement
            leave - BlockStatement
            enter - BlockStatement
            leave - BlockStatement
            leave - TryStatement
        """

describe 'arrow function expression', ->
    it 'traverse', ->
        tree =
            type: 'ArrowFunctionExpression'
            params: [{
                type: 'Identifier'
                name: 'a'
            }]
            defaults: [{
                type: 'Literal'
                value: 20
            }]
            rest: {
                type: 'Identifier'
                name: 'rest'
            }
            body:
                type: 'BlockStatement'
                body: []

        expect(Dumper.dump(tree)).to.be.equal """
            enter - ArrowFunctionExpression
            enter - Identifier
            leave - Identifier
            enter - Literal
            leave - Literal
            enter - Identifier
            leave - Identifier
            enter - BlockStatement
            leave - BlockStatement
            leave - ArrowFunctionExpression
        """

describe 'function expression', ->
    it 'traverse', ->
        tree =
            type: 'FunctionExpression'
            params: [{
                type: 'Identifier'
                name: 'a'
            }]
            defaults: [{
                type: 'Literal'
                value: 20
            }]
            rest: {
                type: 'Identifier'
                name: 'rest'
            }
            body:
                type: 'BlockStatement'
                body: []

        expect(Dumper.dump(tree)).to.be.equal """
            enter - FunctionExpression
            enter - Identifier
            leave - Identifier
            enter - Literal
            leave - Literal
            enter - Identifier
            leave - Identifier
            enter - BlockStatement
            leave - BlockStatement
            leave - FunctionExpression
        """

describe 'function declaration', ->
    it 'traverse', ->
        tree =
            type: 'FunctionDeclaration'
            id: {
                type: 'Identifier'
                name: 'decl'
            }
            params: [{
                type: 'Identifier'
                name: 'a'
            }]
            defaults: [{
                type: 'Literal'
                value: 20
            }]
            rest: {
                type: 'Identifier'
                name: 'rest'
            }
            body:
                type: 'BlockStatement'
                body: []

        expect(Dumper.dump(tree)).to.be.equal """
            enter - FunctionDeclaration
            enter - Identifier
            leave - Identifier
            enter - Identifier
            leave - Identifier
            enter - Literal
            leave - Literal
            enter - Identifier
            leave - Identifier
            enter - BlockStatement
            leave - BlockStatement
            leave - FunctionDeclaration
        """

