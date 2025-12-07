# MakerKit Demo

MakerKit × Monad Hackathon Demo - 硬件创意链上资产平台

## 快速开始

```bash
# 1. 安装依赖
cd makerkit-demo
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
# http://localhost:3000
```

## 项目结构

```
makerkit-demo/
├── app/
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页 - 项目列表（类似 GitHub）
│   ├── globals.css       # 全局样式
│   └── project/
│       └── [id]/
│           └── page.tsx  # 项目详情页 - Clone 功能
├── lib/
│   └── mockData.ts       # 模拟项目数据
└── package.json
```

## 功能演示

### 1. 首页 - 项目浏览
- 类似 GitHub 的项目列表界面
- 分类筛选、搜索功能
- 项目卡片展示：名称、描述、标签、Clone 数、生产数

### 2. 项目详情页
- 项目完整信息
- Clone 按钮（模拟 x402 支付）
- 文件列表（Clone 后解锁）
- 分润模式说明

### 3. 技术栈
- **前端**: Next.js 14 + React + TailwindCSS
- **支付**: x402 协议（模拟）
- **区块链**: Monad Testnet（合约已部署到 foundry-monad）
- **钱包**: thirdweb SDK（待集成）

## 智能合约

合约代码在 `../foundry-monad/src/`:

```solidity
// ProjectRegistry.sol
- createProject()      // 创建项目
- cloneProject()       // Clone 项目（付费）
- reportProduction()   // 报告生产数量
- addContributor()     // 添加贡献者
```

### 部署合约到 Monad Testnet

```bash
cd ../foundry-monad

# 测试合约
forge test

# 部署
forge create src/ProjectRegistry.sol:ProjectRegistry \
  --account monad-deployer \
  --broadcast
```

## 演示流程

1. **浏览项目** → 首页展示所有 Building Block
2. **查看详情** → 点击项目卡片进入详情页
3. **Clone 项目** → 点击 Clone 按钮，模拟 x402 支付
4. **获取文件** → 支付成功后，文件列表解锁
5. **查看分润** → 展示创作者收益统计

## TODO

- [ ] 集成 thirdweb 钱包连接
- [ ] 真实调用 Monad 合约
- [ ] 集成 x402 支付
- [ ] 添加"我的项目"页面
- [ ] 添加创建项目功能
- [ ] 生产报告功能
