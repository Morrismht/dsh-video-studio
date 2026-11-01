// @local/dsh-video-studio — Client half.
// Registers a sidebar entry + central "Video Studio" panel (生成模式), a header
// toggle that swaps the main panel between the studio and the conversation, and
// a gallery picker over the local code-animation-prompts style library.

const MODULE_ID = '@local/dsh-video-studio'
const PANEL_ID = 'video-studio'
const CHANNEL = '/video-studio'
const NS = 'video-studio'
const IMAGE_ROUTE = '/plugins/video-studio/image'

const DICT = {
  zh: {
    'panel.title': '视频工作室',
    'panel.subtitle': '代码动画 · 341 种风格提示词 · 193 张参考静帧',
    'panel.back': '返回对话',
    'panel.refresh': '刷新',
    'panel.libraryMissing': '未找到本地风格库',
    'panel.libraryMissingHint': '请把 code-animation-prompts 仓库解压到下面这个目录（github.com/XiaoyeCodes/code-animation-prompts）：',
    'panel.retry': '重新检测',
    'panel.needStyle': '请先在左侧选一种风格',
    'panel.noTopic': '请先填写内容主题',
    'panel.needTitle': '先选风格',
    'search.ph': '搜索风格：白板 / 粒子 / 打字 / 国风…',
    'filter.stills': '只看有参考图',
    'filter.clear': '清除筛选',
    'count.showing': '显示 {n} / {total}',
    'series.all': '全部系列',
    'series.count': '个风格',
    'tab.params': '参数',
    'tab.style': '风格提示词',
    'style.none': '在左侧点一种风格，这里会显示参考静帧与完整提示词模板。',
    'style.copy': '复制提示词模板',
    'style.use': '用这个风格',
    'style.useCurrent': '当前使用：',
    'style.prompt': '提示词模板',
    'style.ref': '参考静帧',
    'style.desc': '长什么样',
    'style.fit': '适合',
    'style.category': '分类',
    'style.tags': '关键词',
    'style.noStill': '这一条没有配参考静帧',
    'params.title': '视频参数',
    'params.topic': '内容主题 *',
    'params.topicPh': '例如：用 20 秒讲清楚什么是递归',
    'params.topicPhShort': '一句话说清要讲什么',
    'params.script': '口播文案 / 分镜（可选）',
    'params.scriptPh': '留空则由 AI 按主题自由发挥',
    'params.extra': '额外要求（可选）',
    'params.extraPh': '例如：主色 #E5432B、结尾出 Logo、右上角放二维码',
    'params.aspect': '视频比例',
    'params.duration': '视频时长',
    'params.audio': '声音',
    'params.voice': '旁白音色',
    'params.voiceSpeed': '语速',
    'params.music': '音乐风格',
    'params.musicVolume': '音乐音量',
    'params.subtitle': '字幕',
    'params.subtitlePos': '字幕位置',
    'params.resolution': '分辨率',
    'params.fps': '帧率',
    'params.format': '输出格式',
    'params.pacing': '动画节奏',
    'params.color': '品牌主色',
    'params.colorAuto': '跟随风格',
    'params.colorReset': '跟随风格',
    'params.font': '字体',
    'params.sec': '秒',
    'params.reminder': '生成前请确认：声音 · 比例 · 时长 · 分辨率',
    'params.basic': '基础',
    'params.audioGroup': '声音与字幕',
    'params.lookGroup': '画面风格',
    'estimate.title': '预计生成时间',
    'estimate.range': '总计约 {low} ~ {high} 分钟',
    'estimate.render': '动画渲染 {render} 秒',
    'estimate.audio': '声音合成 {audio} 秒',
    'estimate.encode': '编码导出 {encode} 秒',
    'estimate.note': '按本机 HTML/Canvas 渲染速度估算，实际取决于模型写代码的速度与机器性能。',
    'estimate.pending': '选择风格并填好参数后显示预计时间',
    'generate': '生成视频',
    'generate.hint': '点击后先弹出参数确认，再提交到当前对话',
    'confirm.title': '生成前确认参数',
    'confirm.intro': '提交前请再看一眼这些设置——它们决定了成片的样子：',
    'confirm.copy': '复制提示词',
    'confirm.submit': '确认并提交',
    'confirm.cancel': '返回修改',
    'confirm.copied': '已复制到剪贴板',
    'confirm.warnAudio': '当前是无声视频：如果想成片带声音，请把「声音」改成口播或背景音乐。',
    'confirm.warnLong': '时长超过 30 秒且分辨率较高，实际生成会明显更久。',
    'confirm.warnNoStyle': '还没选风格，AI 会自行设计画面。',
    'submit.submitting': '正在提交…',
    'submit.done': '已提交到当前对话，正在生成视频',
    'submit.noSession': '没有找到当前对话。请先打开一个会话，或改用「复制提示词」。',
    'submit.failed': '提交失败',
    'submit.banner': '已提交到当前对话，AI 正在按提示词生成视频。',
    'submit.viewChat': '查看对话',
    'header.toggle': '打开视频工作室',
    'loading': '加载中…',
    'empty.noMatch': '没有匹配的风格，换个关键词试试',
    'audio.none': '无声音（纯视觉动画）',
    'audio.voice': 'AI 口播旁白',
    'audio.bgm': '背景音乐',
    'audio.fx': '音效',
    'audio.voice_bgm': '口播 + 背景音乐',
    'subtitle.none': '无字幕',
    'subtitle.zh': '中文字幕',
    'subtitle.en': '英文字幕',
    'subtitle.both': '中英双语字幕',
    'subtitle.karaoke': '逐字卡点字幕',
    'voice.zhi': '知性女声',
    'voice.ci': '磁性男声',
    'voice.huo': '活力少年',
    'voice.wen': '温柔女声',
    'voice.chen': '沉稳男声',
    'music.kadian': '卡点节奏',
    'music.dianzi': '轻快电子',
    'music.gangqin': '氛围钢琴',
    'music.shishi': '史诗管弦',
    'music.guofeng': '国风古韵',
    'speed.slow': '慢',
    'speed.normal': '正常',
    'speed.fast': '快',
    'vol.low': '低',
    'vol.mid': '中',
    'vol.high': '高',
    'pos.bottom': '底部',
    'pos.center': '中部',
    'pos.top': '顶部',
    'pacing.calm': '舒缓',
    'pacing.mid': '适中',
    'pacing.tight': '紧凑',
    'font.system': '系统默认',
    'font.hei': '思源黑体',
    'font.song': '思源宋体',
    'font.kai': '楷体',
    'font.mono': '等宽'
  },
  en: {
    'panel.title': 'Video Studio',
    'panel.subtitle': 'Code animation · 341 style prompts · 193 reference stills',
    'panel.back': 'Back to chat',
    'panel.refresh': 'Reload',
    'panel.libraryMissing': 'Local style library not found',
    'panel.libraryMissingHint': 'Unzip the code-animation-prompts repository into this directory (github.com/XiaoyeCodes/code-animation-prompts):',
    'panel.retry': 'Detect again',
    'panel.needStyle': 'Pick a style on the left first',
    'panel.noTopic': 'Please fill in the topic',
    'panel.needTitle': 'Pick a style',
    'search.ph': 'Search styles: whiteboard / particles / typing / ink…',
    'filter.stills': 'Only with a still',
    'filter.clear': 'Clear filters',
    'count.showing': 'Showing {n} / {total}',
    'series.all': 'All series',
    'series.count': 'styles',
    'tab.params': 'Parameters',
    'tab.style': 'Style prompt',
    'style.none': 'Pick a style on the left to see its reference still and prompt template.',
    'style.copy': 'Copy template',
    'style.use': 'Use this style',
    'style.useCurrent': 'In use: ',
    'style.prompt': 'Prompt template',
    'style.ref': 'Reference still',
    'style.desc': 'Looks like',
    'style.fit': 'Best for',
    'style.category': 'Category',
    'style.tags': 'Keywords',
    'style.noStill': 'No reference still for this style',
    'params.title': 'Video parameters',
    'params.topic': 'Topic *',
    'params.topicPh': 'e.g. explain recursion in 20 seconds',
    'params.topicPhShort': 'One line: what is it about',
    'params.script': 'Script / storyboard (optional)',
    'params.scriptPh': 'Leave empty and let the AI improvise from the topic',
    'params.extra': 'Extra requirements (optional)',
    'params.extraPh': 'e.g. accent #E5432B, logo at the end, QR code top-right',
    'params.aspect': 'Aspect ratio',
    'params.duration': 'Duration',
    'params.audio': 'Audio',
    'params.voice': 'Voice',
    'params.voiceSpeed': 'Speaking rate',
    'params.music': 'Music',
    'params.musicVolume': 'Music level',
    'params.subtitle': 'Subtitles',
    'params.subtitlePos': 'Subtitle position',
    'params.resolution': 'Resolution',
    'params.fps': 'Frame rate',
    'params.format': 'Output',
    'params.pacing': 'Pacing',
    'params.color': 'Accent color',
    'params.colorAuto': 'Follow the style',
    'params.colorReset': 'Follow style',
    'params.font': 'Font',
    'params.sec': 's',
    'params.reminder': 'Before generating, check: audio · aspect · duration · resolution',
    'params.basic': 'Basics',
    'params.audioGroup': 'Audio & subtitles',
    'params.lookGroup': 'Look & feel',
    'estimate.title': 'Estimated generation time',
    'estimate.range': 'About {low} ~ {high} minutes in total',
    'estimate.render': 'Animation render {render}s',
    'estimate.audio': 'Audio {audio}s',
    'estimate.encode': 'Encode {encode}s',
    'estimate.note': 'Estimate from local HTML/Canvas rendering speed; real time depends on the model and the machine.',
    'estimate.pending': 'Pick a style and fill in the parameters to see the estimate',
    'generate': 'Generate video',
    'generate.hint': 'A confirmation dialog shows every parameter before it is submitted',
    'confirm.title': 'Confirm parameters before generating',
    'confirm.intro': 'One last look — these settings decide what the video looks like:',
    'confirm.copy': 'Copy prompt',
    'confirm.submit': 'Confirm and submit',
    'confirm.cancel': 'Back to edit',
    'confirm.copied': 'Copied to clipboard',
    'confirm.warnAudio': 'This is a silent video: switch "Audio" to voice-over or music if you want sound.',
    'confirm.warnLong': 'Over 30s at a high resolution will take noticeably longer.',
    'confirm.warnNoStyle': 'No style selected — the AI will design the visuals itself.',
    'submit.submitting': 'Submitting…',
    'submit.done': 'Submitted to the conversation — generating the video',
    'submit.noSession': 'No active conversation. Open a session first, or use "Copy prompt".',
    'submit.failed': 'Submission failed',
    'submit.banner': 'Submitted to the conversation — the AI is generating the video from the prompt.',
    'submit.viewChat': 'View chat',
    'header.toggle': 'Open Video Studio',
    'loading': 'Loading…',
    'empty.noMatch': 'No style matches — try another keyword',
    'audio.none': 'No audio (pure visuals)',
    'audio.voice': 'AI voice-over',
    'audio.bgm': 'Background music',
    'audio.fx': 'Sound effects',
    'audio.voice_bgm': 'Voice-over + BGM',
    'subtitle.none': 'None',
    'subtitle.zh': 'Chinese',
    'subtitle.en': 'English',
    'subtitle.both': 'Bilingual',
    'subtitle.karaoke': 'Word-by-word karaoke',
    'voice.zhi': 'Wise female',
    'voice.ci': 'Magnetic male',
    'voice.huo': 'Energetic youth',
    'voice.wen': 'Gentle female',
    'voice.chen': 'Calm male',
    'music.kadian': 'Beat-sync rhythm',
    'music.dianzi': 'Light electronic',
    'music.gangqin': 'Ambient piano',
    'music.shishi': 'Epic orchestral',
    'music.guofeng': 'Chinese guofeng',
    'speed.slow': 'Slow',
    'speed.normal': 'Normal',
    'speed.fast': 'Fast',
    'vol.low': 'Low',
    'vol.mid': 'Medium',
    'vol.high': 'High',
    'pos.bottom': 'Bottom',
    'pos.center': 'Center',
    'pos.top': 'Top',
    'pacing.calm': 'Calm',
    'pacing.mid': 'Balanced',
    'pacing.tight': 'Tight',
    'font.system': 'System default',
    'font.hei': 'Noto Sans SC',
    'font.song': 'Noto Serif SC',
    'font.kai': 'KaiTi',
    'font.mono': 'Monospace'
  }
}

