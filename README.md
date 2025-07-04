# 图片管理系统

基于 Electron + Vue 3 + TypeScript 开发的跨平台图片管理系统，支持图片管理、分类、标注等功能。

## 功能特性

- 📸 图片管理：上传、查看、编辑、删除图片
- 🏷️ 标签管理：支持自定义标签和自动标签
- 📊 分类系统：基于 AI 的图片分类
- 🔍 智能搜索：支持按标签、类别、日期等搜索
- 📱 跨平台：支持 Windows、macOS、Linux

## 技术栈

- 前端：Vue 3 + TypeScript + Vite
- 后端：Electron + Node.js
- 数据库：SQLite
- AI模型：ONNX Runtime
- UI框架：Element Plus

## 开发环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0
- Git

## 快速开始

1. 克隆项目
```bash
git clone [项目地址]
cd my-vite-electron-app
```

2. 安装依赖
```bash
npm install
```

3. 开发模式运行
```bash
npm run electron:dev
```

4. 构建应用
```bash
npm run electron:build
```

## 项目结构

```
├── electron/                    # Electron 主进程代码
│   ├── main.mjs                # 主进程入口文件
│   ├── preload.mjs             # 预加载脚本
│   ├── core/                   # 核心功能模块
│   ├── types/                  # 类型定义
│   │   ├── api.types.ts       # API 接口类型
│   │   ├── annotation.types.ts # 标注相关类型
│   │   ├── classification.types.ts # 分类相关类型
│   │   ├── common.ts          # 通用类型
│   │   ├── electron.d.ts      # Electron 类型声明
│   │   ├── image.types.ts     # 图片相关类型
│   │   ├── index.ts           # 类型导出入口
│   │   ├── model.types.ts     # 模型相关类型
│   │   ├── services.types.ts  # 服务接口类型
│   │   └── tag.types.ts       # 标签相关类型
│   ├── utils/                 # 工具函数
│   ├── constants/             # 常量定义
│   ├── config/                # 配置文件
│   └── resources/             # 资源文件
│
├── src/                       # 前端代码
│   ├── assets/               # 静态资源
│   ├── components/           # Vue 组件
│   ├── middleware/           # 中间件
│   ├── router/               # 路由配置
│   ├── services/             # 前端服务
│   ├── types/                # 类型定义
│   ├── views/                # 页面视图
│   ├── App.vue              # 根组件
│   ├── main.ts              # 入口文件
│   ├── env.d.ts             # 环境变量类型
│   ├── vite-env.d.ts        # Vite 环境类型
│   └── style.css            # 全局样式
│
├── public/                   # 公共资源
├── dist-electron/            # 构建输出目录
├── .vscode/                  # VS Code 配置
├── .git/                     # Git 配置
├── node_modules/             # 依赖包
├── package.json              # 项目配置
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 配置
└── vitest.config.ts          # Vitest 配置
```

## 开发指南

### 添加新功能

1. 在 `electron/services` 中实现后端服务
2. 在 `electron/types` 中定义类型
3. 在 `src/middleware` 中创建中间件
4. 在 `src/components` 中实现前端组件

### 运行测试

```bash
# 运行所有测试
npm test

# 运行 UI 测试
npm run test:ui

# 运行覆盖率测试
npm run test:coverage
```

## 构建和发布

1. 修改 `package.json` 中的版本号
2. 运行构建命令
```bash
npm run electron:build
```
3. 在 `dist-electron` 目录中找到构建好的应用

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加新特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

- 项目维护者：[维护者姓名]
- 邮箱：[邮箱地址]
