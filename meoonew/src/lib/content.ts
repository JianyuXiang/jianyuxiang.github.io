// 站点全部文案与简历内容（中英双语）集中在此文件。
// 内容来源：用户提供的《XIANG Jianyu CV.docx》，英文为简历原文，中文为对应译文。

export type Lang = "zh" | "en";

export interface Bilingual {
  zh: string;
  en: string;
}

/** 编辑排版的行式条目：左栏机构与角色，右栏职责要点 */
export interface TimelineItem {
  org: Bilingual;
  role: Bilingual;
  period: string;
  place?: Bilingual;
  bullets: Bilingual[];
  tags?: string[];
}

/** 教育背景：单条目内可并列多所在读院校 */
export interface EducationSchool {
  org: Bilingual;
  role: Bilingual;
  period: string;
  place: Bilingual;
}

export interface EducationItem {
  /** 左栏并列展示的在读院校 */
  schools: EducationSchool[];
  /** 右栏统一的课程与荣誉要点 */
  bullets: Bilingual[];
}

export interface ProjectItem {
  name: Bilingual;
  summary: Bilingual;
  detail: Bilingual;
  period: string;
  highlights: Bilingual[];
  stack: string[];
  accent: AccentKey;
}

export interface SkillGroup {
  title: Bilingual;
  icon: string;
  accent: AccentKey;
  items: { name: string; level: number; note?: Bilingual }[];
}

/** 论文详情块（对应参考图展开后的四栏细节） */
export interface PaperBlock {
  heading: Bilingual;
  body: Bilingual;
}

/** 数据面板中的对比条（如 M2PO + GCD 67.1% vs M2PO 48.1%） */
export interface MetricBar {
  label: string;
  value: string;
  /** 0–100 的填充比例 */
  pct: number;
  /** 是否用强调色（否则为中性灰） */
  primary: boolean;
  /** 数值单位后缀；留空则不显示任何单位（MSE / R² 这类指标不带 %） */
  unit?: string;
}

/**
 * 分组对比行：一行同时展示同一模型配置的多个指标。
 * direction 决定条长的语义——"lower" 表示数值越低越好（误差类），
 * "higher" 表示越高越好（拟合优度类），由组件换算成填充比例。
 */
export interface CompareRow {
  /** 配置名，保持论文原文写法，不参与翻译 */
  label: string;
  /** 该配置在实验中的角色说明（本文方法 / 基线 / 消融项） */
  note?: Bilingual;
  metrics: {
    /** 指标名缩写，如 MSE / R² */
    key: string;
    /** 展示值（字符串以保留小数位） */
    value: string;
    /** 参与归一化的真实数值 */
    raw: number;
    unit?: string;
  }[];
  /** 是否为本文提出的方法（用强调色） */
  primary: boolean;
  direction: "lower" | "higher";
}

/** 面板底部的改进幅度强调块 */
export interface GainStat {
  /** 主数字，如 "−42%" */
  value: string;
  /** 数字下方的说明 */
  label: Bilingual;
  /** 补充口径 */
  note: Bilingual;
  /** 次要指标（如收敛迭代次数、R² 提升） */
  secondary: { value: string; label: Bilingual }[];
}

export interface PaperItem {
  venue: string;
  /** 索引条里的短名，如 GCD / SCRIBE */
  short: string;
  track: Bilingual;
  role: Bilingual;
  period: string;
  title: Bilingual;
  oneLine: Bilingual;
  question: Bilingual;
  approach: Bilingual;
  panelTitle: Bilingual;
  panelNote: Bilingual;
  bars: MetricBar[];
  bigStat: { value: string; unit: string; label: Bilingual; note: Bilingual };
  /** 存在时该条目改用「分组对比表」形态渲染（目前仅 AICBD） */
  compare?: {
    /** 作为主要指标的 key（其条长驱动整张表） */
    metricKey: string;
    /** 轴的两端标注，取自真实取值区间 */
    axis: { min: string; max: string; caption: Bilingual };
    rows: CompareRow[];
    gain: GainStat;
  };
  stack: string[];
  details: PaperBlock[];
  /** 融合进论文条目的项目说明（与「研究细节」同级的可展开区块） */
  project?: { name: Bilingual; summary: Bilingual; detail: Bilingual };
}

export type AccentKey = "blue" | "purple" | "green" | "orange" | "pink" | "teal" | "indigo";

export const ACCENT_CLASS: Record<AccentKey, string> = {
  blue: "bg-ios-blue",
  purple: "bg-ios-purple",
  green: "bg-ios-green",
  orange: "bg-ios-orange",
  pink: "bg-ios-pink",
  teal: "bg-ios-teal",
  indigo: "bg-ios-indigo",
};

export const ACCENT_TEXT: Record<AccentKey, string> = {
  blue: "text-ios-blue",
  purple: "text-ios-purple",
  green: "text-ios-green",
  orange: "text-ios-orange",
  pink: "text-ios-pink",
  teal: "text-ios-teal",
  indigo: "text-ios-indigo",
};

/** 证件照（用户上传，CDN 地址） */
export const AVATAR_URL =
  "https://conversation.cdn.meoo.host/conversations/368046778773389312/image/2026-10-12/1791816929065-%E5%90%91%E5%BB%BA%E7%BE%BD%E8%AF%81%E4%BB%B6%E7%85%A7.jpg?auth_key=4d1d1ca7011824f56b0ae770beeeb64ef3cb2720feb8a5fe26ced5e131dd9ada";

/** 简历原件（用户上传，CDN 地址） */
export const RESUME_URL =
  "https://conversation.cdn.meoo.host/conversations/368046778773389312/file/2026-10-12/1791817799535-XIANG_Jianyu_CV.docx?auth_key=19fad6c0081655921736ccb3ccaa7d42bb138ddf7134528ed72677e0b97c53f7";

export const PROFILE = {
  name: { zh: "向建羽", en: "Jianyu XIANG" },
  shortName: { zh: "向建羽", en: "Jianyu" },
  initials: "XJY",
  slogan: {
    zh: "今日之探索，明日之智能",
    en: "Today's exploration, tomorrow's intelligence",
  },
  titles: [
    { zh: "AI Agent 研究", en: "AI Agent Research" },
    { zh: "大模型强化学习", en: "LLM Reinforcement Learning" },
    { zh: "数据建模", en: "Data Modelling" },
  ] as Bilingual[],
  /** 简历中未给出所在城市，故不展示地点信息 */
  location: null as Bilingual | null,
  email: "jxiang1@emich.edu",
  phone: "+86 182 8208 1298",
  birth: { zh: "2005 年 8 月 25 日", en: "August 25, 2005" } as Bilingual,
  /** 简历入口暂关：留空即隐藏 Hero「下载简历」；恢复时改回 resumeUrl: RESUME_URL */
  resumeUrl: "",
};