// value -> locale key for enumerations whose stored value is the Chinese label
const ASSET_ROUTE = '/plugins/video-studio/asset'

// Learning-page strings. Merged into DICT so locale.register() picks them up.
const EXTRA_DICT = {
  zh: {
    'top.studio': '生成',
    'top.learn': '参考库',
    'learn.title': '参考库 · 边看边做',
    'learn.intro': '库里 341 种风格全在这儿：先看别人的实例和提示词，再照着自己的题目做一版。点任意卡片就能把它套进生成工作台。',
    'learn.guide': '怎么用（5 步）',
    'learn.series': '按系列看 · 10 类 341 种',
    'learn.examples': '实测案例（可以直接照着做）',
    'learn.tips': '几个常见坑',
    'learn.useStyle': '用这个风格',
    'learn.tryIt': '照这个做一版',
    'learn.watch': '成片',
    'learn.prompt': '当时的提示词（点开看全文）',
    'learn.source': '源码 / 截图',
    'learn.loading': '正在读取参考库…',
    'learn.styles': '种风格',
    'learn.stills': '张静帧',
    'learn.seriesCount': '个系列',
    'learn.representative': '代表作',
    'learn.applyHint': '已套用这个案例的风格与参数，把主题改成你自己的就能生成。',
    'learn.openFull': '打开完整提示词',
    'learn.videoHint': '成片直接在本页播放（来自仓库示例文件夹）',
    'learn.viewAll': '看这一类全部',
    'learn.detailLoading': '正在读取这个风格的详情…',
    'learn.detailFail': '详情读取失败',
    'learn.promptBtn': '提示词参考 →',
    'learn.collapse': '收起'
  },
  en: {
    'top.studio': 'Studio',
    'top.learn': 'Library',
    'learn.title': 'Reference library',
    'learn.intro': 'All 341 styles live here: study the examples and prompts, then make your own version. Click any card to load it into the studio.',
    'learn.guide': 'How to use (5 steps)',
    'learn.series': 'Browse by series · 10 groups, 341 styles',
    'learn.examples': 'Tested examples (copy the approach)',
    'learn.tips': 'Common traps',
    'learn.useStyle': 'Use this style',
    'learn.tryIt': 'Build one like this',
    'learn.watch': 'Render',
    'learn.prompt': 'The exact prompt (expand)',
    'learn.source': 'Source / stills',
    'learn.loading': 'Loading the library…',
    'learn.styles': 'styles',
    'learn.stills': 'stills',
    'learn.seriesCount': 'series',
    'learn.representative': 'Highlights',
    'learn.applyHint': 'Style and parameters applied — change the topic and generate.',
    'learn.openFull': 'Open the full prompt',
    'learn.videoHint': 'Played inline from the repository examples folder',
    'learn.viewAll': 'See all in this category',
    'learn.detailLoading': 'Loading this style…',
    'learn.detailFail': 'Could not load this style',
    'learn.promptBtn': 'Prompt reference →',
    'learn.collapse': 'Collapse'
  }
}
Object.assign(DICT.zh, EXTRA_DICT.zh)
Object.assign(DICT.en, EXTRA_DICT.en)

const VOICE_KEYS = { 知性女声: 'voice.zhi', 磁性男声: 'voice.ci', 活力少年: 'voice.huo', 温柔女声: 'voice.wen', 沉稳男声: 'voice.chen' }
const MUSIC_KEYS = { 卡点节奏: 'music.kadian', 轻快电子: 'music.dianzi', 氛围钢琴: 'music.gangqin', 史诗管弦: 'music.shishi', 国风古韵: 'music.guofeng' }
const SPEED_KEYS = { 慢: 'speed.slow', 正常: 'speed.normal', 快: 'speed.fast' }
const VOLUME_KEYS = { 低: 'vol.low', 中: 'vol.mid', 高: 'vol.high' }
const POSITION_KEYS = { 底部: 'pos.bottom', 中部: 'pos.center', 顶部: 'pos.top' }
const PACING_KEYS = { 舒缓: 'pacing.calm', 适中: 'pacing.mid', 紧凑: 'pacing.tight' }
const FONT_KEYS = { 系统默认: 'font.system', 思源黑体: 'font.hei', 思源宋体: 'font.song', 楷体: 'font.kai', 等宽: 'font.mono' }

const ASPECTS = [
  { value: '16:9', label: '16:9 · 1920×1080' },
  { value: '9:16', label: '9:16 · 1080×1920' },
  { value: '1:1', label: '1:1 · 1080×1080' },
  { value: '21:9', label: '21:9 · 2560×1080' },
  { value: '4:3', label: '4:3 · 1440×1080' },
  { value: '3:2', label: '3:2 · 1620×1080' }
]
const DURATIONS = [4, 5, 6, 8, 10, 12, 15, 20, 30, 45, 60, 90, 120]
const AUDIOS = ['none', 'voice', 'bgm', 'fx', 'voice_bgm']
const VOICES = ['知性女声', '磁性男声', '活力少年', '温柔女声', '沉稳男声']
const SPEEDS = ['慢', '正常', '快']
const MUSICS = ['卡点节奏', '轻快电子', '氛围钢琴', '史诗管弦', '国风古韵']
const VOLUMES = ['低', '中', '高']
const SUBTITLES = ['none', 'zh', 'en', 'both', 'karaoke']
const POSITIONS = ['底部', '中部', '顶部']
const RESOLUTIONS = ['720p', '1080p', '2K', '4K']
const FPSS = [24, 30, 60]
const FORMATS = ['mp4', 'gif', 'webm']
const PACINGS = ['舒缓', '适中', '紧凑']
const FONTS = ['系统默认', '思源黑体', '思源宋体', '楷体', '等宽']

const DEFAULT_PARAMS = {
  aspect: '16:9',
  duration: 12,
  audio: 'none',
  voiceStyle: '知性女声',
  voiceSpeed: '正常',
  musicStyle: '卡点节奏',
  musicVolume: '中',
  subtitle: 'zh',
  subtitlePos: '底部',
  resolution: '1080p',
  fps: 30,
  format: 'mp4',
  pacing: '适中',
  primaryColor: '',
  fontFamily: '系统默认'
}

