// @local/dsh-video-studio — Host half.
// Reads the local code-animation-prompts style library, exposes a package-private
// RPC channel to the Client half, and registers an agent tool so the model can
// query the same library from inside a conversation.

import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'
import { existsSync } from 'node:fs'

export const name = '@local/dsh-video-studio'
export const inject = ['tools']

const CHANNEL = 'video-studio'
/** Same-origin route the Client uses for `<img src>` so the 193 reference stills
 *  lazy-load in the browser instead of being shipped as base64 over RPC. */
const IMAGE_ROUTE = '/plugins/video-studio/image'
const SKILL_RELATIVE = ['skills', 'code-animation-prompts']
const LIBRARY_RELATIVE = [...SKILL_RELATIVE, 'assets', 'library', '风格提示词']
const CATALOG_RELATIVE = [...SKILL_RELATIVE, 'references', 'catalog.json']
const SKIP_DIRS = new Set(['示例', '第三方许可'])
const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i
const MIME_BY_EXT = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }
/** Same-origin route for the learning page's assets: stills, mp4 demos, html demos, md text. */
const ASSET_ROUTE = '/plugins/video-studio/asset'
const ASSET_MIME = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
  mp4: 'video/mp4', webm: 'video/webm',
  html: 'text/html; charset=utf-8', md: 'text/markdown; charset=utf-8',
  txt: 'text/plain; charset=utf-8', json: 'application/json; charset=utf-8'
}
/** One-line summaries come from the library's own 说明.md (「341 种怎么分」表格). */
const SERIES_BLURB = {
  AG: '字、粒子、线与墨、光与天气、图形与纸、讲解、质感；每种附参考实现代码',
  M: '整段视频怎么动、怎么剪、怎么讲：口播、逐字字幕、节奏、结构',
  K: '角色和画面长什么样：卡通画风与角色设定',
  Z: '水墨、工笔、剪纸、皮影、敦煌……中国风画法',
  H: '配色加字体的整套搭配，拿来就能用的现成版式',
  L: '开源项目 Lemo-Opuscar 的风格，每种都有完整做法',
  V: '开源项目 mg-styles-15 的动态风格',
  X: '开源项目 code-video 的风格，一句话也能出片',
  R: '照参考学着用代码画的赛博朋克',
  O: '98 部奥斯卡最佳影片，每部一种画风'
}
/** Hand-picked representatives per series: the first thing a newcomer should look at. */
const SERIES_PICKS = {
  AG: ['A1', 'A3', 'A4', 'B3', 'B6', 'C1', 'C4', 'D1'],
  M: ['M1', 'M3', 'M5', 'M6', 'M8', 'M18', 'M22', 'M23'],
  K: ['K1', 'K2', 'K5', 'K10', 'K20'],
  Z: ['Z1', 'Z5', 'Z8', 'Z11'],
  H: ['H1', 'H2', 'H3', 'H6'],
  L: ['L5', 'L7', 'L8', 'L53', 'L59'],
  V: ['V1', 'V3', 'V8'],
  X: ['X1', 'X7', 'X12'],
  R: ['R1', 'R4', 'R7'],
  O: ['O1', 'O5', 'O10', 'O30']
}
const EXAMPLE_DEFS = [
  {
    id: 'b6',
    styleId: 'AG/B6',
    folder: 'skills/code-animation-prompts/assets/library/示例/B6_光速穿梭·爆炸·重聚_同一份提示词',
    title: 'B6 光速穿梭 · 爆炸 · 重聚',
    kicker: '同一份详细提示词，Opus 5.5 与 DeepSeek 各做一版',
    blurb:
      '12 秒一镜到底：光速穿梭穿过 5 个光环 → 急刹 → 爆炸 → 4000 颗粒子重聚成标题。' +
      '提示词把镜头函数、焦距、抖动都写死了，所以两个模型做出来的东西高度接近 —— 这就是"写得细有多重要"的最好例子。',
    promptFile: '提示词.md',
    videos: [
      { file: 'DeepSeek-V4.1-Flash_High.mp4', label: 'DeepSeek-V4.1-Flash 版' },
      { file: 'Opus5.5_High.mp4', label: 'Opus 5.5 版' }
    ],
    posters: ['截图_DeepSeek做出的B6.png', '截图_Opus5.5的出图文件夹.png'],
    extras: [
      { file: 'DeepSeek-V4.1-Flash_High.html', label: 'DeepSeek 版源码' },
      { file: 'Opus5.5_High.html', label: 'Opus 5.5 版源码' }
    ],
    applyParams: { aspect: '16:9', duration: 12, audio: 'none', subtitle: 'none', resolution: '1080p', fps: 30, format: 'mp4', pacing: '紧凑' },
    topic: '光速穿梭 → 爆炸 → 粒子重聚成标题'
  },
  {
    id: 'x7',
    styleId: 'X/X7',
    folder: 'skills/code-animation-prompts/assets/library/示例/X7_英雄漫画_只给一句话',
    title: 'X7 英雄漫画：只给一句话',
    kicker: '一句英文提示词，DeepSeek 直接出片',
    blurb:
      '全部提示词只有一句话（美式英雄漫画：报纸纹理、粗墨线、本戴点、黄色旁白框、对话气泡、红标题块）。' +
      '对比上面 B6 就知道：写得细 → 稳定命中；只给一句 → 每次都不一样，但也能出片。注意这条当时没说声音，所以成片是静音的。',
    promptFile: '提示词.md',
    noteFile: 'DeepSeek写的说明.md',
    videos: [{ file: 'ink-and-thunder.mp4', label: '《Ink & Thunder》成片' }],
    posters: ['截图_DeepSeek做漫画的对话.png'],
    extras: [
      { file: 'index.html', label: '源码 index.html' },
      { file: 'hero-pd.svg', label: '精帧 hero-pd.svg' }
    ],
    applyParams: { aspect: '16:9', duration: 16, audio: 'voice_bgm', subtitle: 'en', resolution: '1080p', fps: 30, format: 'mp4', pacing: '紧凑' },
    topic: '超级英雄漫画风：报纸纹理 + 粗墨线 + 本戴点 + 红标题块'
  }
]

