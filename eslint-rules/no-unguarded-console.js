/**
 * @fileoverview Rule to flag unguarded use of console object. Based on `no-console`
 * @see https://github.com/eslint/eslint/blob/master/lib/rules/no-console.js
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
	meta: {
		docs: {
			description:
				"disallow the use of `console` unless guarded by `process.env.NODE_ENV == 'development'`",
			category: 'Possible Errors'
		},

		messages: {
			unexpected: 'Unexpected unguarded console statement.'
		}
	},

	create(context) {
		const options = context.options[0] || {};

		/**
		 *
		 * @param {ASTNode} node - The Node to check
		 * @returns {boolean} `true` if the node is a MemberExpression
		 */
		function isMemberExpression(node) {
			return node && node.type === 'MemberExpression';
		}

		function isIdentifierWithName(node, name) {
			return node && node.type === 'Identifier' && node.name === name;
		}

		function isLiteralWithValue(reference, value) {
			return (
				reference && reference.type === 'Literal' && reference.value === value
			);
		}

		function isSuitibleGuard(node) {
			return false;
			/*
			{
				"type": "IfStatement",
				"test": {
					"type": "BinaryExpression",
					"left": {
						"type": "MemberExpression",
						"object": {
							"type": "MemberExpression",
							"object": {
								"type": "Identifier",
								"name": "process"
							},
							"property": {
								"type": "Identifier",
								"name": "env"
							}
						},
						"property": {
							"type": "Identifier",
							"name": "NODE_ENV"
						}
					},
					"operator": "==",
					"right": {
						"type": "Literal",
						"value": "development"
					}
				}
			}
			*/
		}

		function isGuarded(node) {
			if (!node || !node.parent) {
				return false;
			}
			const parent = node.parent;

			return (
				isSuitibleGuard(parent) ||
				isGuarded(parent.parent)
			);
		}

		return {
			CallExpression(node) {
				if (
					node.callee &&
					isMemberExpression(node.callee) &&
					isIdentifierWithName(node.callee.object, 'console')
				) {
					if (!isGuarded(node)) {
						context.report({
							node,
							loc: node.loc.start,
							messageId: 'unexpected'
						});
					}
				}
			}
		};
	}
};