const CSS = `
.vs-root{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111827);font-family:inherit;font-size:13px;line-height:1.5;}
.vs-top{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--dsw-alias-border-l2,#e5e7eb);flex:0 0 auto;min-height:44px;box-sizing:border-box;}
.vs-title{font-size:15px;font-weight:600;white-space:nowrap;}
.vs-sub{color:var(--dsw-alias-label-tertiary,#6b7280);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.vs-chip{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:999px;background:var(--dsw-alias-brand-primary-soft,rgba(76,120,255,.1));color:var(--dsw-alias-brand-primary,#4c78ff);font-size:11.5px;white-space:nowrap;}
.vs-spacer{flex:1;}
.vs-btn{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:var(--dsw-radius-md,6px);border:1px solid var(--dsw-alias-border-default,rgba(0,0,0,.2));background:var(--dsw-alias-bg-layer-2,#fff);color:var(--dsw-alias-label-secondary,#4b5563);font-size:12px;cursor:pointer;font-family:inherit;white-space:nowrap;}
.vs-btn:hover{background:var(--dsw-alias-bg-skeleton,#eef1f7);}
.vs-btn:disabled{opacity:.5;cursor:not-allowed;}
.vs-btn-sm{padding:3px 8px;font-size:11.5px;}
.vs-btn-primary{background:var(--dsw-alias-brand-primary,#4c78ff);border-color:var(--dsw-alias-brand-primary,#4c78ff);color:#fff;}
.vs-btn-primary:hover{background:var(--dsw-alias-state-business-primary,#3f68e6);}
.vs-body{display:flex;flex:1;min-height:0;}
.vs-rail{width:172px;flex:0 0 auto;border-right:1px solid var(--dsw-alias-border-l2,#e5e7eb);overflow:auto;padding:8px;box-sizing:border-box;}
.vs-rail-item{display:flex;align-items:center;gap:6px;width:100%;text-align:left;padding:7px 9px;border-radius:var(--dsw-radius-md,6px);border:none;background:transparent;color:var(--dsw-alias-label-secondary,#4b5563);cursor:pointer;font-size:12.5px;font-family:inherit;margin-bottom:2px;box-sizing:border-box;}
.vs-rail-item span.vs-rail-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.vs-rail-item:hover{background:var(--dsw-alias-bg-skeleton,#eef1f7);}
.vs-rail-item.on{background:var(--dsw-alias-brand-primary-soft,rgba(76,120,255,.1));color:var(--dsw-alias-brand-primary,#4c78ff);font-weight:600;}
.vs-rail-count{color:var(--dsw-alias-label-caption,#929bad);font-size:11px;flex:0 0 auto;}
.vs-main{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0;}
.vs-toolbar{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2,#e5e7eb);flex-wrap:wrap;flex:0 0 auto;}
.vs-search{position:relative;flex:1;min-width:180px;max-width:340px;display:flex;align-items:center;}
.vs-search input{width:100%;box-sizing:border-box;padding:6px 26px 6px 26px;border-radius:999px;border:1px solid var(--dsw-alias-border-l4,#d7dbe0);background:var(--dsw-alias-bg-layer-2,#fff);color:var(--dsw-alias-label-primary,#111827);font-size:12.5px;font-family:inherit;}
.vs-search input:focus{outline:none;border-color:var(--dsw-alias-brand-primary,#4c78ff);}
.vs-search-icon{position:absolute;left:9px;color:var(--dsw-alias-label-caption,#929bad);display:flex;pointer-events:none;}
.vs-search-clear{position:absolute;right:6px;border:none;background:transparent;color:var(--dsw-alias-label-caption,#929bad);cursor:pointer;font-size:14px;line-height:1;padding:2px 4px;}
.vs-count{color:var(--dsw-alias-label-tertiary,#6b7280);font-size:11.5px;white-space:nowrap;}
.vs-toggle{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--dsw-alias-label-secondary,#4b5563);cursor:pointer;white-space:nowrap;}
.vs-grid{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(186px,1fr));gap:14px;padding:16px;align-content:start;align-items:start;box-sizing:border-box;}
.vs-card{position:relative;display:block;padding:0;min-height:200px;border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:8px;background:var(--dsw-alias-bg-layer-2,#fff);cursor:pointer;font-family:inherit;text-align:left;overflow:hidden;color:inherit;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease,opacity .16s ease,filter .16s ease;}
.vs-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(17,24,39,.10);border-color:var(--dsw-alias-brand-primary,#4c78ff);}
.vs-grid.has-sel .vs-card:not(.on){opacity:.5;filter:saturate(.7);}
.vs-grid.has-sel .vs-card:not(.on):hover{opacity:.92;filter:none;}
.vs-card.on{border-color:var(--dsw-alias-brand-primary,#4c78ff);box-shadow:0 8px 22px rgba(76,120,255,.26);transform:translateY(-2px) scale(1.02);opacity:1;filter:none;}
.vs-card-check{position:absolute;right:7px;top:7px;z-index:2;width:17px;height:17px;border-radius:50%;background:var(--dsw-alias-brand-primary,#4c78ff);color:#fff;font-size:11px;line-height:17px;text-align:center;font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,.25);}
.vs-thumb{height:134px;background:var(--dsw-alias-bg-skeleton,#eef1f7);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;}
.vs-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.vs-thumb-none{color:var(--dsw-alias-label-caption,#929bad);font-size:11px;font-weight:700;}
.vs-card-badge{position:absolute;left:6px;top:6px;background:rgba(17,24,39,.72);color:#fff;font-size:10.5px;font-weight:700;padding:1px 6px;border-radius:4px;letter-spacing:.02em;}
.vs-card-body{padding:10px 12px 12px;display:flex;flex-direction:column;gap:4px;min-width:0;}
.vs-card-title{font-size:14px;font-weight:600;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
.vs-card-desc{font-size:12.4px;line-height:1.5;color:var(--dsw-alias-label-tertiary,#6b7280);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
.vs-side{width:330px;flex:0 0 auto;border-left:1px solid var(--dsw-alias-border-l2,#e5e7eb);display:flex;flex-direction:column;min-height:0;background:var(--dsw-alias-bg-layer-1,#fff);}
.vs-tabs{display:flex;gap:4px;padding:8px 10px 0;flex:0 0 auto;}
.vs-tab{padding:5px 10px;border-radius:var(--dsw-radius-md,6px) var(--dsw-radius-md,6px) 0 0;border:1px solid transparent;border-bottom:none;background:transparent;color:var(--dsw-alias-label-tertiary,#6b7280);font-size:12px;cursor:pointer;font-family:inherit;}
.vs-tab.on{background:var(--dsw-alias-bg-layer-2,#f9fafb);border-color:var(--dsw-alias-border-l2,#e5e7eb);color:var(--dsw-alias-label-primary,#111827);font-weight:600;}
.vs-side-body{flex:1;min-height:0;overflow:auto;padding:10px 12px 16px;border-top:1px solid var(--dsw-alias-border-l2,#e5e7eb);box-sizing:border-box;}
.vs-group-label{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--dsw-alias-label-caption,#929bad);margin:14px 0 8px;padding-bottom:4px;border-bottom:1px dashed var(--dsw-alias-border-l2,#e5e7eb);}
.vs-group-label:first-child{margin-top:2px;}
.vs-field{margin-bottom:9px;}
.vs-label{display:block;font-size:11.5px;font-weight:600;color:var(--dsw-alias-label-secondary,#4b5563);margin-bottom:3px;}
.vs-input,.vs-select,.vs-textarea{width:100%;box-sizing:border-box;padding:5px 7px;border-radius:var(--dsw-radius-sm,4px);border:1px solid var(--dsw-alias-border-l4,#d7dbe0);background:var(--dsw-alias-bg-layer-2,#fff);color:var(--dsw-alias-label-primary,#111827);font-size:12.5px;font-family:inherit;}
.vs-input:focus,.vs-select:focus,.vs-textarea:focus{outline:none;border-color:var(--dsw-alias-brand-primary,#4c78ff);}
.vs-textarea{resize:vertical;min-height:52px;line-height:1.5;}
.vs-hint{font-size:11px;color:var(--dsw-alias-label-caption,#929bad);}
.vs-est{background:var(--dsw-alias-brand-primary-soft,rgba(76,120,255,.1));border:1px solid var(--dsw-alias-brand-primary,rgba(76,120,255,.5));border-radius:var(--dsw-radius-md,6px);padding:9px 10px;margin:10px 0;}
.vs-est-title{font-weight:700;color:var(--dsw-alias-brand-primary,#4c78ff);font-size:12.5px;margin-bottom:3px;}
.vs-est-row{font-size:11.5px;color:var(--dsw-alias-label-secondary,#4b5563);}
.vs-est-note{font-size:10.5px;color:var(--dsw-alias-label-tertiary,#6b7280);margin-top:3px;line-height:1.45;}
.vs-reminder{font-size:11.5px;color:var(--dsw-alias-label-secondary,#4b5563);background:var(--dsw-alias-bg-layer-2,#f9fafb);border:1px dashed var(--dsw-alias-border-l4,#d7dbe0);border-radius:var(--dsw-radius-md,6px);padding:7px 9px;margin-bottom:8px;}
.vs-preview-img{width:100%;border-radius:var(--dsw-radius-md,6px);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);display:block;cursor:zoom-in;background:var(--dsw-alias-bg-skeleton,#eef1f7);}
.vs-detail-title{font-size:14px;font-weight:700;margin-bottom:2px;word-break:break-word;}
.vs-detail-sub{font-size:11.5px;color:var(--dsw-alias-label-tertiary,#6b7280);margin-bottom:8px;}
.vs-kv{display:flex;gap:6px;font-size:11.5px;color:var(--dsw-alias-label-secondary,#4b5563);margin-bottom:4px;}
.vs-kv b{font-weight:600;color:var(--dsw-alias-label-tertiary,#6b7280);flex:0 0 auto;}
.vs-tag{background:var(--dsw-alias-brand-primary-soft,rgba(76,120,255,.1));color:var(--dsw-alias-brand-primary,#4c78ff);border-radius:999px;padding:1px 8px;font-size:11px;display:inline-block;margin:0 4px 4px 0;}
.vs-md{background:var(--dsw-alias-bg-layer-2,#f9fafb);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:var(--dsw-radius-md,6px);padding:9px;font-size:11px;line-height:1.6;white-space:pre-wrap;word-break:break-word;max-height:300px;overflow:auto;color:var(--dsw-alias-label-secondary,#4b5563);margin-top:6px;}
.vs-empty{flex:1;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:40px;gap:12px;max-width:660px;margin:0 auto;}
.vs-empty-title{font-size:16px;font-weight:700;color:var(--dsw-alias-label-error,#d33);}
.vs-empty-path{background:var(--dsw-alias-bg-layer-2,#f9fafb);border:1px dashed var(--dsw-alias-border-l4,#d7dbe0);border-radius:var(--dsw-radius-md,6px);padding:8px 10px;font-family:monospace;font-size:12px;word-break:break-all;color:var(--dsw-alias-label-secondary,#4b5563);}
.vs-empty-hint{color:var(--dsw-alias-label-tertiary,#6b7280);font-size:12.5px;padding:24px;text-align:center;width:100%;box-sizing:border-box;}
.vs-banner{display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--dsw-alias-brand-primary-soft,rgba(76,120,255,.1));color:var(--dsw-alias-label-secondary,#4b5563);border-bottom:1px solid var(--dsw-alias-border-l2,#e5e7eb);font-size:12px;flex:0 0 auto;}
.vs-modal-backdrop{position:fixed;inset:0;background:rgba(17,24,39,.5);display:flex;align-items:center;justify-content:center;z-index:1000;}
.vs-modal{width:min(720px,calc(100vw - 48px));max-height:calc(100vh - 80px);display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1,#fff);border-radius:var(--dsw-radius-md,6px);box-shadow:0 12px 40px rgba(0,0,0,.25);}
.vs-modal-head{padding:13px 16px;border-bottom:1px solid var(--dsw-alias-border-l2,#e5e7eb);font-weight:700;font-size:14px;}
.vs-modal-body{flex:1;overflow:auto;padding:13px 16px;display:flex;flex-direction:column;gap:9px;}
.vs-modal-params{display:flex;flex-wrap:wrap;gap:6px;}
.vs-warn{background:var(--dsw-alias-brand-primary-soft,rgba(76,120,255,.1));border-left:3px solid var(--dsw-alias-brand-primary,#4c78ff);border-radius:var(--dsw-radius-sm,4px);padding:7px 10px;font-size:12px;color:var(--dsw-alias-label-secondary,#4b5563);}
.vs-modal-prompt{background:var(--dsw-alias-bg-layer-2,#f9fafb);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:var(--dsw-radius-md,6px);padding:10px;font-size:11.5px;white-space:pre-wrap;word-break:break-word;max-height:240px;overflow:auto;line-height:1.55;}
.vs-modal-foot{display:flex;gap:9px;justify-content:flex-end;padding:11px 16px;border-top:1px solid var(--dsw-alias-border-l2,#e5e7eb);}
.vs-zoom{position:fixed;inset:0;background:rgba(9,12,20,.86);display:flex;align-items:center;justify-content:center;z-index:1200;cursor:zoom-out;padding:32px;box-sizing:border-box;}
.vs-zoom img{max-width:100%;max-height:100%;object-fit:contain;border-radius:4px;box-shadow:0 20px 60px rgba(0,0,0,.5);}
.vs-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--dsw-alias-label-primary,#111827);color:#fff;padding:8px 16px;border-radius:var(--dsw-radius-md,6px);font-size:12.5px;z-index:1300;box-shadow:0 6px 20px rgba(0,0,0,.3);max-width:70vw;}
.vs-sidebar-icon{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:20px;height:20px;min-width:20px;min-height:20px;padding:0;margin:0;border:0;background:none;border-radius:0;color:inherit;line-height:0;vertical-align:middle;}
.vs-sidebar-icon svg{display:block;}
.vs-header-btn{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;margin:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#4b5563);cursor:pointer;font-family:inherit;line-height:0;}
.vs-header-btn:hover{background:var(--dsw-alias-bg-layer-2,#f3f4f6);color:var(--dsw-alias-label-primary,#111827);}
.vs-seg{display:inline-flex;align-items:center;gap:2px;padding:2px;border-radius:999px;background:var(--dsw-alias-bg-layer-2,#f3f4f6);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);}
.vs-seg button{border:none;background:transparent;color:var(--dsw-alias-label-tertiary,#6b7280);font-size:12px;font-family:inherit;padding:4px 12px;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;}
.vs-seg button.on{background:var(--dsw-alias-brand-primary,#4c78ff);color:#fff;font-weight:600;}
.vs-root button:focus:not(:focus-visible),.vs-root a:focus:not(:focus-visible),.vs-root summary:focus:not(:focus-visible),.vs-root input:focus:not(:focus-visible),.vs-root textarea:focus:not(:focus-visible),.vs-root select:focus:not(:focus-visible){outline:none;}
.vs-root button:focus-visible,.vs-root a:focus-visible,.vs-root summary:focus-visible,.vs-root input:focus-visible,.vs-root textarea:focus-visible,.vs-root select:focus-visible{outline:2px solid rgba(76,120,255,.5);outline-offset:2px;}
.vs-learn{flex:1;min-height:0;overflow:auto;padding:18px 22px 40px;box-sizing:border-box;}
.vs-learn-hero{max-width:980px;margin:0 auto 6px;}
.vs-learn-h1{font-size:19px;font-weight:700;margin-bottom:4px;}
.vs-learn-sub{color:var(--dsw-alias-label-secondary,#4b5563);font-size:12.5px;line-height:1.6;max-width:760px;}
.vs-learn-stats{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;}
.vs-learn-sec{max-width:980px;margin:22px auto 0;}
.vs-sec-title{font-size:13.5px;font-weight:700;padding-bottom:6px;border-bottom:1px solid var(--dsw-alias-border-l2,#e5e7eb);margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.vs-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;}
.vs-step{border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:var(--dsw-radius-md,6px);padding:10px 12px;background:var(--dsw-alias-bg-layer-2,#fff);}
.vs-step-title{font-weight:700;font-size:12.5px;margin-bottom:4px;color:var(--dsw-alias-brand-primary,#4c78ff);}
.vs-step-text{font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary,#4b5563);}
.vs-tips{margin-top:10px;background:var(--dsw-alias-brand-primary-soft,rgba(76,120,255,.08));border-left:3px solid var(--dsw-alias-brand-primary,#4c78ff);border-radius:var(--dsw-radius-sm,4px);padding:9px 12px;}
.vs-tips-title{font-size:12px;font-weight:700;margin-bottom:4px;}
.vs-tips li{font-size:12px;line-height:1.65;color:var(--dsw-alias-label-secondary,#4b5563);}
.vs-tips ul{margin:0;padding-left:18px;}
.vs-series-row{display:flex;gap:14px;padding:11px 0;border-bottom:1px dashed var(--dsw-alias-border-l2,#e5e7eb);align-items:flex-start;}
.vs-link-btn{border:none;background:transparent;color:var(--dsw-alias-brand-primary,#4c78ff);font-size:11.5px;font-family:inherit;cursor:pointer;padding:2px 0;margin-top:5px;}
.vs-link-btn:hover{text-decoration:underline;}
.vs-series-head{flex:0 0 220px;min-width:0;}
.vs-series-name{font-size:13px;font-weight:700;margin-bottom:3px;}
.vs-series-blurb{font-size:11.5px;line-height:1.55;color:var(--dsw-alias-label-tertiary,#6b7280);}
.vs-series-picks{flex:1;min-width:0;display:flex;gap:8px;flex-wrap:wrap;}
.vs-pick{width:152px;position:relative;border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:8px;background:var(--dsw-alias-bg-layer-2,#fff);padding:0;cursor:pointer;overflow:hidden;font-family:inherit;text-align:left;color:inherit;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease;}
.vs-pick:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(17,24,39,.10);border-color:var(--dsw-alias-brand-primary,#4c78ff);}
.vs-pick.on{border-color:var(--dsw-alias-brand-primary,#4c78ff);box-shadow:0 6px 18px rgba(76,120,255,.24);transform:translateY(-2px) scale(1.03);}
.vs-pick-thumb{height:95px;background:var(--dsw-alias-bg-skeleton,#eef1f7);display:flex;align-items:center;justify-content:center;overflow:hidden;}
.vs-pick-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.vs-pick-thumb span{font-size:11px;font-weight:700;color:var(--dsw-alias-label-caption,#929bad);}
.vs-pick-title{font-size:12px;padding:6px 8px;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
.vs-series-group{padding-bottom:2px;}
.vs-series-row.on{border-bottom-color:transparent;}
.vs-pick-detail{margin:2px 0 14px;border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:10px;background:var(--dsw-alias-bg-layer-2,#fff);padding:14px;display:flex;gap:16px;align-items:flex-start;box-shadow:0 4px 16px rgba(17,24,39,.06);animation:vs-detail-in .18s ease;}
@keyframes vs-detail-in{from{opacity:0;transform:translateY(-5px);}to{opacity:1;transform:none;}}
.vs-pick-detail-img{flex:0 0 320px;max-width:320px;border-radius:8px;overflow:hidden;border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:zoom-in;display:block;background:var(--dsw-alias-bg-skeleton,#eef1f7);padding:0;}
.vs-pick-detail-img img{width:100%;display:block;}
.vs-pick-detail-body{flex:1;min-width:0;}
.vs-pick-detail-head{font-size:15px;font-weight:700;margin-bottom:3px;}
.vs-pick-detail-sub{font-size:11.5px;color:var(--dsw-alias-label-tertiary,#6b7280);margin-bottom:9px;}
.vs-pick-detail-kv{font-size:12.2px;line-height:1.7;color:var(--dsw-alias-label-secondary,#4b5563);margin-bottom:6px;}
.vs-pick-detail-kv b{color:var(--dsw-alias-label-primary,#111827);margin-right:6px;font-weight:600;}
.vs-pick-detail-foot{display:flex;gap:8px;margin-top:11px;flex-wrap:wrap;}
.vs-example{border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:var(--dsw-radius-md,6px);padding:13px 15px;margin-bottom:14px;background:var(--dsw-alias-bg-layer-2,#fff);}
.vs-example-title{font-size:14px;font-weight:700;}
.vs-example-kicker{font-size:11.5px;color:var(--dsw-alias-brand-primary,#4c78ff);margin-bottom:7px;}
.vs-example-blurb{font-size:12.5px;line-height:1.65;color:var(--dsw-alias-label-secondary,#4b5563);margin-bottom:10px;}
.vs-videos{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;}
.vs-video-wrap{flex:1 1 320px;min-width:260px;max-width:520px;}
.vs-video{width:100%;border-radius:var(--dsw-radius-md,6px);background:#000;display:block;}
.vs-video-label{font-size:11px;color:var(--dsw-alias-label-tertiary,#6b7280);margin-top:4px;}
.vs-posters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
.vs-poster{width:180px;border-radius:var(--dsw-radius-md,6px);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:zoom-in;display:block;}
.vs-details{margin:6px 0 8px;}
.vs-details summary{font-size:12px;cursor:pointer;color:var(--dsw-alias-label-secondary,#4b5563);padding:3px 0;}
.vs-details .vs-md{max-height:320px;}
.vs-links{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:9px;}
.vs-links a{text-decoration:none;}
.vs-example-foot{display:flex;gap:8px;flex-wrap:wrap;}
`

