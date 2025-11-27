/**
 * =====================================================
 * NeonSwitch - 核心交互脚本
 * =====================================================
 * 
 * 📖 代码阅读路线图（按实际用户操作顺序）：
 * 
 * 1️⃣ 页面加载完毕 → 执行 init() 函数（初始化阶段）
 *    ├─ 读取 config.js 的配置（颜色、文本、图片路径）
 *    ├─ 设置页面标题、logo、个人信息
 *    ├─ 生成右侧"B面"的卡片内容
 *    └─ 绑定按钮点击事件
 * 
 * 2️⃣ 用户点击"切换"按钮 → 触发 toggleMode()
 *    ├─ 如果当前是普通模式 → 启动转场动画 playTransitionAnimation()
 *    │  ├─ 黑屏淡入（全黑）
 *    │  ├─ Logo 1 闪现
 *    │  ├─ Logo 2 闪现
 *    │  ├─ 苦无飞来
 *    │  ├─ 切换到 Neon 界面（亮起霓虹灯）
 *    │  └─ 动画结束
 *    │
 *    └─ 如果当前是 Neon 模式 → 直接切回普通模式 switchToNormal()
 * 
 * 3️⃣ 点击"返回"按钮 → 也会触发 toggleMode()（从 Neon 回到普通）
 * 
 * ===== 代码结构说明 =====
 * - 状态变量（currentMode）：追踪当前是哪个界面
 * - DOM 引用：获取网页上的所有交互元素
 * - init()：初始化，只运行一次
 * - toggleMode()：点击按钮时执行
 * - 动画序列：playTransitionAnimation()、switchToNeon()、switchToNormal()
 */

