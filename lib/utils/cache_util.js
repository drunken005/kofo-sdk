'use strict';
const util = require('util');
const _ = require('lodash');
const valuesKey = 'Values';
const indexKey = '(index)';
const {Buffer} = require('buffer');
// const { removeColors } = require('internal/util');
const HasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

const colorRegExp = /\u001b\[\d\d?m/g;

function removeColors(str) {
    return str.replace(colorRegExp, '');
}

// The use of Unicode characters below is the only non-comment use of non-ASCII
// Unicode characters in Node.js built-in modules. If they are ever removed or
// rewritten with \u escapes, then a test will need to be (re-)added to Node.js
// core to verify that Unicode characters work in built-ins. Otherwise,
// consumers using Unicode in _third_party_main.js will run into problems.
// Refs: https://github.com/nodejs/node/issues/10673
const tableChars = {
    /* eslint-disable node-core/non-ascii-character */
    middleMiddle: '─',
    rowMiddle: '┼',
    topRight: '┐',
    topLeft: '┌',
    leftMiddle: '├',
    topMiddle: '┬',
    bottomRight: '┘',
    bottomLeft: '└',
    bottomMiddle: '┴',
    rightMiddle: '┤',
    left: '│ ',
    right: ' │',
    middle: ' │ ',
    /* eslint-enable node-core/non-ascii-character */
};

const countSymbols = (string) => {
    const normalized = removeColors(string).normalize('NFC');
    return Buffer.from(normalized, 'UCS-2').byteLength / 2;
};

const renderRow = (row, columnWidths) => {
    let out = tableChars.left;
    for (var i = 0; i < row.length; i++) {
        const cell = row[i];
        const len = countSymbols(cell);
        const needed = (columnWidths[i] - len) / 2;
        // round(needed) + ceil(needed) will always add up to the amount
        // of spaces we need while also left justifying the output.
        out += `${' '.repeat(needed)}${cell}${' '.repeat(Math.ceil(needed))}`;
        if (i !== row.length - 1)
            out += tableChars.middle;
    }
    out += tableChars.right;
    return out;
};

const table = (head, columns) => {
    const rows = [];
    const columnWidths = head.map((h) => countSymbols(h));
    const longestColumn = columns.reduce((n, a) => Math.max(n, a.length), 0);

    for (let i = 0; i < head.length; i++) {
        const column = columns[i];
        for (let j = 0; j < longestColumn; j++) {
            if (rows[j] === undefined)
                rows[j] = [];
            const value = rows[j][i] = HasOwnProperty(column, j) ? column[j] : '';
            const width = columnWidths[i] || 0;
            const counted = countSymbols(value);
            columnWidths[i] = Math.max(width, counted);
        }
    }

    const divider = columnWidths.map((i) =>
        tableChars.middleMiddle.repeat(i + 2));

    let result = `${tableChars.topLeft}${divider.join(tableChars.topMiddle)}` +
        `${tableChars.topRight}\n${renderRow(head, columnWidths)}\n` +
        `${tableChars.leftMiddle}${divider.join(tableChars.rowMiddle)}` +
        `${tableChars.rightMiddle}\n`;

    for (const row of rows)
        result += `${renderRow(row, columnWidths)}\n`;

    result += `${tableChars.bottomLeft}${divider.join(tableChars.bottomMiddle)}` +
        tableChars.bottomRight;

    return result;
};

const tableStr = function (tabularData, properties) {
    const inspect = (v) => {
        const depth = v !== null &&
        typeof v === 'object' &&
        !_.isArray(v) &&
        _.keys(v).length > 2 ? -1 : 0;
        const opt = {
            depth,
            maxArrayLength: 3
        };
        return util.inspect(v, opt);
    };


    const map = {};
    let hasPrimitives = false;
    const valuesKeyArray = [];
    const indexKeyArray = _.keys(tabularData);

    for (let i = 0; i < indexKeyArray.length; i++) {
        const item = tabularData[indexKeyArray[i]];
        const primitive = item === null ||
            (typeof item !== 'function' && typeof item !== 'object');
        if (properties === undefined && primitive) {
            hasPrimitives = true;
            valuesKeyArray[i] = inspect(item);
        } else {
            const keys = properties || _.keys(item);
            for (const key of keys) {
                if (map[key] === undefined)
                    map[key] = [];
                // console.log(hasOwnProperty(item, key))
                if ((primitive && properties) || !item.hasOwnProperty(key))
                    map[key][i] = '';
                else
                    map[key][i] = item == null ? item : inspect(item[key]);
            }
        }
    }
    const keys = _.keys(map);
    const values = _.values(map);
    if (hasPrimitives) {
        keys.push(valuesKey);
        values.push(valuesKeyArray);
    }
    keys.unshift(indexKey);
    values.unshift(indexKeyArray);
    return table(keys, values);
};


module.exports = {table, tableStr};
