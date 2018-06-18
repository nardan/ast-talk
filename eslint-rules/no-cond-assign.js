/**
 * Based on eslint `no-cond-assign` but simplifer for example
 * @see https://github.com/eslint/eslint/blob/master/lib/rules/no-cond-assign.js
 */

module.exports = {
	create: function(context) {
		return {
			IfStatement(node) {
				if (node.test && node.test.type === 'AssignmentExpression') {
					context.report({
						node,
						loc: node.test.loc.start,
						message: 'Expected a conditional expression and instead saw an assignment.'
					});
				}
			}
		};
	}
};
