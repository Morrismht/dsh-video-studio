# 出处与许可 / Attribution & License

## 本仓库包含什么

本仓库包含**插件代码**（`index.js` / `client.js` / `package.json` / `cordis.patch.yml` / `icon.svg` / `locale/*`），以及 `thumbs/` 下 **333 张风格预览图**（205 张来自上游原创静帧，128 张为本仓库补绘）。
**不包含**风格提示词正文、示例视频与文档——这些仍在上游仓库，插件运行时从你本地读取。

## 上游素材来源（必须署名）

| 内容 | 来源 | 许可 |
| --- | --- | --- |
| 341 种代码动画风格提示词、193 张参考静帧、`catalog.json`、`说明.md`、`许可与来源.md` | [XiaoyeCodes/code-animation-prompts](https://github.com/XiaoyeCodes/code-animation-prompts) | 作者原创；**全部免费，可免费转发**；禁止包装成课程 / 付费 skill 售卖 |
| `示例\B6_光速穿梭·爆炸·重聚`（Opus 5.5 与 DeepSeek-V4.1-Flash 两版成片与截图） | 同上 | 同上 |
| `示例\X7_英雄漫画_只给一句话` | 同上 | 同上 |
| `docs\images\*` | 同上 | 同上 |
| `thumbs/` 下 205 张预览图（上游原图，含 catalog 未登记的 12 张） | 同上游 [XiaoyeCodes/code-animation-prompts](https://github.com/XiaoyeCodes/code-animation-prompts) | 同上游约定：免费转发，禁止付费封装 |
| `thumbs/` 下 128 张补绘预览图 | 本仓库用 HTML/CSS/SVG 手写画面 + 无头 Chrome 截图生成 | 与上游同样免费转发、禁止付费封装；可任意使用 |
| L 系列（Lemo-Opuscar）原始素材 | 见上游 `assets\library\第三方许可\Lemo-Opuscar_LICENSE.txt` | MIT 类许可 |
| V 系列（mg-styles-15）原始素材 | 见上游 `assets\library\第三方许可\mg-styles-15_LICENSE.txt` | MIT 类许可 |
| X 系列（code-video）原始素材 | 见上游 `assets\library\第三方许可\code-video_LICENSE.txt` | MIT 类许可 |

## 视频

B 站《【经验开源】Opus 5.5 做的代码动画，DeepSeek 也能做！341 种风格提示词，全部免费送》
<https://www.bilibili.com/video/BV1bqx76wEUM> —— 上游风格库作者本人的讲解，
本插件是那套风格库在 DeepSeek Harness（DSH）里的移植与图形化前端。

## 使用约定

- 你可以自由使用、修改、转发本插件，保留本文件的署名即可。
- **不要**把「本插件 + 上游风格库」打包成付费课程或付费 skill 出售。
- 修改后再分发时，请同时保留上游仓库与作者信息。

---

## English summary

This repository ships the **plugin code** plus a `thumbs/` folder with **333 preview stills**
(205 of them are upstream stills, 128 were rendered by this repository for styles upstream did not illustrate).
The 341 prompt texts, example films and docs stay in [XiaoyeCodes/code-animation-prompts](https://github.com/XiaoyeCodes/code-animation-prompts) and are read from your local copy at runtime.

Upstream content is free to use and to pass along, but must not be repackaged into paid courses
or paid skills. Third-party assets (Lemo-Opuscar, mg-styles-15, code-video) keep their own
MIT-style licenses, reproduced in the upstream repository under `assets/library/第三方许可/`.
