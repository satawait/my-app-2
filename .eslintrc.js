// eslint文档 http://eslint.cn/
// vue eslint plugin文档 https://vuejs.github.io/eslint-plugin-vue/rules/

module.exports = {
    root: true,
    parser: 'vue-eslint-parser',

    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 6,
        sourceType: 'module'
    },

    env: {
        browser: true,
        node: true
    },

    // https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md
    extends: ['plugin:vue/recommended', 'standard'],

    // required to lint *.vue files
    plugins: ['vue'],

    // add your custom rules here
    globals: {
        __DEV__: true
    },

    rules: {
        'no-new': 'off',
        'no-void': 'off',
        indent: [
            'error',
            4
        ],
        'no-debugger': 'off',
        'no-console': 'off',
        'space-before-function-paren': [
            'error',
            'never'
        ],
        eqeqeq: 'warn',
        'no-useless-escape': 'warn',
        'new-cap': 'warn',
        'no-useless-call': 'warn',
        'no-unused-expressions': 'warn',
        'no-new-wrappers': 'warn',
        'no-array-constructor': 'warn',
        semi: [
            'error',
            'always'
        ],
        'vue/html-indent': [
            'error',
            4
        ],
        'vue/require-default-prop': 0,
        'vue/require-prop-types': 0,
        'vue/prop-name-casing': [
            'error',
            'camelCase'
        ],
        'vue/no-v-html': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    'void': 'never',
                    normal: 'any',
                    component: 'any'
                }
            }
        ]
    },

    'extends': [
        'plugin:vue/recommended',
        'standard'
    ]
};
