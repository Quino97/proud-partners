import assert from 'node:assert/strict';
import { parseInline, plainText } from '../src/lib/utils/rich-text.ts';
for (const [marked, expected] of [
	['Plain text.', [{ text: 'Plain text.', bold: false, italic: false }]],
	['*Proud Partners*', [{ text: 'Proud Partners', bold: false, italic: true }]],
	['**In recognition of 20 years of partnership.**', [{ text: 'In recognition of 20 years of partnership.', bold: true, italic: false }]],
	['***Both***', [{ text: 'Both', bold: true, italic: true }]],
	['**Bold*****both***', [{ text: 'Bold', bold: true, italic: false }, { text: 'both', bold: true, italic: true }]],
	['<script>alert(1)</script>', [{ text: '<script>alert(1)</script>', bold: false, italic: false }]],
	['Unmatched * marker', [{ text: 'Unmatched * marker', bold: false, italic: false }]]
]) assert.deepEqual(parseInline(marked), expected);
assert.equal(plainText('On it were the words: "**In recognition of 20 years of partnership.**"'), 'On it were the words: "In recognition of 20 years of partnership."');
console.log('Plain, bold, italic, combined, adjacent and literal-text cases passed.');
