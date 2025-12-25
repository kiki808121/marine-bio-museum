// API配置
const API_URL = 'http://localhost:8000/api';

// 物种数据（从API加载）
let speciesData = [];
let currentCategory = 'all';

// 从API加载物种数据
async function loadSpeciesFromAPI() {
    try {
        const response = await fetch(`${API_URL}/species`);
        speciesData = await response.json();
        initPage();
    } catch (error) {
        console.error('加载数据失败，使用模拟数据:', error);
        // 如果API失败，使用模拟数据
        useMockData();
        initPage();
    }
}

// 使用模拟数据（备用方案）
function useMockData() {
    speciesData = [
        {
            id: 1,
            name: "中华鲟",
            latin: "Acipenser sinensis",
            category: "fish",
            emoji: "🐟",
            protection: "国家一级",
            endangered: "CR",
            description: "长江流域特有物种,具有重要的生态和科研价值。成鱼可达4米长,寿命可达40年以上。",
            habitat: "长江口及近岸海域",
            genes: "已完成全基因组测序",
            sound: true
        },
        {
            id: 2,
            name: "江豚",
            latin: "Neophocaena asiaeorientalis",
            category: "fish",
            emoji: "🐬",
            protection: "国家一级",
            endangered: "EN",
            description: "长江及近海特有的小型鲸类,性情温顺,被称为'微笑天使'。",
            habitat: "长江口、苏北浅滩",
            genes: "已完成线粒体基因测序",
            sound: true
        },
        {
            id: 3,
            name: "黑脸琵鹭",
            latin: "Platalea minor",
            category: "bird",
            emoji: "🦆",
            protection: "国家一级",
            endangered: "EN",
            description: "全球仅存约5000只,江苏沿海是重要的迁徙停歇地和越冬地。",
            habitat: "盐城湿地、连云港海岸",
            genes: "已完成mtDNA测序",
            sound: true
        },
        {
            id: 4,
            name: "勺嘴鹬",
            latin: "Calidris pygmaea",
            category: "bird",
            emoji: "🐦",
            protection: "国家一级",
            endangered: "CR",
            description: "全球最濒危的鸟类之一,成鸟仅约500只,江苏沿海是其迁徙的关键栖息地。",
            habitat: "盐城条子泥湿地",
            genes: "DNA条形码已录入",
            sound: true
        },
        {
            id: 5,
            name: "中国鲎",
            latin: "Tachypleus tridentatus",
            category: "benthos",
            emoji: "🦀",
            protection: "国家二级",
            endangered: "EN",
            description: "有'活化石'之称,在地球上存活了4亿年,其蓝色血液具有重要医学价值。",
            habitat: "江苏南部沿海滩涂",
            genes: "部分基因片段已测序",
            sound: false
        },
        {
            id: 6,
            name: "文昌鱼",
            latin: "Branchiostoma belcheri",
            category: "benthos",
            emoji: "🐛",
            protection: "省级保护",
            endangered: "VU",
            description: "脊索动物的代表,具有重要的进化研究价值,被称为脊椎动物的祖先。",
            habitat: "连云港近海沙质底",
            genes: "全基因组已公开",
            sound: false
        },
        {
            id: 7,
            name: "互花米草",
            latin: "Spartina alterniflora",
            category: "plant",
            emoji: "🌾",
            protection: "入侵物种",
            endangered: null,
            invasive: true,
            description: "原产北美,快速扩张威胁本土生态系统,影响滩涂底栖生物和候鸟栖息地。",
            habitat: "江苏全海岸线",
            genes: "已完成基因组分析",
            sound: false
        },
        {
            id: 8,
            name: "海三棱藨草",
            latin: "Scirpus mariqueter",
            category: "plant",
            emoji: "🌿",
            protection: "省级保护",
            endangered: "VU",
            description: "长江口特有的盐沼植物,是重要的湿地生态系统工程种。",
            habitat: "长江口崇明东滩",
            genes: "叶绿体基因组已测序",
            sound: false
        },
        {
            id: 9,
            name: "凤鲚",
            latin: "Coilia mystus",
            category: "fish",
            emoji: "🐠",
            protection: "经济物种",
            endangered: "VU",
            description: "江苏重要经济鱼类,俗称'刀鱼',因过度捕捞种群数量急剧下降。",
            habitat: "长江口及近海",
            genes: "已完成转录组测序",
            sound: false
        },
        {
            id: 10,
            name: "北美海蓬子",
            latin: "Salicornia bigelovii",
            category: "plant",
            emoji: "🌱",
            protection: "入侵物种",
            endangered: null,
            invasive: true,
            description: "外来盐生植物,竞争本土物种生存空间,改变滩涂生态结构。",
            habitat: "盐城、南通沿海",
            genes: "DNA条形码已建立",
            sound: false
        },
        {
            id: 11,
            name: "斑海豹",
            latin: "Phoca largha",
            category: "fish",
            emoji: "🦭",
            protection: "国家一级",
            endangered: "VU",
            description: "在江苏近海偶有发现,主要分布在黄渤海,是中国唯一在近海繁殖的鳍足类动物。",
            habitat: "苏北近海海域",
            genes: "线粒体基因已测序",
            sound: true
        },
        {
            id: 12,
            name: "海月水母",
            latin: "Aurelia aurita",
            category: "benthos",
            emoji: "🪼",
            protection: "指示物种",
            endangered: null,
            description: "海洋生态环境的重要指示物种,其种群数量变化反映海洋环境状况。",
            habitat: "江苏全海域",
            genes: "mtDNA已分析",
            sound: false
        }
    ];
}

