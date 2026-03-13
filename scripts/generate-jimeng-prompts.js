#!/usr/bin/env node
/**
 * 生成即梦专用提示词（支持多小说）
 * 输出为 Markdown 格式
 */

const fs = require('fs');
const path = require('path');

// 获取小说目录
const novelDir = process.argv[2];
if (!novelDir) {
  console.error('Usage: node generate-jimeng-prompts.js <novel-directory>');
  console.error('Example: node generate-jimeng-prompts.js novels/结婚七年');
  process.exit(1);
}

const storyboardPath = path.join(novelDir, 'storyboard', 'storyboard.json');
if (!fs.existsSync(storyboardPath)) {
  console.error(`❌ 找不到分镜文件: ${storyboardPath}`);
  console.error('请先运行: node scripts/generate-storyboard.js ' + novelDir);
  process.exit(1);
}

const storyboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf-8'));
const projectName = path.basename(novelDir);

// 输出到小说的 outputs 目录
const outputDir = path.join(novelDir, 'outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'prompts-for-jimeng.md');

let output = '';

output += `# 🎨 即梦图片生成提示词清单\n\n`;
output += `- **项目名称**: ${projectName}\n`;
output += `- **生成时间**: ${new Date().toLocaleString()}\n\n`;

output += `---\n\n`;
output += `## 📋 使用说明\n\n`;
output += `1. 复制下面的提示词到即梦\n`;
output += `2. 生成后下载图片\n`;
output += `3. 按命名规则保存到 \`${novelDir}/outputs/images/\`\n`;
output += `4. **命名规则**: \`ep[章节]-p[编号].jpg\`\n`;
output += `   - 例如: \`ep01-p001.jpg\` = 第一章第1个画面\n\n`;

output += `---\n\n`;

for (let epIndex = 0; epIndex < storyboard.episodes.length; epIndex++) {
  const episode = storyboard.episodes[epIndex];
  const epNum = String(epIndex + 1).padStart(2, '0');
  
  output += `## 📺 第${epIndex + 1}章: ${episode.title}\n\n`;
  output += `- **场景**: ${episode.setting}\n`;
  output += `- **画面数**: ${episode.panels.length} 张\n\n`;
  
  for (const panel of episode.panels) {
    const filename = `ep${epNum}-${panel.id}.jpg`;
    
    output += `### 🎯 ${filename}\n\n`;
    output += `| 属性 | 值 |\n`;
    output += `|------|-----|\n`;
    output += `| 景别 | ${panel.camera} |\n`;
    output += `| 运镜 | ${panel.camera_movement} |\n`;
    output += `| 情绪 | ${panel.emotion} |\n`;
    output += `| 角色 | ${panel.characters.join(', ') || '无'} |\n\n`;
    
    output += `**即梦提示词**:\n\n`;
    output += '```\n';
    output += `${panel.prompt}\n`;
    output += '```\n\n';
    
    output += `**反向提示词**:\n\n`;
    output += '```\n';
    output += `${panel.negative_prompt}\n`;
    output += '```\n\n';
    
    output += `**画面描述**: ${panel.narration.substring(0, 150)}...\n\n`;
    
    if (panel.dialogue.length > 0) {
      output += `**对话**:\n\n`;
      for (const d of panel.dialogue) {
        output += `- **${d.speaker}**: ${d.text.substring(0, 50)}...\n`;
      }
      output += '\n';
    }
    
    output += `✅ 生成后保存为: \`${filename}\`\n\n`;
    output += `---\n\n`;
  }
}

output += `## 📊 生成清单汇总\n\n`;

let totalPanels = 0;
for (let i = 0; i < storyboard.episodes.length; i++) {
  const ep = storyboard.episodes[i];
  const epNum = String(i + 1).padStart(2, '0');
  output += `### 第${i + 1}章: ${ep.panels.length} 张\n\n`;
  for (const panel of ep.panels) {
    output += `- [ ] \`ep${epNum}-${panel.id}.jpg\`\n`;
    totalPanels++;
  }
  output += '\n';
}

output += `**总计**: ${totalPanels} 张图片\n\n`;
output += `**预估成本**: ¥${(totalPanels * 0.22).toFixed(2)} (API) 或 即梦会员\n`;

fs.writeFileSync(outputPath, output);
console.log(`✅ 提示词清单已生成: ${outputPath}`);
console.log(`📊 共 ${totalPanels} 个画面的提示词`);
console.log(`\n下一步:`);
console.log(`1. 打开 ${outputPath}`);
console.log(`2. 复制提示词到即梦生成`);
console.log(`3. 下载图片保存到 ${novelDir}/outputs/images/`);
