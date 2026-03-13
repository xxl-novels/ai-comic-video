#!/usr/bin/env node
/**
 * 批量生成漫画画面
 * 输入：分镜 JSON
 * 输出：AI 生成图片（使用 doubao-image）
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const storyboardPath = process.argv[2] || './storyboard/正文-storyboard.json';
const outputDir = process.argv[3] || './outputs/images';

if (!storyboardPath) {
  console.error('Usage: node batch-generate-images.js <storyboard.json> [output-dir]');
  process.exit(1);
}

const storyboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf-8'));

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateImage(panel, index) {
  const outputFile = path.join(outputDir, `${panel.id}.jpg`);
  
  // 根据镜头类型调整尺寸
  let size = '1024x1024';
  if (panel.camera === 'wide') size = '1920x1080';
  if (panel.camera === 'close-up') size = '1080x1920';
  
  console.log(`[${index + 1}] 生成: ${panel.id} - ${panel.camera}`);
  console.log(`    提示词: ${panel.prompt.substring(0, 80)}...`);
  
  try {
    // 使用 doubao-image 生成
    execSync(
      `node ~/.openclaw/skills/doubao-image/generate.js "${panel.prompt}" ` +
      `--size ${size} --output ${outputDir} --no-watermark`,
      { stdio: 'inherit' }
    );
    
    console.log(`    ✅ 已保存: ${outputFile}`);
    return outputFile;
  } catch (err) {
    console.error(`    ❌ 生成失败: ${panel.id}`, err.message);
    return null;
  }
}

async function main() {
  let total = 0;
  let success = 0;
  
  for (const episode of storyboard.episodes) {
    console.log(`\n📺 处理: ${episode.title}`);
    
    for (let i = 0; i < episode.panels.length; i++) {
      total++;
      const result = await generateImage(episode.panels[i], i);
      if (result) success++;
      
      // 添加延迟避免 API 限流
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  console.log(`\n✅ 批量生成完成: ${success}/${total}`);
}

main().catch(console.error);