/** Text snippets shown on the learning page, taken from the library's 说明.md. */
const GUIDE_STEPS = [
  {
    title: '① 挑一个风格',
    text: '左边按系列浏览（A–G 代码样片 / M 动态风格 / K 卡通 / Z 中国风 / H 版式 / L / V / X / R / O）。' +
      '带静帧的卡片可以直接看效果图，点开能看到这一种风格的完整提示词；觉得像你要的，点「用这个风格」。'
  },
  {
    title: '② 说清楚讲什么',
    text: '主题写一句话就够（例：为什么很多人学不会剪辑）。有口播文案就贴进"口播/分镜"框，' +
      '想加品牌色、指定字体、必须出现的元素，写进"额外要求"。'
  },
  {
    title: '③ 定视频参数',
    text: '比例、时长、有没有声音、字幕、分辨率、帧率、格式 —— 生成前会再弹一次确认，' +
      '把声音和时长这两个最容易漏的放在最上面提醒你。'
  },
  {
    title: '④ 看预计时间',
    text: '右侧的预计耗时是按你当前参数实时算的：时长 × 帧率 × 分辨率 × 节奏系数，' +
      '再加上声音合成与编码时间。片长超过 30 秒又选 2K/4K 时，耗时会明显变长。'
  },
  {
    title: '⑤ 生成',
    text: '确认后，拼好的完整提示词会直接发到当前会话，模型按提示词写 HTML + Canvas/SVG 动画，' +
      '再用脚本渲染成视频。回来对话里就能看到进度。'
  }
]
const GUIDE_TIPS = [
  '不说声音，多半做出来是静音的 —— 这是最常见的一坑。',
  '提示词写得越细（颜色、时间、镜头都写死），不同模型做出来越接近；只给一句话也能做，但每次结果不一样、更慢。',
  '提示词里的 {{ }} 是要你填的地方；本插件会自动把主题、时长、画幅替换进去。',
  '长片 + 高分辨率 = 等很久：先出 12 秒 1080p 的版本看效果，满意了再放大。'
]

const ASPECT_LABELS = {
  '16:9': '16:9 横屏（1920×1080）',
  '9:16': '9:16 竖屏（1080×1920）',
  '1:1': '1:1 方形（1080×1080）',
  '21:9': '21:9 电影宽银幕（2560×1080）',
  '4:3': '4:3 经典（1440×1080）',
  '3:2': '3:2（1620×1080）'
}
const ASPECT_SIZES = {
  '16:9': [1920, 1080],
  '9:16': [1080, 1920],
  '1:1': [1080, 1080],
  '21:9': [2560, 1080],
  '4:3': [1440, 1080],
  '3:2': [1620, 1080]
}
const AUDIO_LABELS = {
  none: '无声音（纯视觉动画）',
  voice: 'AI 口播旁白',
  bgm: '背景音乐',
  fx: '音效',
  voice_bgm: '口播 + 背景音乐'
}
const SUBTITLE_LABELS = {
  none: '无字幕',
  zh: '中文字幕',
  en: '英文字幕',
  both: '中英双语字幕',
  karaoke: '逐字卡点字幕'
}
const FORMAT_LABELS = { mp4: 'MP4 视频', gif: 'GIF 动图', webm: 'WebM 视频' }
const RESOLUTION_FACTOR = { '720p': 0.62, '1080p': 1, '2K': 1.85, '4K': 3.6 }

function ok(value) { return { ok: true, value } }
function fail(error) {
  const message = error instanceof Error ? error.message : String(error)
  return { ok: false, error: { message } }
}

function sendText(res, status, text) {
  try {
    res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
    res.end(text)
  } catch {}
}

/** GET /plugins/video-studio/image?id=<styleId> — the reference still for one style. */
async function serveImage(req, res, catalog) {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendText(res, 405, 'method-not-allowed')
    const origin = req.headers.origin
    const host = req.headers.host
    if (origin !== undefined && host !== undefined && origin !== `http://${host}` && origin !== `https://${host}`) {
      return sendText(res, 403, 'origin-rejected')
    }
    const url = new URL(String(req.url ?? '/'), 'http://127.0.0.1')
    const id = url.searchParams.get('id') ?? ''
    if (id === '') return sendText(res, 400, 'missing-id')
    const { style } = await catalog.findStyle(id)
    const file = catalog.resolveFile(style, 'image')
    if (!file) return sendText(res, 404, 'no-still')
    let bytes
    try { bytes = await readFile(file) } catch { return sendText(res, 404, 'unreadable') }
    const ext = String(file).split('.').pop().toLowerCase()
    res.writeHead(200, {
      'content-type': MIME_BY_EXT[ext] ?? 'image/jpeg',
      'content-length': String(bytes.byteLength),
      'cache-control': 'private, max-age=86400',
      'x-content-type-options': 'nosniff'
    })
    res.end(req.method === 'HEAD' ? undefined : bytes)
  } catch (error) {
    sendText(res, 500, error instanceof Error ? error.message : String(error))
  }
}

/** Reject any path that escapes the library root. `rel` is repo-relative ("skills/…/示例/…"). */
function resolveInside(root, rel) {
  const normalized = String(rel ?? '').replaceAll('\\', '/').replace(/^\/+/, '')
  if (normalized === '' || normalized.includes('\u0000')) return null
  const parts = normalized.split('/')
  for (const part of parts) if (part === '' || part === '.' || part === '..') return null
  return join(root, ...parts)
}

/** GET /plugins/video-studio/asset?p=<repo-relative path> — stills, demo videos, source html, md text. */
async function serveAsset(req, res, catalog) {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendText(res, 405, 'method-not-allowed')
    const origin = req.headers.origin
    const host = req.headers.host
    if (origin !== undefined && host !== undefined && origin !== `http://${host}` && origin !== `https://${host}`) {
      return sendText(res, 403, 'origin-rejected')
    }
    const url = new URL(String(req.url ?? '/'), 'http://127.0.0.1')
    const file = resolveInside(catalog.root, url.searchParams.get('p') ?? '')
    if (!file) return sendText(res, 400, 'bad-path')
    let bytes
    try { bytes = await readFile(file) } catch { return sendText(res, 404, 'not-found') }
    const ext = String(file).split('.').pop().toLowerCase()
    const mime = ASSET_MIME[ext] ?? 'application/octet-stream'
    const total = bytes.byteLength
    // `<video>` seeks with byte ranges; answer a single range and fall back to the whole file.
    const range = String(req.headers.range ?? '').trim()
    const match = /^bytes=(\d*)-(\d*)$/.exec(range)
    if (match) {
      let start = match[1] === '' ? 0 : Number(match[1])
      let end = match[2] === '' ? total - 1 : Number(match[2])
      if (!Number.isFinite(start) || start < 0) start = 0
      if (!Number.isFinite(end) || end >= total) end = total - 1
      if (start > end) return sendText(res, 416, 'range-not-satisfiable')
      const chunk = bytes.subarray(start, end + 1)
      res.writeHead(206, {
        'content-type': mime,
        'content-length': String(chunk.byteLength),
        'content-range': `bytes ${start}-${end}/${total}`,
        'accept-ranges': 'bytes',
        'cache-control': 'private, max-age=3600',
        'x-content-type-options': 'nosniff'
      })
      res.end(req.method === 'HEAD' ? undefined : chunk)
      return
    }
    res.writeHead(200, {
      'content-type': mime,
      'content-length': String(total),
      'accept-ranges': 'bytes',
      'cache-control': 'private, max-age=3600',
      'x-content-type-options': 'nosniff'
    })
    res.end(req.method === 'HEAD' ? undefined : bytes)
  } catch (error) {
    sendText(res, 500, error instanceof Error ? error.message : String(error))
  }
}

