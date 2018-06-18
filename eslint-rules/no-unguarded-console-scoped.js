/**
 * @fileoverview Rule to flag unguarded use of console object. Based on `no-console`
 * @see https://github.com/eslint/eslint/blob/master/lib/rules/no-console.js
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// const astUtils = require('../ast-utils');

function getVariableByName(initScope, name) {
	let scope = initScope;

	while (scope) {
		const variable = scope.set.get(name);

		if (variable) {
			return variable;
		}

		scope = scope.upper;
	}

	return null;
}

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
		 * Checks whether the given reference is 'console' or not.
		 *
		 * @param {eslint-scope.Reference} reference - The reference to check.
		 * @returns {boolean} `true` if the reference is 'console'.
		 */
		function isConsole(reference) {
			const id = reference.identifier;

			return id && id.name === 'console';
		}

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
			if (!node) {
				return false;
			}

			let test = node.test;
			if (!test || test.type !== 'BinaryExpression') {
				return false;
			}

			let left = test.left;
			let right = test.right;

			return (
				isMemberExpression(left) &&
				isMemberExpression(left.object) &&
				isIdentifierWithName(left.object.object, 'process') &&
				isIdentifierWithName(left.object.property, 'env') &&
				isIdentifierWithName(left.property, 'NODE_ENV') &&
				(test.operator === '==' || test.operator === '===') &&
				isLiteralWithValue(right, 'development')
			);
		}

		function isGuarded(node) {
			if (!node || !node.parent) {
				return false;
			}
			const parent = node.parent;

			return (
				(parent.type === 'IfStatement' && isSuitibleGuard(parent)) ||
				isGuarded(parent.parent)
			);
		}

		function isUnguardedReference(reference) {
			const node = reference.identifier;
			return !isGuarded(node);
		}

		/**
		 * Reports the given reference as a violation.
		 *
		 * @param {eslint-scope.Reference} reference - The reference to report.
		 * @returns {void}
		 */
		function report(reference) {
			const node = reference.identifier.parent;

			context.report({
				node,
				loc: node.loc,
				messageId: 'unexpected'
			});
		}

		return {
			'Program:exit'() {
				const scope = context.getScope();
				const consoleVar = getVariableByName(scope, 'console');
				const shadowed = consoleVar && consoleVar.defs.length > 0;

				/*
				 * 'scope.through' includes all references to undefined
				 * variables. If the variable 'console' is not defined, it uses
				 * 'scope.through'.
				 */
				const references = consoleVar
					? consoleVar.references
					: scope.through.filter(isConsole);

				if (!shadowed) {
					references.filter(isUnguardedReference).forEach(report);
				}
			}
		};
	}
};