export const NAV: { id: SectionId; label: Bilingual }[] = [
  { id: "about", label: { zh: "关于", en: "About" } },
  { id: "papers", label: { zh: "研究", en: "Research" } },
  { id: "experience", label: { zh: "经历", en: "Experience" } },
  { id: "contact", label: { zh: "联系", en: "Contact" } },
];

export type SectionId = "about" | "papers" | "experience" | "contact";

export const UI = {
  exploreResearch: { zh: "查看研究成果", en: "Explore Research" },
  downloadCV: { zh: "下载简历", en: "Download CV" },
  viewResume: { zh: "查看简历", en: "View Résumé" },
  downloadResume: { zh: "下载简历", en: "Download Résumé" },
  contactMe: { zh: "联系我", en: "Get in touch" },
  copyEmail: { zh: "复制邮箱", en: "Copy email" },
  emailCopied: { zh: "邮箱已复制", en: "Email copied" },
  sendEmail: { zh: "发送邮件", en: "Send email" },
  copyPhone: { zh: "复制电话", en: "Copy phone" },
  copied: { zh: "已复制", en: "Copied" },
  lightMode: { zh: "浅色模式", en: "Light mode" },
  darkMode: { zh: "深色模式", en: "Dark mode" },
  language: { zh: "语言", en: "Language" },
  expand: { zh: "研究细节与实验", en: "Research details & experiments" },
  collapse: { zh: "收起研究细节", en: "Collapse research details" },
  scrollHint: { zh: "向下滚动了解更多", en: "Scroll to explore" },
  education: { zh: "教育背景", en: "Education" },
  research: { zh: "科研经历", en: "Research Experience" },
  footerNote: {
    zh: "本站由个人独立设计与实现 · 中英文可随时切换",
    en: "Designed & built solo · Switch language anytime",
  },
  backToTop: { zh: "回到顶部", en: "Back to top" },
};

export const STATS: { value: string; suffix: string; label: Bilingual; accent: AccentKey }[] = [
  { value: "3", suffix: "", label: { zh: "会议论文录用", en: "Papers accepted" }, accent: "blue" },
  { value: "3", suffix: "", label: { zh: "共同第一作者", en: "Co-first authorships" }, accent: "purple" },
  { value: "0.93", suffix: " R²", label: { zh: "模型拟合优度", en: "Model goodness of fit" }, accent: "green" },
  { value: "Top", suffix: "5%", label: { zh: "专业排名", en: "Class ranking" }, accent: "orange" },
];

/** 首屏编辑排版所需字段（均取自简历） */
export const HERO = {
  /** 首屏元信息行：可列多条在读学位，样式相同 */
  metas: [
    {
      org: { zh: "东密歇根大学，美国", en: "Eastern Michigan University, USA" } as Bilingual,
      major: { zh: "计算机与电气工程技术", en: "Computer and Electrical Engineering Technology" } as Bilingual,
      period: "2027.08 — 2028.04",
    },
    {
      org: { zh: "北部湾大学，中国", en: "Beibu Gulf University, China" } as Bilingual,
      major: { zh: "物联网工程", en: "Internet of Things Engineering" } as Bilingual,
      period: "2024.09 — 2027.06",
    },
  ],
  statement: {
    zh: "研究智能体如何学习、协作并真正发挥作用。",
    en: "Studying how AI agents learn, collaborate and perform.",
  } as Bilingual,
  focus: [
    { zh: "AI Agent", en: "AI Agents" },
    { zh: "智能体强化学习", en: "Agentic RL" },
    { zh: "数据建模", en: "Data Modelling" },
  ] as Bilingual[],
  gpa: "3.5 / 4.0",
  rank: "11 / 220 · Top 5%",
  contacts: [
    {
      label: { zh: "邮箱", en: "Email" } as Bilingual,
      value: "jxiang1@emich.edu",
      href: "mailto:jxiang1@emich.edu",
    },
    {
      label: { zh: "邮箱", en: "Email" } as Bilingual,
      value: "jyxiangcn@163.com",
      href: "mailto:jyxiangcn@163.com",
    },
    {
      label: { zh: "电话", en: "Phone" } as Bilingual,
      value: "+86 182 8208 1298",
      href: "tel:+8618282081298",
    },
    {
      label: { zh: "出生日期", en: "Date of Birth" } as Bilingual,
      value: "August 25, 2005",
      href: "",
    },
  ],
  keywords: {
    zh: "Learning · Collaboration · Evaluation",
    en: "Learning · Collaboration · Evaluation",
  } as Bilingual,
};

export const ABOUT = {
  paragraph: {
    zh: "拥有中美双理工科学术背景，目前聚焦 AI Agent 与大模型强化学习方向。已有 3 篇会议论文被 KDD 2026 AI Agents、NeurIPS 2026 与 AICBD 2025 录用，其中 3 篇为共同第一作者。在数学建模竞赛中担任队伍核心成员、在人工智能赛事中担任队长，多次获得省级及以上奖项；也习惯把研究里跑通的方法整理成可复用的工具。",
    en: "I have a dual China–US STEM background and work on AI agents and LLM reinforcement learning. Three conference papers have been accepted at KDD 2026 AI Agents, NeurIPS 2026 and AICBD 2025 — all three as co-first author. I have served as a core member of mathematical modelling teams and as team leader in AI competitions, winning multiple provincial-level awards, and I keep turning what works in research into tools others can reuse.",
  },
  points: [
    {
      title: { zh: "科研创新", en: "Research" },
      desc: {
        zh: "从第一性原理出发定位被忽略的偏差，把问题拆成可证明、可测量的部分。",
        en: "I look for overlooked bias from first principles and break it into provable, measurable parts.",
      },
      icon: "🔬",
      accent: "blue" as AccentKey,
    },
    {
      title: { zh: "建模实践", en: "Modelling" },
      desc: {
        zh: "熟悉从数据预处理、模型构建到仿真验证的完整链路，并用指标说明效果。",
        en: "Comfortable across preprocessing, model building and simulation, always reported with metrics.",
      },
      icon: "📐",
      accent: "purple" as AccentKey,
    },
    {
      title: { zh: "团队协作", en: "Leadership" },
      desc: {
        zh: "担任队长组织跨学科调研与现场汇报，擅长整合分歧、推动结论落地。",
        en: "As team leader I run interdisciplinary research and present findings, aligning disagreement into decisions.",
      },
      icon: "🤝",
      accent: "green" as AccentKey,
    },
  ],
};

