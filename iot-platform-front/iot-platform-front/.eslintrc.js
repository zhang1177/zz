module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    // "plugin:vue/recommended",
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-deprecated-v-bind-sync': 'off', 
    // 关闭 Vue 组件命名规则
    "vue/multi-word-component-names": "off",

    // 关闭 Vue 多个根节点规则（适用于 Vue 3）
    "vue/no-multiple-template-root": "off",

    // 关闭未使用变量警告
    "no-unused-vars": "off",
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}