function defaultLibraryRoot(config) {
  const cfg = config && typeof config.libraryRoot === 'string' ? config.libraryRoot.trim() : ''
  if (cfg !== '') return cfg
  // The bundle normally sits next to the downloaded repo (…/代码动画插件/video-studio-bundle),
  // so resolve the sibling first and only fall back to the absolute Desktop path.
  const bundledSibling = join(dirname(fileURLToPath(import.meta.url)), '..', 'code-animation-prompts')
  if (existsSync(join(bundledSibling, ...SKILL_RELATIVE, 'references', 'catalog.json'))) return bundledSibling
  return join(homedir(), 'Desktop', 'agent工作区', '项目文件', '代码动画插件', 'code-animation-prompts')
}

function squash(text, limit) {
  const one = String(text ?? '').replace(/\s+/g, ' ').trim()
  return limit && one.length > limit ? `${one.slice(0, limit)}…` : one
}

function parseStyleMeta(md, fallbackName) {
  const meta = {
    title: fallbackName ?? '',
    category: '',
    description: '',
    fit: '',
    tags: []
  }
  const line = (label) => {
    const m = String(md ?? '').match(new RegExp(`^\\s*-?\\s*${label}\\s*[：:]\\s*(.+)$`, 'm'))
    return m ? squash(m[1]) : ''
  }
  const heading = String(md ?? '').match(/^#\s+(.+)$/m)
  if (heading) meta.title = squash(heading[1])
  meta.category = line('分类')
  meta.description = line('长什么样')
  meta.fit = line('适合')
  const tagLine = line('关键词')
  if (tagLine !== '') meta.tags = tagLine.split(/[、,，/|]/).map((it) => it.trim()).filter(Boolean)
  if (meta.title === '' && fallbackName) meta.title = fallbackName
  return meta
}

/** The block under "## 风格提示词" — the part that actually drives generation.
 *  In this library the section runs to the end of the file (later `##` headings are
 *  subsections of the prompt: 讲什么 / 画面怎么画 / 动起来的规则 …). */
function extractPromptBlock(md) {
  const text = String(md ?? '')
  const re = /^##+\s*风格提示词\s*$/m
  const hit = re.exec(text)
  if (!hit) {
    const body = text.replace(/^---[\s\S]*?---\s*/, '')
    return body.trim()
  }
  return text.slice(hit.index + hit[0].length).trim()
}

class Catalog {
  constructor(root) {
    this.root = root
    this.skillDir = join(root, ...SKILL_RELATIVE)
    this.libDir = join(root, ...LIBRARY_RELATIVE)
    this.catalogFile = join(root, ...CATALOG_RELATIVE)
    this.cached = null
  }

  probe() {
    const found = existsSync(this.libDir)
    const hasCatalog = existsSync(this.catalogFile)
    return {
      found,
      libraryRoot: this.root,
      libraryDir: this.libDir,
      catalogFile: hasCatalog ? this.catalogFile : null,
      hint: found
        ? (hasCatalog ? 'index: catalog.json' : 'index: directory scan')
        : `未找到风格库，请把 code-animation-prompts 仓库放到：${this.root}`
    }
  }

  async list(force = false) {
    const probe = this.probe()
    if (!probe.found) return { ...probe, total: 0, withStill: 0, series: [] }
    let mtime = 0
    try { mtime = (await stat(probe.catalogFile ?? this.libDir)).mtimeMs } catch {}
    if (!force && this.cached && this.cached.mtime === mtime) {
      return { ...probe, ...this.cached.data }
    }
    const data = probe.catalogFile ? await this.readCatalogJson() : await this.scanDirectory()
    this.cached = { mtime, data }
    return { ...probe, ...data }
  }

  async readCatalogJson() {
    const raw = await readFile(this.catalogFile, 'utf8')
    const parsed = JSON.parse(raw)
    const entries = Array.isArray(parsed.entries) ? parsed.entries : []
    const seriesMeta = Array.isArray(parsed.series) ? parsed.series : []
    const groups = new Map()
    for (const s of seriesMeta) {
      groups.set(s.id, { id: s.id, title: s.name ?? s.id, count: s.count ?? 0, readme: '', styles: [] })
    }
    for (const entry of entries) {
      const seriesId = entry.series ?? 'misc'
      if (!groups.has(seriesId)) groups.set(seriesId, { id: seriesId, title: seriesId, count: 0, readme: '', styles: [] })
      const group = groups.get(seriesId)
      const name = `${entry.id} ${entry.name}`.trim()
      group.styles.push({
        id: `${seriesId}/${entry.id}`,
        series: seriesId,
        seriesTitle: group.title,
        entryId: entry.id,
        name,
        title: entry.name ?? name,
        category: entry.category ?? '',
        head: squash(entry.description ?? '', 120),
        description: entry.description ?? '',
        fit: entry.fit ?? '',
        tags: Array.isArray(entry.tags) ? entry.tags : [],
        image: Boolean(entry.image),
        file: entry.file ?? '',
        imagePath: entry.image ?? ''
      })
    }
    const series = [...groups.values()].filter((g) => g.styles.length > 0)
    for (const group of series) group.count = group.styles.length
    return {
      source: 'catalog.json',
      total: entries.length,
      withStill: Number(parsed.with_still ?? entries.filter((e) => e.image).length),
      series
    }
  }

  /** Fallback when the repo ships without references/catalog.json. */
  async scanDirectory() {
    const top = await readdir(this.libDir, { withFileTypes: true })
    const series = []
    for (const ent of top) {
      if (!ent.isDirectory() || SKIP_DIRS.has(ent.name)) continue
      const seriesDir = join(this.libDir, ent.name)
      const items = await readdir(seriesDir, { withFileTypes: true })
      let readme = ''
      if (items.some((it) => it.isFile() && it.name === '说明.md')) {
        try { readme = squash(await readFile(join(seriesDir, '说明.md'), 'utf8'), 400) } catch {}
      }
      const images = new Map()
      for (const it of items) {
        if (it.isFile() && IMAGE_EXT.test(it.name)) images.set(it.name.replace(/\.[^.]+$/, ''), it.name)
      }
      const styles = []
      const mdFiles = items.filter((it) => it.isFile() && /\.md$/i.test(it.name) && !it.name.startsWith('_') && it.name !== '说明.md')
      for (const md of mdFiles) {
        const stem = md.name.replace(/\.md$/i, '')
        const imageName = images.get(stem) ?? null
        let text = ''
        try { text = await readFile(join(seriesDir, md.name), 'utf8') } catch { continue }
        const meta = parseStyleMeta(text, stem.replaceAll('_', ' '))
        styles.push({
          id: `${ent.name}/${stem}`,
          series: ent.name,
          seriesTitle: ent.name.replaceAll('_', ' '),
          entryId: (stem.match(/^[A-Za-z]+\d+/) ?? [stem])[0],
          name: stem.replaceAll('_', ' '),
          title: meta.title,
          category: meta.category,
          head: squash(meta.description, 120),
          description: meta.description,
          fit: meta.fit,
          tags: meta.tags,
          image: Boolean(imageName),
          file: `${ent.name}/${md.name}`,
          imagePath: imageName ? `${ent.name}/${imageName}` : ''
        })
      }
      // one-level nested layout (系列/风格/md)
      for (const sub of items.filter((it) => it.isDirectory())) {
        let files = []
        try { files = await readdir(join(seriesDir, sub.name)) } catch { continue }
        const mdName = files.find((f) => /\.md$/i.test(f))
        if (!mdName) continue
        const imageName = files.find((f) => IMAGE_EXT.test(f)) ?? null
        let text = ''
        try { text = await readFile(join(seriesDir, sub.name, mdName), 'utf8') } catch { continue }
        const meta = parseStyleMeta(text, sub.name.replaceAll('_', ' '))
        styles.push({
          id: `${ent.name}/${sub.name}`,
          series: ent.name,
          seriesTitle: ent.name.replaceAll('_', ' '),
          entryId: (sub.name.match(/^[A-Za-z]+\d+/) ?? [sub.name])[0],
          name: sub.name.replaceAll('_', ' '),
          title: meta.title,
          category: meta.category,
          head: squash(meta.description, 120),
          description: meta.description,
          fit: meta.fit,
          tags: meta.tags,
          image: Boolean(imageName),
          file: `${ent.name}/${sub.name}/${mdName}`,
          imagePath: imageName ? `${ent.name}/${sub.name}/${imageName}` : ''
        })
      }
      styles.sort((a, b) => String(a.entryId).localeCompare(String(b.entryId), 'zh-CN', { numeric: true }))
      if (styles.length > 0) {
        series.push({
          id: ent.name,
          title: ent.name.replaceAll('_', ' '),
          count: styles.length,
          readme,
          styles
        })
      }
    }
    return {
      source: 'directory',
      total: series.reduce((n, s) => n + s.count, 0),
      withStill: series.reduce((n, s) => n + s.styles.filter((x) => x.image).length, 0),
      series
    }
  }

  /** Resolve "AG/A1", "A1", "AG/A1 字雨" or the old "A-G_代码样片/A1_字雨" form. */
  async findStyle(id) {
    const catalog = await this.list()
    const raw = String(id ?? '').trim()
    if (raw === '') return { catalog, style: null }
    const [head, ...tailParts] = raw.split('/')
    const tail = tailParts.join('/')
    const flat = []
    for (const group of catalog.series) for (const style of group.styles) flat.push(style)
    const match = () => {
      if (tail !== '') {
        const byFullId = flat.find((s) => s.id === raw)
        if (byFullId) return byFullId
        const byEntry = flat.find((s) => s.series === head && String(s.entryId).toUpperCase() === tail.toUpperCase())
        if (byEntry) return byEntry
        const byName = flat.find((s) => s.series === head && (s.name === tail || s.name.startsWith(tail) || tail.startsWith(s.name)))
        if (byName) return byName
        return flat.find((s) => s.id.endsWith(`/${tail}`)) ?? null
      }
      const upper = raw.toUpperCase()
      return flat.find((s) => String(s.entryId).toUpperCase() === upper)
        ?? flat.find((s) => s.name === raw || s.name.startsWith(raw))
        ?? null
    }
    const style = match()
    const series = style ? catalog.series.find((g) => g.id === style.series) : undefined
    return { catalog, style, series }
  }

  /** catalog.json stores repo-relative paths; the directory scan stores library-relative ones. */
  resolveFile(style, which) {
    if (!style) return null
    const rel = which === 'image' ? (style.image ? style.imagePath : '') : (style.file ?? '')
    if (!rel) return null
    const normalized = String(rel).replaceAll('\\', '/')
    if (/^[A-Za-z]:\//.test(normalized) || normalized.startsWith('/')) return normalized
    if (normalized.startsWith('skills/')) return join(this.root, ...normalized.split('/'))
    // catalog.json stores paths relative to the skill root (assets/library/...)
    if (normalized.startsWith('assets/')) return join(this.skillDir, ...normalized.split('/'))
    return join(this.libDir, ...normalized.split('/'))
  }

  async readStyle(id) {
    const { catalog, style } = await this.findStyle(id)
    if (!catalog.found) throw new Error(`风格库不存在：${catalog.libraryDir}`)
    if (!style) throw new Error(`未找到风格：${id}`)
    const file = this.resolveFile(style, 'md')
    const md = await readFile(file, 'utf8')
    const meta = parseStyleMeta(md, style.name)
    return {
      id: style.id,
      entryId: style.entryId,
      series: style.series,
      seriesTitle: style.seriesTitle,
      name: style.name,
      title: meta.title || style.title,
      category: meta.category || style.category,
      description: meta.description || style.description,
      fit: meta.fit || style.fit,
      tags: meta.tags.length > 0 ? meta.tags : style.tags,
      image: style.image,
      md,
      promptBlock: extractPromptBlock(md)
    }
  }

  async readImage(id) {
    const { style } = await this.findStyle(id)
    const file = this.resolveFile(style, 'image')
    if (!file) return { mime: '', data: null }
    let st
    try { st = await stat(file) } catch { return { mime: '', data: null } }
    if (st.size > 6 * 1024 * 1024) return { mime: '', data: null, note: '参考图超过 6MB，已跳过' }
    const ext = String(file).split('.').pop().toLowerCase()
    return { mime: MIME_BY_EXT[ext] ?? 'image/jpeg', data: (await readFile(file)).toString('base64') }
  }
}

function pickOf(style) {
  return {
    id: style.id,
    entryId: style.entryId,
    name: style.name,
    title: style.title,
    category: style.category,
    head: style.head,
    image: Boolean(style.image)
  }
}

function assetUrl(rel) {
  return `${ASSET_ROUTE}?p=${encodeURIComponent(String(rel).replaceAll('\\', '/'))}`
}

/** Everything the learning page renders: how-to guide, per-series representatives, tested examples. */
async function buildLearn(catalog) {
  const data = await catalog.list()
  if (!data.found) return { found: false, libraryDir: data.libraryDir, hint: data.hint }

  const series = data.series.map((group) => {
    const wanted = SERIES_PICKS[group.id] ?? []
    const byEntry = new Map(group.styles.map((style) => [String(style.entryId).toUpperCase(), style]))
    const picks = []
    for (const entryId of wanted) {
      const hit = byEntry.get(String(entryId).toUpperCase())
      if (hit && !picks.some((item) => item.id === hit.id)) picks.push(pickOf(hit))
    }
    if (picks.length < 4) {
      for (const style of group.styles) {
        if (picks.length >= 4) break
        if (!style.image) continue
        if (picks.some((item) => item.id === style.id)) continue
        picks.push(pickOf(style))
      }
    }
    return {
      id: group.id,
      title: group.title,
      count: group.count,
      blurb: SERIES_BLURB[group.id] ?? '',
      picks
    }
  })

  const examples = []
  for (const def of EXAMPLE_DEFS) {
    const base = resolveInside(catalog.root, def.folder)
    if (!base || !existsSync(base)) continue
    const videos = []
    for (const item of def.videos ?? []) {
      const rel = `${def.folder}/${item.file}`
      if (existsSync(resolveInside(catalog.root, rel))) videos.push({ label: item.label, url: assetUrl(rel) })
    }
    const posters = []
    for (const file of def.posters ?? []) {
      const rel = `${def.folder}/${file}`
      if (existsSync(resolveInside(catalog.root, rel))) posters.push({ label: file, url: assetUrl(rel) })
    }
    const extras = []
    for (const item of def.extras ?? []) {
      const rel = `${def.folder}/${item.file}`
      if (existsSync(resolveInside(catalog.root, rel))) extras.push({ label: item.label, url: assetUrl(rel) })
    }
    let prompt = ''
    if (def.promptFile) {
      const rel = `${def.folder}/${def.promptFile}`
      try { prompt = await readFile(resolveInside(catalog.root, rel), 'utf8') } catch { prompt = '' }
    }
    let note = ''
    if (def.noteFile) {
      const rel = `${def.folder}/${def.noteFile}`
      try { note = await readFile(resolveInside(catalog.root, rel), 'utf8') } catch { note = '' }
    }
    if (videos.length === 0 && posters.length === 0) continue
    examples.push({
      id: def.id,
      title: def.title,
      kicker: def.kicker,
      blurb: def.blurb,
      styleId: def.styleId,
      topic: def.topic,
      applyParams: def.applyParams ?? null,
      videos,
      posters,
      extras,
      prompt: String(prompt).slice(0, 9000),
      note: String(note).slice(0, 4000)
    })
  }

  return {
    found: true,
    stats: { total: data.total, withStill: data.withStill, series: series.length },
    guide: { steps: GUIDE_STEPS, tips: GUIDE_TIPS },
    series,
    examples,
    libraryDir: data.libraryDir
  }
}

function replaceAll(text, key, value) {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text
    .replace(new RegExp(`\\{\\{\\s*${esc}\\s*\\}\\}`, 'gi'), value)
    .replace(new RegExp(`\\{\\s*${esc}\\s*\\}`, 'gi'), value)
}

function normalizeParams(params) {
  const p = params && typeof params === 'object' ? params : {}
  const duration = Number(p.duration)
  const color = String(p.primaryColor ?? '').trim()
  return {
    aspect: ASPECT_LABELS[p.aspect] ? String(p.aspect) : '16:9',
    duration: Number.isFinite(duration) && duration > 0 && duration <= 600 ? Math.round(duration) : 12,
    audio: AUDIO_LABELS[p.audio] ? String(p.audio) : 'none',
    voiceStyle: String(p.voiceStyle ?? '知性女声'),
    voiceSpeed: ['慢', '正常', '快'].includes(p.voiceSpeed) ? String(p.voiceSpeed) : '正常',
    musicStyle: String(p.musicStyle ?? '卡点节奏'),
    musicVolume: ['低', '中', '高'].includes(p.musicVolume) ? String(p.musicVolume) : '中',
    subtitle: SUBTITLE_LABELS[p.subtitle] ? String(p.subtitle) : 'zh',
    subtitlePos: ['底部', '中部', '顶部'].includes(p.subtitlePos) ? String(p.subtitlePos) : '底部',
    resolution: RESOLUTION_FACTOR[p.resolution] ? String(p.resolution) : '1080p',
    fps: [24, 30, 60].includes(Number(p.fps)) ? Number(p.fps) : 30,
    format: FORMAT_LABELS[p.format] ? String(p.format) : 'mp4',
    pacing: ['舒缓', '适中', '紧凑'].includes(p.pacing) ? String(p.pacing) : '适中',
    primaryColor: /^#[0-9a-fA-F]{6}$/.test(color) ? color.toUpperCase() : '',
    fontFamily: ['系统默认', '思源黑体', '思源宋体', '楷体', '等宽'].includes(p.fontFamily) ? String(p.fontFamily) : '系统默认'
  }
}

export function estimate(params, styleId) {
  const p = normalizeParams(params)
  const seriesKey = String(styleId ?? '').split('/')[0] ?? ''
  const codeHeavy = /^([A-G]|AG)/i.test(seriesKey) || /^[A-G]\d/i.test(String(styleId ?? ''))
  const perFrame = codeHeavy ? 0.22 : 0.1
  const pacingFactor = { 舒缓: 0.9, 适中: 1, 紧凑: 1.12 }[p.pacing] ?? 1
  const resFactor = RESOLUTION_FACTOR[p.resolution] ?? 1
  const render = p.duration * p.fps * perFrame * resFactor * pacingFactor
  const voiceFactor = { 慢: 1.15, 正常: 1, 快: 0.92 }[p.voiceSpeed] ?? 1
  const audioSeconds = {
    none: 0,
    voice: (40 + p.duration * 1.2) * voiceFactor,
    bgm: 15,
    fx: 10,
    voice_bgm: (55 + p.duration * 1.2) * voiceFactor
  }[p.audio] ?? 0
  const setup = 35
  const encode = 20 + (p.format === 'mp4' ? 12 : 0) + (resFactor > 1.5 ? 22 : 0)
  const total = setup + render + audioSeconds + encode
  const [w, h] = ASPECT_SIZES[p.aspect] ?? ASPECT_SIZES['16:9']
  return {
    render: Math.round(render),
    audio: Math.round(audioSeconds),
    encode: Math.round(encode),
    setup,
    total: Math.round(total),
    low: Math.round(total * 0.8),
    high: Math.round(total * 1.35),
    frames: Math.round(p.duration * p.fps),
    canvas: `${w}×${h}`
  }
}

const AUDIO_INSTRUCTIONS = {
  none: [
    '无声音：只输出画面，音轨留空。不要擅自加配乐、旁白或音效，并在交付说明里写明"无声预览"。'
  ],
  voice: [
    'AI 口播旁白：把上面的文案当作唯一旁白稿，逐句配音并与画面对齐；',
    '若本机没有可用的 TTS，交付配音稿 + 逐句时间轴，并明确说明"旁白未合成，需要先配音"。'
  ],
  bgm: [
    '背景音乐：按所选音乐风格铺一条完整 BGM，音量低于人声，首尾淡入淡出。'
  ],
  fx: [
    '音效：为关键动作配短音效（入场、打击、转场），保持克制，不要盖过画面节奏。'
  ],
  voice_bgm: [
    '口播 + 背景音乐：人声在前景，BGM 压到 -18dB 左右，遇停顿再抬升；',
    '若本机没有可用的 TTS，交付配音稿与时间轴，并说明旁白尚未合成。'
  ]
}

const SUBTITLE_INSTRUCTIONS = {
  none: ['无字幕：画面内不要出现字幕条。'],
  zh: ['中文字幕：跟随旁白/要点逐句出现，位于安全区内，字号在 1080p 下不小于 34px。'],
  en: ['英文字幕：为中文字幕配英文翻译，保持同样的断句与出现时机。'],
  both: ['中英双语字幕：中文在上、英文在下，两行都不得压住主体画面。'],
  karaoke: ['逐字卡点字幕：每个字/词跟随节奏逐字高亮，与音频波形对齐。']
}

const VOICE_SPEED_HINT = {
  慢: '每句之间留半拍呼吸，适合讲解与科普，不要压缩成连珠炮。',
  正常: '自然语速，句间留 0.2 秒气口，与画面关键帧对齐。',
  快: '节奏紧凑，句间几乎不停顿，适合信息量大的盘点类内容。'
}
const MUSIC_VOLUME_HINT = {
  低: 'BGM 压到 -26dB 左右，只做氛围底噪，绝不盖过人声。',
  中: 'BGM 约 -18dB，人声在前景，副歌处可略微抬升。',
  高: 'BGM 约 -12dB，情绪推进更强烈，但人声仍须清晰可辨。'
}
const SUBTITLE_POS_HINT = {
  底部: '字幕固定在底部安全区，距下边缘约 8%，避开进度条与平台 UI。',
  中部: '字幕位于画面中部偏下，用半透明色块衬底以保证可读性。',
  顶部: '字幕位于顶部安全区，适合画面底部有主体的构图。'
}
const PACING_HINT = {
  舒缓: '转场留白多、停留时间长，适合氛围与情绪类内容。',
  适中: '每 2-4 秒一个视觉变化，讲解与宣传片都适用。',
  紧凑: '每秒都有信息推进，卡点密集，适合盘点/节奏类内容。'
}
const FONT_HINT = {
  思源黑体: '请优先使用 "Source Han Sans / Noto Sans SC"，缺失时回退到系统黑体。',
  思源宋体: '请优先使用 "Source Han Serif / Noto Serif SC"，标题可用宋体增强质感。',
  楷体: '请优先使用 "KaiTi / STKaiti"，适合手写、国风与温柔风格。',
  等宽: '请优先使用 "JetBrains Mono / Consolas"，适合代码与技术讲解。'
}

function deliveryRules(p) {
  const [w, h] = ASPECT_SIZES[p.aspect] ?? ASPECT_SIZES['16:9']
  const rules = [
    `用 HTML + Canvas/SVG/CSS 实现，画布 ${w}×${h}（${p.aspect}），时长 ${p.duration} 秒、${p.fps} fps；需要真实 3D 空间镜头时可用 Three.js，已有 Remotion 工程则沿用。`,
    '画面必须完全由秒数 t 决定（render(t)）：不使用 setTimeout 累积状态，随机数用固定种子，导出时关闭实时循环，保证同一时刻重复渲染结果一致。',
    '文案、配色、节奏等常改参数集中放在文件顶部配置区，方便二次修改。',
    '完成后自检首帧、中段、尾帧与转场：字体是否加载、文字是否溢出、有无黑帧、图片是否加载、字幕是否可读。',
    '交付可运行的 HTML 文件；用户要成片时实际渲染并检查分辨率、时长、帧率与声音轨，不能把 HTML 或录屏命令当成视频交付。',
    '交付时说明：所用风格编号、运行方法、实际视频规格、声音是否存在，以及文件路径。'
  ]
  return rules
}

/** Build the prompt handed to the conversation when the user hits "生成". */
export function composePrompt({ style, styleId, topic, script, params, extra }) {
  const p = normalizeParams(params)
  const aspectLabel = ASPECT_LABELS[p.aspect]
  const [w, h] = ASPECT_SIZES[p.aspect] ?? ASPECT_SIZES['16:9']
  const out = []
  out.push('用代码制作一段"代码动画"视频。')
  out.push('')
  out.push('【内容主题】')
  out.push(String(topic ?? '').trim() !== '' ? String(topic).trim() : '（未填写，请先用一句话概括要讲的要点，再开始做）')
  if (script && String(script).trim() !== '') {
    out.push('')
    out.push('【口播文案 / 分镜脚本】')
    out.push(String(script).trim())
  }
  if (extra && String(extra).trim() !== '') {
    out.push('')
    out.push('【额外要求】')
    out.push(String(extra).trim())
  }
  if (style) {
    out.push('')
    out.push('【风格设定】')
    out.push(`编号：${style.entryId ?? style.id} · 名称：${style.title ?? style.name}（系列：${style.seriesTitle}${style.category ? ` / 分类：${style.category}` : ''}）`)
    if (style.description) out.push(`长什么样：${style.description}`)
    if (style.fit) out.push(`适合：${style.fit}`)
    if (Array.isArray(style.tags) && style.tags.length > 0) out.push(`关键词：${style.tags.join('、')}`)
    if (style.promptBlock) {
      out.push('')
      out.push('【风格提示词（保留核心视觉特征，其余按内容自由发挥）】')
      out.push(style.promptBlock.slice(0, 12000))
      out.push('')
      out.push('注：风格提示词里"只输出代码/不要解释"之类的措辞只针对该风格素材本身，一切以本提示词的交付要求为准；模板中剩余的 {{占位符}} 请按内容主题自行填写，不要保留花括号。')
    }
  } else if (styleId) {
    out.push('')
    out.push(`【风格】${styleId}`)
  }
  out.push('')
  out.push('【视频参数】')
  out.push(`- 视频时长：${p.duration} 秒（${p.duration * p.fps} 帧 @ ${p.fps}fps）`)
  out.push(`- 画幅比例：${aspectLabel}`)
  out.push(`- 输出分辨率：${p.resolution}（${w}×${h} 基准）`)
  out.push(`- 帧率：${p.fps} fps`)
  out.push(`- 声音：${AUDIO_LABELS[p.audio]}`)
  if (p.audio === 'voice' || p.audio === 'voice_bgm') out.push(`- 旁白音色：${p.voiceStyle}｜语速：${p.voiceSpeed}`)
  if (p.audio === 'bgm' || p.audio === 'voice_bgm') out.push(`- 音乐风格：${p.musicStyle}｜音量：${p.musicVolume}`)
  out.push(`- 字幕：${SUBTITLE_LABELS[p.subtitle]}${p.subtitle === 'none' ? '' : `｜位置：${p.subtitlePos}`}`)
  out.push(`- 动画节奏：${p.pacing}`)
  out.push(`- 输出格式：${FORMAT_LABELS[p.format]}`)
  if (p.primaryColor) out.push(`- 品牌主色：${p.primaryColor}`)
  if (p.fontFamily !== '系统默认') out.push(`- 指定字体：${p.fontFamily}`)
  out.push('')
  out.push('【声音与字幕要求】')
  for (const line of AUDIO_INSTRUCTIONS[p.audio]) out.push(`- ${line}`)
  if (p.audio === 'voice' || p.audio === 'voice_bgm') out.push(`- 语速（${p.voiceSpeed}）：${VOICE_SPEED_HINT[p.voiceSpeed]}`)
  if (p.audio === 'bgm' || p.audio === 'voice_bgm') out.push(`- 音乐音量（${p.musicVolume}）：${MUSIC_VOLUME_HINT[p.musicVolume]}`)
  for (const line of SUBTITLE_INSTRUCTIONS[p.subtitle]) out.push(`- ${line}`)
  if (p.subtitle !== 'none') out.push(`- 字幕位置（${p.subtitlePos}）：${SUBTITLE_POS_HINT[p.subtitlePos]}`)
  out.push('')
  out.push('【视觉与节奏要求】')
  out.push(`- 动画节奏（${p.pacing}）：${PACING_HINT[p.pacing]}`)
  if (p.primaryColor) {
    out.push(`- 品牌主色 ${p.primaryColor}：把该颜色作为强调色/高光色使用，颜色要出现在关键元素上，但不要整屏铺满，背景仍按风格的底色处理。`)
  }
  if (p.fontFamily !== '系统默认') {
    out.push(`- 字体（${p.fontFamily}）：${FONT_HINT[p.fontFamily] ?? ''} 中文字形必须完整显示，不能出现豆腐块或缺字。`)
  }
  out.push('')
  out.push('【实现与交付要求】')
  for (const line of deliveryRules(p)) out.push(`- ${line}`)
  let prompt = out.join('\n')
  const fill = (key, value) => { prompt = replaceAll(prompt, key, value) }
  fill('内容', topic || '（按主题自行补全）')
  fill('主题', topic || '（按主题自行补全）')
  fill('文案', script || '（按主题自行撰写）')
  fill('脚本', script || '（按主题自行撰写）')
  fill('时长', `${p.duration} 秒`)
  fill('画幅', aspectLabel)
  fill('分辨率', p.resolution)
  fill('帧率', `${p.fps} fps`)
  return { prompt, params: p, canvas: `${w}×${h}` }
}

// A few client bundles probe `CSS.supports` at module scope (dsh-image-gen tracks
// this as #40). In a rare renderer state that global exists without the method, the
// probe throws during import and the whole web boot fails ("web boot: 1 entry did
// not activate"). Filling the method in before any client module evaluates keeps the
// failure from coming back — this script is inert wherever CSS.supports already works.
const CSS_SUPPORTS_SHIM = '<script data-dsh-video-studio-css>(function(){try{var c=(typeof CSS!=="undefined")?CSS:(window.CSS=window.CSS||{});if(c&&typeof c.supports!=="function"){try{c.supports=function(){return false}}catch(e){}}if(c&&typeof c.supports!=="function"){try{Object.defineProperty(c,"supports",{value:function(){return false},configurable:true,writable:true})}catch(e){}}}catch(e){}})();</script>'

export function apply(ctx, config = {}) {
  const catalog = new Catalog(defaultLibraryRoot(config))

  const buildComposed = async (styleId, topic, script, params, extra) => {
    let style = null
    if (styleId) {
      const found = await catalog.findStyle(styleId)
      if (!found.catalog.found) throw new Error(`风格库不存在：${found.catalog.libraryDir}`)
      if (!found.style) throw new Error(`未找到风格：${styleId}`)
      style = await catalog.readStyle(styleId)
    }
    return composePrompt({ style, styleId, topic, script, params, extra })
  }

  // Client <-> Host RPC. Mirrors the shipped dsh-mnemon bridge:
  // client: connection.rpc.call(CHANNEL, endpoint, payload, signal?)
  // host:   connection.rpc.handle(CHANNEL, async (endpoint, payload, signal) => ({ok, value}|{ok:false, error:{message}}))
  ctx.inject(['connection', 'webServer'], (webContext) => {
    const lookup = (key) => {
      if (!webContext) return null
      if (typeof webContext.get === 'function') {
        try { const value = webContext.get(key); if (value) return value } catch {}
      }
      return webContext[key] ?? null
    }
    let connection = lookup('connection')
    if (!connection && webContext && typeof webContext.extend === 'function') {
      try { connection = webContext.extend({ webServer: lookup('webServer') }).connection } catch {}
    }

    // Reference stills for the picker: served over HTTP so <img> can lazy-load them.
    const webServer = lookup('webServer')
    if (webServer && typeof webServer.register === 'function') {
      ctx.effect(() => webServer.register({
        kind: 'exact',
        path: IMAGE_ROUTE,
        handler: (req, res) => serveImage(req, res, catalog)
      }), 'video-studio: reference image route')
      ctx.effect(() => webServer.register({
        kind: 'exact',
        path: ASSET_ROUTE,
        handler: (req, res) => serveAsset(req, res, catalog)
      }), 'video-studio: example asset route')
    }

    if (config.cssShim !== false && webServer && typeof webServer.tapIndex === 'function') {
      ctx.effect(() => webServer.tapIndex((html) => {
        try {
          if (typeof html !== 'string' || html.includes('data-dsh-video-studio-css')) return html
          return html.includes('</head>') ? html.replace('</head>', CSS_SUPPORTS_SHIM + '</head>') : html
        } catch {
          return html
        }
      }), 'video-studio: css.supports guard')
    }

    if (!connection || typeof connection.rpc?.handle !== 'function') return
    connection.rpc.handle(CHANNEL, async (endpoint, payload = {}, signal) => {
      try {
        switch (endpoint) {
          case 'probe':
            return ok(catalog.probe())
          case 'catalog':
            return ok(await catalog.list(payload.force === true))
          case 'learn':
            return ok(await buildLearn(catalog))
          case 'style':
            return ok(await catalog.readStyle(payload.id))
          case 'image':
            return ok(await catalog.readImage(payload.id))
          case 'estimate': {
            const value = estimate(payload.params, payload.styleId)
            return ok({
              ...value,
              text: `预计约 ${Math.round(value.low / 60)} ~ ${Math.round(value.high / 60)} 分钟`,
              note: '估计值按本机 HTML/CSS/Canvas 渲染速度估算，实际耗时还取决于模型生成代码的速度与机器性能。'
            })
          }
          case 'compose':
            return ok(await buildComposed(payload.styleId, payload.topic, payload.script, payload.params, payload.extra))
          default:
            return fail(new Error(`video-studio: 未知接口 ${endpoint}`))
        }
      } catch (error) {
        return fail(error)
      }
    })
  })

  // Agent tool: the model can query the same library while generating.
  ctx.tools.register({
    name: 'video_studio_query',
    description:
      '查询本地"代码动画"风格库（来自 code-animation-prompts 仓库：341 种风格提示词、193 张参考静帧，分 10 个系列）。' +
      'list=列出系列与风格；read=读取某个风格的完整提示词与元数据；compose=按风格+内容+视频参数拼装最终提示词；estimate=估算渲染耗时。' +
      '当用户想生成代码动画/风格化视频时先用它选风格，再按返回的提示词与实现要求用 HTML/Canvas 渲染并导出视频。',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'learn', 'read', 'compose', 'estimate'],
          description: 'list=列出系列/风格；learn=参考库总览（怎么用+每个系列代表作+实测案例）；read=读取风格完整提示词；compose=拼装提示词；estimate=估算耗时'
        },
        series: { type: 'string', description: '仅列出指定系列 ID（AG/M/K/Z/H/L/V/X/R/O，可选）' },
        styleId: { type: 'string', description: '风格 ID，形如 "AG/A1"、"M/M1" 或直接 "A1"（read/compose/estimate 需要）' },
        topic: { type: 'string', description: '视频内容主题（compose 需要）' },
        script: { type: 'string', description: '口播文案或分镜脚本（可选）' },
        extra: { type: 'string', description: '额外要求（可选，如品牌色、指定字体、必须出现的元素）' },
        params: {
          type: 'object',
          additionalProperties: true,
          description:
            '视频参数：aspect(16:9/9:16/1:1/21:9/4:3/3:2)、duration(秒)、audio(none/voice/bgm/fx/voice_bgm)、' +
            'voiceStyle、musicStyle、subtitle(none/zh/en/both/karaoke)、resolution(720p/1080p/2K/4K)、fps(24/30/60)、format(mp4/gif/webm)'
        }
      },
      required: ['action']
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => [{
        type: 'text',
        text: typeof value === 'string' ? value : JSON.stringify(value, null, 2)
      }]
    },
    execute: async (args, exec) => {
      const signal = exec && exec.signal
      switch (args.action) {
        case 'list': {
          const value = await catalog.list()
          if (!value.found) throw new Error(`风格库不存在，请把 code-animation-prompts 仓库放到：${value.libraryRoot}`)
          const pick = (group) => ({
            id: group.id,
            title: group.title,
            count: group.count,
            styles: group.styles.map((s) => ({
              id: s.id,
              name: s.name,
              category: s.category,
              head: s.head,
              fit: s.fit,
              tags: s.tags,
              hasStill: s.image
            }))
          })
          if (args.series) {
            const wanted = String(args.series).trim().toUpperCase()
            const series = value.series.find((s) => s.id.toUpperCase() === wanted || s.title.includes(args.series))
            if (!series) throw new Error(`未找到系列：${args.series}（可选：${value.series.map((s) => s.id).join('/')}）`)
            return pick(series)
          }
          return {
            libraryDir: value.libraryDir,
            source: value.source,
            totalStyles: value.total,
            withStill: value.withStill,
            series: value.series.map((s) => ({ id: s.id, title: s.title, count: s.count })),
            tip: `共 ${value.total} 种风格、${value.withStill} 张参考静帧。用 series 参数展开某个系列，或用 styleId 读取单个风格。`
          }
        }
        case 'learn': {
          const value = await buildLearn(catalog)
          if (!value.found) throw new Error(`风格库不存在，请把 code-animation-prompts 仓库放到：${value.libraryDir}`)
          return {
            stats: value.stats,
            guide: value.guide.steps.map((step) => `${step.title}：${step.text}`),
            series: value.series.map((group) => ({
              id: group.id,
              title: group.title,
              count: group.count,
              blurb: group.blurb,
              representatives: group.picks.map((pick) => `${pick.id} ${pick.title}`)
            })),
            examples: value.examples.map((example) => ({
              title: example.title,
              kicker: example.kicker,
              blurb: example.blurb,
              styleId: example.styleId,
              prompt: example.prompt
            }))
          }
        }
        case 'read': {
          const style = await catalog.readStyle(args.styleId)
          return {
            id: style.id,
            name: style.name,
            title: style.title,
            series: style.series,
            seriesTitle: style.seriesTitle,
            category: style.category,
            description: style.description,
            fit: style.fit,
            tags: style.tags,
            hasStill: style.image,
            promptBlock: style.promptBlock,
            md: style.md
          }
        }
        case 'compose': {
          const composed = await buildComposed(args.styleId, args.topic, args.script, args.params, args.extra)
          return {
            styleId: args.styleId ?? null,
            canvas: composed.canvas,
            params: composed.params,
            prompt: composed.prompt
          }
        }
        case 'estimate': {
          const value = estimate(args.params, args.styleId)
          return {
            ...value,
            text: `预计约 ${Math.round(value.low / 60)} ~ ${Math.round(value.high / 60)} 分钟（动画渲染约 ${value.render} 秒，声音合成约 ${value.audio} 秒，编码约 ${value.encode} 秒）`
          }
        }
        default:
          throw new Error(`未知 action：${args.action}`)
      }
    }
  })
}