document.addEventListener('DOMContentLoaded', () => {
    // ================================================================
    // 【第一步】加载配置（来自 config.js 文件）
    // ================================================================
    // config.js 中定义了所有文本、颜色、图片路径等信息
    // 这里读取它，作为"单一信任来源"，所以改颜色只需改 config.js 即可
    const config = window.resumeConfig;
    
    // ================================================================
    // 【第二步】获取网页上的 DOM 元素（所有能点击、显示的东西）
    // ================================================================
    // 这些就是你在网页上看到的所有元素的引用
    
    // 主容器和主要视图
    const body = document.body;                          // 整个页面的背景容器
    const normalView = document.getElementById('normalView');  // 普通模式界面（A面 - 左边的简历预览）
    const neonView = document.getElementById('neonView');      // 霓虹模式界面（B面 - 右边的卡片网格）
    
    // 切换按钮和相关 UI
    const switchBtn = document.getElementById('modeSwitch');   // 主切换按钮（"切换"那个按钮）
    const switchLogo = document.getElementById('switchLogo');  // 按钮上显示的 Logo 图片
    const switchSlogan = document.getElementById('switchSlogan'); // 按钮下方的文字描述
    const backBtn = document.getElementById('backBtn');        // 返回按钮（在 Neon 模式中显示）
    
    // 左侧界面（普通模式）的内容
    const resumeImage = document.getElementById('resumeImage'); // 左边的大头照
    
    // 右侧界面（霓虹模式）的内容
    const neonGrid = document.getElementById('neonGrid');      // 右边用来放置卡片的网格容器
    
    // 转场动画层（全黑屏幕中间的东西）
    const transitionLayer = document.getElementById('transitionLayer');  // 动画遮罩层（在两个界面之间切换时使用）
    const animLogo1 = document.getElementById('animLogo1');    // 转场动画中出现的第一个 Logo
    const animLogo2 = document.getElementById('animLogo2');    // 转场动画中出现的第二个 Logo
    const kunaiLeft = document.getElementById('kunaiLeft');    // 左苦无
    const kunaiRight = document.getElementById('kunaiRight');  // 右苦无

    // ================================================================
    // 【第三步】状态变量（追踪当前处于哪个状态）
    // ================================================================
    // 这两个变量追踪程序的"大脑状态"
    let currentMode = config.global.initialMode;  // 当前模式：'normal'(普通) 或 'neon'(霓虹)
    let isAnimating = false;                       // 动画是否正在进行中（防止用户疯狂点按钮）

    // ================================================================
    // 【第四步】INIT 函数 - 页面加载时只运行一次的初始化
    // ================================================================
    // ✨ 这是你看网页时最先执行的函数
    // ========================================
    function init() {
        // ---- 第1步：设置基本页面信息 ----
        // 设置浏览器标签页的标题（在浏览器上方看到的文字）
        document.title = config.global.pageTitle;
        
        // 设置切换按钮上显示的 Logo 图片
        switchLogo.src = config.global.logoPath;
        
        // 设置转场动画中的两个 Logo（飞来飞去的图片）
        const tLogos = config.global.transitionLogos || {};
        animLogo1.src = tLogos.logo1 || config.global.logoPath;
        animLogo2.src = tLogos.logo2 || config.global.logoPath;

        // 设置苦无图片路径
        const kPath = config.global.kunaiPath || 'assets/Kunai.png';
        kunaiLeft.src = kPath;
        kunaiRight.src = kPath;

        // 设置左边普通模式中显示的简历预览图
        resumeImage.src = config.normalMode.resumeImagePath;
        
        // ---- 第2步：设置口号文字 ----
        // 在切换按钮下方显示一句话（比如"切换视角"之类的）
        if (config.global.slogan) {
            switchSlogan.textContent = config.global.slogan;
        }

        // ---- 第3步：设置 CSS 变量（这会影响网页的整体颜色） ----
        // CSS 变量是"全局颜色库"，一处修改处处生效
        // 在网页上看到的所有霓虹色彩都是用这些变量控制的
        document.documentElement.style.setProperty('--neon-primary', config.neonMode.primaryColor);
        document.documentElement.style.setProperty('--bg-normal', config.normalMode.backgroundColor);
        document.documentElement.style.setProperty('--bg-neon', config.neonMode.backgroundColor);

        // ---- 第4步：生成右侧卡片内容 ----
        // 这会读取 config.js 中定义的个人信息和卡片，
        // 然后生成 HTML 代码，显示在右边的网格中
        renderNeonContent();

        // ---- 第5步：绑定按钮点击事件 ----
        // 这些代码翻译为：
        // "当用户点击切换按钮时，执行 toggleMode() 函数"
        // "当用户点击返回按钮时，也执行 toggleMode() 函数（回到普通模式）"
        switchBtn.addEventListener('click', toggleMode);
        backBtn.addEventListener('click', toggleMode);

        // ---- 第6步：应用初始化模式 ----
        // 如果 config.js 中设置初始模式为 'neon'（霓虹）
        // 那就直接跳到霓虹模式，不播放转场动画
        // true 参数表示"不要动画，直接切换"
        if (currentMode === 'neon') {
            switchToNeon(true);
        }
    }

    // ================================================================
    // 【第五步】renderNeonContent() - 生成右侧卡片内容
    // ================================================================
    // 这个函数做的事情：
    // 读取 config.js 中的个人信息 → 转换成 HTML 代码 → 显示在网页上
    // ==========================================
    function renderNeonContent() {
        // 从 config.js 中读取个人信息和卡片数据
        const p = config.neonMode.profile;      // 个人信息（名字、头像、标签等）
        const cards = config.neonMode.cards;    // 卡片数组（技能卡、获奖卡等）

        let html = '';  // 用来存放最终生成的 HTML 代码

        // ---- 生成个人信息卡片（大卡片，占据两列） ----
        // 这就是你在网页右边看到的那个大头照 + 名字 + 标签的部分
        html += `
            <div class="neon-card profile-card" style="grid-column: 1 / -1;">
                <img src="${p.avatar}" alt="${p.name}" class="profile-avatar">
                <h1 class="profile-name">${p.name}</h1>
                <p class="profile-title">${p.title}</p>
                <div class="card-content" style="margin-bottom: 15px;">${p.bio}</div>
                
                <!-- 第一行：MBTI 和 音乐 -->
                <div class="tags-container" style="margin-bottom: 5px;">
                    <span class="neon-tag">${p.mbti}</span>
                    <span class="neon-tag">🎵 ${p.music}</span>
                </div>
                
                <!-- 第二行：其他标签 -->
                <div class="tags-container" style="margin-top: 5px;">
                    ${p.tags.map(tag => `<span class="neon-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // ---- 生成其他卡片（技能卡、获奖卡等） ----
        // 这个 forEach 循环逐个读取每个卡片信息，生成 HTML
        // 比如 cards 数组中有 3 个卡片，就会生成 3 个 <div class="neon-card"> 元素
        cards.forEach(card => {
            html += `
                <div class="neon-card">
                    <h2 class="card-title">${card.title}</h2>
                    <div class="card-content">${card.content}</div>
                </div>
            `;
        });

        // ---- 将生成的 HTML 代码插入到网页中 ----
        // neonGrid 就是右侧那个网格容器，现在它被填充了所有卡片
        neonGrid.innerHTML = html;
    }

    // ================================================================
    // 【第六步】toggleMode() - 点击切换按钮时执行
    // ================================================================
    // 这是用户交互的"枢纽"函数
    // 用户点击按钮 → 这个函数运行 → 要么启动转场动画，要么直接切回普通模式
    // =============================================
    function toggleMode() {
        // 防止用户疯狂点按钮
        // 如果动画正在进行中，直接返回，不继续执行
        if (isAnimating) return;
        isAnimating = true;

        // 判断当前处于什么模式，然后采取相应的动作
        if (currentMode === 'normal') {
            // 【用户从普通模式点击切换】
            // → 启动转场动画，最后切换到霓虹模式
            playTransitionAnimation();
        } else {
            // 【用户从霓虹模式点击返回】
            // → 直接淡出动画，切回普通模式（没有转场动画）
            switchToNormal();
        }
    }

    // ================================================================
    // 【第七步】playTransitionAnimation() - 复杂的转场动画序列
    // ================================================================
    // 这是整个网页最复杂的部分！
    // 
    // 当用户从普通模式点击"切换"时，执行这个函数
    // 它会按时间顺序播放一系列动画：
    // 
    //  时间轴：
    //  0ms      → 黑屏淡入开始
    //  500ms    → 黑屏完全（全黑）
    //  800ms    → Logo 1 闪现
    //  1000ms   → Logo 2 闪现
    //  1500ms   → 苦无飞来并合并
    //  2000ms   → 保持黑屏
    //  2500ms   → Neon 界面亮起（霓虹灯打开）
    //  3200ms   → 动画结束，用户看到新界面
    // ================================================
    function playTransitionAnimation() {
        // 从 config.js 中读取动画模式配置
        // 支持 logo 动画的两种模式："pop"（弹出） 或 "morph"（变形）
        // 支持 kunai（苦无）的两种模式："fade"（淡出） 或 "drop"（下落）
        const animModes = config.global.animationModes || { logo: 'pop', kunai: 'fade' };

        // ---- 定义动画时间点 ----
        // 这些数字控制动画播放的节奏感
        // 改这些数字可以加快或减慢动画速度
        const DURATION = {
            BLACK_OUT: 500,      // 黑屏淡入需要 500ms
            FLASH_DELAY: 800,    // 等待闪光的延迟
            // 根据 logo 动画模式调整时间
            LOGO_1_DELAY: animModes.logo === 'morph' ? 500 : 800,    // Logo 1 出现的延迟
            LOGO_2_DELAY: animModes.logo === 'morph' ? 750 : 1000,   // Logo 2 出现的延迟
            KUNAI_DELAY: animModes.logo === 'morph' ? 800 : 1000,    // 苦无出现的延迟
            KUNAI_ANIM: 1000,    // 苦无动画持续时间
            KUNAI_DROP_ANIM: animModes.kunai === 'drop' ? 600 : 0,   // Drop 模式下的额外时间
            BLACK_SCREEN: 500,   // 保持黑屏的时间
            FADE_OUT: 700        // 动画层淡出的时间
        };

        let timeline = 0; // 时间轴游标（用来计算每个动画应该在何时执行）

        // ============ 阶段 1：黑屏淡入 ============
        // 让动画遮罩层（全黑屏幕）逐渐变不透明
        // 这给用户一种"切换次元"的感觉
        
        // 首先初始化：透明度为 0（看不见黑屏）
        transitionLayer.style.opacity = '0';
        // 设置淡入动画的持续时间
        transitionLayer.style.transition = `opacity ${DURATION.BLACK_OUT}ms ease`;
        // 显示动画层（但还是透明的）
        transitionLayer.style.display = 'flex';
        // 强制浏览器重绘（技巧：读取一个属性会强制重绘）
        transitionLayer.offsetHeight;
        
        // 触发淡入动画：透明度从 0 变为 1
        transitionLayer.classList.add('active');
        transitionLayer.style.opacity = '1';
        
        // 同时隐藏左边的普通模式界面（不透明淡出，而是直接隐藏）
        // 这样做是为了防止透出背景
        setTimeout(() => { 
            normalView.style.display = 'none'; 
        }, DURATION.BLACK_OUT);

        // 更新时间轴：黑屏淡入完成
        timeline += DURATION.BLACK_OUT;

        // ============ 阶段 2：Logo 1 闪现 ============
        // 在全黑屏幕中，第一个 Logo 闪现
        timeline += DURATION.LOGO_1_DELAY;
        setTimeout(() => {
            // 移除闪光动画类
            transitionLayer.classList.remove('anim-flash');
            // 添加 Logo 1 动画类 + 动画模式类（pop 或 morph）
            transitionLayer.classList.add('anim-logo-step1', `mode-${animModes.logo}`);
        }, timeline);

        // ============ 阶段 3：Logo 2 闪现 ============
        // 第一个 Logo 消失，第二个 Logo 闪现
        timeline += DURATION.LOGO_2_DELAY;
        setTimeout(() => {
            // 移除 Logo 1 动画类
            transitionLayer.classList.remove('anim-logo-step1');
            // 强制重绘（防止某些浏览器的动画卡顿）
            void transitionLayer.offsetWidth;
            // 添加 Logo 2 动画类
            transitionLayer.classList.add('anim-logo-step2', `mode-${animModes.logo}`);
        }, timeline);

        // ============ 阶段 4：苦无飞来合并 ============
        // Logo 消失，苦无（飞镖）飞来
        timeline += DURATION.KUNAI_DELAY;
        setTimeout(() => {
            // 移除 Logo 2 动画类
            transitionLayer.classList.remove('anim-logo-step2');
            // 添加苦无飞来动画类
            transitionLayer.classList.add('anim-kunai');
        }, timeline);

        // ============ 阶段 5：苦无掉落（可选） ============
        // 如果 config.js 中设置了 kunai 动画为 'drop' 模式
        // 那么苦无会在合并后继续做掉落 + 背景闪烁的特效
        timeline += DURATION.KUNAI_ANIM;
        
        if (animModes.kunai === 'drop') {
            setTimeout(() => {
                // 给苦无容器添加下落动画
                document.querySelector('.kunai-container').classList.add('anim-drop');
                
                // 延迟一点点触发背景闪烁（配合下落冲刺瞬间）
                setTimeout(() => {
                    transitionLayer.classList.add('anim-bg-flash');
                }, 200); // 200ms 是蓄力时间
                
            }, timeline);
            
            // 增加下落动画的时间
            timeline += DURATION.KUNAI_DROP_ANIM;
        }

        // ============ 阶段 6：准备进入 Neon 界面 ============
        // 此时全屏仍然是黑色，但我们已经在后台切换了 DOM
        // （也就是说右边的卡片已经生成好了，就等着亮灯）
        setTimeout(() => {
            // 移除苦无相关的动画类
            transitionLayer.classList.remove('anim-kunai');
            document.querySelector('.kunai-container').classList.remove('anim-drop');
            transitionLayer.classList.remove('anim-bg-flash');
            
            // 切换到 Neon 模式（准备 DOM，但不淡入）
            // 参数 false, false 表示：不用 instant 模式，也不自动淡入
            switchToNeon(false, false);
        }, timeline);

        // ============ 阶段 7：保持黑屏 ============
        // 继续保持黑屏，给用户一种"蓄势待发"的感觉
        timeline += DURATION.BLACK_SCREEN;
        
        // ============ 阶段 8：Neon 界面亮起 ============
        // 这是"灯亮了"的瞬间！
        // 黑屏淡出，右边的霓虹卡片界面淡入
        setTimeout(() => {
            // 右侧界面快速变得可见（opacity 从 0 变为 1）
            neonView.style.opacity = '1';
            // 给 body 添加 'neon-active' 类（触发霓虹特效）
            body.classList.add('neon-active');
            // 更新状态：当前模式已经是 'neon'
            currentMode = 'neon';
            // 动画完成：允许用户再次点击
            isAnimating = false;

            // ============ 阶段 9：清理动画层 ============
            // 现在淡出动画层（黑屏退场）
            transitionLayer.style.transition = `opacity ${DURATION.FADE_OUT}ms ease`;
            transitionLayer.style.opacity = '0';
            
            // 等淡出动画完成后，彻底隐藏动画层
            setTimeout(() => {
                // 移除所有动画类（清理现场）
                transitionLayer.classList.remove('active', `mode-${animModes.logo}`);
                transitionLayer.style.display = 'none';
                // 清除内联样式，让 CSS 重新接管
                transitionLayer.style.opacity = '';
                transitionLayer.style.transition = '';
            }, DURATION.FADE_OUT);

        }, timeline);
    }

    // ================================================================
    // 【第八步】switchToNeon() - 切换到霓虹模式
    // ================================================================
    // 这个函数有两种工作模式：
    // 
    // 1️⃣ instant=true（初始化时）：
    //    直接显示 Neon 界面，不播放任何动画
    // 
    // 2️⃣ instant=false（动画切换时）：
    //    准备好 DOM，等待 playTransitionAnimation 后续淡入
    // ================================================
    function switchToNeon(instant = false, autoFadeIn = true) {
        // ---- 步骤 1：更改 body 的背景颜色类 ----
        // 移除普通模式的样式类
        body.classList.remove('mode-normal');
        // 添加霓虹模式的样式类（这会改变背景色和其他样式）
        body.classList.add('mode-neon');

        // ---- 步骤 2：隐藏左边的普通界面 ----
        if (instant) {
            normalView.style.display = 'none';
            normalView.style.opacity = '0';
        }

        // ---- 步骤 3：显示右边的霓虹界面（但初始是完全透明的） ----
        neonView.style.display = 'flex';     // 显示（但看不见，因为透明度是 0）
        neonView.style.opacity = '0';        // 完全透明（黑的）
        neonView.offsetHeight;               // 强制浏览器计算（防止动画卡顿）
        
        // ---- 步骤 4：决定是否淡入 ----
        // 根据参数决定是立即显示还是等待后续淡入
        if (instant) {
            // 【模式 A：初始化时】
            // 直接显示，不需要淡入动画
            neonView.style.opacity = '1';
            body.classList.add('neon-active');
            currentMode = 'neon';
            isAnimating = false;
        } else if (autoFadeIn) {
            // 【模式 B：自动淡入】
            // 等待一小段时间后，开始淡入
            setTimeout(() => {
                neonView.style.opacity = '1';
                body.classList.add('neon-active');
                currentMode = 'neon';
                isAnimating = false;
            }, 100);
        }
        // 【模式 C：不自动淡入】
        // autoFadeIn=false 时，DOM 已准备好，但淡入由外部控制
        // playTransitionAnimation 会在适当时机自己调用淡入
    }

    // ================================================================
    // 【第九步】switchToNormal() - 从霓虹模式切回普通模式
    // ================================================================
    // 当用户在霓虹模式中点击"返回"按钮时执行
    // 这个过程相对简单：淡出 → 隐藏 → 恢复普通界面
    // ================================================
    function switchToNormal() {
        // ---- 步骤 1：关闭霓虹特效 ----
        // 移除 'neon-active' 类（这会关闭霓虹灯光特效）
        body.classList.remove('neon-active');
        
        // ---- 步骤 2：霓虹界面淡出（变成透明） ----
        neonView.style.opacity = '0';

        // ---- 步骤 3：等淡出动画完成后，做真正的切换 ----
        setTimeout(() => {
            // 彻底隐藏霓虹界面
            neonView.style.display = 'none';
            
            // 移除 Neon 模式的样式类
            body.classList.remove('mode-neon');
            // 添加普通模式的样式类（恢复原来的样子）
            body.classList.add('mode-normal');

            // ---- 步骤 4：显示左边的普通界面 ----
            normalView.style.opacity = '0';        // 初始透明
            normalView.style.display = 'flex';     // 显示（但还看不见）
            normalView.offsetHeight;               // 强制浏览器计算
            // 淡入普通界面
            normalView.style.opacity = '1';

            // ---- 步骤 5：更新状态 ----
            currentMode = 'normal';  // 当前模式已变为普通
            isAnimating = false;     // 动画完成，允许再次点击
        }, 500); // 500ms 是淡出动画的时间
    }

    // ================================================================
    // 【最后一步】启动整个程序
    // ================================================================
    // 当 HTML 页面加载完毕，执行 init() 函数
    // 这会触发所有的初始化逻辑
    // ================================================
    init();
});
