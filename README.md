# AI Comic Video (AI 漫剧)

AI 驱动的漫画视频生成工作流，将小说文本自动转换为漫剧视频。

## 项目结构

```
ai-comic-video/
├── novels/              # 小说文本输入
├── storyboard/          # 分镜脚本输出 (JSON)
├── scripts/             # 自动化脚本
│   ├── generate-storyboard.js    # 分镜脚本生成
│   ├── batch-generate-images.js  # AI 图像批量生成
│   ├── batch-tts.js              # AI 配音批量生成
│   ├── compose-video.sh          # 视频合成
│   └── run-workflow.sh           # 一键执行工作流
├── characters/          # 角色设定（LoRA、参考图）
├── scenes/              # 场景素材
├── outputs/             # 生成文件输出
│   ├── images/          # AI 生成画面
│   ├── audio/           # 配音文件
│   └── videos/          # 最终视频
└── templates/           # 剪映/AE 模板
```

## 快速开始

### 1. 安装依赖

```bash
# 安装必要技能
clawhub install comic-script
clawhub install image-to-video
clawhub install ai-video-script
clawhub install douyin-video-publish
clawhub install bilibili-video-publish

# 确保已安装 ffmpeg
brew install ffmpeg

# 安装 edge-tts（用于配音）
pip install edge-tts
```

### 2. 配置 API Key

确保已设置豆包 API Key：
```bash
export ARK_API_KEY="your-api-key"
```

或在 `~/.openclaw/openclaw.json` 中配置。

### 3. 运行工作流

```bash
# 一键执行完整工作流
./scripts/run-workflow.sh novels/正文.md
```

### 4. 分步执行

```bash
# 1. 生成分镜脚本
node scripts/generate-storyboard.js novels/正文.md

# 2. 批量生成图像
node scripts/batch-generate-images.js storyboard/正文-storyboard.json outputs/images

# 3. 批量生成配音
node scripts/batch-tts.js storyboard/正文-storyboard.json outputs/audio

# 4. 合成视频
./scripts/compose-video.sh storyboard/正文-storyboard.json outputs/videos/final.mp4 outputs/images outputs/audio
```

## 工作流程

```
小说文本 (Markdown)
    ↓
[generate-storyboard.js] → 分镜 JSON
    ↓
[batch-generate-images.js] → AI 生成画面 (豆包/doubao-image)
    ↓
[batch-tts.js] → AI 配音 (edge-tts)
    ↓
[compose-video.sh] → 视频合成 (ffmpeg)
    ↓
最终视频 (MP4)
```

## 技术栈

- **图像生成**: 豆包 Seedream (doubao-image)
- **视频合成**: FFmpeg
- **配音合成**: edge-tts (Microsoft Azure TTS)
- **脚本语言**: Node.js / Python / Bash

## 小说格式要求

```markdown
# 小说标题

## 第一章：章节标题

场景：场景描述（如：医院病房，白天）

正文内容...

对话使用引号："这是对话内容"

场景切换...
```

## 注意事项

1. **API 限流**: 图像生成有速率限制，脚本已添加 2 秒延迟
2. **角色一致性**: 如需保持角色一致，需训练 LoRA 模型
3. **视频质量**: 建议使用 1080P 以上分辨率
4. **版权问题**: 确保小说内容有合法授权

## 相关文档

- [小说转漫剧调研报告](../reports/小说转漫剧调研报告.md)
- [AI漫剧自动化工作流](../reports/AI漫剧自动化工作流.md)

## License

MIT
