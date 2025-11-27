# NeonSwitch - 双模态交互式简历

NeonSwitch 是一个极具视觉冲击力的交互式简历网站模板。它打破了传统简历的单调形式，引入了“双模态”概念：用户可以在**专业模式（A面）**和**赛博朋克模式（B面）**之间自由切换，通过炫酷的转场动画展示你的不同侧面。

## ✨ 功能特性

*   **双模态设计**：
    *   **A面 (Normal Mode)**：展示传统的专业简历图片，适合正式场合。
    *   **B面 (Neon Mode)**：赛博朋克风格的个人主页，展示个性标签、技能卡片和兴趣爱好。
*   **炫酷转场**：包含黑屏闪烁、Logo 变形/弹出、苦无（飞镖）飞入等动画效果。
*   **多角色支持**：一套代码支持多份简历配置，通过 URL 参数即可无缝切换不同角色的简历。
*   **高度可配置**：所有文字、图片、颜色、动画模式均可在配置文件中修改，无需改动核心代码。

## 🚀 快速开始

### 1. 打开网站
直接在浏览器中打开 `index.html` 文件即可预览。

### 2. 切换角色
本项目支持多角色配置。默认加载 `Doloris` 的配置。
你可以通过在 URL 后添加 `?role=名字` 来查看不同角色的简历：

*   **默认角色 (Doloris)**: 打开 `index.html` 或 `index.html?role=Doloris`
*   **其他角色 (例如 Mortis)**: 打开 `index.html?role=Mortis`

> **注意**：系统会自动寻找名为 `config_角色名.js` 的文件（首字母会自动大写）。例如 `?role=mortis` 会尝试加载 `config_Mortis.js`。

## ⚙️ 配置指南

本项目不再使用单一的 `config.js`，而是采用 **`config_角色名.js`** 的命名方式。
你可以复制现有的 `config_Doloris.js` 来创建自己的配置文件（例如 `config_MyName.js`）。

### 配置文件结构说明

打开任意 `config_*.js` 文件，你会看到如下结构。所有内容均可修改：

#### 1. 全局配置 (global)
控制网站的基础设置和动画风格。

```javascript
global: {
    initialMode: 'normal',      // 初始模式：'normal'(A面) 或 'neon'(B面)
    logoPath: 'assets/logo.png',// 你的个人 Logo
    kunaiPath: 'assets/Kunai.png', // 转场动画中的飞镖图片
    
    // 动画模式设置
    animationModes: {
        logo: 'pop',   // 'pop'(直接闪现) 或 'morph'(扭曲变形)
        kunai: 'drop'  // 'fade'(淡出) 或 'drop'(下落+背景闪烁)
    },
    
    slogan: '一体两面 · Now you see me', // 切换按钮下方的文字
    pageTitle: '双模态简历'             // 浏览器标签页标题
}
```

#### 2. A面配置 (normalMode)
传统简历的展示设置。

```javascript
normalMode: {
    resumeImagePath: 'assets/resume_doloris.png', // 简历图片路径 (建议使用长图)
    backgroundColor: '#ffffff'                    // 背景颜色
}
```

#### 3. B面配置 (neonMode)
个性化界面的核心配置。

```javascript
neonMode: {
    primaryColor: '#ffe100ff', // 主题色 (霓虹灯光颜色)
    backgroundColor: '#0a0a0a',// 背景色 (建议深色)

    // 个人信息区域
    profile: {
        name: 'Doloris',
        title: '职位 / 称号',
        avatar: 'assets/avatar.png',
        mbti: 'E-N-F-J',
        tags: ['标签1', '标签2'], // 个人标签数组
        music: '喜欢的音乐风格',
        bio: '个人简介 (支持 HTML <br> 换行)'
    },

    // 卡片列表 (技能、兴趣等)
    cards: [
        {
            title: '卡片标题',
            content: '卡片内容描述'
        },
        // 可以添加任意数量的卡片...
    ]
}
```

## 📂 目录结构

```
NeonSwitch_MVP/
├── assets/              # 存放图片资源 (Logo, 简历图, 头像等)
├── config_Doloris.js    # Doloris 的配置文件
├── config_Mortis.js     # Mortis 的配置文件
├── index.html           # 网站入口 (包含动态加载逻辑)
├── script.js            # 核心逻辑 (动画控制, 页面渲染)
├── style.css            # 样式文件 (包含霓虹特效和动画定义)
└── README.md            # 说明文档
```

## 🛠️ 如何添加新角色

1.  复制 `config_Doloris.js` 文件。
2.  重命名为 `config_你的名字.js` (例如 `config_Alex.js`)。
3.  修改文件中的内容（图片路径、文案、颜色等）。
4.  在浏览器访问 `index.html?role=Alex` 即可查看效果。

