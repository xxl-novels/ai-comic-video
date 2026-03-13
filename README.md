# AI Comic Video (AI 漫剧)

AI 驱动的漫画视频生成工作流，将小说文本自动转换为漫剧视频。

## 项目特点

- 📚 **多小说支持**: 每本小说独立目录，互不干扰
- 🎨 **双模式生成**: 支持 API 自动生成或即梦会员手动生成
- 🎭 **角色管理**: 全局角色库 + 小说专属角色设定
- 🎬 **完整工作流**: 分镜 → 图片 → 配音 → 视频 → 发布

---

## 项目结构

```
ai-comic-video/
├── novels/                      # 小说目录（每本小说一个子目录）
│   └── 结婚七年/               # 示例：小说《结婚七年》
│       ├── 正文.md             # 小说正文
│       ├── storyboard/         # 分镜脚本
│       │   └── storyboard.json
│       ├── characters/         # 本小说专属角色设定（可选）
│       ├── scenes/             # 本小说专属场景设定（可选）
│       └── outputs/            # 生成本小说的输出文件
│           ├── images/         # AI 生成图片
│           ├── audio/          # 配音文件
│           └── videos/         # 最终视频
├── scripts/                     # 自动化脚本
│   ├── generate-storyboard.js         # 分镜脚本生成
│   ├── generate-jimeng-prompts.js     # 即梦提示词生成
│   ├── generate-character-prompts.js  # 角色定妆照提示词
│   ├── batch-generate-images.js       # AI 图像批量生成（API模式）
│   ├── batch-tts.js                   # AI 配音批量生成
│   ├── compose-video.sh               # 视频合成
│   └── run-workflow.sh                # 一键执行工作流
├── characters/                  # 全局角色库（所有小说共用）
│   ├── 陈北辰/
│   │   └── description.md
│   ├── 柳安然/
│   │   └── description.md
│   └── 周子轩/
│       └── description.md
├── scenes/                      # 全局场景库（所有小说共用）
│   ├── 医院病房.md
│   ├── 大学宿舍.md
│   └── 毕业典礼.md
└── templates/                   # 剪映/AE 模板
```

---

## 快速开始

### 模式一：即梦会员（推荐 - 质量更高）

```bash
# 1. 创建新小说目录
cd novels
mkdir "我的小说名"
cd "我的小说名"

# 2. 放入小说正文
cp /path/to/your/story.md ./正文.md

# 3. 生成分镜
cd ../..
node scripts/generate-storyboard.js "novels/我的小说名"

# 4. 生成即梦提示词
node scripts/generate-jimeng-prompts.js "novels/我的小说名"

# 5. 打开生成的提示词文件，复制到即梦生成图片
open "novels/我的小说名/outputs/prompts-for-jimeng.txt"

# 6. 下载图片保存到 novels/我的小说名/outputs/images/
#    命名规则: ep01-p001.jpg, ep01-p002.jpg, ...

# 7. 告诉我图片已准备好，我继续配音和视频合成
```

### 模式二：API 自动生成（适合批量）

```bash
# 1. 配置 API Key
export ARK_API_KEY="your-api-key"

# 2. 一键执行完整工作流
./scripts/run-workflow.sh "novels/我的小说名"
```

---

## 详细使用指南

### 添加新小说

```bash
# 创建小说目录结构
mkdir -p "novels/小说名"/{storyboard,outputs/images}

# 放入小说正文（必须是 正文.md）
cp your-story.md "novels/小说名/正文.md"

# 可选：添加本小说专属角色
cp -r characters/某个角色 "novels/小说名/characters/"

# 可选：添加本小说专属场景
cp scenes/某个场景.md "novels/小说名/scenes/"
```

### 生成分镜脚本

```bash
node scripts/generate-storyboard.js "novels/小说名"
```

输出：`novels/小说名/storyboard/storyboard.json`

### 生成即梦提示词

```bash
node scripts/generate-jimeng-prompts.js "novels/小说名"
```

输出：`novels/小说名/outputs/prompts-for-jimeng.txt`

### 生成角色定妆照提示词

```bash
node scripts/generate-character-prompts.js > "novels/小说名/outputs/character-prompts.txt"
```

---

## 工作流程

### 即梦会员模式（手动）

```
小说目录/
├── 正文.md
└── outputs/
    ├── prompts-for-jimeng.txt      ← 我生成
    ├── character-prompts.txt        ← 我生成
    └── images/
        ├── chenbeichen-front.jpg   ← 你生成后上传
        ├── liuanran-sweet.jpg      ← 你生成后上传
        ├── ep01-p001.jpg           ← 你生成后上传
        ├── ep01-p002.jpg           ← 你生成后上传
        └── ...
```

**交互流程**:
1. 我读取 `正文.md`，生成分镜和提示词
2. 你打开提示词文件，在即梦生成图片
3. 你把图片上传到 `outputs/images/`
4. 我进行配音和视频合成

### API 自动模式

```
小说目录/
├── 正文.md
└── outputs/
    ├── images/     ← API 自动生成
    ├── audio/      ← API 自动生成
    └── videos/     ← 脚本自动合成
```

---

## 角色设定

### 全局角色（所有小说共用）

放在 `characters/` 目录，包含：
- `description.md` - 外貌、服装、表情、提示词模板

### 小说专属角色（可选）

放在 `novels/小说名/characters/` 目录，会**覆盖**全局角色设定

---

## 场景设定

### 全局场景（所有小说共用）

放在 `scenes/` 目录，包含：
- 场景描述、环境、光线、提示词

### 小说专属场景（可选）

放在 `novels/小说名/scenes/` 目录，会**覆盖**全局场景设定

---

## 图片命名规则

### 角色定妆照
```
[角色拼音]-[角度/表情].jpg

chenbeichen-front.jpg    # 陈北辰正面
chenbeichen-profile.jpg  # 陈北辰侧面
chenbeichen-cold.jpg     # 陈北辰冷漠表情
liuanran-sweet.jpg       # 柳安然甜美微笑
zhouzixuan-smug.jpg      # 周子轩得意表情
```

### 分镜画面
```
ep[章节]-p[编号].jpg

ep01-p001.jpg  # 第一章第1个画面
ep01-p002.jpg  # 第一章第2个画面
ep02-p001.jpg  # 第二章第1个画面
```

---

## 成本估算

### 即梦会员模式
- 即梦会员: ¥69/月
- 可生成: 4320张图 + 108个视频
- **单本项目**: 约 11张角色照 + 12张分镜 = 23张
- **成本**: ¥69 会员费（可同时做多项目）

### API 模式
- 豆包 API: ¥0.22/张
- **单本项目**: 23张图 × ¥0.22 = **¥5.06**

---

## 相关文档

- [小说转漫剧调研报告](./reports/小说转漫剧调研报告.md)
- [AI漫剧自动化工作流](./reports/AI漫剧自动化工作流.md)

## License

MIT
