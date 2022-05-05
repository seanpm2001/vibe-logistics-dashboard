// FEAT：新增功能
// UPDATE: 更新功能
// FIX：bug 修复
// DOCS：文档更新
// STYLE：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
// REFACTOR：重构代码(既没有新增功能，也没有修复 bug)
// PERF：性能, 体验优化
// TEST：新增测试用例或是更新现有测试
// BUILD：主要目的是修改项目构建系统(例如 glup，webpack， vite， rollup 的配置等)的提交
// CI：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
// CHORE：不属于以上类型的其他类，比如构建流程, 依赖管理
// REVERT：回滚某个更早之前的提交

// TODO: 暂时还未引入，先自觉遵循该规范
module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'FEAT',
        'UPDATE',
        'FIX',
        'PERF',
        'STYLE',
        'DOCS',
        'TEST',
        'REFACTOR',
        'BUILD',
        'CI',
        'CHORE',
        'REVERT',
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
  },
};
