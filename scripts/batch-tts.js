#!/usr/bin/env node
/**
 * 批量生成 AI 配音
 * 输入：分镜 JSON
 * 输出：MP3 音频文件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const storyboardPath = process.argv[2];
const outputDir = process.argv[3] || './outputs/audio';

const storyboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf-8'));

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 角色声音映射
const voiceMap = {
  '旁白': { voice: 'zh-CN-YunjianNeural', pitch: -10, rate: -5 },
  '男': { voice: 'zh-CN-YunxiNeural', pitch: 0, rate: 0 },
  '女': { voice: 'zh-CN-XiaoxiaoNeural', pitch: 0, rate: 0 },
  'default': { voice: 'zh-CN-YunxiNeural', pitch: 0, rate: 0 }
};

async function generateTTS(text, voice, outputFile) {
  try {
    execSync(
      `edge-tts --voice "${voice}" --text "${text}" --write-media "${outputFile}"`,
      { stdio: 'pipe' }
    );
    return true;
  } catch (err) {
    console.error(`TTS 失败: ${err.message}`);
    return false;
  }
}

async function main() {
  for (const episode of storyboard.episodes) {
    console.log(`\n🎙️ 处理: ${episode.title}`);
    
    for (const panel of episode.panels) {
      // 生成旁白
      if (panel.narration) {
        const outputFile = path.join(outputDir, `${panel.id}-narration.mp3`);
        const voice = voiceMap['旁白'];
        console.log(`  [旁白] ${panel.id}`);
        await generateTTS(panel.narration, voice.voice, outputFile);
      }
      
      // 生成对话
      for (let i = 0; i < panel.dialogue.length; i++) {
        const dialogue = panel.dialogue[i];
        const outputFile = path.join(outputDir, `${panel.id}-dialogue-${i}.mp3`);
        const voice = voiceMap[dialogue.speaker.includes('女') ? '女' : '男'] || voiceMap['default'];
        console.log(`  [对话] ${dialogue.speaker}: ${dialogue.text.substring(0, 20)}...`);
        await generateTTS(dialogue.text, voice.voice, outputFile);
      }
      
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  console.log(`\n✅ 配音生成完成，保存至: ${outputDir}`);
}

main().catch(console.error);
