// NeonSwitch 配置文件
// 用户可以在这里修改文字、颜色和图片路径

const config = {
    // 全局配置
    global: {
        // 初始模式: 'normal' (A面) 或 'neon' (B面)
        initialMode: 'normal',
        // 你的个人LOGO图片路径 (建议透明背景PNG)
        logoPath: 'assets/logo.png',
        
        // 苦无图片路径 (新增)
        kunaiPath: 'assets/Dog.png',

        // 转场动画中闪现的两个额外Logo (如果不填则默认使用 logoPath)
        transitionLogos: {
            logo1: 'assets/OP.png', // 第一次闪现
            logo2: 'assets/PM.png'  // 第二次闪现
        },

        // 动画模式配置 (新增)
        animationModes: {
            // Logo 过渡模式: 'pop' (默认闪现) | 'morph' (扭曲变换)
            logo: 'pop', 
            // 苦无结束模式: 'fade' (默认消失) | 'drop' (向下冲刺+背景闪烁)
            kunai: 'drop' 
        },

        // 切换按钮旁边的标语
        slogan: '一体两面 · Now you see me',
        // 网页标题
        pageTitle: '双模态简历'
    },

    // A面：专业简历 (Professional View)
    normalMode: {
        // 简历图片路径 (可以是长图)
        resumeImagePath: 'assets/resume_doloris.png',
        // 背景色 (默认白色)
        backgroundColor: '#ffffffff'
    },

    // B面：霓虹模式 (Cyberpunk View)
    neonMode: {
        // 霓虹主色调 (影响边框、文字发光、苦无描边)
        // 建议使用高饱和度的颜色，如 #fbff00ff (绿), #00ffff (蓝), #ff00ff (紫), #ff0055 (红)
        primaryColor: '#ffe100ff', 
        
        // 背景色 (建议深黑，影响 B 面整体背景)
        backgroundColor: '#0a0a0a',

        // 个人信息卡片
        profile: {
            name: 'Doloris',
            title: 'Saki酱 Saki酱 Saki酱  <br> Saki酱 Saki酱 Saki酱',
            avatar: 'assets/uika.png', // B面头像
            
            // MBTI 人格类型
            mbti: 'E-N-F-J',
            
            // 个人标签
            tags: [
                '压抑了',
                '双脚着地',
                '咖啡重度依赖',
                '三角贸易'
            ],
            
            // 音乐风格
            music: 'Pop Music / Goth Rock',
            
            // 简短介绍 (支持HTML标签)
            bio: '绿蚁新醅酒 <br> 红泥小火炉 <br> 晚来祥欲雪 <br> 能饮一杯无 '
        },

        // 技能/兴趣展示 (卡片列表)
        cards: [
            {
                title: '手机依赖',
                content: '重度'
            },
            {
                title: '表演能力',
                content: '天啊，是初华大人'
            },
            {
                title: '抗寒能力',
                content: '0'
            },
            {
                title: '你好能力：',
                content: 'helloword!'
            }
        ]
    }
};

// 导出配置供 script.js 使用
window.resumeConfig = config;
