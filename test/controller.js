// Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>
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


import { Controller } from '../src/estraverse.js';
import Dumper from './dumper.js';
import checkDump from './checkDump.js';

describe('controller', function() {
    it('traverse', function() {
        const controller = new Controller();
        const dumper = new Dumper();
        const tree = {
            type: 'ObjectExpression',
            properties: [{
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'Identifier',
                    name: 'a'
                }
            }]
        };

        controller.traverse(tree, {
            enter(node) {
                dumper.log(`enter - ${node.type}`);
            },

            leave(node) {
                dumper.log(`leave - ${node.type}`);
            }
        });

        checkDump(dumper.result(), `
            enter - ObjectExpression
            enter - undefined
            enter - Identifier
            leave - Identifier
            enter - Identifier
            leave - Identifier
            leave - undefined
            leave - ObjectExpression
        `);
    });
});
