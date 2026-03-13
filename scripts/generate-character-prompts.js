#!/usr/bin/env node
/**
 * 生成角色定妆照提示词（即梦专用）- Markdown 格式
 */

const fs = require('fs');
const path = require('path');

// 获取输出路径（可选参数）
const outputPath = process.argv[2] || './outputs/character-prompts-for-jimeng.md';

// 确保输出目录存在
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const output = `# 🎭 角色定妆照 - 即梦提示词

---

## 📋 使用说明

1. 先为每个角色生成定妆照，确定形象
2. 后续分镜画面参考这些形象保持一致
3. 保存命名: \`[角色拼音]-[角度/表情].jpg\`

---

## 👤 角色一: 陈北辰 (男主角)

### chenbeichen-front.jpg - 正面照

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1boy, 22 years old, Chinese male, black short hair, handsome, oval face, sharp features, slender build, 175cm tall, wearing simple white t-shirt, clean background, cinematic lighting, professional headshot, front view, neutral expression, bookish temperament
\`\`\`

---

### chenbeichen-profile.jpg - 侧面照

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1boy, 22 years old, Chinese male, black short hair, handsome, side profile view, sharp jawline, slender build, wearing simple white t-shirt, clean background, cinematic lighting, professional headshot, side view
\`\`\`

---

### chenbeichen-cold.jpg - 冷漠表情

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1boy, 22 years old, Chinese male, black short hair, handsome, cold expression, indifferent eyes, distant gaze, emotionless face, slightly narrowed eyes, wearing simple white t-shirt, dark background, dramatic lighting, intense atmosphere
\`\`\`

---

### chenbeichen-smirk.jpg - 冷笑表情

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1boy, 22 years old, Chinese male, black short hair, handsome, slight smirk, sarcastic smile, eyes without warmth, knowing expression, subtle smile, wearing simple white t-shirt, dark background, dramatic side lighting, mysterious atmosphere
\`\`\`

---

## 👤 角色二: 柳安然 (女主角/反派)

### liuanran-front.jpg - 正面照

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1girl, 22 years old, Chinese female, beautiful, black long hair, straight hair, hair over shoulder, oval face, big eyes, high nose bridge, dimples, slim build, 165cm tall, wearing white dress, clean background, soft lighting, professional headshot, front view, sweet smile, gentle expression, pure and innocent look
\`\`\`

---

### liuanran-profile.jpg - 侧面照

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1girl, 22 years old, Chinese female, beautiful, black long hair, side profile view, elegant neck, delicate features, wearing white dress, clean background, soft lighting, professional headshot, side view
\`\`\`

---

### liuanran-sweet.jpg - 甜美微笑

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1girl, 22 years old, Chinese female, beautiful, black long hair, big eyes, dimples showing, sweet smile, gentle eyes, approachable expression, warm smile, wearing white dress, soft background, warm lighting, pleasant atmosphere
\`\`\`

---

### liuanran-calculating.jpg - 算计表情

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1girl, 22 years old, Chinese female, beautiful, black long hair, slight smile but cold eyes, calculating expression, observant eyes, assessing look, hidden agenda, wearing white dress, dark background, dramatic lighting, mysterious atmosphere
\`\`\`

---

## 👤 角色三: 周子轩 (反派)

### zhouzixuan-front.jpg - 正面照

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1boy, 22 years old, Chinese male, handsome, fashionable hairstyle, slightly dyed hair, brown highlights, confident expression, sporty build, 178cm tall, wearing designer clothes, expensive watch visible, clean background, professional lighting, headshot, front view, rich second generation vibe
\`\`\`

---

### zhouzixuan-fake.jpg - 假热情

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1boy, 22 years old, Chinese male, handsome, fashionable hair, fake smile, insincere eyes, pretending to be friendly, smiling but eyes cold, false cheerfulness, wearing designer clothes, dark background, dramatic lighting, unsettling atmosphere
\`\`\`

---

### zhouzixuan-smug.jpg - 得意表情

**即梦提示词**:

\`\`\`
masterpiece, best quality, highly detailed, portrait of 1boy, 22 years old, Chinese male, handsome, fashionable hair, smug expression, self-satisfied smile, gloating, victorious look, arrogance in eyes, wearing designer clothes, dark background, dramatic side lighting, confident pose
\`\`\`

---

## 🚫 通用反向提示词

所有角色生成时都在反向提示词中加入以下内容：

\`\`\`
worst quality, low quality, blurry, distorted face, extra limbs, anime, cartoon, ugly, deformed, bad anatomy, watermark, signature, text
\`\`\`

---

## 📊 角色定妆照清单

### 陈北辰: 4 张

- [ ] \`chenbeichen-front.jpg\` (正面)
- [ ] \`chenbeichen-profile.jpg\` (侧面)
- [ ] \`chenbeichen-cold.jpg\` (冷漠)
- [ ] \`chenbeichen-smirk.jpg\` (冷笑)

### 柳安然: 4 张

- [ ] \`liuanran-front.jpg\` (正面)
- [ ] \`liuanran-profile.jpg\` (侧面)
- [ ] \`liuanran-sweet.jpg\` (甜美)
- [ ] \`liuanran-calculating.jpg\` (算计)

### 周子轩: 3 张

- [ ] \`zhouzixuan-front.jpg\` (正面)
- [ ] \`zhouzixuan-fake.jpg\` (假热情)
- [ ] \`zhouzixuan-smug.jpg\` (得意)

**总计**: 11 张角色定妆照
`;

fs.writeFileSync(outputPath, output);
console.log(`✅ 角色定妆照提示词已生成: ${outputPath}`);
console.log(`📊 共 11 个角色的表情/角度`);
