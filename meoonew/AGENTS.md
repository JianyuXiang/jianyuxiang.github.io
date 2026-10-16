# 项目说明（个人网站 · iOS 风 · 中英双语）

## Dependencies
- 无平台默认之外的第三方运行依赖。图标用 `lucide-react`，动效全部为 CSS keyframes + 模板自带 `src/lib/reveal-engine.ts`（未引入 framer-motion，遵守 react-design 约束）。

## Architecture
- **文案单一来源**：全站中英文内容与简历条目集中在 `src/lib/content.ts`，类型 `Bilingual = { zh, en }`。组件一律通过 `useSitePrefs().t(bilingual)` 取当前语言文本；新增文案只需在该文件补 `zh/en` 两个字段，不要在任何组件里硬编码可翻译字符串。首屏专属字段（元信息行 `HERO.metas` 数组、主张句、方向标签、联系清单）集中在导出的 `HERO` 对象；`metas` 每条对应一个在读学位，Hero 循环渲染同一样式行。
- **语言偏好**：`src/hooks/use-site-prefs.tsx` 提供 `SitePrefsProvider`（挂在 `routes/index.tsx` 顶层），仅管理语言（localStorage key: `site-lang`）。站点已按用户要求取消深色模式，hook 不再暴露 theme，并在挂载时移除 `<html>` 上遗留的 `.dark` 以兼容老访客记录。
- **设计系统**：`src/styles.css` 为编辑排版式学术主页风格——暖白纸面 + 近黑正文 + 港科大校徽蓝（`--accent-blue`）单一强调色，**只有 `:root` 一套色值，无 `.dark`**。关键 class：`.display-name`（巨型姓名，桌面固定 160px、窄屏按视口缩放，见下条）、`.lead-statement`、`.dot-grid`（极淡点阵底纹）、`.ios-card`（细边框克制版）、`.story-link`。板块侧仍沿用 `SectionShell` + `ios-card` 结构。
- **展示字体 Poppins ExtraBold**：经 `styles.css` 顶部 `@import url(...)` 引入 Google Fonts（必须放在所有规则之前，否则构建报 `@import rules must precede all rules` 警告）。`.display-name` / `.section-title` / `.item-headline` 西文走 `"Poppins"` + `font-weight: 800`；NavBar 的 `JY.X` 标识用 `font-display font-extrabold`。中文靠全局 fallback 会被超粗字重挤压错位，故这三个类各有 `:lang(zh)` 覆写（PingFang/Noto 栈；巨型姓名用 900 + line-height 0.98 模拟块面感）。语言开关会同步 `<html lang>`，`:lang()` 选择器因此可靠生效。**`.display-name` 行高不能小于 ~1.0**——Poppins 800 的下行部（Jianyu 的 y 尾巴）会被紧行高裁切，参考图口径要求尾巴完整露出。
- **板块结构**：单页滚动，各板块为 `src/components/*Section.tsx`，共用 `SectionShell.tsx`。锚点 id 与 `NAV` 中的 `SectionId` 必须一致，`index.tsx` 的 `useActiveSection` 据此做导航高亮。顶部固定导航栏（`NavBar.tsx`）保留：标识 + 文字锚点 + 语言开关，Hero 内不再重复放顶栏。顺序：about → papers → experience → contact（技能、项目板块已按用户要求删除；原项目内容融合进 `PAPERS[i].project` 字段，在每条论文「研究细节」下方以同级可展开区块呈现）。
- **简历入口约定**：`PROFILE.resumeUrl` 留空时 Hero 自动隐藏「下载简历」，仅保留主按钮——填入 CDN 地址即可启用，无需改组件。当前状态为**暂关**（`resumeUrl: ""`），真实地址仍保留在 `RESUME_URL` 常量里，恢复时改回 `resumeUrl: RESUME_URL`。
- **经历板块三个分组**：顺序为教育背景 → 项目经历 → 竞赛获奖。教育走内联 `EducationRow`（单条 `EducationItem`：`schools[]` 左栏并列两校 + `bullets[]` 右栏统一要点，主修课程**不分中美、合并为一条**）；项目经历用 `GroupLabel` + `TimelineRow` 列表；奖项数据独立于 `RESEARCH`，放在 `content.ts` 的 `COMPETITION_AWARDS: AwardGroup[]`（`AwardGroup = { label, countLabel, items }`，当前为「省级奖项 3 项」「校级奖项 5 项」两组），组件侧由内联 `AwardGroupItem` 按组渲染成**折叠条目**（默认收起，点击标题行展开该组 `items`，复用 PapersSection 的 `tap-press` + `toggle-disc` + lucide `Plus`/`Minus` + `aria-expanded` 范式，金色 ❖ 逐条列出）。`TimelineItem` **没有 `awards` 字段**（曾挂在美赛条目下，已按用户要求拆为独立分组）。`EducationSchool` 也没有 `tags` 字段——校名下方只展示「专业·本科在读」与「时间 · 国家」两行，GPA/Rank 等指标只在首屏头像下方出现。
- **教育时间双处同步**：就读区间同时写在 `HERO.metas[i].period`（首屏元信息行）与 `EDUCATION[0].schools[i].period`（经历板块），两处必须一起改；当前口径为东密歇根 `2027.08 — 2028.04`、北部湾 `2024.09 — 2027.06`。
- **巨型姓名响应式口径**：桌面（≥1024px）固定 `160px` 不动；窄屏在 `@media (max-width: 1023px)` 内按视口缩放——西文 `min(160px, 11.5vw)`，中文另写 `.display-name:lang(zh) { min(160px, 22vw) }`（汉字少、可大得多）。Hero 顶部留白须大于顶栏总高（顶栏 h-16 + 移动端锚点行约 37px），当前为 `pt-28 sm:pt-32 lg:pt-24`，否则学校信息行会被固定导航遮住。
- **波点聚焦动效**：`src/components/DotGridLens.tsx` 是 canvas 覆盖层（挂在 Hero 的 `.dot-grid` 容器内），以鼠标为中心把 26px 点阵的波点平滑放大并转「提亮版校徽金」（oklch 0.9 0.115 88，比 `--accent-gold` token 亮一档）。canvas 不解析 oklch，用 Path2D 试画一次让浏览器转成 sRGB 再取回。点阵整体内缩一个最大放大半径（pad），边缘的点不会画出残缺圆；`.dot-lens` 在 `hover: none` 设备上隐藏、回退到静态 CSS 底纹。

