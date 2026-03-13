#!/bin/bash
# AI 漫剧视频自动合成
# 依赖: ffmpeg

STORYBOARD_JSON="${1:-./storyboard/正文-storyboard.json}"
OUTPUT_VIDEO="${2:-output.mp4}"

if [ -z "$STORYBOARD_JSON" ]; then
  echo "Usage: ./compose-video.sh <storyboard.json> [output.mp4]"
  exit 1
fi

WORK_DIR=$(dirname "$STORYBOARD_JSON")
IMAGES_DIR="${3:-$WORK_DIR/images}"
AUDIO_DIR="${4:-$WORK_DIR/audio}"
TEMP_DIR=$(mktemp -d)

echo "🎬 开始合成视频..."
echo "工作目录: $WORK_DIR"
echo "图片目录: $IMAGES_DIR"
echo "音频目录: $AUDIO_DIR"
echo "临时目录: $TEMP_DIR"

# 检查依赖
if ! command -v ffmpeg &> /dev/null; then
  echo "❌ 错误: 未安装 ffmpeg"
  exit 1
fi

# 解析 JSON 并生成片段
python3 << EOF
import json
import os
import subprocess

with open('$STORYBOARD_JSON', 'r') as f:
    data = json.load(f)

concat_file = open('$TEMP_DIR/concat-list.txt', 'w')

for episode in data['episodes']:
    for panel in episode['panels']:
        image_file = os.path.join('$IMAGES_DIR', f"{panel['id']}.jpg")
        duration = panel.get('duration', 4)
        
        if os.path.exists(image_file):
            # 生成视频片段
            output_clip = os.path.join('$TEMP_DIR', f"{panel['id']}.mp4")
            
            # 镜头运动参数
            if panel.get('camera') == 'close-up':
                zoom = "zoompan=z='min(zoom+0.002,1.5)':d={}:s=1080x1920:fps=30".format(duration * 30)
            elif panel.get('camera') == 'wide':
                zoom = "zoompan=z='1.0':d={}:s=1920x1080:fps=30".format(duration * 30)
            else:
                zoom = "zoompan=z='min(zoom+0.001,1.2)':d={}:s=1080x1920:fps=30".format(duration * 30)
            
            cmd = [
                'ffmpeg', '-y', '-loop', '1', '-i', image_file,
                '-vf', f"{zoom},format=yuv420p",
                '-c:v', 'libx264', '-t', str(duration),
                '-pix_fmt', 'yuv420p', '-an', output_clip
            ]
            
            subprocess.run(cmd, capture_output=True)
            concat_file.write(f"file '{output_clip}'\n")

concat_file.close()
EOF

# 合并所有片段
if [ -f "$TEMP_DIR/concat-list.txt" ]; then
  ffmpeg -y -f concat -safe 0 -i "$TEMP_DIR/concat-list.txt" \
    -c copy \
    -movflags +faststart \
    "$OUTPUT_VIDEO"
  
  echo "✅ 视频合成完成: $OUTPUT_VIDEO"
else
  echo "❌ 没有生成视频片段"
fi

# 清理
rm -rf "$TEMP_DIR"
