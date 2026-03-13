#!/usr/bin/env node
/**
 * 生成即梦专用提示词
 * 输出为易读的文本格式，方便复制粘贴
 */

const fs = require('fs');
const path = require('path');

const storyboardPath = process.argv[2] || './storyboard/正文-storyboard.json';
const outputPath = process.argv[3] || './outputs/prompts-for-jimeng.txt';

if (!fs.existsSync(storyboardPath)) {
  console.error(`❌ 找不到分镜文件: ${storyboardPath}`);
  process.exit(1);
}

const storyboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf-8'));

// 确保输出目录存在
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let output = '';

output += `===============================================\n`;
output += `🎨 即梦图片生成提示词清单\n`;
output += `项目名称: ${storyboard.project}\n`;
output += `生成时间: ${new Date().toLocaleString()}\n`;
output += `===============================================\n\n`;

output += `📋 使用说明:\n`;
output += `1. 复制下面的提示词到即梦\n`;
output += `2. 生成后下载图片\n`;
output += `3. 按命名规则保存到 outputs/images/\n`;
output += `4. 命名规则: ep[章节]-p[编号].jpg\n`;
output += `   例如: ep01-p001.jpg = 第一章第1个画面\n\n`;
output += `===============================================\n\n`;

for (let epIndex = 0; epIndex < storyboard.episodes.length; epIndex++) {
  const episode = storyboard.episodes[epIndex];
  const epNum = String(epIndex + 1).padStart(2, '0');
  
  output += `\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `📺 第${epIndex + 1}章: ${episode.title}\n`;
  output += `🎬 场景: ${episode.setting}\n`;
  output += `🖼️ 画面数: ${episode.panels.length} 张\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  for (const panel of episode.panels) {
    const panelNum = panel.id.replace('p', '');
    const filename = `ep${epNum}-${panel.id}.jpg`;
    
    output += `─────────────────────────────────────────────\n`;
    output += `🎯 ${filename}\n`;
    output += `─────────────────────────────────────────────\n`;
    output += `📐 景别: ${panel.camera}\n`;
    output += `🎥 运镜: ${panel.camera_movement}\n`;
    output += `😊 情绪: ${panel.emotion}\n`;
    output += `👥 角色: ${panel.characters.join(', ') || '无'}\n`;
    output += `\n`;
    output += `📝 即梦提示词:\n`;
    output += `${panel.prompt}\n`;
    output += `\n`;
    output += `🚫 反向提示词:\n`;
    output += `${panel.negative_prompt}\n`;
    output += `\n`;
    output += `📖 画面描述:\n`;
    output += `${panel.narration.substring(0, 150)}...\n`;
    output += `\n`;
    
    if (panel.dialogue.length > 0) {
      output += `💬 对话:\n`;
      for (const d of panel.dialogue) {
        output += `   ${d.speaker}: ${d.text.substring(0, 50)}...\n`;
      }
      output += `\n`;
    }
    
    output += `✅ 生成后保存为: ${filename}\n`;
    output += `\n`;
  }
}

output += `\n===============================================\n`;
output += `📊 生成清单汇总\n`;
output += `===============================================\n`;

let totalPanels = 0;
for (let i = 0; i < storyboard.episodes.length; i++) {
  const ep = storyboard.episodes[i];
  const epNum = String(i + 1).padStart(2, '0');
  output += `第${i + 1}章: ${ep.panels.length} 张 (${epNum})\n`;
  for (const panel of ep.panels) {
    output += `   - ep${epNum}-${panel.id}.jpg\n`;
    totalPanels++;
  }
}

output += `\n总计: ${totalPanels} 张图片\n`;
output += `===============================================\n`;

fs.writeFileSync(outputPath, output);
console.log(`✅ 提示词清单已生成: ${outputPath}`);
console.log(`📊 共 ${totalPanels} 个画面的提示词`);
console.log(`\n下一步:`);
console.log(`1. 打开 ${outputPath}`);
console.log(`2. 复制提示词到即梦生成`);
console.log(`3. 下载图片保存到 outputs/images/`);
