#!/usr/bin/env node
/**
 * AI 漫剧分镜脚本生成器（增强版）
 * 读取角色和场景设定，生成更具体的提示词
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
const projectRoot = path.dirname(novelPath);

// 加载角色设定
function loadCharacter(name) {
  const charPath = path.join(projectRoot, '..', 'characters', name, 'description.md');
  if (fs.existsSync(charPath)) {
    return fs.readFileSync(charPath, 'utf-8');
  }
  return null;
}

// 加载场景设定
function loadScene(sceneName) {
  const scenePath = path.join(projectRoot, '..', 'scenes', `${sceneName}.md`);
  if (fs.existsSync(scenePath)) {
    return fs.readFileSync(scenePath, 'utf-8');
  }
  return null;
}

// 解析角色提示词
function getCharacterPrompt(charName, emotion = 'neutral') {
  const charDesc = loadCharacter(charName);
  if (!charDesc) return '1boy, black hair';
  
  // 基础描述
  let prompt = '';
  
  if (charName === '陈北辰') {
    prompt = '1boy, black hair, short hair, handsome, 22 years old, Chinese male, slender build';
    if (emotion === '冷漠') prompt += ', cold expression, indifferent eyes';
    if (emotion === '冷笑') prompt += ', slight smirk, sarcastic smile';
    if (emotion === '沉思') prompt += ', looking down, contemplative';
    if (emotion === '愤怒') prompt += ', clenched jaw, intense stare';
    if (emotion === '痛苦') prompt += ', sad eyes, melancholic';
  } else if (charName === '柳安然') {
    prompt = '1girl, black long hair, beautiful, 22 years old, Chinese female, big eyes, dimples';
    if (emotion === '甜美') prompt += ', sweet smile, dimples, gentle eyes';
    if (emotion === '困惑') prompt += ', confused expression, puzzled look';
    if (emotion === '得意') prompt += ', smug smile, self-satisfied';
  } else if (charName === '周子轩') {
    prompt = '1boy, fashionable hairstyle, stylish, 22 years old, Chinese male, handsome';
    if (emotion === '假热情') prompt += ', fake smile, insincere eyes';
    if (emotion === '得意') prompt += ', smug expression, gloating';
  }
  
  return prompt;
}

// 获取场景提示词
function getScenePrompt(sceneName) {
  if (sceneName.includes('医院')) {
    return 'hospital room, white walls, medical equipment, heart rate monitor, IV drip, hospital bed';
  } else if (sceneName.includes('宿舍')) {
    return 'university dormitory, male dorm room, bunk bed, morning sunlight, student life';
  } else if (sceneName.includes('毕业')) {
    return 'graduation ceremony, university campus, outdoor venue, crowd of students, sunny day';
  }
  return 'modern interior';
}

// 检测场景 - 基于内容而非标题
function detectScene(text, chapterTitle = '') {
  const lowerText = text.toLowerCase();
  
  // 医院相关关键词（最高优先级）
  if (lowerText.includes('病房') || lowerText.includes('医院') || 
      lowerText.includes('监护仪') || lowerText.includes('病床') ||
      lowerText.includes('肺癌') || lowerText.includes('临终') ||
      lowerText.includes('输液') || lowerText.includes('氧气管') ||
      lowerText.includes('病人') || lowerText.includes('医生') ||
      (lowerText.includes('死') && lowerText.includes('三个月'))) {
    return { name: '医院病房', type: 'hospital' };
  }
  
  // 宿舍相关关键词
  if ((lowerText.includes('宿舍') || lowerText.includes('起床') || 
       lowerText.includes('床上') || lowerText.includes('室友') ||
       lowerText.includes('睡觉') || lowerText.includes('醒来')) &&
      !lowerText.includes('医院') && !lowerText.includes('病房')) {
    return { name: '大学宿舍', type: 'dorm' };
  }
  
  // 毕业典礼相关关键词
  if (lowerText.includes('毕业典礼') || lowerText.includes('典礼') ||
      lowerText.includes('学士服') || lowerText.includes('毕业') ||
      (lowerText.includes('人群') && lowerText.includes('校园'))) {
    return { name: '毕业典礼', type: 'graduation' };
  }
  
  // 根据章节默认返回
  if (chapterTitle.includes('含恨而终')) return { name: '医院病房', type: 'hospital' };
  if (chapterTitle.includes('提前布局')) return { name: '毕业典礼', type: 'graduation' };
  if (chapterTitle.includes('反杀')) return { name: 'modern interior', type: 'generic' };
  
  return { name: 'modern interior', type: 'generic' };
}

// 检测角色
function detectCharacters(text) {
  const chars = [];
  if (text.includes('陈北辰') || text.includes('北辰')) chars.push('陈北辰');
  if (text.includes('柳安然') || text.includes('安然')) chars.push('柳安然');
  if (text.includes('周子轩') || text.includes('子轩')) chars.push('周子轩');
  return chars;
}

// 检测情绪
function detectEmotion(text, characters) {
  if (text.includes('冷笑') || text.includes('冷笑')) return '冷笑';
  if (text.includes('冷漠') || text.includes('冷淡')) return '冷漠';
  if (text.includes('愤怒') || text.includes('恨')) return '愤怒';
  if (text.includes('痛苦') || text.includes('不甘')) return '痛苦';
  if (text.includes('甜美') || text.includes('微笑') || text.includes('酒窝')) return '甜美';
  if (text.includes('困惑') || text.includes('愣')) return '困惑';
  if (text.includes('得意')) return '得意';
  return 'neutral';
}

// 解析小说结构
function parseNovel(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const scenes = [];
  let currentScene = null;
  let currentSetting = 'modern interior';
  
  for (const line of lines) {
    // 检测章节标题
    if (line.startsWith('## ')) {
      if (currentScene) scenes.push(currentScene);
      currentScene = {
        chapter: line.replace('## ', '').trim(),
        description: '',
        panels: [],
        setting: detectScene(line).name
      };
    }
    // 检测场景描述（导语或特殊标记）
    else if (line.startsWith('**导语**') || line.startsWith('场景：')) {
      // 导语通常是场景描述
    }
    // 检测正文内容
    else if (currentScene && line.length > 10 && !line.startsWith('#') && !line.startsWith('---')) {
      const sceneInfo = detectScene(line, currentScene.chapter);
      
      // 只在第一次检测到有效场景时设置，或更具体的场景覆盖通用场景
      if (sceneInfo.type !== 'generic') {
        // 如果当前场景是通用的，或者新检测到的更具体，则更新
        const currentIsGeneric = currentScene.setting === 'modern interior' || 
                                  currentScene.setting === 'generic';
        if (currentIsGeneric) {
          currentScene.setting = sceneInfo.name;
        }
      }
      
      currentScene.panels.push({
        text: line.trim(),
        type: line.includes('「') || line.includes('"') ? 'dialogue' : 'narration',
        characters: detectCharacters(line),
        scene: sceneInfo
      });
    }
  }
  
  if (currentScene) scenes.push(currentScene);
  return scenes;
}

// 生成提示词
function generatePrompt(panel, sceneName, emotion) {
  const basePrompt = 'masterpiece, best quality, highly detailed, cinematic lighting';
  
  // 场景描述
  const scenePrompt = getScenePrompt(sceneName);
  
  // 角色描述
  let characterPrompt = '';
  if (panel.characters && panel.characters.length > 0) {
    const mainChar = panel.characters[0];
    characterPrompt = getCharacterPrompt(mainChar, emotion);
  }
  
  // 镜头类型
  let cameraPrompt = '';
  if (panel.type === 'dialogue') {
    cameraPrompt = 'close-up portrait, emotional, dramatic';
  } else if (panel.characters.length === 0) {
    cameraPrompt = 'wide shot, atmospheric';
  } else {
    cameraPrompt = 'medium shot, cinematic composition';
  }
  
  // 情绪氛围
  let emotionPrompt = '';
  if (emotion === '冷漠') emotionPrompt = 'cold atmosphere, tense';
  if (emotion === '痛苦') emotionPrompt = 'sad atmosphere, melancholic';
  if (emotion === '愤怒') emotionPrompt = 'intense atmosphere, dramatic lighting';
  if (emotion === '甜美') emotionPrompt = 'warm light, pleasant atmosphere';
  
  return `${basePrompt}, ${scenePrompt}, ${characterPrompt}, ${cameraPrompt}, ${emotionPrompt}`
    .replace(/\s+/g, ' ')
    .trim();
}

// 主流程
async function main() {
  const scenes = parseNovel(novelContent);
  const storyboard = {
    project: path.basename(novelPath, '.md'),
    created: new Date().toISOString(),
    episodes: []
  };
  
  for (const scene of scenes.slice(0, 3)) { // 只处理前3个章节
    console.log(`处理章节: ${scene.chapter} - 场景: ${scene.setting}`);
    
    const episode = {
      title: scene.chapter,
      setting: scene.setting,
      panels: []
    };
    
    // 每3-4个段落生成一个画面
    for (let i = 0; i < Math.min(scene.panels.length, 12); i += 3) {
      const panelGroup = scene.panels.slice(i, i + 3);
      const mainPanel = panelGroup[0];
      const emotion = detectEmotion(mainPanel.text, mainPanel.characters);
      
      // 提取对话
      const dialogues = [];
      for (const p of panelGroup) {
        if (p.type === 'dialogue') {
          const matches = p.text.match(/「([^」]+)」/g) || p.text.match(/"([^"]+)"/g);
          if (matches) {
            for (const match of matches) {
              const cleanText = match.replace(/[「」"]/g, '');
              // 检测说话人
              let speaker = '旁白';
              if (p.text.includes('柳安然') || cleanText.includes('同学') && cleanText.includes('计算机')) speaker = '柳安然';
              else if (p.text.includes('陈北辰') || cleanText.includes('那边')) speaker = '陈北辰';
              else if (p.text.includes('周子轩') || cleanText.includes('北辰') && p.text.includes('起床')) speaker = '周子轩';
              
              dialogues.push({ speaker, text: cleanText });
            }
          }
        }
      }
      
      // 生成旁白（取第一个段落）
      const narration = panelGroup.map(p => p.text).join('\n');
      
      episode.panels.push({
        id: `p${String(i/3 + 1).padStart(3, '0')}`,
        duration: 4 + panelGroup.length,
        narration: narration.substring(0, 200), // 限制长度
        dialogue: dialogues,
        prompt: generatePrompt(mainPanel, scene.setting, emotion),
        negative_prompt: 'worst quality, low quality, blurry, distorted face, extra limbs, anime, cartoon, ugly',
        camera: mainPanel.type === 'dialogue' ? 'close-up' : (i === 0 ? 'wide' : 'medium'),
        emotion: emotion,
        characters: mainPanel.characters,
        scene: scene.setting
      });
    }
    
    storyboard.episodes.push(episode);
  }
  
  // 确保 storyboard 目录存在
  const storyboardDir = path.join(projectRoot, '..', 'storyboard');
  if (!fs.existsSync(storyboardDir)) {
    fs.mkdirSync(storyboardDir, { recursive: true });
  }
  
  // 输出 JSON
  const outputPath = path.join(storyboardDir, `${path.basename(novelPath, '.md')}-storyboard.json`);
  fs.writeFileSync(outputPath, JSON.stringify(storyboard, null, 2));
  console.log(`\n✅ 分镜脚本已生成: ${outputPath}`);
  console.log(`📊 总计: ${storyboard.episodes.length} 集, ${storyboard.episodes.reduce((a, e) => a + e.panels.length, 0)} 个画面`);
  
  // 打印预览
  console.log('\n📋 分镜预览:');
  for (const ep of storyboard.episodes) {
    console.log(`\n【${ep.title}】- ${ep.setting}`);
    for (const panel of ep.panels) {
      console.log(`  ${panel.id}: ${panel.camera} | ${panel.emotion} | 角色: ${panel.characters.join(', ') || '无'}`);
      console.log(`     提示词: ${panel.prompt.substring(0, 80)}...`);
    }
  }
}

main().catch(console.error);
