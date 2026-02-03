# 前沿技术情报与预警平台 V1.5（从 0 到 1）实施路线

本仓库当前为空，为了让你可以直接开干，我把你的 V1.5 方案拆成一条「可执行、可迭代」的落地路线：先搭好数据与页面骨架，再逐步实现筛选、AI、预警闭环和批量导入。每一步都能验收、能演示。

## 0. 准备阶段（第 0 周）

**目标**：明确范围与验收点，准备样机资产。

1. **冻结 V1.5 范围**
   - 确认首页、情报总表、上传&复核、草稿管理、Excel 导入、详情页 6 个页面为 V1.5 交付。 
   - 统计/趋势仅基于 published 数据；AI 只做推荐，人工确认入库。
2. **定义最小数据模型（样机）**
   - 设计 `info_items`（情报）、`alerts`（预警）、`domains`（领域树）、`indicator_values`（指标值）等 JSON 结构。
3. **准备样机数据**
   - 先造 20~50 条样机数据覆盖：多领域、多来源、多类型、预警/非预警、comment 有/无。

> ✅ 产出：`README`（路线图）、`/data` 样机数据结构说明。

## 1. 目录与页面骨架（第 1 周）

**目标**：搭建可运行的前端壳子，先把页面框架跑起来。

**建议结构**（静态样机版）：

```
/README.md
/index.html
/info_table.html
/upload_review.html
/drafts.html
/excel_import.html
/info_detail.html
/assets/
  /css/
  /js/
/data/
```

**页面优先级**：
1) 上传&复核（闭环核心） → 2) 情报总表（主工作台） → 3) 首页（汇总+趋势）

> ✅ 产出：所有页面可点击互相跳转，拥有统一布局与导航。

## 2. 数据模型落地（第 1~2 周）

**目标**：样机数据结构与未来上线 DB 一致，避免重写。

**建议数据字段（样机 JSON）**：
- `info_items`
  - `id`, `title`, `content`, `published_at`, `status`（draft/published）
  - `domain_ids`（多选）, `primary_domain_id`
  - `source_types[]`, `info_types[]`, `tags[]`
  - `importance_score`, `is_new_tech`
  - `comment`（上传前备注）
- `alerts`
  - `id`, `info_item_id`, `status`, `source`（auto/manual）
  - `manual_override`, `dismiss_reason`, `alert_title`, `alert_body`, `reviewer_comment`
- `indicator_values`
  - `info_item_id`, `name`, `value_number`, `unit`, `source`

> ✅ 产出：`/data/*.json` 数据文件 + 前端读取模块。

## 3. 上传&复核闭环（第 2~3 周）

**目标**：实现“先填全字段 → 提交 → AI 建议 → 人工修改 → 预览 → 发布”。

**实现要点**：
1. **表单字段**：正文 `content` 放在 `tags` 上面，多领域多选。
2. **提交按钮**：生成 AI 建议（前端 mock）。
3. **AI 面板**：展示指标候选 & 预警建议；可人工修改。
4. **预警强制校验**：若预警为 true，必须填写预警内容。
5. **发布**：写入 `published`，参与统计。

> ✅ 产出：`upload_review.html` 完整闭环；可演示提交到发布。

## 4. 情报总表（第 3~4 周）

**目标**：成为主要工作界面，具备强筛选+高亮+预警入口。

**实现要点**：
1. **左侧筛选器**：领域树、来源/类型、多选标签、重要度范围、是否预警、是否有 comment。
2. **搜索/高亮**：关键词高亮 + 正文片段展开。
3. **预警按钮**：支持人工新增/编辑/解除。
4. **列表**：显示 comment/预警状态标识。

> ✅ 产出：`info_table.html` 强筛选 + 高亮 + 预警入口。

## 5. 首页合并趋势图（第 4 周）

**目标**：一体化工作台，汇总表 + 可折叠趋势图。

**实现要点**：
1. **时间筛选器**：周/月/年/自定义，自动刷新。
2. **分级汇总表**：多领域统计去重口径。
3. **趋势图面板**：折线/柱状/散点（可选 X/Y）。

> ✅ 产出：`index.html` 首页 + 趋势图面板。

## 6. 草稿管理与 Excel 导入（第 5 周）

**目标**：草稿可追踪，Excel 可批量导入。

**实现要点**：
1. **草稿页**：本地 LocalStorage 或 JSON 保存草稿。
2. **Excel 导入**：下载模板 → 上传解析预览 → 校验错误 → 批量生成草稿。

> ✅ 产出：`drafts.html` 与 `excel_import.html`。

## 7. AI 结果结构与缓存（第 5~6 周）

**目标**：AI 推荐可解释、可控。

- AI 输出结构中包含 `indicators[]` 和 `alert`。
- 草稿 hash 未变时可复用 AI 结果，减少重复生成。

> ✅ 产出：前端 mock AI + 可替换后端接口。

## 8. 后端化路线（上线阶段）

**目标**：从纯前端样机迁移到 API + DB。

**需要落地的后端模块**：
- `/api/info-items`（筛选与分页）
- `/api/info-items/{id}/ai-suggest`
- `/api/alerts`（manual & dismiss）
- `/api/import/excel`（解析预览与提交）

> ✅ 产出：后端 API 接口文档与 DB 脚本。

---

## 建议的开发顺序（可执行清单）

1. 建页面骨架 + 导航
2. 造数据结构 + JSON 数据
3. 先实现上传&复核闭环
4. 实现情报总表筛选、高亮与预警按钮
5. 首页汇总表 + 趋势图
6. 草稿管理 + Excel 导入
7. 再做 AI 接口与后端迁移

---

如果你希望，我可以按上面的顺序开始落地页面代码：
**先做 upload_review → info_table → index**。 
只要你确认，我就开始写完整 HTML/JS/CSS 版本。
