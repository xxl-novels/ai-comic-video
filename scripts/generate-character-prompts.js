#!/usr/bin/env node
/**
 * 生成角色定妆照提示词（即梦专用）
 */

const fs = require('fs');

const outputPath = './outputs/character-prompts-for-jimeng.txt';

// 确保输出目录存在
if (!fs.existsSync('./outputs')) {
  fs.mkdirSync('./outputs', { recursive: true });
}

let output = '';

output += `===============================================\n`;
output += `🎭 角色定妆照 - 即梦提示词\n`;
output += `===============================================\n\n`;

output += `📋 使用说明:\n`;
output += `1. 先为每个角色生成定妆照，确定形象\n`;
output += `2. 后续分镜画面参考这些形象保持一致\n`;
output += `3. 保存命名: [角色]-[角度/表情].jpg\n\n`;

// 陈北辰
output += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
output += `👤 角色一: 陈北辰 (男主角)\n`;
output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

output += `🎯 chenbeichen-front.jpg - 正面照\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1boy, `;
output += `22 years old, Chinese male, black short hair, handsome, `;
output += `oval face, sharp features, slender build, 175cm tall, `;
output += `wearing simple white t-shirt, clean background, `;
output += `cinematic lighting, professional headshot, front view, `;
output += `neutral expression, bookish temperament\n\n`;

output += `🎯 chenbeichen-profile.jpg - 侧面照\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1boy, `;
output += `22 years old, Chinese male, black short hair, handsome, `;
output += `side profile view, sharp jawline, slender build, `;
output += `wearing simple white t-shirt, clean background, `;
output += `cinematic lighting, professional headshot, side view\n\n`;

output += `🎯 chenbeichen-cold.jpg - 冷漠表情\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1boy, `;
output += `22 years old, Chinese male, black short hair, handsome, `;
output += `cold expression, indifferent eyes, distant gaze, `;
output += `emotionless face, slightly narrowed eyes, `;
output += `wearing simple white t-shirt, dark background, `;
output += `dramatic lighting, intense atmosphere\n\n`;

output += `🎯 chenbeichen-smirk.jpg - 冷笑表情\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1boy, `;
output += `22 years old, Chinese male, black short hair, handsome, `;
output += `slight smirk, sarcastic smile, eyes without warmth, `;
output += `knowing expression, subtle smile, `;
output += `wearing simple white t-shirt, dark background, `;
output += `dramatic side lighting, mysterious atmosphere\n\n`;

// 柳安然
output += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
output += `👤 角色二: 柳安然 (女主角/反派)\n`;
output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

output += `🎯 liuanran-front.jpg - 正面照\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1girl, `;
output += `22 years old, Chinese female, beautiful, black long hair, `;
output += `straight hair, hair over shoulder, oval face, big eyes, `;
output += `high nose bridge, dimples, slim build, 165cm tall, `;
output += `wearing white dress, clean background, `;
output += `soft lighting, professional headshot, front view, `;
output += `sweet smile, gentle expression, pure and innocent look\n\n`;

output += `🎯 liuanran-profile.jpg - 侧面照\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1girl, `;
output += `22 years old, Chinese female, beautiful, black long hair, `;
output += `side profile view, elegant neck, delicate features, `;
output += `wearing white dress, clean background, `;
output += `soft lighting, professional headshot, side view\n\n`;

output += `🎯 liuanran-sweet.jpg - 甜美微笑\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1girl, `;
output += `22 years old, Chinese female, beautiful, black long hair, `;
output += `big eyes, dimples showing, sweet smile, gentle eyes, `;
output += `approachable expression, warm smile, `;
output += `wearing white dress, soft background, `;
output += `warm lighting, pleasant atmosphere\n\n`;

output += `🎯 liuanran-calculating.jpg - 算计表情\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1girl, `;
output += `22 years old, Chinese female, beautiful, black long hair, `;
output += `slight smile but cold eyes, calculating expression, `;
output += `observant eyes, assessing look, hidden agenda, `;
output += `wearing white dress, dark background, `;
output += `dramatic lighting, mysterious atmosphere\n\n`;

// 周子轩
output += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
output += `👤 角色三: 周子轩 (反派)\n`;
output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

output += `🎯 zhouzixuan-front.jpg - 正面照\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1boy, `;
output += `22 years old, Chinese male, handsome, fashionable hairstyle, `;
output += `slightly dyed hair, brown highlights, confident expression, `;
output += `sporty build, 178cm tall, wearing designer clothes, `;
output += `expensive watch visible, clean background, `;
output += `professional lighting, headshot, front view, `;
output += `rich second generation vibe\n\n`;

output += `🎯 zhouzixuan-fake.jpg - 假热情\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1boy, `;
output += `22 years old, Chinese male, handsome, fashionable hair, `;
output += `fake smile, insincere eyes, pretending to be friendly, `;
output += `smiling but eyes cold, false cheerfulness, `;
output += `wearing designer clothes, dark background, `;
output += `dramatic lighting, unsettling atmosphere\n\n`;

output += `🎯 zhouzixuan-smug.jpg - 得意表情\n`;
output += `----------------------------------------------\n`;
output += `提示词:\n`;
output += `masterpiece, best quality, highly detailed, portrait of 1boy, `;
output += `22 years old, Chinese male, handsome, fashionable hair, `;
output += `smug expression, self-satisfied smile, gloating, `;
output += `victorious look, arrogance in eyes, `;
output += `wearing designer clothes, dark background, `;
output += `dramatic side lighting, confident pose\n\n`;

// 反向提示词
output += `\n===============================================\n`;
output += `🚫 通用反向提示词（所有角色都加）\n`;
output += `===============================================\n\n`;
output += `worst quality, low quality, blurry, distorted face, `;
output += `extra limbs, anime, cartoon, ugly, deformed, `;
output += `bad anatomy, watermark, signature, text\n\n`;

// 汇总
output += `===============================================\n`;
output += `📊 角色定妆照清单\n`;
output += `===============================================\n\n`;
output += `陈北辰: 4 张\n`;
output += `  - chenbeichen-front.jpg (正面)\n`;
output += `  - chenbeichen-profile.jpg (侧面)\n`;
output += `  - chenbeichen-cold.jpg (冷漠)\n`;
output += `  - chenbeichen-smirk.jpg (冷笑)\n\n`;
output += `柳安然: 4 张\n`;
output += `  - liuanran-front.jpg (正面)\n`;
output += `  - liuanran-profile.jpg (侧面)\n`;
output += `  - liuanran-sweet.jpg (甜美)\n`;
output += `  - liuanran-calculating.jpg (算计)\n\n`;
output += `周子轩: 3 张\n`;
output += `  - zhouzixuan-front.jpg (正面)\n`;
output += `  - zhouzixuan-fake.jpg (假热情)\n`;
output += `  - zhouzixuan-smug.jpg (得意)\n\n`;
output += `总计: 11 张角色定妆照\n`;
output += `===============================================\n`;

fs.writeFileSync(outputPath, output);
console.log(`✅ 角色定妆照提示词已生成: ${outputPath}`);
console.log(`📊 共 11 个角色的表情/角度`);
