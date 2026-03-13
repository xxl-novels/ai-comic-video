#!/usr/bin/env node
/**
 * AI 漫剧分镜脚本生成器
 * 输入：小说章节文本
 * 输出：结构化分镜 JSON
 */

const fs = require('fs');
const path = require('path');

// 读取小说文件
const novelPath = process.argv[2];
if (!novelPath) {
  console.error('Usage: node generate-storyboard.js <novel.md>');
  process.exit(1);
}

const novelContent = fs.readFileSync(novelPath, 'utf-8');

// 解析小说结构
function parseNovel(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const scenes = [];
  let currentScene = null;
  
  for (const line of lines) {
    // 检测场景标题
    if (line.startsWith('## ')) {
      if (currentScene) scenes.push(currentScene);
      currentScene = {
        chapter: line.replace('## ', '').trim(),
        description: '',
        panels: []
      };
    }
    // 检测场景描述
    else if (line.startsWith('场景：')) {
      if (currentScene) currentScene.setting = line.replace('场景：', '').trim();
    }
    // 检测对话/叙述
    else if (currentScene && line.length > 10 && !line.startsWith('#')) {
      currentScene.panels.push({
        text: line.trim(),
        type: line.includes('"') || line.includes('「') ? 'dialogue' : 'narration'
      });
    }
  }
  
  if (currentScene) scenes.push(currentScene);
  return scenes;
}

// 生成提示词模板
function generatePrompt(panel, characterPrompt, sceneSetting) {
  const basePrompt = 'masterpiece, best quality, highly detailed, cinematic lighting, modern Chinese urban style';
  
  let contentPrompt = '';
  if (panel.type === 'dialogue') {
    const match = panel.text.match(/"([^"]+)"/) || panel.text.match(/「([^」]+)」/);
    const dialogue = match ? match[1] : panel.text;
    const speaker = panel.text.split(/["「]/)[0].trim();
    
    contentPrompt = `
      ${characterPrompt},
      ${speaker.includes('男') ? '1boy' : '1girl'}, 
      close-up portrait,
      ${sceneSetting || 'indoor'},
      emotional, dramatic
    `;
  } else {
    contentPrompt = `
      ${sceneSetting || 'modern interior'},
      wide shot,
      ${panel.text.includes('医院') ? 'hospital room' : ''},
      ${panel.text.includes('手机') ? 'holding smartphone' : ''},
      atmospheric
    `;
  }
  
  return `${basePrompt}, ${contentPrompt}`.replace(/\s+/g, ' ').trim();
}

// 主流程
async function main() {
  const scenes = parseNovel(novelContent);
  const storyboard = {
    project: path.basename(novelPath, '.md'),
    created: new Date().toISOString(),
    episodes: []
  };
  
  for (const scene of scenes.slice(0, 3)) { // 只处理前3个场景用于测试
    const episode = {
      title: scene.chapter,
      setting: scene.setting || 'modern urban',
      panels: []
    };
    
    // 每3-4个文本段落生成一个画面
    for (let i = 0; i < Math.min(scene.panels.length, 9); i += 3) {
      const panelGroup = scene.panels.slice(i, i + 3);
      const mainPanel = panelGroup[0];
      
      episode.panels.push({
        id: `p${String(i/3 + 1).padStart(3, '0')}`,
        duration: 3 + panelGroup.length,
        narration: panelGroup.map(p => p.text).join('\n'),
        dialogue: panelGroup.filter(p => p.type === 'dialogue').map(p => {
          const match = p.text.match(/"([^"]+)"/) || p.text.match(/「([^」]+)」/);
          return {
            speaker: p.text.split(/["「]/)[0].trim() || ' narrator',
            text: match ? match[1] : p.text
          };
        }),
        prompt: generatePrompt(mainPanel, '1boy, black hair, modern clothes', scene.setting),
        negative_prompt: 'worst quality, low quality, blurry, distorted face, extra limbs, anime, cartoon',
        camera: i === 0 ? 'wide' : (mainPanel.type === 'dialogue' ? 'close-up' : 'medium'),
        emotion: extractEmotion(mainPanel.text)
      });
    }
    
    storyboard.episodes.push(episode);
  }
  
  // 确保 storyboard 目录存在
  const storyboardDir = path.join(path.dirname(novelPath), '..', 'storyboard');
  if (!fs.existsSync(storyboardDir)) {
    fs.mkdirSync(storyboardDir, { recursive: true });
  }
  
  // 输出 JSON 到 storyboard 目录
  const outputPath = path.join(storyboardDir, `${path.basename(novelPath, '.md')}-storyboard.json`);
  fs.writeFileSync(outputPath, JSON.stringify(storyboard, null, 2));
  console.log(`✅ 分镜脚本已生成: ${outputPath}`);
  console.log(`📊 总计: ${storyboard.episodes.length} 集, ${storyboard.episodes.reduce((a, e) => a + e.panels.length, 0)} 个画面`);
}

function extractEmotion(text) {
  const emotions = {
    '笑': 'smiling', '哭': 'crying', '怒': 'angry',
    '冷漠': 'cold, indifferent', '痛苦': 'painful, suffering',
    '震惊': 'shocked, surprised', '开心': 'happy, joyful'
  };
  for (const [cn, en] of Object.entries(emotions)) {
    if (text.includes(cn)) return en;
  }
  return 'neutral';
}

main().catch(console.error);