// 渲染物种卡片
function renderSpecies(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(species => `
        <div class="species-card" onclick="showDetail(${species.id})">
            <div class="species-image">${species.emoji}</div>
            <div class="species-info">
                <div class="species-name">${species.name}</div>
                <div class="species-latin">${species.latin}</div>
                <div class="species-tags">
                    ${species.protection ? `<span class="tag protected">${species.protection}</span>` : ''}
                    ${species.endangered ? `<span class="tag endangered">${species.endangered}</span>` : ''}
                    ${species.invasive ? `<span class="tag" style="background: rgba(230, 126, 34, 0.3); border-color: rgba(230, 126, 34, 0.5);">入侵物种</span>` : ''}
                    ${species.sound ? `<span class="tag">🎵 有声纹</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// 初始化页面
function initPage() {
    renderSpecies(speciesData, 'speciesGrid');
    renderSpecies(speciesData.filter(s => s.endangered && !s.invasive), 'endangeredGrid');
    renderSpecies(speciesData.filter(s => s.invasive), 'invasiveGrid');
}

// 切换导航
window.showSection = function(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));

    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }

    const buttons = document.querySelectorAll('.nav button');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(sectionId)) {
            btn.classList.add('active');
        }
    });
}

// 分类筛选
window.filterByCategory = function(category) {
    currentCategory = category;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));

    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });

    let filtered = category === 'all' ? speciesData : speciesData.filter(s => s.category === category);
    renderSpecies(filtered, 'speciesGrid');
}

// 搜索功能
window.filterSpecies = function(keyword) {
    const filtered = speciesData.filter(s =>
        s.name.includes(keyword) ||
        s.latin.toLowerCase().includes(keyword.toLowerCase()) ||
        s.description.includes(keyword)
    );
    const result = currentCategory === 'all' ? filtered : filtered.filter(s => s.category === currentCategory);
    renderSpecies(result, 'speciesGrid');
}

// 显示详情
window.showDetail = function(id) {
    const species = speciesData.find(s => s.id === id);
    if (!species) return;

    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');

    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 6rem; margin-bottom: 1rem;">${species.emoji}</div>
            <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">${species.name}</h2>
            <p style="font-style: italic; color: #95a5a6; font-size: 1.1rem;">${species.latin}</p>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">分类类群</div>
                <div class="info-value">${getCategoryName(species.category)}</div>
            </div>
            ${species.protection ? `
            <div class="info-item">
                <div class="info-label">保护等级</div>
                <div class="info-value">${species.protection}</div>
            </div>` : ''}
            ${species.endangered ? `
            <div class="info-item">
                <div class="info-label">IUCN红色名录</div>
                <div class="info-value">${getEndangeredName(species.endangered)}</div>
            </div>` : ''}
            <div class="info-item">
                <div class="info-label">栖息地</div>
                <div class="info-value">${species.habitat}</div>
            </div>
        </div>

        <div style="margin: 2rem 0; padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 10px; line-height: 1.8;">
            <h3 style="color: #3498db; margin-bottom: 1rem;">📖 物种描述</h3>
            ${species.description}
        </div>

        <div style="margin: 2rem 0; padding: 1.5rem; background: rgba(52, 152, 219, 0.1); border-radius: 10px;">
            <h3 style="color: #3498db; margin-bottom: 1rem;">🧬 遗传信息</h3>
            <p style="line-height: 1.8;">${species.genes}</p>
            ${species.invasive ? '<p style="margin-top: 1rem; color: #e67e22;">⚠️ 该物种已完成基因组分析，用于监测和管控入侵扩散</p>' : ''}
        </div>

        ${species.sound ? `
        <div class="audio-player">
            <div class="audio-title">🎵 物种声纹数据</div>
            <p style="margin-bottom: 1rem; color: #95a5a6; font-size: 0.9rem;">
                声纹数据已录入系统，可用于生物声学监测和物种识别
            </p>
            <audio controls>
                <source src="#" type="audio/mpeg">
                您的浏览器不支持音频播放
            </audio>
            <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #7f8c8d;">
                * 演示版本暂无实际音频文件
            </p>
        </div>` : ''}

        <div style="margin: 2rem 0; padding: 1.5rem; background: rgba(46, 204, 113, 0.1); border-radius: 10px;">
            <h3 style="color: #2ecc71; margin-bottom: 1rem;">📷 标本与影像资料</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">数字标本</div>
                    <div class="info-value">${Math.floor(Math.random() * 20) + 5} 份</div>
                </div>
                <div class="info-item">
                    <div class="info-label">现场照片</div>
                    <div class="info-value">${Math.floor(Math.random() * 100) + 20} 张</div>
                </div>
                <div class="info-item">
                    <div class="info-label">影像资料</div>
                    <div class="info-value">${Math.floor(Math.random() * 30) + 5} 段</div>
                </div>
                <div class="info-item">
                    <div class="info-label">分布记录</div>
                    <div class="info-value">${Math.floor(Math.random() * 50) + 10} 个点位</div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭详情
window.closeDetail = function() {
    document.getElementById('detailModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 获取类别名称
function getCategoryName(category) {
    const names = {
        'fish': '🐟 鱼类及海洋哺乳动物',
        'bird': '🦆 海鸟',
        'benthos': '🦀 底栖生物',
        'plant': '🌿 滩涂湿地植物'
    };
    return names[category] || category;
}

// 获取濒危等级名称
function getEndangeredName(code) {
    const names = {
        'CR': '极危 (Critically Endangered)',
        'EN': '濒危 (Endangered)',
        'VU': '易危 (Vulnerable)'
    };
    return names[code] || code;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 先尝试从API加载数据
    loadSpeciesFromAPI();

    // 点击模态框外部关闭
    document.getElementById('detailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetail();
        }
    });
});
