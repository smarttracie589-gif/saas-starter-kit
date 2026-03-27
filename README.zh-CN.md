# SaaS Starter Kit

[English](./README.md) | **中文**

一套生产级 Next.js SaaS 全栈模板，所有基础设施已接好。专注于你的核心业务，不用重复造轮子。

## 包含什么

- **用户认证：** NextAuth v5（邮箱/密码，JWT Session）
- **数据库：** Neon Serverless PostgreSQL（自动 Scale to Zero）
- **支付系统：** Creem（Checkout + Webhook + 订阅管理）
- **定时任务：** Vercel Cron（自动化后台任务）
- **邮件通知：** Resend（HTML 模板 + 变更告警）
- **安全防护：** 速率限制、密码加密、Webhook 签名验证

## 快速开始

```bash
# 1. 克隆并安装依赖
git clone https://github.com/smarttracie589-gif/saas-starter-kit.git
cd saas-starter-kit
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 API keys

# 3. 启动开发服务器
npm run dev

# 4. 初始化数据库（只需执行一次）
# 浏览器访问：http://localhost:3000/api/init-db
```

## 如何定制

### 1. 换品牌和定价
打开 `src/lib/config.js`，修改产品名、定价、Plan 限制。这是全局唯一的配置文件，改这一个文件就能换掉整个品牌。

### 2. 换业务逻辑
模板内置了一个「网站在线监控」示例（HTTP ping），演示 Cron + 数据库 + 邮件 如何协作。

要做你自己的产品，只需修改 `src/lib/dataSource.js`：

```js
export async function fetchCurrentData(monitor) {
  // 替换成你自己的数据获取逻辑
  // 返回一个对象，key-value 代表当前状态
  // 系统会自动和上次快照对比，有变化就发邮件告警
}
```

### 3. 改数据库
`src/lib/db.js` 里的 `monitors` 和 `changes` 表是示例用的，根据你的业务修改。`users` 和 `waitlist` 表是通用的 SaaS 基础设施，一般不需要改。

## 项目结构

```
src/
├── app/
│   ├── page.js              # Landing Page
│   ├── login/page.js         # 登录/注册
│   ├── dashboard/page.js     # 用户 Dashboard
│   └── api/
│       ├── auth/             # 认证路由
│       ├── register/         # 注册
│       ├── monitors/         # CRUD + 检查
│       ├── checkout/         # 创建支付会话
│       ├── webhooks/creem/   # 支付 Webhook
│       ├── cron/check/       # 定时任务
│       └── waitlist/         # Waitlist
├── components/               # UI 组件
└── lib/
    ├── config.js             # 集中配置（改这个换品牌）
    ├── dataSource.js         # 数据源（改这个换业务）
    ├── db.js                 # 数据库操作
    ├── auth.js               # 认证配置
    ├── email.js              # 邮件服务
    └── rateLimit.js          # 速率限制
```

## 部署

本项目针对 Vercel 优化，一键部署：

1. 把代码 push 到 GitHub
2. 在 Vercel 导入项目
3. 在 Vercel 后台填入环境变量
4. 部署！Vercel 会自动根据 `vercel.json` 配置 Cron 任务

## 技术栈

| 模块 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) + React 19 |
| 认证 | NextAuth v5 |
| 数据库 | Neon Serverless PostgreSQL |
| 支付 | Creem |
| 邮件 | Resend |
| 定时任务 | Vercel Cron |
| 部署 | Vercel |

## License

[MIT](./LICENSE) — 随便用，不用问。
