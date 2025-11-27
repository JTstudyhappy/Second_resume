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
        kunaiPath: 'assets/Kunai2.png',

        // 转场动画中闪现的两个额外Logo (如果不填则默认使用 logoPath)
        transitionLogos: {
            logo1: 'assets/OP.png', // 第一次闪现
            logo2: 'assets/PM.png'  // 第二次闪现
        },

        // 动画模式配置 (新增)
        animationModes: {
            // Logo 过渡模式: 'pop' (默认闪现) | 'morph' (扭曲变换)
            logo: 'morph', 
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
        resumeImagePath: 'assets/resume_mortis.png',
        // 背景色 (默认白色)
        backgroundColor: '#ffffff'
    },

    // B面：霓虹模式 (Cyberpunk View)
    neonMode: {
        // 霓虹主色调 (影响边框、文字发光、苦无描边)
        // 建议使用高饱和度的颜色，如 #fbff00ff (绿), #00ffff (蓝), #ff00ff (紫), #ff0055 (红)
        primaryColor: '#5ceb82ff', 
        
        // 背景色 (建议深黑，影响 B 面整体背景)
        backgroundColor: '#0a0a0a',

        // 个人信息卡片
        profile: {
            name: 'Mortis',
            title: '天啊  <br> 是莫提斯大人',
            avatar: 'assets/mortis.png', // B面头像
            
            // MBTI 人格类型
            mbti: 'I-N-T-P',
            
            // 个人标签
            tags: [
                '天才少女',
                '自给自足',
                '抗压这一块',
            ],
            
            // 音乐风格
            music: 'Classical / Goth Rock',
            
            // 简短介绍 (支持HTML标签)
            bio: '网页设计：若叶睦 <br> 代码编写：若叶睦（不） <br> 视频剪辑：若叶睦 <br> 质量监督：若叶睦 '
        },

        // 技能/兴趣展示 (卡片列表)
        cards: [
            {
                title: '聊天能力',
                content: '擅长与人交流，能够快速建立联系'
            },
            {
                title: '产品能力',
                content: '帮部门完成形态转变的重大工作'
            },
            {
                title: '学习能力',
                content: '快速学习新知识和技能，适应变化'
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
