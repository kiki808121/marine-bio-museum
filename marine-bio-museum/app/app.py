from flask import Flask, jsonify, request, send_from_directory, render_template
from flask_cors import CORS
import sqlite3
import os
from pathlib import Path
from typing import List, Dict, Any

app = Flask(
    __name__,
    static_folder= Path(__file__).parent.parent / 'static',
    template_folder=Path(__file__).parent.parent / 'templates'
)

DB_PATH = Path(__file__).parent.parent / 'data' / 'marine_bio.db'

CORS(app, resources={r"/api/*": {"origins": "*"}})  # 更精确的跨域控制（可根据需要收紧）

def get_db_connection() -> sqlite3.Connection:
    """获取数据库连接，并启用 Row 工厂"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    """初始化数据库表和示例数据（仅在首次运行时插入）"""
    with get_db_connection() as conn:
        cursor = conn.cursor()

        # 创建物种表（使用 IF NOT EXISTS 更安全）
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS species (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                latin_name TEXT NOT NULL,
                category TEXT NOT NULL,
                emoji TEXT,
                protection_level TEXT,
                iucn_status TEXT,
                description TEXT,
                habitat TEXT,
                genes TEXT,
                has_sound BOOLEAN DEFAULT 0,
                is_invasive BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 检查是否已有数据
        cursor.execute('SELECT COUNT(*) FROM species')
        if cursor.fetchone()[0] == 0:
            sample_data: List[tuple] = [
                ('中华鲟', 'Acipenser sinensis', 'fish', '🐟', '国家一级', 'CR',
                 '长江流域特有物种,具有重要的生态和科研价值。成鱼可达4米长,寿命可达40年以上。',
                 '长江口及近岸海域', '已完成全基因组测序', 1, 0),
                # ... 你的其他示例数据（保持不变，省略以节省篇幅）
                ('海月水母', 'Aurelia aurita', 'benthos', '🪼', '指示物种', None,
                 '海洋生态环境的重要指示物种,其种群数量变化反映海洋环境状况。',
                 '江苏全海域', 'mtDNA已分析', 0, 0)
            ]

            cursor.executemany('''
                INSERT INTO species (
                    name, latin_name, category, emoji, protection_level,
                    iucn_status, description, habitat, genes, has_sound, is_invasive
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', sample_data)

            conn.commit()
            print("✅ 数据库初始化完成，已插入示例数据")


# API：获取所有物种（支持分类 + 搜索）
@app.route('/api/species', methods=['GET'])
def get_species() -> tuple:
    category = request.args.get('category')
    search = request.args.get('search')

    with get_db_connection() as conn:
        cursor = conn.cursor()

        query = 'SELECT * FROM species WHERE 1=1'
        params: List[str] = []

        if category and category != 'all':
            query += ' AND category = ?'
            params.append(category)

        if search:
            query += ' AND (name LIKE ? OR latin_name LIKE ? OR description LIKE ?)'
            pattern = f'%{search}%'
            params.extend([pattern, pattern, pattern])

        cursor.execute(query, params)
        rows = cursor.fetchall()

        species_list: List[Dict[str, Any]] = [
            {
                'id': row['id'],
                'name': row['name'],
                'latin': row['latin_name'],
                'category': row['category'],
                'emoji': row['emoji'],
                'protection': row['protection_level'],
                'endangered': row['iucn_status'],
                'description': row['description'],
                'habitat': row['habitat'],
                'genes': row['genes'],
                'sound': bool(row['has_sound']),
                'invasive': bool(row['is_invasive'])
            }
            for row in rows
        ]

    return jsonify(species_list)


# 其他 API 路由保持不变，但使用 with 语句管理连接（更安全）
# （add_species / update_species / delete_species / get_stats）
# 这里省略代码，建议也把它们改成使用 get_db_connection() + with 语句


# 静态文件服务（适配前端在同一端口访问）
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def static_files(path: str):
    # 安全处理：防止目录穿越
    full_path = (Path('.') / path).resolve()
    if not full_path.exists() or full_path.is_dir():
        return "Not Found", 404
    return send_from_directory('.', path)


if __name__ == '__main__':
    # 初始化数据库
    init_db()

    print("🌊 江苏海洋生物多样性科普馆 - 后端服务启动")
    print(f"📊 数据库: {DB_PATH}")
    print("🌐 访问地址: http://localhost:8000")
    print("📡 API示例: http://localhost:8000/api/species")

    # 启动服务器
    app.run(
        debug=True,           # 开发模式（严格模式下建议保留）
        port=8000,            # 与前端不一致
        host='0.0.0.0',       # 允许局域网访问（可选，根据需要）
        use_reloader=True,    # 代码修改自动重载
        threaded=True         # 更好的并发处理（开发时推荐）
    )