export const EDUCATION: EducationItem[] = [
  {
    schools: [
      {
        org: { zh: "东密歇根大学", en: "Eastern Michigan University" },
        role: { zh: "计算机与电气工程技术 · 本科在读", en: "Computer and Electrical Engineering Technology · B.Sc." },
        period: "2027.08 — 2028.04",
        place: { zh: "美国", en: "United States" },
      },
      {
        org: { zh: "北部湾大学", en: "Beibu Gulf University" },
        role: { zh: "物联网工程 · 本科在读", en: "Internet of Things Engineering · B.Sc." },
        period: "2024.09 — 2027.06",
        place: { zh: "中国", en: "China" },
      },
    ],
    bullets: [
      {
        zh: "中美双理工科学位在读，全英文或双语授课的专业课程环境，具备英文学术写作与汇报能力",
        en: "Two simultaneous STEM degrees taught in full English or bilingually, with academic writing and presentation practice",
      },
      {
        zh: "主修课程：高等数学、线性代数、概率论与数理统计、离散数学、网络与商业技术、C 语言程序设计、Java 程序设计、微电子电路、电路分析、光电技术、Android 应用程序开发、Web 应用与开发、计算机操作系统",
        en: "Core courses: Advanced Mathematics, Linear Algebra, Probability & Mathematical Statistics, Discrete Mathematics, Network & Business Technology, C and Java Programming, Microelectronic Circuits, Circuit Analysis, Electro-optics, Android Application Development, Web Application Development and Computer Operating Systems",
      },
      {
        zh: "获校级优秀共青团员、学院优秀学生干部称号",
        en: "Awarded Excellent League Member at university level and Outstanding Student Cadre at college level",
      },
    ],
  },
];

