# dsh-video-studio · 代码动画视频工作室

DSH 插件「生成模式」：把 [XiaoyeCodes/code-animation-prompts](https://github.com/XiaoyeCodes/code-animation-prompts)
的 **341 种代码动画风格提示词 + 193 张参考静帧** 搬进 DSH，挑风格、填内容、定参数、看预计耗时，
一键把拼好的完整提示词提交给当前会话，让模型直接开始做代码动画视频。

## 三条核心需求怎么落地

| 需求 | 实现 |
| --- | --- |
| 1. 独立的「生成模式」，切换时更改主界面 | 两个入口：①**侧边栏最上面第一个图标**（线条风格场记板，`order: -50`，排在所有面板图标之前，鼠标悬停显示「代码动画工作室」）；②会话标题右侧的**场记板小图标按钮**（鼠标悬停时出现提示气泡）。点任一入口，**主面板整块替换**为工作室（`layout.selectPanel`），顶栏「返回对话」再切回去。 |
| 2. 类型选择参考 + 提示词参考，选项尽量多 | 两个视图：**「生成」**视图 = 左侧 10 个系列（A–G 代码样片 / H 现成版式 / K 卡通画风 / L Lemo-Opuscar / M 动态风格 / O 奥斯卡 98 部 / R 参考学来的 / V mg-styles-15 / X code-video / Z 中国风）+ 中间图墙（可按名称/描述/适合场景/分类/标签搜索，按分类筛选，只看有参考图）+ 右侧风格详情（大图、分类/适合/长什么样/关键词、完整提示词模板可复制）；**「参考库」**视图 = 图文学习页（见下）。 |
| 3. 生成前提醒视频参数 + 预计生成时间 | 右侧参数页常驻「生成前请确认：声音 · 比例 · 时长 · 分辨率」提示条，底部实时显示 `总计约 X ~ Y 分钟`（含渲染/声音/编码拆分）；点「生成」先弹出**确认弹窗**，列出全部参数 chip、三条智能警告（无声视频 / 长时长 + 高分辨率 / 未选风格），并预览最终提示词，确认后才提交。 |

## 「参考库」学习页（怎么照着做一版）

顶栏左侧的 **生成 / 参考库** 分段按钮切换。参考库页从上到下：

1. **数据总览**：341 种风格 / 193 张参考静帧 / 10 个系列。
2. **怎么用（5 步）**：挑风格 → 说清讲什么 → 定参数 → 看预计时间 → 生成；下面 4 条经验提示（不说声音多半没声音、写得越细越稳、`{{ }}` 要填、长片 + 高分辨率很慢）。
3. **10 个系列，每类给代表作**：左边是系列名 + 数量 + 一句话定位，右边是 4–8 个手挑的代表风格缩略图（有静帧的显示真图），**点缩略图就在原地展开**该风格的大图与说明（不跳走），展开区底部「提示词参考 →」直接跳到生成页的提示词面板；每行末尾「看这一类全部 · N」跳到图墙并按该系列过滤，能看到该系列每一个风格。
4. **两个真实成品案例**：
   - **B6 光速穿梭·爆炸·重聚**（同一份提示词，Opus 5.5 与 DeepSeek-V4.1-Flash 各出一版）——页面内可直接播放两个 mp4，看两张出图截图，展开「当时的提示词」看 4.7KB 原文；
   - **X7 英雄漫画**（全部提示词只有一句英文）——播放成片、看对话截图、读作者说明「这次没说声音，所以视频没有声音」。
   每个案例都有「照这个做一版」：一键把风格、主题、参数（含比例/时长/声音/字幕/节奏）填进生成表单。
5. 素材（mp4 / png / html / svg）由 Host 的 `/plugins/video-studio/asset?p=<仓库相对路径>` 直接流式提供，支持 Range（视频可拖动进度条），且做了路径穿越校验（`..` 一律 400）。

## 界面结构

```
┌ 顶栏：视频工作室 · 341 种风格 · 193 张参考静帧 · [341/193] [刷新] [返回对话]
├ 系列栏 186px │ 图墙（搜索 / 只看有参考图 / 分类 chips / 显示 n / total）│ 右侧 352px
│  全部 341    │                                                          │ ① 参数
│  A–G 26      │  [缩略图 A1]  [B1]  [B2] …                               │ ② 风格提示词
│  H 12 …      │                                                          │
└─────────────────────────────────────────────────────────────────────────
```

## 交互细节（v1.2）

- **侧栏图标与官方面板同构**：直接返回裸 `<svg>`（带 `data-dsh-panel-entry`），尺寸取 shell 传入的 `size`（宽栏 16 / 侧栏收起 18），不加包裹元素、不写内联宽高，和官方 Plugins、计划表、任务看板的面板行渲染方式完全一致；选中态只由 shell 切换行背景色（`aria-current="page"`），行高恒 36px，图标不会上下位移。
- **会话头部按钮只留图标**：`打开视频工作室` 常驻文字已去掉，改成 26×26 图标按钮，鼠标悬停显示提示（原生 `title`）。
- **风格卡片放大**：图墙最小列宽 164px → **186px**（侧栏 / 右侧栏同步收窄到 172 / 330px），常见窗口下一行两个风格，一张卡片放下缩略图 + 标题 + 两行描述。
- **卡片尺寸完全统一**：每张卡片固定 240px 高（缩略图 132px + 文字区 106px），文字区固定容纳「标题 + 两行介绍文字」；标题短的卡片把介绍文字贴底对齐，整行卡片高度与间距完全一致，不再参差。
- **选中效果不再是一圈黑线**：改成「选中项轻微放大 + 品牌色描边 + 投影」，同时**其余卡片变淡变灰**（`opacity .5` + 降饱和），聚焦当前选择。
- **参考库原地展开**：在参考库点代表作不再跳转到「生成」页，而是该系列行下方直接展开大图 + 分类/适合/长什么样/关键词，末尾给「提示词参考 →」「用这个风格」「收起」三个按钮。
## 参数清单（右侧「参数」页）

**基础**：内容主题（必填）、口播文案/分镜脚本、额外要求、视频比例（16:9 / 9:16 / 1:1 / 4:3 / 3:4 / 21:9）、
时长（4–120 秒，13 档）、分辨率（720p / 1080p / 2K / 4K）、帧率（24 / 30 / 60）、输出格式（mp4 / gif / webm）。

**声音与字幕**：声音（无 / 口播 / BGM / 音效 / 口播+BGM，选纯 BGM 时不显示音色）、旁白音色（5 种）、
语速（慢 / 正常 / 快）、音乐风格（5 种）、音乐音量（低 / 中 / 高）、字幕（无 / 中文 / 英文 / 中英 / 卡拉 OK）、
字幕位置（底部 / 中部 / 顶部）。

**画面风格**：动画节奏（舒缓 / 适中 / 紧凑）、字体（系统默认 / 思源黑体 / 思源宋体 / 楷体 / 等宽）、
品牌主色（取色器，可「跟随风格」清空）。

## 预计耗时怎么算

```
单帧成本 perFrame = 0.22s（A–G 代码样片）/ 0.10s（其余系列，偏文字与图形）
渲染 render  = 时长 × 帧率 × 分辨率系数 × 节奏系数 × perFrame
声音 audio   = 无声音 0 / 口播 40 + 时长×1.2 / BGM 15 / 音效 10 / 口播+BGM 55 + 时长×1.2（再乘语速系数）
编码 encode  = 固定小头
总计 total   = setup 35 + render + audio + encode
区间         = total × 0.8 ~ total × 1.3（给出"约 X ~ Y 分钟"）
```

实测：M/M1 + 9:16 + 20 秒 + 2K + 60fps + 紧凑 → 约 410 秒（区间 328–554 秒，1200 帧）。

## Agent 工具

模型侧也能用同一套库：`video_studio_query`

```
{ "action": "list" }                              列出系列与计数
{ "action": "read",   "styleId": "M/M1" }          读取风格详情 + 提示词模板
{ "action": "compose","styleId":"M/M1",           拼装完整提示词
  "topic":"…", "script":"…", "params": { … } }
{ "action": "estimate","params": { … } }          估算耗时
{ "action": "learn" }                             参考库页的全部数据（系列/代表作/案例/分步指南）
{ "action": "diag" }                              自检：Host 半 RPC 通道状态 + 浏览器半是否真的挂载
```

Host 半（`index.js`）与浏览器半（`client.js`）通过 `connection.rpc` 通道 `/video-studio` 通信；
channel 必须以 `/` 开头，否则运行时会报 `invalid or reserved RPC channel`。

## 前置条件

风格库需要先放到本机（`git clone` 或下载 zip 解压）：

```bash
git clone https://github.com/XiaoyeCodes/code-animation-prompts
```

插件按这个结构找库：

```
<风格库根目录>
└─ skills/code-animation-prompts/
   ├─ references/catalog.json          ← 341 条索引（优先使用）
   └─ assets/library/风格提示词/<系列>/<编号>_<名称>.md + .jpg
```

查找顺序：

1. `cordis.patch.yml` 里 `config.libraryRoot` 指定的目录；
2. **本 bundle 的同级目录** `../code-animation-prompts`（推荐：把两个文件夹放在一起）；
3. 兜底路径 `~/Desktop/agent工作区/项目文件/代码动画插件/code-animation-prompts`。

换位置时改 `config.libraryRoot`（写仓库根目录），重启/重载插件即可。

## 安装与重载

1. 插件管理器 → 安装 bundle → 选本目录（`plugin_manager install_bundle`）；已装过则直接启用。
2. 改过 `index.js` / `client.js` 后：先禁用再启用该条目（`set_plugin enabled=false` → `true`）。
3. **然后必须完全退出并重启桌面端**——客户端插件的清单是在应用启动时生成并注入页面的，
   `Ctrl+R` 只会重跑已加载的模块，**不会**发现新启用/新改动的客户端插件。

## 文件

| 文件 | 作用 |
| --- | --- |
| `package.json` | bundle manifest（入口 / 客户端 / 语言包 / 图标、cordis 补丁指针） |
| `cordis.patch.yml` | 插入 `video-studio` 一行；可选 `config.libraryRoot` 指定风格库位置 |
| `index.js` | Host 半：风格库索引（catalog.json → 目录扫描兜底）、提示词拼装、耗时估算、`/plugins/video-studio/image` 静帧路由、`/plugins/video-studio/asset` 案例素材路由、RPC 通道 `/video-studio`、`video_studio_query` 工具（含 `learn` / `diag`）、`CSS.supports` 启动守卫 |
| `client.js` | Client 半：侧边栏入口（第一格）+ 主面板（生成视图 / 参考库视图）+ 参数页 + 确认弹窗 + 头部切换按钮 |
| `locale/zh.json` `locale/en.json` | 插件标题与描述 |
| `icon.svg` | 场记板图标 |

## 排错

- 显示「未找到本地风格库」：检查上面的目录是否存在，或点「重新检测」。
- 缩略图空白：静帧缺失（341 个风格中 193 个有参考图），或路由 404；卡片仍可点。
- 面板没变 / 侧边栏没有图标：确认插件条目是 `active`，然后**完全重启桌面端**（`Ctrl+R` 不够）。
- 生成或参考库报 `invalid RPC target` / `invalid or reserved RPC channel`：说明 Host 半的 RPC 没挂上，
  查 `video_studio_query { "action": "diag" }` 的 `hostState.rpcRegistered`；`clientMount.mounted: false`
  表示浏览器半没跑起来（通常是没重启，或 `client.js` 构建失败——控制台会有 `[video-studio] client ...` 日志）。
- 提交按钮报「没有找到当前会话」：先回到对话页并进入一个会话，再回工作室提交。
- 想彻底关掉 CSS 守卫：`cordis.patch.yml` 里给该行加 `config: { cssShim: false }`。

## 关于「重启后打不开窗口」

2026-11-01 14:56 的两个 `web-boot` 崩溃日志（`%APPDATA%\@deepseek-ai\dsh-desktop\logs\crash-*-web-boot.log`）里，失败条目是
**`dsh-image-gen`**，不是本插件：

```
Error: web boot: 1 entry did not activate
dsh-image-gen: import failed: CSS.supports is not a function
```

该插件的客户端入口在模块顶层探测 `CSS.supports`，而某些渲染进程状态下这个全局存在但没有该方法，于是 import 直接抛错。
为了不让它再打断启动，本插件 Host 半用 `webServer.tapIndex()` 往 index.html 的 `</head>` 前注入一段极小的守卫脚本
（标记 `data-dsh-video-studio-css`），在任何客户端模块求值之前补齐 `CSS.supports`；如果本来就有该方法，脚本什么都不做。
想关掉这个守卫：给插件配置加 `cssShim: false`。

顺带：`dsh-image-gen` 自己的 `lib\client.js` 里只给本模块装了 shim，而 ESM 的 import 提升会让依赖先求值，所以挡不住这类崩溃。
根上还是建议更新或临时禁用 `dsh-image-gen`。

## 出处与许可（重要）

本插件的**代码**（`index.js` / `client.js` / 其余 bundle 文件）为原创；本插件**不自带**任何风格提示词或参考图，
运行时读取你本地的 [XiaoyeCodes/code-animation-prompts](https://github.com/XiaoyeCodes/code-animation-prompts) 仓库：

| 内容 | 来源 | 许可 |
| --- | --- | --- |
| 341 种风格提示词、193 张参考静帧、`catalog.json`、`说明.md`、`许可与来源.md` | [XiaoyeCodes/code-animation-prompts](https://github.com/XiaoyeCodes/code-animation-prompts) | 作者原创，**全部免费，可免费转发**；禁止包装成课程 / 付费 skill 售卖 |
| `示例\B6…`（Opus 5.5 与 DeepSeek-V4.1-Flash 两版成片）、`示例\X7…`、`docs\images\*` | 同上 | 同上 |
| L 系列（Lemo-Opuscar）、V 系列（mg-styles-15）、X 系列（code-video）原始素材 | 见仓库 `assets\library\第三方许可\*.txt` | MIT 类许可，随仓库附原文 |

B 站视频《【经验开源】Opus 5.5 做的代码动画，DeepSeek 也能做！341 种风格提示词，全部免费送》
（[BV1bqx76wEUM](https://www.bilibili.com/video/BV1bqx76wEUM)）是该风格库的作者讲解，本插件是它对 DSH 的移植。

使用约定：**不要**把本插件配上风格库后打包成付费课程 / 付费 skill 售卖；转发时保留本节的出处说明。

