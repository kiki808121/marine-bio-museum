💡 核心功能说明
前台功能

✅ 响应式设计（电脑/手机适配）
✅ 物种图谱浏览
✅ 多维度筛选（类别/保护等级/濒危状态）
✅ 关键词搜索
✅ 物种详情展示
✅ 数据统计可视化

后台功能

✅ 数据统计看板
✅ 物种列表管理
✅ 添加新物种
✅ 编辑物种信息
✅ 删除物种
✅ 实时更新前台

数据库功能

✅ SQLite数据库（演示用）
✅ 完整的CRUD操作（增删改查）
✅ RESTful API接口
✅ 数据关联查询
✅ 统计分析


🔧 数据库结构
species 表
sqlid              整数，主键，自增
name            文本，物种中文名
latin_name      文本，拉丁学名
category        文本，物种类别（fish/bird/benthos/plant）
emoji           文本，Emoji图标
protection_level 文本，保护等级
iucn_status     文本，IUCN红色名录等级
description     文本，物种描述
habitat         文本，栖息地
genes           文本，遗传信息
has_sound       布尔值，是否有声纹
is_invasive     布尔值，是否为入侵物种
created_at      时间戳，创建时间

📡 API接口文档
获取所有物种
GET /api/species
查询参数：
  - category: 物种类别（可选）
  - search: 搜索关键词（可选）
获取统计数据
GET /api/stats
返回：总数、濒危数、保护数、入侵数、各类群数量
添加物种
POST /api/species
Body: JSON格式的物种数据
更新物种
PUT /api/species/{id}
Body: JSON格式的物种数据
删除物种
DELETE /api/species/{id}