- **论文数据面板双形态**：`PapersSection.tsx` 的 `DataPanel` 按 `PaperItem.compare` 是否存在分流——有则走 `CompareTable`（AICBD 用，一行一个模型配置，主指标驱动条长、次指标同行右对齐，底部为 `gain` 改进幅度强调块），无则走原「对比条 + bigStat」形态（NeurIPS / KDD 用）。`compare.rows[].direction` 决定条长语义（`lower`=误差类越低越好，取反向填充），条长由 `fillPct()` 按该表实际 min/max 归一并留 22%–100% 区间；轴两端标注取自真实取值区间（`axis.min/max`），不是假的 0/50/100%。
- **数值单位必须由数据声明**：`MetricBar.unit` 与 `CompareRow.metrics[].unit` 是显式字段，留空即不渲染任何后缀。**禁止**在组件里按「值不等于 SOTA/—」就补 `%`——MSE、R² 这类指标会被错标成百分数。`panelTitle` 已从纯字符串改为 `Bilingual`，新增面板文案要走 `t()`。

## Lessons
- 用户头像等上传文件必须引用 `.assets_mapping` 里的 CDN_URL，不能用沙箱本地路径（vite 找不到 `/home/user-files`）。
- 动态拼接的 class（如 `` `text-${accent}` ``）Tailwind 扫描不到，会被 purge；强调色请用 `content.ts` 导出的 `ACCENT_CLASS` / `ACCENT_TEXT` 映射表。
- 证件照是竖版人像，圆形裁切会切掉肩部：头像用 `object-cover` + `object-top` 效果更稳（当前 `object-cover` 居中已可接受，若换更大头像建议加 `object-top`）。
- ❌ 给面板内多行元素逐个挂 `reveal` + 递增 `data-reveal-delay` → 依赖 IntersectionObserver 判定，动态渲染区域有永久不可见风险 → 改用纯 CSS keyframes + `:nth-child` 交错延迟（见 `.compare-row`），入场动画与滚动引擎解耦。
- `meoo-cli read-browser-screenshot --path "/#anchor"` 不会执行单页应用的锚点滚动，截图恒停在首屏；需要看深层板块得靠代码复核或让用户手动滚动，不要把它当成页面缺陷反复修。