window.__ModuleLoader__.load({
  id: MODULE_ID,
  factory(require) {
    // Any throw here would fail this client entry at web boot; degrade instead.
    try {
    const React = require('react')
    const { useState, useEffect, useMemo, useCallback } = React
    const h = React.createElement

    // ---------- icons ----------
    const ClapperIcon = ({ size = 20 }) =>
      h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M3.2 4.2 20.8 5.4 20.8 9.1 3.2 9.1 Z' }),
        h('path', { d: 'M6.6 4.6 6.4 9.1' }),
        h('path', { d: 'M11.4 5.3 11.2 9.1' }),
        h('path', { d: 'M16.2 6.0 16.0 9.1' }),
        h('rect', { x: 3.2, y: 9.1, width: 17.6, height: 10.8, rx: 1.6 }),
        h('path', { d: 'M9.7 12.1v4.9l4.5-2.45Z', fill: 'currentColor', stroke: 'none' })
      )

    const ArrowIcon = ({ size = 14 }) =>
      h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M19 12H5' }),
        h('path', { d: 'M12 19l-7-7 7-7' })
      )

    const SearchIcon = ({ size = 13 }) =>
      h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' },
        h('circle', { cx: 11, cy: 11, r: 7 }),
        h('path', { d: 'M20 20l-3.6-3.6' })
      )

    // ---------- small pieces ----------
    function Field({ label, hint, children }) {
      return h('div', { className: 'vs-field' },
        h('label', { className: 'vs-label' }, label),
        children,
        hint ? h('div', { className: 'vs-hint' }, hint) : null)
    }

    function Select({ label, value, onChange, options }) {
      return h(Field, { label },
        h('select', { className: 'vs-select', value: String(value), onChange: (e) => onChange(e.target.value) },
          options.map((o) => h('option', { key: String(o.value), value: String(o.value) }, o.label))))
    }

    function SidebarIcon() {
      // Match the shipped panel icons: a bare line glyph in the inherited colour.
      // Fixed 20×20 box regardless of the props the owner passes, so the glyph can
      // never grow/shrink or drift when the entry becomes active.
      return h('span', { className: 'vs-sidebar-icon' }, h(ClapperIcon, { size: 20 }))
    }

    function HeaderToggle({ openStudio, label }) {
      // Icon only — the shell's neighbours ("expand sidebar", "expand bottom panel")
      // are the same pattern: a glyph plus the native title tooltip.
      return h('button', {
        type: 'button',
        className: 'vs-header-btn',
        title: label,
        'aria-label': label,
        onClick: () => openStudio && openStudio()
      }, h(ClapperIcon, { size: 16 }))
    }

    // ---------- studio panel ----------
    function StudioPanel({ studio }) {
      const t = studio.t
      const [probe, setProbe] = useState(null)
      const [catalog, setCatalog] = useState(null)
      const [loading, setLoading] = useState(true)
      const [seriesSel, setSeriesSel] = useState('')
      const [query, setQuery] = useState('')
      const [stillsOnly, setStillsOnly] = useState(false)
      const [category, setCategory] = useState('')
      const [styleSel, setStyleSel] = useState('')
      const [detail, setDetail] = useState(null)
      const [tab, setTab] = useState('params')
      const [params, setParams] = useState(DEFAULT_PARAMS)
      const [topic, setTopic] = useState('')
      const [script, setScript] = useState('')
      const [extra, setExtra] = useState('')
      const [estimate, setEstimate] = useState(null)
      const [confirm, setConfirm] = useState(null)
      const [submitting, setSubmitting] = useState(false)
      const [submitted, setSubmitted] = useState(false)
      const [toast, setToast] = useState(null)
      const [zoom, setZoom] = useState('')
      const [view, setView] = useState('studio')
      const [learn, setLearn] = useState(null)
      const [learnError, setLearnError] = useState('')
      const [expandedPick, setExpandedPick] = useState('')
      const [pickDetail, setPickDetail] = useState(null)
      const [pickLoading, setPickLoading] = useState('')
      const toastTimer = React.useRef(0)

      // Fit the studio to whatever box the shell hands the main panel: measure the
      // parent and pin an explicit pixel height, so the three columns scroll
      // internally instead of depending on the shell's own height chain.
      const rootRef = React.useRef(null)
      const [boxHeight, setBoxHeight] = useState(0)
      useEffect(() => {
        const measure = () => {
          const el = rootRef.current
          const box = el && el.parentElement
          const next = box ? box.clientHeight : 0
          setBoxHeight(next > 160 ? next : 0)
        }
        measure()
        const el = rootRef.current
        const box = el && el.parentElement
        let observer = null
        if (box && typeof window.ResizeObserver === 'function') {
          observer = new window.ResizeObserver(measure)
          observer.observe(box)
        } else {
          window.addEventListener('resize', measure)
        }
        return () => {
          if (observer) observer.disconnect()
          else window.removeEventListener('resize', measure)
        }
      }, [loading])

      const setP = useCallback((key, value) => setParams((prev) => ({ ...prev, [key]: value })), [])

      const showToast = useCallback((text) => {
        setToast(text)
        if (toastTimer.current) window.clearTimeout(toastTimer.current)
        toastTimer.current = window.setTimeout(() => setToast(null), 3600)
      }, [])
      useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current) }, [])

      const loadCatalog = useCallback(async (force) => {
        setLoading(true)
        try {
          const p = await studio.rpc('probe', {})
          setProbe(p)
          if (p && p.found) setCatalog(await studio.rpc('catalog', force ? { force: true } : {}))
          else setCatalog(null)
        } catch (err) {
          showToast(String(err && err.message ? err.message : err))
        } finally {
          setLoading(false)
        }
      }, [showToast])

      useEffect(() => { loadCatalog(false) }, [])

      // Learning page data is built by the Host half (series blurbs, representatives,
      // the two tested examples with their mp4s and the exact prompts).
      useEffect(() => {
        if (view !== 'learn' || learn) return
        let alive = true
        ;(async () => {
          try {
            const data = await studio.rpc('learn', {})
            if (alive) { setLearn(data); setLearnError('') }
          } catch (err) {
            if (alive) setLearnError(String(err && err.message ? err.message : err))
          }
        })()
        return () => { alive = false }
      }, [view, learn])

      // One-shot layout probe: this panel lives inside the shell's main area and
      // cannot be inspected from outside, so publish real pixel metrics to the Host
      // half (read them back with the `diag` action of the video_studio_query tool).
      useEffect(() => {
        if (!catalog) return undefined
        const timer = window.setTimeout(() => {
          try {
            const root = rootRef.current
            const grid = root ? root.querySelector('.vs-grid') : null
            const card = root ? root.querySelector('.vs-card') : null
            const thumb = card ? card.querySelector('.vs-thumb') : null
            const cs = card ? window.getComputedStyle(card) : null
            const gs = grid ? window.getComputedStyle(grid) : null
            const ts = thumb ? window.getComputedStyle(thumb) : null
            studio.rpc('diag', {
              where: 'studio',
              dom: {
                rootH: root ? root.offsetHeight : -1,
                rootW: root ? root.offsetWidth : -1,
                gridH: grid ? grid.offsetHeight : -1,
                gridW: grid ? grid.offsetWidth : -1,
                gridCols: gs ? gs.gridTemplateColumns : '',
                cardH: card ? card.offsetHeight : -1,
                cardW: card ? card.offsetWidth : -1,
                cardDisplay: cs ? cs.display : '',
                thumbH: thumb ? thumb.offsetHeight : -1,
                thumbDisplay: ts ? ts.display : ''
              }
            }).catch(() => {})
          } catch (err) {
            console.error('[video-studio] layout probe failed', err)
          }
        }, 900)
        return () => window.clearTimeout(timer)
      }, [catalog])

      // style detail
      useEffect(() => {
        if (!styleSel) { setDetail(null); return }
        let alive = true
        ;(async () => {
          try {
            const d = await studio.rpc('style', { id: styleSel })
            if (alive) setDetail(d)
          } catch (err) {
            if (alive) showToast(String(err && err.message ? err.message : err))
          }
        })()
        return () => { alive = false }
      }, [styleSel])

      // live estimate (works even before a style is picked)
      const [estKey, setEstKey] = useState('')
      useEffect(() => {
        const key = JSON.stringify(params)
        if (key === estKey) return
        const timer = window.setTimeout(() => {
          studio.rpc('estimate', { params, styleId: styleSel })
            .then((value) => { setEstimate(value); setEstKey(key) })
            .catch(() => {})
        }, 220)
        return () => window.clearTimeout(timer)
      }, [params, styleSel, estKey])

      const allStyles = useMemo(() => {
        if (!catalog || !Array.isArray(catalog.series)) return []
        return catalog.series.reduce((acc, s) => acc.concat(s.styles), [])
      }, [catalog])

      const seriesStyles = useMemo(() => {
        if (!catalog || !Array.isArray(catalog.series)) return []
        if (!seriesSel) return allStyles
        const found = catalog.series.find((s) => s.id === seriesSel)
        return found ? found.styles : []
      }, [catalog, seriesSel, allStyles])

      const categories = useMemo(() => {
        const seen = new Map()
        for (const s of seriesStyles) {
          const c = String(s.category ?? '').trim()
          if (c === '') continue
          seen.set(c, (seen.get(c) ?? 0) + 1)
        }
        return [...seen.entries()].sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'))
      }, [seriesStyles])

      useEffect(() => { setCategory('') }, [seriesSel])

      const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return seriesStyles.filter((s) => {
          if (stillsOnly && !s.image) return false
          if (category && String(s.category ?? '') !== category) return false
          if (q === '') return true
          const hay = [s.name, s.title, s.description, s.fit, s.category, (s.tags || []).join(' ')].join(' ').toLowerCase()
          return hay.indexOf(q) >= 0
        })
      }, [seriesStyles, query, stillsOnly, category])

      const totalCount = catalog && Array.isArray(catalog.series)
        ? catalog.series.reduce((n, s) => n + (s.count || s.styles.length), 0)
        : 0

      const imageUrl = useCallback((id) => IMAGE_ROUTE + '?id=' + encodeURIComponent(id), [])

      const onSelect = (id) => {
        setStyleSel(id)
        setTab('style')
      }

      // Load a style straight into the generator and jump back to the studio view.
      const applyStyle = (id) => {
        if (!id) return
        setStyleSel(id)
        setView('studio')
        setTab('style')
      }

      // Expand a representative style inline (in the reference-library view) instead
      // of yanking the user over to the generator: the row grows downwards and the
      // full still + description appear right underneath the thumbnail.
      const pickReq = React.useRef('')
      const expandPick = async (id) => {
        if (!id) return
        if (expandedPick === id) {
          pickReq.current = ''
          setExpandedPick('')
          setPickDetail(null)
          return
        }
        pickReq.current = id
        setExpandedPick(id)
        setPickDetail(null)
        setPickLoading(id)
        try {
          const d = await studio.rpc('style', { id })
          if (pickReq.current === id) setPickDetail(d)
        } catch (err) {
          if (pickReq.current === id) {
            setPickDetail({ error: String(err && err.message ? err.message : err) })
          }
        } finally {
          if (pickReq.current === id) setPickLoading('')
        }
      }

      // "Build one like this": reuse the example's style AND its video parameters.
      const applyExample = (example) => {
        if (!example) return
        if (example.styleId) setStyleSel(example.styleId)
        if (example.topic) setTopic(example.topic)
        if (example.applyParams) setParams((prev) => ({ ...prev, ...example.applyParams }))
        setView('studio')
        setTab('params')
        showToast(t('learn.applyHint'))
      }

      const onGenerate = async () => {
        if (!topic.trim()) { showToast(t('panel.noTopic')); return }
        try {
          const composed = await studio.rpc('compose', {
            styleId: styleSel,
            topic: topic.trim(),
            script,
            extra,
            params
          })
          setConfirm({ prompt: composed.prompt, composed })
        } catch (err) {
          showToast(String(err && err.message ? err.message : err))
        }
      }

      const copyText = async (text) => {
        try {
          await navigator.clipboard.writeText(text)
          showToast(t('confirm.copied'))
        } catch {
          try {
            const ta = document.createElement('textarea')
            ta.value = text
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            showToast(t('confirm.copied'))
          } catch { showToast(t('confirm.copied')) }
        }
      }

      const onSubmit = async () => {
        if (!confirm || submitting) return
        setSubmitting(true)
        try {
          await studio.submit(confirm.prompt)
          setConfirm(null)
          setSubmitted(true)
          showToast(t('submit.done'))
          if (typeof studio.isMainViewShowing === 'function' && !studio.isMainViewShowing()) studio.openChat()
        } catch (err) {
          showToast(String(err && err.message ? err.message : err))
        } finally {
          setSubmitting(false)
        }
      }

      const estimateLine = estimate
        ? t('estimate.range').replace('{low}', Math.round(estimate.low / 60)).replace('{high}', Math.max(1, Math.round(estimate.high / 60)))
        : ''

      // ---------- empty library ----------
      if (probe && !probe.found) {
        return h('div', { className: 'vs-root', ref: rootRef, style: boxHeight ? { height: boxHeight + 'px' } : undefined },
          h('style', null, CSS),
          h('div', { className: 'vs-top' },
            h('span', { className: 'vs-title' }, t('panel.title')),
            h('span', { className: 'vs-spacer' }),
            h('button', { type: 'button', className: 'vs-btn', onClick: () => studio.openChat() }, h(ArrowIcon), t('panel.back'))),
          h('div', { className: 'vs-empty' },
            h('div', { className: 'vs-empty-title' }, t('panel.libraryMissing')),
            h('div', null, t('panel.libraryMissingHint')),
            h('div', { className: 'vs-empty-path' }, probe.libraryDir),
            h('button', { type: 'button', className: 'vs-btn vs-btn-primary', onClick: () => loadCatalog(false) }, t('panel.retry'))))
      }

      // ---------- option lists ----------
      const audioOptions = AUDIOS.map((v) => ({ value: v, label: t('audio.' + v) }))
      const subtitleOptions = SUBTITLES.map((v) => ({ value: v, label: t('subtitle.' + v) }))
      const voiceOptions = VOICES.map((v) => ({ value: v, label: t(VOICE_KEYS[v]) }))
      const musicOptions = MUSICS.map((v) => ({ value: v, label: t(MUSIC_KEYS[v]) }))
      const speedOptions = SPEEDS.map((v) => ({ value: v, label: t(SPEED_KEYS[v]) }))
      const volumeOptions = VOLUMES.map((v) => ({ value: v, label: t(VOLUME_KEYS[v]) }))
      const positionOptions = POSITIONS.map((v) => ({ value: v, label: t(POSITION_KEYS[v]) }))
      const pacingOptions = PACINGS.map((v) => ({ value: v, label: t(PACING_KEYS[v]) }))
      const fontOptions = FONTS.map((v) => ({ value: v, label: t(FONT_KEYS[v]) }))
      const hasVoice = params.audio === 'voice' || params.audio === 'voice_bgm'
      const hasMusic = params.audio === 'bgm' || params.audio === 'voice_bgm'
      const stillUrl = detail && detail.image ? imageUrl(detail.id) : ''

      const warnings = []
      if (params.audio === 'none') warnings.push(t('confirm.warnAudio'))
      if (params.duration > 30 && (params.resolution === '2K' || params.resolution === '4K')) warnings.push(t('confirm.warnLong'))
      if (!styleSel) warnings.push(t('confirm.warnNoStyle'))

      const paramForm = h('div', null,
        h('div', { className: 'vs-group-label' }, t('params.basic')),
        h(Field, { label: t('params.topic') },
          h('textarea', {
            className: 'vs-textarea',
            value: topic,
            placeholder: t('params.topicPh'),
            onChange: (e) => setTopic(e.target.value)
          })),
        h(Field, { label: t('params.script') },
          h('textarea', {
            className: 'vs-textarea',
            value: script,
            placeholder: t('params.scriptPh'),
            onChange: (e) => setScript(e.target.value)
          })),
        h(Field, { label: t('params.extra') },
          h('textarea', {
            className: 'vs-textarea',
            value: extra,
            placeholder: t('params.extraPh'),
            onChange: (e) => setExtra(e.target.value)
          })),
        h(Select, { label: t('params.aspect'), value: params.aspect, onChange: (v) => setP('aspect', v), options: ASPECTS }),
        h(Select, {
          label: t('params.duration'),
          value: params.duration,
          onChange: (v) => setP('duration', Number(v)),
          options: DURATIONS.map((v) => ({ value: v, label: v + ' ' + t('params.sec') }))
        }),

        h('div', { className: 'vs-group-label' }, t('params.audioGroup')),
        h(Select, { label: t('params.audio'), value: params.audio, onChange: (v) => setP('audio', v), options: audioOptions }),
        hasVoice ? h(Select, { label: t('params.voice'), value: params.voiceStyle, onChange: (v) => setP('voiceStyle', v), options: voiceOptions }) : null,
        hasVoice ? h(Select, { label: t('params.voiceSpeed'), value: params.voiceSpeed, onChange: (v) => setP('voiceSpeed', v), options: speedOptions }) : null,
        hasMusic ? h(Select, { label: t('params.music'), value: params.musicStyle, onChange: (v) => setP('musicStyle', v), options: musicOptions }) : null,
        hasMusic ? h(Select, { label: t('params.musicVolume'), value: params.musicVolume, onChange: (v) => setP('musicVolume', v), options: volumeOptions }) : null,
        h(Select, { label: t('params.subtitle'), value: params.subtitle, onChange: (v) => setP('subtitle', v), options: subtitleOptions }),
        params.subtitle !== 'none'
          ? h(Select, { label: t('params.subtitlePos'), value: params.subtitlePos, onChange: (v) => setP('subtitlePos', v), options: positionOptions })
          : null,

        h('div', { className: 'vs-group-label' }, t('params.lookGroup')),
        h(Select, { label: t('params.pacing'), value: params.pacing, onChange: (v) => setP('pacing', v), options: pacingOptions }),
        h(Select, { label: t('params.font'), value: params.fontFamily, onChange: (v) => setP('fontFamily', v), options: fontOptions }),
        h(Field, { label: t('params.color') },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            h('input', {
              type: 'color',
              value: params.primaryColor || '#4c78ff',
              onChange: (e) => setP('primaryColor', e.target.value),
              style: { width: 40, height: 26, padding: 0, border: 'none', background: 'none', cursor: 'pointer', flex: '0 0 auto' }
            }),
            h('span', { className: 'vs-hint', style: { flex: 1 } }, params.primaryColor ? params.primaryColor.toUpperCase() : t('params.colorAuto')),
            params.primaryColor
              ? h('button', { type: 'button', className: 'vs-btn vs-btn-sm', onClick: () => setP('primaryColor', '') }, t('params.colorReset'))
              : null)),
        h(Select, { label: t('params.resolution'), value: params.resolution, onChange: (v) => setP('resolution', v), options: RESOLUTIONS.map((v) => ({ value: v, label: v })) }),
        h(Select, { label: t('params.fps'), value: params.fps, onChange: (v) => setP('fps', Number(v)), options: FPSS.map((v) => ({ value: v, label: v + ' fps' })) }),
        h(Select, { label: t('params.format'), value: params.format, onChange: (v) => setP('format', v), options: FORMATS.map((v) => ({ value: v, label: v.toUpperCase() })) }),

        estimate
          ? h('div', { className: 'vs-est' },
            h('div', { className: 'vs-est-title' }, t('estimate.title')),
            h('div', { className: 'vs-est-row', style: { fontWeight: 600 } }, estimateLine),
            h('div', { className: 'vs-est-row' }, t('estimate.render').replace('{render}', estimate.render)),
            hasVoice || params.audio === 'fx' ? h('div', { className: 'vs-est-row' }, t('estimate.audio').replace('{audio}', estimate.audio)) : null,
            h('div', { className: 'vs-est-row' }, t('estimate.encode').replace('{encode}', estimate.encode)),
            h('div', { className: 'vs-est-note' }, t('estimate.note')))
          : h('div', { className: 'vs-est' }, h('div', { className: 'vs-est-note' }, t('estimate.pending'))),

        h('div', { className: 'vs-reminder' }, t('params.reminder')),
        h('button', {
          type: 'button',
          className: 'vs-btn vs-btn-primary',
          style: { width: '100%', justifyContent: 'center', padding: '9px 12px' },
          onClick: onGenerate
        }, t('generate')),
        h('div', { className: 'vs-hint', style: { textAlign: 'center', marginTop: 5 } }, t('generate.hint')))

      const detailPane = detail
        ? h('div', null,
          h('div', { className: 'vs-detail-title' }, detail.name),
          h('div', { className: 'vs-detail-sub' }, detail.seriesTitle + (detail.category ? ' · ' + detail.category : '')),
          stillUrl
            ? h('img', {
              className: 'vs-preview-img',
              src: stillUrl,
              alt: t('style.ref'),
              onClick: () => setZoom(stillUrl)
            })
            : h('div', { className: 'vs-hint', style: { margin: '8px 0' } }, t('style.noStill')),
          detail.fit ? h('div', { className: 'vs-kv', style: { marginTop: 8 } }, h('b', null, t('style.fit')), h('span', null, detail.fit)) : null,
          detail.description ? h('div', { className: 'vs-kv' }, h('b', null, t('style.desc')), h('span', null, detail.description)) : null,
          Array.isArray(detail.tags) && detail.tags.length > 0
            ? h('div', { style: { marginTop: 4 } }, detail.tags.map((tag) => h('span', { key: tag, className: 'vs-tag' }, tag)))
            : null,
          h('div', { className: 'vs-label', style: { marginTop: 10 } }, t('style.prompt')),
          h('div', { className: 'vs-md' }, detail.promptBlock || detail.md || ''),
          h('div', { style: { display: 'flex', gap: 8, marginTop: 9 } },
            h('button', {
              type: 'button',
              className: 'vs-btn',
              onClick: () => copyText(detail.promptBlock || detail.md || '')
            }, t('style.copy')),
            h('button', {
              type: 'button',
              className: 'vs-btn vs-btn-primary',
              onClick: () => { setTab('params'); if (!topic.trim()) setTopic(detail.title) }
            }, t('style.use'))))
        : h('div', { className: 'vs-empty-hint' }, t('style.none'))

      // ---------- inline detail under a representative style ----------
      const pickDetailView = (id) => {
        if (!id || id !== expandedPick) return null
        if (pickLoading === id || !pickDetail) {
          return h('div', { className: 'vs-pick-detail' },
            h('div', { className: 'vs-pick-detail-body' },
              h('div', { className: 'vs-pick-detail-head' }, t('learn.detailLoading'))))
        }
        if (pickDetail.error) {
          return h('div', { className: 'vs-pick-detail' },
            h('div', { className: 'vs-pick-detail-body' },
              h('div', { className: 'vs-pick-detail-head' }, t('learn.detailFail')),
              h('div', { className: 'vs-pick-detail-kv' }, pickDetail.error)))
        }
        const still = pickDetail.image ? imageUrl(pickDetail.id) : ''
        const openPrompt = () => {
          setStyleSel(pickDetail.id)
          setTab('style')
          setView('studio')
        }
        const useIt = () => {
          setStyleSel(pickDetail.id)
          if (!topic.trim()) setTopic(pickDetail.title || pickDetail.name || '')
          setTab('params')
          setView('studio')
        }
        return h('div', { className: 'vs-pick-detail' },
          still
            ? h('button', {
              type: 'button',
              className: 'vs-pick-detail-img',
              title: t('learn.openFull'),
              onClick: () => setZoom(still)
            }, h('img', { src: still, alt: pickDetail.name || pickDetail.id }))
            : null,
          h('div', { className: 'vs-pick-detail-body' },
            h('div', { className: 'vs-pick-detail-head' }, pickDetail.name + (pickDetail.title ? ' · ' + pickDetail.title : '')),
            h('div', { className: 'vs-pick-detail-sub' },
              [pickDetail.id, pickDetail.seriesTitle, pickDetail.category].filter(Boolean).join(' · ')),
            pickDetail.fit
              ? h('div', { className: 'vs-pick-detail-kv' }, h('b', null, t('style.fit')), h('span', null, pickDetail.fit))
              : null,
            pickDetail.description
              ? h('div', { className: 'vs-pick-detail-kv' }, h('b', null, t('style.desc')), h('span', null, pickDetail.description))
              : null,
            Array.isArray(pickDetail.tags) && pickDetail.tags.length > 0
              ? h('div', null, pickDetail.tags.map((tag) => h('span', { key: tag, className: 'vs-tag' }, tag)))
              : null,
            h('div', { className: 'vs-pick-detail-foot' },
              h('button', { type: 'button', className: 'vs-btn vs-btn-primary', onClick: openPrompt }, t('learn.promptBtn')),
              h('button', { type: 'button', className: 'vs-btn', onClick: useIt }, t('learn.useStyle')),
              h('button', { type: 'button', className: 'vs-btn', onClick: () => expandPick(id) }, t('learn.collapse')))))
      }

      // ---------- learning view ----------
      const learnView = !learn
        ? h('div', { className: 'vs-empty-hint' }, learnError || t('learn.loading'))
        : h('div', { className: 'vs-learn' },
          h('div', { className: 'vs-learn-hero' },
            h('div', { className: 'vs-learn-h1' }, t('learn.title')),
            h('div', { className: 'vs-learn-sub' }, t('learn.intro')),
            h('div', { className: 'vs-learn-stats' },
              h('span', { className: 'vs-tag' }, learn.stats.total + ' ' + t('learn.styles')),
              h('span', { className: 'vs-tag' }, learn.stats.withStill + ' ' + t('learn.stills')),
              h('span', { className: 'vs-tag' }, learn.stats.series + ' ' + t('learn.seriesCount')))),

          h('section', { className: 'vs-learn-sec' },
            h('div', { className: 'vs-sec-title' }, t('learn.guide')),
            h('div', { className: 'vs-steps' },
              learn.guide.steps.map((step) => h('div', { key: step.title, className: 'vs-step' },
                h('div', { className: 'vs-step-title' }, step.title),
                h('div', { className: 'vs-step-text' }, step.text)))),
            h('div', { className: 'vs-tips' },
              h('div', { className: 'vs-tips-title' }, t('learn.tips')),
              h('ul', null, learn.guide.tips.map((tip) => h('li', { key: tip }, tip))))),

          h('section', { className: 'vs-learn-sec' },
            h('div', { className: 'vs-sec-title' }, t('learn.series')),
            learn.series.map((group) => h('div', { key: group.id, className: 'vs-series-group' },
              h('div', { className: 'vs-series-row' + (group.picks.some((p) => p.id === expandedPick) ? ' on' : '') },
                h('div', { className: 'vs-series-head' },
                  h('div', { className: 'vs-series-name' }, group.title + ' · ' + group.count),
                  h('div', { className: 'vs-series-blurb' }, group.blurb),
                  h('button', {
                    type: 'button',
                    className: 'vs-link-btn',
                    onClick: () => { setSeriesSel(group.id); setQuery(''); setStillsOnly(false); setCategory(''); setView('studio') }
                  }, t('learn.viewAll') + ' · ' + group.count)),
                h('div', { className: 'vs-series-picks' },
                  group.picks.map((pick) => h('button', {
                    key: pick.id,
                    type: 'button',
                    className: 'vs-pick' + (expandedPick === pick.id ? ' on' : ''),
                    title: pick.title,
                    onClick: () => expandPick(pick.id)
                  },
                    h('div', { className: 'vs-pick-thumb' },
                      pick.image
                        ? h('img', { src: imageUrl(pick.id), alt: pick.title, loading: 'lazy' })
                        : h('span', null, pick.entryId)),
                    h('div', { className: 'vs-pick-title' }, pick.title))))),
              group.picks.some((p) => p.id === expandedPick) ? pickDetailView(expandedPick) : null))),

          h('section', { className: 'vs-learn-sec' },
            h('div', { className: 'vs-sec-title' }, t('learn.examples')),
            learn.examples.length === 0
              ? h('div', { className: 'vs-empty-hint' }, t('learn.loading'))
              : learn.examples.map((example) => h('div', { key: example.id, className: 'vs-example' },
                h('div', { className: 'vs-example-title' }, example.title),
                h('div', { className: 'vs-example-kicker' }, example.kicker),
                h('div', { className: 'vs-example-blurb' }, example.blurb),
                example.videos && example.videos.length > 0
                  ? h('div', { className: 'vs-videos' },
                    example.videos.map((video) => h('div', { key: video.url, className: 'vs-video-wrap' },
                      h('video', {
                        className: 'vs-video',
                        src: video.url,
                        controls: true,
                        preload: 'metadata',
                        playsInline: true
                      }),
                      h('div', { className: 'vs-video-label' }, t('learn.watch') + ' · ' + video.label))))
                  : null,
                example.posters && example.posters.length > 0
                  ? h('div', { className: 'vs-posters' },
                    example.posters.map((poster) => h('img', {
                      key: poster.url,
                      className: 'vs-poster',
                      src: poster.url,
                      alt: poster.label,
                      loading: 'lazy',
                      onClick: () => setZoom(poster.url)
                    })))
                  : null,
                example.prompt
                  ? h('details', { className: 'vs-details' },
                    h('summary', null, t('learn.prompt')),
                    h('div', { className: 'vs-md' }, example.prompt))
                  : null,
                example.note
                  ? h('details', { className: 'vs-details' },
                    h('summary', null, t('learn.source')),
                    h('div', { className: 'vs-md' }, example.note))
                  : null,
                example.extras && example.extras.length > 0
                  ? h('div', { className: 'vs-links' },
                    example.extras.map((extra) => h('a', {
                      key: extra.url,
                      className: 'vs-btn vs-btn-sm',
                      href: extra.url,
                      target: '_blank',
                      rel: 'noreferrer'
                    }, extra.label)))
                  : null,
                h('div', { className: 'vs-example-foot' },
                  h('button', {
                    type: 'button',
                    className: 'vs-btn vs-btn-primary',
                    onClick: () => applyExample(example)
                  }, t('learn.tryIt')),
                  example.styleId
                    ? h('button', {
                      type: 'button',
                      className: 'vs-btn',
                      onClick: () => applyStyle(example.styleId)
                    }, t('learn.useStyle') + ' · ' + example.styleId)
                    : null)))))

      return h('div', { className: 'vs-root', ref: rootRef, style: boxHeight ? { height: boxHeight + 'px' } : undefined },
        h('style', null, CSS),
        h('div', { className: 'vs-top' },
          h('span', { className: 'vs-title' }, t('panel.title')),
          h('span', { className: 'vs-sub' }, t('panel.subtitle')),
          catalog ? h('span', { className: 'vs-chip' }, totalCount + ' / ' + (catalog.withStill || 0)) : null,
          h('span', { className: 'vs-spacer' }),
          h('div', { className: 'vs-seg' },
            h('button', {
              type: 'button',
              className: view === 'studio' ? 'on' : '',
              onClick: () => setView('studio')
            }, t('top.studio')),
            h('button', {
              type: 'button',
              className: view === 'learn' ? 'on' : '',
              onClick: () => setView('learn')
            }, t('top.learn'))),
          h('button', { type: 'button', className: 'vs-btn', onClick: () => loadCatalog(true) }, t('panel.refresh')),
          h('button', { type: 'button', className: 'vs-btn', onClick: () => studio.openChat() }, h(ArrowIcon), t('panel.back'))),

        submitted
          ? h('div', { className: 'vs-banner' },
            h('span', null, t('submit.banner')),
            h('button', { type: 'button', className: 'vs-btn vs-btn-sm', onClick: () => studio.openChat() }, t('submit.viewChat')),
            h('span', { className: 'vs-spacer' }),
            h('button', { type: 'button', className: 'vs-btn vs-btn-sm', onClick: () => setSubmitted(false) }, '×'))
          : null,

        loading
          ? h('div', { className: 'vs-empty-hint' }, t('loading'))
          : view === 'learn'
          ? learnView
          : h('div', { className: 'vs-body' },
            h('div', { className: 'vs-rail' },
              h('button', {
                type: 'button',
                className: 'vs-rail-item' + (seriesSel === '' ? ' on' : ''),
                onClick: () => { setSeriesSel(''); }
              },
                h('span', { className: 'vs-rail-label' }, t('series.all')),
                h('span', { className: 'vs-rail-count' }, totalCount)),
              (catalog && Array.isArray(catalog.series) ? catalog.series : []).map((s) => h('button', {
                key: s.id,
                type: 'button',
                className: 'vs-rail-item' + (seriesSel === s.id ? ' on' : ''),
                title: s.title,
                onClick: () => { setSeriesSel(seriesSel === s.id ? '' : s.id) }
              },
                h('span', { className: 'vs-rail-label' }, s.title),
                h('span', { className: 'vs-rail-count' }, s.count || s.styles.length)))),

            h('div', { className: 'vs-main' },
              h('div', { className: 'vs-toolbar' },
                h('div', { className: 'vs-search' },
                  h('span', { className: 'vs-search-icon' }, h(SearchIcon)),
                  h('input', {
                    value: query,
                    placeholder: t('search.ph'),
                    onChange: (e) => setQuery(e.target.value)
                  }),
                  query ? h('button', { type: 'button', className: 'vs-search-clear', onClick: () => setQuery('') }, '×') : null),
                h('label', { className: 'vs-toggle' },
                  h('input', { type: 'checkbox', checked: stillsOnly, onChange: (e) => setStillsOnly(e.target.checked) }),
                  t('filter.stills')),
                category
                  ? h('button', { type: 'button', className: 'vs-btn vs-btn-sm', onClick: () => setCategory('') }, category + ' ×')
                  : null,
                h('span', { className: 'vs-spacer' }),
                h('span', { className: 'vs-count' }, t('count.showing').replace('{n}', filtered.length).replace('{total}', seriesStyles.length))),
              category ? null : (categories.length > 1
                ? h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', padding: '8px 12px 0' } },
                  categories.slice(0, 18).map(([name, count]) => h('button', {
                    key: name,
                    type: 'button',
                    className: 'vs-btn vs-btn-sm',
                    onClick: () => setCategory(name)
                  }, name + ' ' + count)))
                : null),
              h('div', { className: 'vs-grid' + (styleSel ? ' has-sel' : '') },
                filtered.length === 0
                  ? h('div', { className: 'vs-empty-hint' }, t('empty.noMatch'))
                  : filtered.map((s) => h('button', {
                    key: s.id,
                    type: 'button',
                    className: 'vs-card' + (styleSel === s.id ? ' on' : ''),
                    onClick: () => onSelect(s.id),
                    title: s.name
                  },
                    h('div', { className: 'vs-thumb' },
                      s.image
                        ? h('img', { src: imageUrl(s.id), alt: s.title, loading: 'lazy' })
                        : h('span', { className: 'vs-thumb-none' }, s.category || s.name.slice(0, 6)),
                      h('span', { className: 'vs-card-badge' }, s.name)),
                    h('div', { className: 'vs-card-body' },
                      h('div', { className: 'vs-card-title' }, s.title || s.name),
                      s.head ? h('div', { className: 'vs-card-desc' }, s.head) : null),
                    styleSel === s.id ? h('span', { className: 'vs-card-check' }, '✓') : null)))),

            h('div', { className: 'vs-side' },
              h('div', { className: 'vs-tabs' },
                h('button', { type: 'button', className: 'vs-tab' + (tab === 'params' ? ' on' : ''), onClick: () => setTab('params') }, t('tab.params')),
                h('button', { type: 'button', className: 'vs-tab' + (tab === 'style' ? ' on' : ''), onClick: () => setTab('style') }, t('tab.style'))),
              h('div', { className: 'vs-side-body' },
                tab === 'params' ? paramForm : detailPane))),

        confirm
          ? h('div', { className: 'vs-modal-backdrop', onClick: (e) => { if (e.target === e.currentTarget) setConfirm(null) } },
            h('div', { className: 'vs-modal' },
              h('div', { className: 'vs-modal-head' }, t('confirm.title')),
              h('div', { className: 'vs-modal-body' },
                h('div', null, t('confirm.intro')),
                h('div', { className: 'vs-modal-params' },
                  h('span', { className: 'vs-tag' }, t('params.aspect') + ' ' + params.aspect),
                  h('span', { className: 'vs-tag' }, t('params.duration') + ' ' + params.duration + t('params.sec')),
                  h('span', { className: 'vs-tag' }, t('audio.' + params.audio)),
                  h('span', { className: 'vs-tag' }, t('subtitle.' + params.subtitle)),
                  h('span', { className: 'vs-tag' }, params.resolution + ' · ' + params.fps + 'fps · ' + params.format.toUpperCase()),
                  h('span', { className: 'vs-tag' }, t('params.pacing') + ' ' + t(PACING_KEYS[params.pacing])),
                  styleSel ? h('span', { className: 'vs-tag' }, styleSel) : null,
                  estimate ? h('span', { className: 'vs-tag', style: { fontWeight: 700 } }, estimateLine) : null),
                warnings.map((w) => h('div', { key: w, className: 'vs-warn' }, w)),
                h('div', { className: 'vs-label' }, t('style.prompt')),
                h('div', { className: 'vs-modal-prompt' }, confirm.prompt)),
              h('div', { className: 'vs-modal-foot' },
                h('button', { type: 'button', className: 'vs-btn', onClick: () => setConfirm(null) }, t('confirm.cancel')),
                h('button', { type: 'button', className: 'vs-btn', onClick: () => copyText(confirm.prompt) }, t('confirm.copy')),
                h('button', { type: 'button', className: 'vs-btn vs-btn-primary', disabled: submitting, onClick: onSubmit },
                  submitting ? t('submit.submitting') : t('confirm.submit')))))
          : null,

        zoom ? h('div', { className: 'vs-zoom', onClick: () => setZoom('') }, h('img', { src: zoom, alt: t('style.ref') })) : null,
        toast ? h('div', { className: 'vs-toast' }, toast) : null)
    }

    // ---------- client apply ----------
    const inject = ['slots', 'sessions', 'connection', 'locale', 'layout']

    function apply(rawContext) {
      const ctx = rawContext

      // A throwing apply() aborts the client entry and can take the whole web boot
      // down with it, so nothing in here may escape.
      try {

      const locale = ctx.locale || (typeof ctx.get === 'function' ? ctx.get('locale') : null)
      ctx.effect(() => {
        if (locale && typeof locale.register === 'function') locale.register(NS, DICT)
      }, MODULE_ID + ':locale')

      const translate = (() => {
        if (locale && typeof locale.bind === 'function') {
          try { return locale.bind(NS) } catch {}
        }
        const dict = DICT.zh
        return (key) => dict[key] || key
      })()

      const connection = ctx.connection || (typeof ctx.get === 'function' ? ctx.get('connection') : null)
      const layout = ctx.layout || (typeof ctx.get === 'function' ? ctx.get('layout') : null)
      const sessions = ctx.sessions || (typeof ctx.get === 'function' ? ctx.get('sessions') : null)

      const rpc = async (endpoint, payload) => {
        if (!connection || !connection.rpc || typeof connection.rpc.call !== 'function') {
          throw new Error('video-studio: 无法连接插件后端（connection.rpc 不可用）')
        }
        const result = await connection.rpc.call(CHANNEL, endpoint, payload || {})
        if (!result || result.ok !== true) {
          throw new Error((result && result.error && result.error.message) || 'video-studio RPC 失败')
        }
        return result.value
      }

      // The main panel only carries the `mainView` ownership marker while the
      // conversation is mounted. Opening the studio unmounts it, so cache the last
      // id we saw and fall back to the most recently touched session.
      let cachedSessionId
      function rememberSession() {
        const id = mainViewSessionId()
        if (id) cachedSessionId = id
      }

      function newestSessionId() {
        try {
          const snapshot = sessions && sessions.list && sessions.list.getSnapshot()
          const byId = (snapshot && snapshot.byId) || {}
          const rows = Object.keys(byId).map((k) => byId[k]).filter((row) => row && !row.archived)
          if (rows.length === 0) return undefined
          const at = (row) => {
            const raw = row.lastActivityAt ?? row.updatedAt ?? row.createdAt ?? 0
            const num = typeof raw === 'number' ? raw : Date.parse(String(raw))
            return Number.isFinite(num) ? num : 0
          }
          rows.sort((a, b) => at(b) - at(a))
          return rows[0].id
        } catch { return undefined }
      }

      function mainViewSessionId() {
        try {
          const snapshot = sessions && sessions.list && sessions.list.getSnapshot()
          const byId = snapshot && snapshot.byId
          if (!byId) return undefined
          const ids = Object.keys(byId)
          for (const id of ids) {
            const row = byId[id]
            if (row && row.retainedBy && row.retainedBy.mainView > 0) return id
          }
        } catch {}
        return undefined
      }

      rememberSession()
      if (sessions && sessions.list && typeof sessions.list.subscribe === 'function') {
        ctx.effect(() => {
          const off = sessions.list.subscribe(rememberSession)
          return () => { if (typeof off === 'function') off() }
        }, MODULE_ID + ':session-track')
      }

      const submit = async (text) => {
        const sessionId = mainViewSessionId() || cachedSessionId || newestSessionId()
        if (!sessionId) throw new Error(translate('submit.noSession'))
        if (!sessions || typeof sessions.retain !== 'function') throw new Error(translate('submit.noSession'))
        const ref = sessions.retain(sessionId, { source: 'controllerOperation' })
        try {
          const binding = await ref.ready
          const result = await binding.session.prompt([{ type: 'text', text }], 'queue')
          if (result && result.ok === false) {
            throw new Error((result.error && result.error.message) || translate('submit.failed'))
          }
        } finally {
          if (ref && typeof ref.release === 'function') ref.release()
        }
      }

      const openStudio = () => {
        if (layout && typeof layout.selectPanel === 'function') layout.selectPanel(PANEL_ID)
      }
      const openChat = () => {
        if (layout && typeof layout.selectPanel === 'function') layout.selectPanel(null)
      }

      const studio = { t: translate, rpc, submit, openStudio, openChat, isMainViewShowing: () => mainViewSessionId() !== undefined }

      ctx.effect(() => {
        const stopMain = ctx.slots.inject('main', () =>
          ctx.slots.inject('sidebar.panellist', () => {
            const stopPanel = ctx.slots.register(
              { name: 'main', key: PANEL_ID, inject: () => ({ studio }) },
              StudioPanel)
            const stopIcon = ctx.slots.register(
              // Sit at the very top of the panel list, above every shipped entry.
              { name: 'sidebar.panellist', id: PANEL_ID, order: -50, label: () => translate('panel.title'), locale: NS },
              SidebarIcon)
            const stopHeader = ctx.slots.inject('conversation.session.header.utilities', () =>
              ctx.slots.register(
                {
                  name: 'conversation.session.header.utilities',
                  id: 'video-studio-toggle',
                  order: 90,
                  label: () => translate('header.toggle'),
                  inject: () => ({ openStudio, label: translate('header.toggle') })
                },
                HeaderToggle))
            return () => { stopHeader(); stopIcon(); stopPanel() }
          }))
        return () => stopMain()
      }, MODULE_ID + ':slots')

      // Heartbeat: proves to the host (and to the agent via video_studio_query
      // action=diag) that this browser half really mounted and registered.
      try {
        Promise.resolve(rpc('diag', {
          slots: ['main', 'sidebar.panellist', 'conversation.session.header.utilities'],
          hasLocale: !!locale,
          hasLayout: !!layout,
          hasSessions: !!sessions,
          hasSlots: !!(ctx.slots && typeof ctx.slots.register === 'function'),
          locale: (navigator && navigator.language) || ''
        })).catch(() => {})
      } catch {}
      } catch (error) {
        console.error('[video-studio] client apply failed', error)
      }
    }

    return { inject, apply }
    } catch (error) {
      console.error('[video-studio] client module failed to build', error)
      return { inject: [], apply() {} }
    }
  }
})