export const PAPERS: PaperItem[] = [
  {
    venue: "NeurIPS 2026",
    short: "GCD",
    project: {
      name: { zh: "Gradient Coupled KV Drift (GCD)", en: "Gradient Coupled KV Drift (GCD)" },
      summary: {
        zh: "量化并缓解离线策略 LLM 强化学习中被忽略的混合分布偏差",
        en: "Quantifies and mitigates the overlooked hybrid-distribution bias in off-policy LLM RL",
      },
      detail: {
        zh: "我们发现离线策略 LLM 强化学习中一个长期被忽视的偏差：参数更新后复用陈旧 KV cache 会从未被 token 级重要性权重察觉的混合分布中采样。GCD 是隐状态感知的修正方案，包含三部分：(i) 一阶偏差界定理（Theorem 5），把漂移分解为逐层注意力熵与 DeltaNet 谱半径；(ii) 标记病态注意力集中的尾部事件检测器；(iii) 由 RL 目标推导出的漂移触发选择性重算策略。在 Qwen3.5-9B + GRPO 上，GCD 使 staleness 512 下训练保持稳定（同设置下 M2PO 崩溃），rollout 墙钟时间下降 38%，bench retail pass@4 提升 5.7 分。3:1 混合架构把偏差集中在仅 25% 的层上，使修正天然稀疏。",
        en: "We identify a previously overlooked bias in off-policy LLM RL: reusing stale KV caches under updated parameters samples from a hybrid distribution that token-level importance weights cannot detect. GCD is a hidden-state-aware correction comprising (i) a first-order bias bound (Theorem 5) decomposing drift into per-layer attention entropy and DeltaNet spectral radius, (ii) a tail-event detector flagging pathological attention concentration, and (iii) a drift-triggered selective recompute policy derived from the RL objective. On Qwen3.5-9B with GRPO, GCD enables stable training at staleness 512 where M2PO collapses, cuts rollout wall-clock by 38%, and lifts bench retail pass@4 by 5.7 points. The 3:1 hybrid architecture concentrates bias in only 25% of layers, making the correction intrinsically sparse.",
      },
    },
    track: { zh: "Main Track · 已录用", en: "Main Track · Accepted" },
    role: { zh: "共同第一作者 · 同等贡献", en: "Co-first author · Equal contribution" },
    period: "2024.11 — 2026.05",
    title: {
      zh: "Gradient Coupled KV Drift (GCD)：离线策略智能体强化学习中的隐状态感知重要性修正",
      en: "Gradient Coupled KV Drift (GCD): Hidden State Aware Importance Correction for Off-Policy Agentic RL",
    },
    oneLine: {
      zh: "量化并缓解离线策略 LLM 强化学习中被忽略的混合分布偏差",
      en: "Correcting hidden-state bias in agentic RL",
    },
    question: {
      zh: "参数更新后复用陈旧 KV cache，会从未被 token 级重要性权重察觉的混合分布中采样。",
      en: "Reusing a stale KV cache after a policy update creates a hybrid sampling distribution that token-level importance ratios cannot detect.",
    },
    approach: {
      zh: "逐层漂移界定理 + 尾部事件检测器 + 漂移触发的选择性重算。修正权重可与 M2PO 信赖域直接复合。",
      en: "Per-layer drift bounds, a tail-event detector and drift-triggered selective recomputation. The corrected weight composes with the M2PO trust region.",
    },
    panelTitle: { zh: "MATH-500 基准", en: "MATH-500" },
    panelNote: { zh: "staleness 512", en: "staleness 512" },
    bars: [
      { label: "M2PO + GCD", value: "67.1", pct: 67.1, primary: true, unit: "%" },
      { label: "M2PO", value: "48.1", pct: 48.1, primary: false, unit: "%" },
    ],
    bigStat: {
      value: "1.38",
      unit: "×",
      label: { zh: "rollout 吞吐", en: "Rollout throughput" },
      note: { zh: "对比全量重算 · staleness 512", en: "vs. full recomputation · staleness 512" },
    },
    stack: ["GRPO", "Qwen3.5-9B", "FSDP-2", "vLLM"],
    details: [
      {
        heading: { zh: "测量与理论", en: "Measurement & theory" },
        body: {
          zh: "在 Qwen3.5-9B 上，staleness 256 / 512 时的隐状态中位间隙为 0.034 / 0.108 nats/token。该界定分离了全注意力项与 Gated DeltaNet 项，在 95.9% 的 token 上紧致度为 0.64–0.80。",
          en: "On Qwen3.5-9B, median hidden gaps are 0.034 / 0.108 nats/token at staleness 256 / 512. The bound separates full-attention and Gated DeltaNet terms, with tightness 0.64–0.80 on 95.9% of tokens.",
        },
      },
      {
        heading: { zh: "训练与评估", en: "Training & evaluation" },
        body: {
          zh: "GRPO 于 4×H100、FP8、FSDP-2、verl + vLLM。staleness 256 时 τ-bench retail pass⁴ 达 44.1 vs 38.4（+5.7，p < 0.001）。staleness 512 时新增计算仅为一次全量重算的 1.9%。",
          en: "GRPO on 4 × H100 with FP8, FSDP-2, verl + vLLM. At staleness 256, τ-bench retail pass⁴ reaches 44.1 vs. 38.4 (+5.7, p < 0.001). At staleness 512, added computation over naive reuse is only 1.9% of a full recompute.",
        },
      },
      {
        heading: { zh: "偏差修正检验", en: "Bias-correction test" },
        body: {
          zh: "E[bₜ] = KL(π_hyb ‖ π_new) ≥ 0。在 staleness 256 / 512 下，修正权重在 68% / 74% 的 token 上更接近全量重算的真值，而均值阻尼基线仅为 58% / 61%。Llama-3.1-8B 在 512 下保持稳定，而 M2PO 在三个随机种子上全部发散。",
          en: "E[bₜ] = KL(πhyb ‖ πnew) ≥ 0. At staleness 256 / 512, corrected weights are closer to full-recomputation ground truth on 68% / 74% of tokens, versus 58% / 61% for matched-mean damping. Llama-3.1-8B stays stable at 512, where M2PO diverges in all three seeds.",
        },
      },
      {
        heading: { zh: "长轨迹成本", en: "Long-trajectory cost" },
        body: {
          zh: "检测器仅在 7.9% 的智能体推理 token 与 0.6% 的工具输出 token 上触发。重算 token 占比从 4k 时的 8.7% 仅升至 16k 时的 9.3%。全注意力层只占 25% 的层数，却贡献 72–77% 的偏差。",
          en: "The detector fires on 7.9% of agent reasoning tokens and 0.6% of tool-output tokens. Recomputed tokens rise only from 8.7% at 4k to 9.3% at 16k. Full-attention layers account for 25% of layers but 72–77% of the bias.",
        },
      },
    ],
  },
  {
    venue: "KDD 2026 AI Agents",
    short: "SCRIBE",
    project: {
      name: {
        zh: "SC-Black Swan-Bench & SCRIBE 智能体框架",
        en: "SC-Black Swan-Bench & SCRIBE Agent Framework",
      },
      summary: {
        zh: "业界首个面向 LLM 智能体的供应链黑天鹅事件评测基准，配套闭环智能体框架",
        en: "The industry's first evaluation benchmark for LLM agents on supply-chain black-swan events, with a companion closed-loop agent framework",
      },
      detail: {
        zh: "针对持续非平稳条件下全球供应链的黑天鹅风险响应难题，构建覆盖真实跨域事件与全链路评测维度的基准 SC-Black Swan-Bench；同时提出具备理论保证的 SCRIBE 智能体框架，建立「感知—因果推理—动态重规划」的闭环范式。框架融合时序图建模、因果推断与运筹学验证，理论上可证明，实验表现显著优于主流前沿智能体方法。",
        en: "Addressing black-swan risk response for global supply chains under persistent non-stationary conditions, we built SC-Black Swan-Bench covering real-world cross-domain incidents and full-chain evaluation dimensions. We also propose SCRIBE, a theoretically guaranteed agent framework establishing a closed loop of perception → causal reasoning → dynamic replanning. Integrating temporal graph modelling, causal inference and operational-research validation, it is theoretically provable and substantially outperforms state-of-the-art agent approaches experimentally.",
      },
    },
    track: { zh: "AI Agents Track · 已录用", en: "AI Agents Track · Accepted" },
    role: { zh: "共同第一作者 · 同等贡献", en: "Co-first author · Equal contribution" },
    period: "2026.01 — 2026.05",
    title: {
      zh: "SC-Black Swan-Bench 与 SCRIBE：供应链黑天鹅风险响应的基准与智能体框架",
      en: "SC-Black Swan-Bench & SCRIBE: A Benchmark and Agent Framework for Supply Chain Black-Swan Risk Response",
    },
    oneLine: {
      zh: "为持续非平稳条件下的供应链黑天鹅事件建立首个评测基准与闭环智能体框架",
      en: "The first benchmark and closed-loop agent framework for supply-chain black-swan events under non-stationary conditions",
    },
    question: {
      zh: "全球供应链长期处于持续非平稳状态，现有评测无法刻画突发中断下智能体的真实响应能力。",
      en: "Global supply chains stay persistently non-stationary, and existing benchmarks cannot capture how agents truly respond to sudden disruption.",
    },
    approach: {
      zh: "构建覆盖真实跨域事件与全链路维度的基准 SC-Black Swan-Bench；提出具备理论保证的 SCRIBE 框架，形成「感知—因果推理—动态重规划」闭环。",
      en: "We build SC-Black Swan-Bench over real cross-domain incidents with full-chain evaluation, and propose SCRIBE, a theoretically guaranteed loop of perception → causal reasoning → dynamic replanning.",
    },
    panelTitle: { zh: "跨域中断事件", en: "Cross-domain incidents" },
    panelNote: { zh: "全链路评测维度", en: "full-chain evaluation" },
    bars: [
      { label: "SCRIBE (ours)", value: "SOTA", pct: 92, primary: true },
      { label: "Frontier agent baselines", value: "—", pct: 58, primary: false },
    ],
    bigStat: {
      value: "1st",
      unit: "",
      label: { zh: "该领域评测基准", en: "benchmark of its kind" },
      note: { zh: "理论可证明 · 超越 SOTA 智能体方法", en: "theoretically provable · beats SOTA agent baselines" },
    },
    stack: ["LLM Agents", "Temporal Graph", "Causal Inference", "Operations Research"],
    details: [
      {
        heading: { zh: "基准构造", en: "Benchmark construction" },
        body: {
          zh: "基准覆盖真实世界的跨域中断事件，并从感知、推理、重规划到执行建立全链路评测维度，避免只看最终答案的片面评估。",
          en: "The benchmark covers real-world cross-domain incidents and evaluates the whole chain — perception, reasoning, replanning and execution — instead of scoring only final answers.",
        },
      },
      {
        heading: { zh: "框架设计", en: "Framework design" },
        body: {
          zh: "SCRIBE 融合时序图建模、因果推断与运筹学验证，把「感知—因果推理—动态重规划」组织为可闭环迭代的智能体流程。",
          en: "SCRIBE integrates temporal graph modelling, causal inference and operations-research validation into an iterable agent loop of perception → causal reasoning → dynamic replanning.",
        },
      },
      {
        heading: { zh: "实验结论", en: "Empirical result" },
        body: {
          zh: "在同类任务上实验表现显著优于主流前沿智能体方法，且框架性质具备理论保证。",
          en: "Experiments show substantial gains over state-of-the-art agent approaches, with theoretical guarantees on the framework's properties.",
        },
      },
      {
        heading: { zh: "个人贡献", en: "My contribution" },
        body: {
          zh: "作为共同第一作者参与基准设计与框架搭建，负责因果推理与实验验证环节的方案推进。",
          en: "As co-first author I took part in benchmark design and framework construction, driving the causal-reasoning and experimental-validation components.",
        },
      },
    ],
  },
  {
    venue: "AICBD 2025",
    short: "ABLNet",
    project: {
      name: { zh: "ABLNet：融合注意力与贝叶斯优化的 LSTM 高效建模", en: "ABLNet: Efficient LSTM Modeling Based on Fusion Attention and Bayesian Optimization" },
      summary: {
        zh: "面向高维非线性时序预测的 LSTM + 多头注意力 + 贝叶斯优化融合架构",
        en: "A fusion of LSTM, multi-head attention and Bayesian optimisation for high-dimensional non-linear time-series forecasting",
      },
      detail: {
        zh: "针对动态系统里高维多元时序预测中的强非线性、显著扰动与复杂依赖结构，提出融合架构 ABLNet（Attention-augmented Bayesian-optimized LSTM Network）：以 LSTM 子模块建模时间依赖，用多头注意力机制增强模型对关键时间片段的响应，并以贝叶斯优化自动搜索超参，从而提升泛化性能与收敛速度。特征侧把 PCA 全局降维（前 5 个主成分累计贡献率 89.8%）与贝叶斯信息增益 BIG 局部特征选择（5 个特征累计信息增益 91.8%）通过加权平均融合（α = 0.5），形成「降维—选择—建模」的一体化流程。在多家公司股票收盘价的五公司对比实验中，混合模型取得 MSE 136.79 / R² 0.90，优于单 LSTM + PCA（142.35 / 0.89）与单 LSTM + 信息增益（140.18 / 0.89）。",
        en: "To address strong non-linearity, heavy disturbance and complex dependency structure in high-dimensional multivariate time-series forecasting, we propose ABLNet (Attention-augmented Bayesian-optimised LSTM Network): an LSTM submodule models temporal dependence, a multi-head attention mechanism sharpens responsiveness to critical time segments, and Bayesian optimisation searches hyper-parameters automatically, improving generalisation and convergence speed. On the feature side we fuse PCA-based global dimensionality reduction (top 5 components, 89.8% cumulative variance) with Bayesian Information Gain local feature selection (5 features, 91.8% cumulative gain) by weighted averaging (α = 0.5), forming an integrated reduction–selection–modelling pipeline. In a five-company closing-price comparison, the hybrid model reaches MSE 136.79 / R² 0.90, outperforming single LSTM + PCA (142.35 / 0.89) and LSTM + information gain (140.18 / 0.89).",
      },
    },
    track: { zh: "Main Track · 已录用", en: "Main Track · Accepted" },
    role: { zh: "共同第一作者 · 同等贡献", en: "Co-first author · Equal contribution" },
    period: "2025.01 — 2025.11",
    title: {
      zh: "基于融合注意力与贝叶斯优化的 LSTM 高效建模研究：面向高维序列预测",
      en: "Research on Efficient Modeling of LSTM for High-Dimensional Sequence Prediction Based on Fusion Attention and Bayesian Optimization",
    },
    oneLine: {
      zh: "把 LSTM、多头注意力与贝叶斯优化统一为一个结构感知、参数自适应的时序建模框架",
      en: "Unifying LSTM, multi-head attention and Bayesian optimisation into one structure-aware, parameter-adaptive forecasting framework",
    },
    question: {
      zh: "高维多元序列具有强非线性、显著扰动与复杂依赖结构；传统统计模型表达力不足，深度学习模型在特征冗余与高维度下训练不稳、注意力涣散。",
      en: "High-dimensional multivariate series are strongly non-linear, heavily disturbed and structurally complex; statistical models lack expressive power while deep models become unstable and diffuse attention under feature redundancy.",
    },
    approach: {
      zh: "LSTM 建模长短期依赖 + 八个注意力头并行聚焦突变/周期/异常点 + 高斯过程代理模型与 EI 采集函数自动调参，并用 PCA × 信息增益加权融合构造模型输入。",
      en: "LSTM captures long- and short-range dependence, eight parallel attention heads focus on mutation, periodic and anomaly points, and a Gaussian-process surrogate with Expected Improvement tunes hyper-parameters automatically; PCA and information-gain weights are fused to build the model input.",
    },
    panelTitle: { zh: "五家公司收盘价预测", en: "Five-company Closing Price" },
    panelNote: { zh: "20 日滚动窗口 · MSE 越低越好", en: "20-day rolling window · lower MSE is better" },
    bars: [],
    compare: {
      metricKey: "MSE",
      axis: {
        min: "125",
        max: "143",
        caption: { zh: "均方误差（MSE）· 取自论文 Table II", en: "Mean square error · from Table II" },
      },
      rows: [
        {
          label: "Attention + Bayes + LSTM",
          note: { zh: "本文方法", en: "Ours" },
          metrics: [
            { key: "MSE", value: "136.79", raw: 136.79 },
            { key: "R²", value: "0.90", raw: 0.9 },
          ],
          primary: true,
          direction: "lower",
        },
        {
          label: "+ PCA",
          note: { zh: "加入全局降维", en: "with global reduction" },
          metrics: [
            { key: "MSE", value: "128.62", raw: 128.62 },
            { key: "R²", value: "0.92", raw: 0.92 },
          ],
          primary: false,
          direction: "lower",
        },
        {
          label: "+ Bayesian Information Gain",
          note: { zh: "加入局部特征选择", en: "with feature selection" },
          metrics: [
            { key: "MSE", value: "125.87", raw: 125.87 },
            { key: "R²", value: "0.92", raw: 0.92 },
          ],
          primary: false,
          direction: "lower",
        },
        {
          label: "LSTM + PCA",
          note: { zh: "单一基线", en: "single baseline" },
          metrics: [
            { key: "MSE", value: "142.35", raw: 142.35 },
            { key: "R²", value: "0.89", raw: 0.89 },
          ],
          primary: false,
          direction: "lower",
        },
        {
          label: "LSTM + Information Gain",
          note: { zh: "单一基线", en: "single baseline" },
          metrics: [
            { key: "MSE", value: "140.18", raw: 140.18 },
            { key: "R²", value: "0.89", raw: 0.89 },
          ],
          primary: false,
          direction: "lower",
        },
      ],
      gain: {
        value: "−42",
        label: { zh: "训练耗时（对比网格搜索）", en: "training time vs. grid search" },
        note: { zh: "贝叶斯优化以期望改进为采集函数，仅 20 次迭代即收敛到最优超参组合。", en: "Expected-improvement acquisition converges to the best configuration in just 20 iterations." },
        secondary: [
          { value: "+12%", label: { zh: "R² 提升", en: "higher R²" } },
          { value: "2.0%", label: { zh: "稳态 MAPE", en: "steady-state MAPE" } },
        ],
      },
    },
    bigStat: {
      value: "122.45",
      unit: " MSE",
      label: { zh: "多任务平均误差", en: "Average MSE across tasks" },
      note: { zh: "同时 R² 达 0.93，优于单一模型", en: "with R² 0.93, ahead of single models" },
    },
    stack: ["LSTM", "Multi-head Attention", "Bayesian Optimisation", "PCA", "Information Gain"],
    details: [
      {
        heading: { zh: "特征工程", en: "Feature construction" },
        body: {
          zh: "数据集与单公司预测保持一致，包含收盘价、滞后特征、技术指标与成交量特征，采用 20 日滚动窗口。PCA 提取前 5 个主成分（累计方差贡献 89.8%），贝叶斯信息增益选出信息量最大的 5 个特征（累计增益 91.8%），两者权重经 α = 0.5 加权平均融合后作为模型输入。",
          en: "The dataset matches the single-company setting — closing prices, lagged features, technical indicators and volume characteristics over a 20-day rolling window. PCA extracts the top 5 components (89.8% cumulative variance) and Bayesian information gain selects the 5 highest-gain features (91.8% cumulative gain); the two weight sets are averaged with α = 0.5 as model input.",
        },
      },
      {
        heading: { zh: "模型结构", en: "Architecture" },
        body: {
          zh: "LSTM 通过遗忘门、输入门与输出门动态调节细胞状态，捕捉高维序列中的因果依赖并缓解梯度消失；多头注意力计算不同时间步的相对重要性权重，在八个头上并行捕获多样时间特征，提升对突变点、周期点与异常点的响应。",
          en: "LSTM regulates cell state through forget, input and output gates, capturing causal dependence in high-dimensional sequences and mitigating vanishing gradients. Multi-head attention computes relative importance across time steps and, over eight heads, captures diverse temporal patterns in parallel, sharpening response to mutation, periodic and anomaly points.",
        },
      },
      {
        heading: { zh: "贝叶斯优化", en: "Bayesian optimisation" },
        body: {
          zh: "以高斯过程构造目标函数的代理模型，用期望改进 EI、UCB 等采集函数在超参空间迭代搜索，自动调整学习率、隐层维度与 dropout 比例。相比网格/随机搜索，样本效率与全局收敛能力更高，仅需 20 次迭代即收敛到最优组合，训练时间减少 42%，R² 提升 12%。",
          en: "A Gaussian-process surrogate models the objective, and acquisition functions such as Expected Improvement and UCB iteratively search the hyper-parameter space, adjusting learning rate, hidden dimensions and dropout. Versus grid/random search it offers higher sample efficiency and global convergence, reaching the best combination in 20 iterations, cutting training time by 42% and raising R² by 12%.",
        },
      },
      {
        heading: { zh: "对比实验", en: "Comparative experiment" },
        body: {
          zh: "基线覆盖 SARIMA、单 LSTM、GRU、Attention-LSTM 与 Bayes-LSTM。五公司数据上混合模型为 MSE 136.79 / R² 0.90，加入 PCA 或信息增益后分别为 128.62 / 0.92 与 125.87 / 0.92；稳态区间 MAPE 由单 LSTM 的 2.5% 降至 2.0%。",
          en: "Baselines span SARIMA, single LSTM, GRU, Attention-LSTM and Bayes-LSTM. On the five-company data the hybrid model scores MSE 136.79 / R² 0.90, improving to 128.62 / 0.92 with PCA and 125.87 / 0.92 with information gain; in steady-state periods MAPE falls from 2.5% for single LSTM to 2.0%.",
        },
      },
    ],
  },
];

