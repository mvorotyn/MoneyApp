export default {
	env: {
		browser: true,
		es2022: true,
	},
	// extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
		extends: ['plugin:react/recommended', 'plugin:unicorn/recommended', ],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint', 'unicorn', 'prettier'],
	rules: {
		'react/jsx-filename-extension': [
			1,
			{ extensions: ['.js', '.jsx', '.ts', '.tsx'] },
		],
		"prettier/prettier": "error",
	// 	'react/jsx-uses-react': 'off',
	// 	'react/react-in-jsx-scope': 'off',
    // 'react/function-component-definition': 'off',
    // 'react/prop-types': 'off',
    // 'no-use-before-define ': 'off',
    // 'arrow-body-style': 'off',
    // 'no-undef': 'off',
    // 'no-use-before-define': 'off',
    // 'import/no-extraneous-dependencies': 'off',
    // 'react/no-unstable-nested-components': 'off',
    // 'import/extensions': 'off',
    // 'import/no-unresolved': 'off',
    // 'eqeqeq': 'off',
    // 'jsx-a11y/anchor-is-valid': 'off',
    // 'no-unused-vars': 'off',
    // 'no-param-reassign': 'off',
    // 'radix': 'off',
    // 'no-console': 'off',
    // 'prefer-const': 'off',
    // 'no-else-return': 'off',
    // 'array-callback-return': 'off',
    // 'import/prefer-default-export': 'off',
    // 'func-names': 'off',

	},
}
