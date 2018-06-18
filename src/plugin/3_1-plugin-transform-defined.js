/**
 *
 * Copied from https://github.com/FormidableLabs/babel-plugin-transform-define
 * and stripped down for example simplicity
 *
 */

/**
 * Replace a node with a given value. If the replacement results in a BinaryExpression, it will be
 * evaluated. For example, if the result of the replacement is `var x = "production" === "production"`
 * The evaluation will make a second replacement resulting in `var x = true`
 * @param  {function}   replaceFn    The function used to replace the node
 * @param  {babelNode}  nodePath     The node to evaluate
 * @param  {*}          replacement  The value the node will be replaced with
 * @return {undefined}
 */
const replaceAndEvaluateNode = (replaceFn, nodePath, replacement) => {
	nodePath.replaceWith(replaceFn(replacement));

	if (nodePath.parentPath.isBinaryExpression()) {
		const result = nodePath.parentPath.evaluate();

		if (result.confident) {
			nodePath.parentPath.replaceWith(replaceFn(result.value));
		}
	}
};

/**
 * Finds the first replacement in sorted object paths for replacements that causes comparator
 * to return true.  If one is found, replaces the node with it.
 * @param  {Object}     replacements The object to search for replacements
 * @param  {babelNode}  nodePath     The node to evaluate
 * @param  {function}   replaceFn    The function used to replace the node
 * @param  {function}   comparator   The function used to evaluate whether a node matches a value in `replacements`
 * @return {undefined}
 */
const processNode = (replacements, nodePath, replaceFn, comparator) => {
  const replacementKey = Object.keys(replacements).find(value => comparator(nodePath, value));
  if (replacementKey) {
	// replaceAndEvaluateNode(replaceFn, nodePath, replacements[replacementKey]);
	nodePath.replaceWith(replaceFn(replacements[replacementKey]));
  }
};

const memberExpressionComparator = (nodePath, value) =>
	nodePath.matchesPattern(value);
const identifierComparator = (nodePath, value) => nodePath.node.name === value;
module.exports = function({ types: t }) {
	return {
		visitor: {
			// process.env.NODE_ENV;
			MemberExpression(nodePath, state) {
				processNode(
					typeof state.opts === 'object' ? state.opts : {},
					nodePath,
					t.valueToNode,
					memberExpressionComparator
				);
			},

			// const x = { version: VERSION };
			Identifier(nodePath, state) {
				processNode(
					typeof state.opts === 'object' ? state.opts : {},
					nodePath,
					t.valueToNode,
					identifierComparator
				);
			}
		}
	};
};