/** 兼容旧引用：索引条所需的精简视图 */
export const PAPER_INDEX = PAPERS.map((p) => ({ short: p.short, venue: p.venue }));

export const RESEARCH: TimelineItem[] = [
  {
    org: { zh: "香港大学 · 智能设计助力智能研究", en: "University of Hong Kong · Smart Design for Smart Research" },
    role: { zh: "队长（暑期实践项目）", en: "Team Leader (Summer Programme)" },
    period: "2025.07 — 2025.08",
    place: { zh: "中国香港", en: "Hong Kong, China" },
    tags: ["BEST PRESENTATION AWARD · 2nd Runner-Up"],
    bullets: [
      {
        zh: "面向跨学科研究中心开展需求调研，访谈港大主校区工程、艺术、物理、医学与生命科学五类专业人士",
        en: "Ran demand research for an interdisciplinary research centre, interviewing five professional groups (Engineering, Arts, Physics, Medicine, Life Sciences) at HKU's main campus",
      },
      {
        zh: "汇总形成需求清单支撑项目设计，整合五位组员的方案产出并完成现场汇报",
        en: "Consolidated a requirement checklist to drive design, integrated five members' outputs and delivered the on-site presentation",
      },
      {
        zh: "团队获最佳展示奖第三名（2nd Runner-Up）",
        en: "The team won the Best Presentation Award — 2nd Runner-Up",
      },
    ],
  },
  {
    org: { zh: "2026 美国大学生数学建模竞赛", en: "2026 MCM / Interdisciplinary Contest in Modeling (USA)" },
    role: { zh: "核心成员", en: "Core Member" },
    period: "2026.01 — 2026.02",
    place: { zh: "美国", en: "United States" },
    tags: ["GWO-Random Forest", "Monte-Carlo", "KNN Imputation"],
    bullets: [
      {
        zh: "研究竞赛中观众投票与评委评分的融合机制优化，构建 GWO-随机森林模型推断隐性粉丝投票",
        en: "Studied fusion of audience voting and judge scoring in competitions, building a GWO–Random Forest model to infer implicit fan votes",
      },
      {
        zh: "通过对比排序法与百分比法评估投票公平性偏差，并设计动态加权仲裁机制平衡公平性与观赏性",
        en: "Measured fairness bias by comparing ranking vs percentage methods, and designed a dynamic weighted arbitration mechanism balancing fairness and entertainment value",
      },
      {
        zh: "使用 KNN 插补与分层抽样完成数据预处理，用蒙特卡洛仿真比较不同投票机制下的淘汰风险",
        en: "Preprocessed data via KNN imputation and stratified sampling, then used Monte-Carlo simulation to compare elimination risk across voting mechanisms",
      },
      {
        zh: "模型预测准确率达 98.75%，极端分歧下的淘汰率显著下降，有效缓解赛果争议",
        en: "Achieved 98.75% prediction accuracy, significantly lowering elimination rate under extreme divergence and mitigating result disputes",
      },
    ],
  },
];

