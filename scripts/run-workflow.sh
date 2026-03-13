#!/bin/bash
# AI 漫剧完整工作流

NOVEL_FILE="$1"
PROJECT_NAME=$(basename "$NOVEL_FILE" .md)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ -z "$NOVEL_FILE" ]; then
  echo "Usage: ./run-workflow.sh <novel-chapter.md>"
  exit 1
fi

echo "🎬 AI 漫剧工作流启动"
echo "项目名称: $PROJECT_NAME"
echo "=========================================="

# 创建项目输出目录
mkdir -p "$PROJECT_ROOT/outputs/$PROJECT_NAME"/{images,audio,videos}

# 1. 生成分镜脚本
echo "📋 Step 1: 生成分镜脚本..."
node "$SCRIPT_DIR/generate-storyboard.js" "$NOVEL_FILE"

# 2. 批量生成图像
echo "🎨 Step 2: 批量生成图像..."
node "$SCRIPT_DIR/batch-generate-images.js" "${NOVEL_FILE%.md}-storyboard.json" "$PROJECT_ROOT/outputs/$PROJECT_NAME/images"

# 3. 批量生成配音
echo "🎙️ Step 3: 批量生成配音..."
node "$SCRIPT_DIR/batch-tts.js" "${NOVEL_FILE%.md}-storyboard.json" "$PROJECT_ROOT/outputs/$PROJECT_NAME/audio"

# 4. 合成视频
echo "🎬 Step 4: 合成视频..."
"$SCRIPT_DIR/compose-video.sh" "${NOVEL_FILE%.md}-storyboard.json" "$PROJECT_ROOT/outputs/$PROJECT_NAME/videos/${PROJECT_NAME}.mp4" "$PROJECT_ROOT/outputs/$PROJECT_NAME/images" "$PROJECT_ROOT/outputs/$PROJECT_NAME/audio"

echo ""
echo "✅ 工作流完成！"
echo "输出文件: $PROJECT_ROOT/outputs/$PROJECT_NAME/"
echo ""
echo "📊 生成统计:"
ls -1 "$PROJECT_ROOT/outputs/$PROJECT_NAME/images/" 2>/dev/null | wc -l | xargs echo "  画面数量"
ls -1 "$PROJECT_ROOT/outputs/$PROJECT_NAME/audio/" 2>/dev/null | wc -l | xargs echo "  音频数量"
ls -lh "$PROJECT_ROOT/outputs/$PROJECT_NAME/videos/${PROJECT_NAME}.mp4" 2>/dev/null | awk '{print "  最终视频: " $9 " (" $5 ")"}'
