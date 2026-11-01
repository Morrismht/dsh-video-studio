# 出处与许可 / Attribution & License

## 本仓库包含什么

本仓库只有**插件代码**（`index.js` / `client.js` / `package.json` / `cordis.patch.yml` / `icon.svg` / `locale/*`）。
**不包含**任何风格提示词、参考静帧或示例视频——这些都在上游仓库里，插件运行时从你本机读取。

## 上游素材来源（必须署名）

| 内容 | 来源 | 许可 |
| --- | --- | --- |
| 341 种代码动画风格提示词、193 张参考静帧、`catalog.json`、`说明.md`、`许可与来源.md` | [XiaoyeCodes/code-animation-prompts](https://github.com/XiaoyeCodes/code-animation-prompts) | 作者原创；**全部免费，可免费转发**；禁止包装成课程 / 付费 skill 售卖 |
| `示例\B6_光速穿梭·爆炸·重聚`（Opus 5.5 与 DeepSeek-V4.1-Flash 两版成片与截图） | 同上 | 同上 |
| `示例\X7_英雄漫画_只给一句话` | 同上 | 同上 |
| `docs\images\*` | 同上 | 同上 |
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

This repository ships **plugin code only**. All 341 style prompts, 193 reference stills,
the example films and docs live in [XiaoyeCodes/code-animation-prompts](https://github.com/XiaoyeCodes/code-animation-prompts)
and are read from your local copy at runtime.

Upstream content is free to use and to pass along, but must not be repackaged into paid courses
or paid skills. Third-party assets (Lemo-Opuscar, mg-styles-15, code-video) keep their own
MIT-style licenses, reproduced in the upstream repository under `assets/library/第三方许可/`.