/** 竞赛获奖：经历板块折叠分组，按级别分列 */
export interface AwardGroup {
  /** 分组名与数量提示文案 */
  label: Bilingual;
  countLabel: Bilingual;
  items: Bilingual[];
}

export const COMPETITION_AWARDS: AwardGroup[] = [
  {
    label: { zh: "省级奖项", en: "Provincial Awards" },
    countLabel: { zh: "3 项省级奖项", en: "3 provincial-level awards" },
    items: [
      {
        zh: "第 11 届全国大学生统计建模大赛三等奖（省级）",
        en: "11th National College Students Statistical Modeling Competition Third Prize (Provincial Level)",
      },
      {
        zh: "第七届全球校园人工智能算法精英大赛三等奖（省级）",
        en: "7th Global Campus Artificial Intelligence Algorithm Elite Competition Third Prize (Provincial Level)",
      },
      {
        zh: "第七届国际青年人工智能大赛西部与东盟赛区总决赛三等奖",
        en: "Final of the Western & ASEAN Division Trials, 7th International Youth Artificial Intelligence Competition Third Prize",
      },
    ],
  },
  {
    label: { zh: "校级奖项", en: "University Awards" },
    countLabel: { zh: "5 项校级奖项", en: "5 university-level awards" },
    items: [
      {
        zh: "中国国际大学生创新大赛（2026）：WindClaw——天空地一体化的多智能体协同深海远洋风机缺陷探测系统，北部湾大学校内选拔赛金奖",
        en: "China International College Students' Innovation Competition 2026 — WindClaw: an integrated space–air–ground multi-agent system for deep-sea offshore wind turbine defect detection, Gold Award, Beibu Gulf University campus selection",
      },
      {
        zh: "中国国际大学生创新大赛（2026）：ForestClaw——基于 Openclaw + RL 的天空地协同树林病虫害与缺陷检测靶向预警防治系统，北部湾大学校内选拔赛金奖",
        en: "China International College Students' Innovation Competition 2026 — ForestClaw: an Openclaw + RL based space–air–ground collaborative system for forest pest and defect detection with targeted early warning and control, Gold Award, Beibu Gulf University campus selection",
      },
      {
        zh: "2026 中国大学生计算机设计大赛：智评之眼，北部湾大学校赛一等奖",
        en: "2026 Chinese College Students' Computer Design Competition — Smart Evaluation Eye, First Prize, Beibu Gulf University campus round",
      },
      {
        zh: "2026 中国大学生计算机设计大赛：星-空-地一体化红树林虫情动态监测及靶向消杀系统，北部湾大学校赛一等奖",
        en: "2026 Chinese College Students' Computer Design Competition — Satellite–Air–Ground integrated dynamic mangrove pest monitoring and targeted disinfection system, First Prize, Beibu Gulf University campus round",
      },
      {
        zh: "2026 中国大学生计算机设计大赛：慧敛虫踪——天空地协同红树林病虫害靶向预警防治系统，北部湾大学校赛三等奖",
        en: "2026 Chinese College Students' Computer Design Competition — Pest Tracker: a space–air–ground collaborative mangrove pest targeted early-warning and control system, Third Prize, Beibu Gulf University campus round",
      },
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    name: {
      zh: "SC-Black Swan-Bench & SCRIBE 智能体框架",
      en: "SC-Black Swan-Bench & SCRIBE Agent Framework",
    },
    summary: {
      zh: "业界首个面向 LLM 智能体的供应链黑天鹅事件评测基准，配套闭环智能体框架",
      en: "The industry's first evaluation benchmark for LLM agents on supply-chain black-swan events, with a companion closed-loop agent framework",
    },
    detail: {
      zh: "针对持续非平稳条件下全球供应链的黑天鹅风险响应难题，构建覆盖真实跨域事件与全链路评测维度的基准 SC-Black Swan-Bench；同时提出具备理论保证的 SCRIBE 智能体框架，建立「感知—因果推理—动态重规划」的闭环范式。框架融合时序图建模、因果推断与运筹学验证，理论上可证明，实验表现显著优于主流前沿智能体方法。",
      en: "Addressing black-swan risk response for global supply chains under persistent non-stationary conditions, we built SC-Black Swan-Bench covering real-world cross-domain incidents and full-chain evaluation dimensions. We also propose SCRIBE, a theoretically guaranteed agent framework establishing a closed loop of perception → causal reasoning → dynamic replanning. Integrating temporal graph modelling, causal inference and operational-research validation, it is theoretically provable and substantially outperforms state-of-the-art agent approaches experimentally.",
    },
    period: "KDD 2026 AI Agents · 2026.01 — 2026.05",
    highlights: [
      { zh: "首个该领域评测基准", en: "First benchmark of its kind" },
      { zh: "理论可证明", en: "Theoretically provable" },
      { zh: "超越 SOTA 智能体方法", en: "Beats SOTA agent baselines" },
    ],
    stack: ["LLM Agents", "Temporal Graph", "Causal Inference", "Operations Research"],
    accent: "blue" as AccentKey,
  },
  {
    name: {
      zh: "Gradient Coupled KV Drift (GCD)",
      en: "Gradient Coupled KV Drift (GCD)",
    },
    summary: {
      zh: "量化并缓解离线策略 LLM 强化学习中被忽略的混合分布偏差",
      en: "Quantifies and mitigates the overlooked hybrid-distribution bias in off-policy LLM RL",
    },
    detail: {
      zh: "我们发现离线策略 LLM 强化学习中一个长期被忽视的偏差：参数更新后复用陈旧 KV cache 会从未被 token 级重要性权重察觉的混合分布中采样。GCD 是隐状态感知的修正方案，包含三部分：(i) 一阶偏差界定理（Theorem 5），把漂移分解为逐层注意力熵与 DeltaNet 谱半径；(ii) 标记病态注意力集中的尾部事件检测器；(iii) 由 RL 目标推导出的漂移触发选择性重算策略。在 Qwen3.5-9B + GRPO 上，GCD 使 staleness 512 下训练保持稳定（同设置下 M2PO 崩溃），rollout 墙钟时间下降 38%，bench retail pass@4 提升 5.7 分。3:1 混合架构把偏差集中在仅 25% 的层上，使修正天然稀疏。",
      en: "We identify a previously overlooked bias in off-policy LLM RL: reusing stale KV caches under updated parameters samples from a hybrid distribution that token-level importance weights cannot detect. GCD is a hidden-state-aware correction comprising (i) a first-order bias bound (Theorem 5) decomposing drift into per-layer attention entropy and DeltaNet spectral radius, (ii) a tail-event detector flagging pathological attention concentration, and (iii) a drift-triggered selective recompute policy derived from the RL objective. On Qwen3.5-9B with GRPO, GCD enables stable training at staleness 512 where M2PO collapses, cuts rollout wall-clock by 38%, and lifts bench retail pass@4 by 5.7 points. The 3:1 hybrid architecture concentrates bias in only 25% of layers, making the correction intrinsically sparse.",
    },
    period: "NeurIPS 2026 · 2024.11 — 2026.05",
    highlights: [
      { zh: "staleness 512 稳定训练", en: "Stable at staleness 512" },
      { zh: "rollout 耗时 -38%", en: "38% less rollout time" },
      { zh: "pass@4 +5.7 分", en: "+5.7 pass@4" },
    ],
    stack: ["GRPO", "Qwen3.5-9B", "KV Cache", "RL Theory"],
    accent: "purple" as AccentKey,
  },
  {
    name: {
      zh: "ABLNet：融合注意力与贝叶斯优化的 LSTM 高效建模",
      en: "ABLNet: Efficient LSTM Modeling Based on Fusion Attention and Bayesian Optimization",
    },
    summary: {
      zh: "面向高维非线性时序预测的 LSTM + 多头注意力 + 贝叶斯优化融合架构",
      en: "A fusion of LSTM, multi-head attention and Bayesian optimisation for high-dimensional non-linear time-series forecasting",
    },
    detail: {
      zh: "针对动态系统里高维多元时序预测中的强非线性、显著扰动与复杂依赖结构，提出融合架构 ABLNet（Attention-augmented Bayesian-optimized LSTM Network）：以 LSTM 子模块建模时间依赖，用多头注意力机制增强模型对关键时间片段的响应，并以贝叶斯优化自动搜索超参，从而提升泛化性能与收敛速度。特征侧把 PCA 全局降维（前 5 个主成分累计贡献率 89.8%）与贝叶斯信息增益 BIG 局部特征选择（5 个特征累计信息增益 91.8%）通过加权平均融合（α = 0.5），形成「降维—选择—建模」的一体化流程。",
      en: "For high-dimensional multivariate forecasting marked by strong non-linearity, heavy disturbance and complex dependencies, we propose ABLNet (Attention-augmented Bayesian-optimised LSTM Network): LSTM models temporal dependence, multi-head attention sharpens responsiveness to critical time segments, and Bayesian optimisation searches hyper-parameters automatically, improving generalisation and convergence. The feature pipeline fuses PCA global reduction (top 5 components, 89.8% cumulative variance) with Bayesian information gain selection (5 features, 91.8% cumulative gain) at α = 0.5, forming an integrated reduction–selection–modelling workflow.",
    },
    period: "AICBD 2025 · 2025.01 — 2025.11",
    highlights: [
      { zh: "20 次迭代收敛最优超参", en: "Best hyper-parameters in 20 iterations" },
      { zh: "训练耗时 -42%", en: "42% less training time" },
      { zh: "R² 提升 12%", en: "12% higher R²" },
    ],
    stack: ["LSTM", "Multi-head Attention", "Bayesian Optimisation", "PCA", "Information Gain"],
    accent: "teal" as AccentKey,
  },
];

export const SKILLS: SkillGroup[] = [
  {
    title: { zh: "研究与建模", en: "Research & Modelling" },
    icon: "🧠",
    accent: "blue",
    items: [
      { name: "LLM / Agentic RL", level: 92 },
      { name: "Mathematical Modelling", level: 90 },
      { name: "Random Forest / GWO", level: 85 },
      { name: "LSTM + Attention", level: 84 },
    ],
  },
  {
    title: { zh: "编程与工具", en: "Programming & Tools" },
    icon: "🛠",
    accent: "purple",
    items: [
      { name: "Python", level: 90 },
      { name: "C", level: 82 },
      { name: "Java", level: 78 },
      { name: "Monte-Carlo Simulation", level: 84 },
    ],
  },
  {
    title: { zh: "学术与协作", en: "Academic & Collaboration" },
    icon: "🤝",
    accent: "green",
    items: [
      { name: "English Academic Writing", level: 88 },
      { name: "Presentation", level: 86 },
      { name: "Team Leadership", level: 85 },
      { name: "Interview & Research", level: 80 },
    ],
  },
];

export const AWARDS: Bilingual[] = [
  {
    zh: "第 11 届全国大学生统计建模大赛三等奖（省级）",
    en: "Third Prize, 11th National College Students Statistical Modelling Competition (Provincial)",
  },
  {
    zh: "第七届全球校园人工智能算法精英大赛三等奖（省级）",
    en: "Third Prize, 7th Global Campus Artificial Intelligence Algorithm Elite Competition (Provincial)",
  },
  {
    zh: "HKUSI 最佳展示奖第三名（2nd Runner-Up）",
    en: "Best Presentation Award — 2nd Runner-Up, HKUSI",
  },
  {
    zh: "第七届国际青年人工智能大赛西部与东盟赛区总决赛三等奖",
    en: "Third Prize, Western & ASEAN Division Finals, 7th International Youth Artificial Intelligence Competition",
  },
  {
    zh: "校级优秀共青团员 · 学院优秀学生干部",
    en: "Excellent League Member at University Level · Outstanding Student Cadre at College Level",
  },
];

export const CONTACT = {
  lead: {
    zh: "如果你对我的研究方向感兴趣，或希望一起推进 AI Agent 相关的课题与合作，欢迎随时联系。",
    en: "If my research interests you, or you would like to collaborate on AI-agent topics, feel free to reach out.",
  },
  responseText: { zh: "邮件通常 24 小时内回复", en: "Usually replies within 24 hours" },
};
