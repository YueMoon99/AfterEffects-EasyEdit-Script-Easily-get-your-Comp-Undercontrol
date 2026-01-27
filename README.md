# Easy Edit v1.2 - After Effects 智能合成修改脚本<br>
Easy Edit 是一款专为 Adobe After Effects 设计的高效脚本工具，旨在简化繁琐的合成设置修改流程。<br>
它具备“智能判定”与“递归穿透”功能，能够根据您的选择状态，快速批量地修改合成时长、帧率及尺寸，极大提升项目整理与修改的效率。<br><br>
## 🇨🇳 中文说明 (Chinese)
<img width="312" height="624" alt="屏幕截图 2026-01-27 155223" src="https://github.com/user-attachments/assets/edd29daf-ce2c-48d9-a174-f706932bb9ee" /><br>

## ✨ 主要功能
智能上下文判定<br>
有选中时：修改所选图层对应的源合成（Source Comp）。<br>
无选中时：直接修改当前打开的活跃合成（Active Comp）。<br>
强大的子合成穿透 (Recursive)<br>
勾选穿透功能后，脚本会自动递归查找并修改所有嵌套的子合成，一键搞定复杂的嵌套结构。<br>
点击对齐按钮，可将合成或图层出点对齐至当前播放头（CTI）。<br>
自动补帧逻辑：自动增加 1 帧时长，避免因 AE 播放机制导致最后一帧不可见的问题。<br>
灵活的时长修改模式<br>
模式1：修改所有层 + 穿透子合成。<br>
模式2：智能识别，仅修改原本时长触及末尾的图层 + 穿透（保持短图层不变）。<br>
模式3：仅修改当前合成容器的时长，不影响内部图层。<br><br>

## 📥 安装方法<br>
下载 EasyEdit.jsx 文件。<br>
将脚本文件复制到 After Effects 的脚本面板文件夹中：<br>
Windows: ...\Adobe After Effects [版本]\Support Files\Scripts\ScriptUI Panels\ <br>
Mac: /Applications/Adobe After Effects [版本]/Scripts/ScriptUI Panels/<br>
重启 After Effects<br>
在顶部菜单栏选择 窗口 (Window) -> EasyEdit 即可打开面板。<br>
该面板支持停靠（Dockable），您可以将其吸附在 AE 界面的任意位置。<br><br>

## 🎮 使用指南<br>
### 1. 时长与出点控制<br>
对齐至播放头：将时间线指针（CTI）移动到想要结束的位置，点击按钮。脚本会将合成时长或选中图层的出点裁剪至此（包含当前帧）。<br>
增加 20 秒：点击即可快速在当前时长基础上增加 20 秒。<br>
修改模式 (Radio Buttons)：<br>
若只想改合成总时长而不改变内部结构，请选择模式 3。<br>
若想让内部所有子合成同步变长/变短，请选择模式1或模式2。<br><br>

### 2. 帧率设置 (FPS)<br>
输入目标帧率（如 25, 30, 60）。<br>
勾选 开启子合成穿透修改，可将所有嵌套的子合成统一改为指定帧率。<br>
点击 应用帧率修改。<br><br>

### 3. 合成尺寸设置 (Size)<br>
输入格式为 宽度 * 高度（例如：1920 * 1080）。<br>
同样支持子合成穿透修改。<br>
点击 应用尺寸修改。<br>

## 👨‍💻 作者信息<br>
博客：yuemoon.vip<br>
GitHub：@YueMoon99<br>
B站：UID223633562<br>
Bug反馈或更多脚本制作建议：我的博客与我联系<br>

## English Description<br>
## ✨ Features<br>
Easy Edit v1.2 is a smart utility script for Adobe After Effects designed to streamline composition settings adjustment. <br>
It features "Smart Context Detection" and "Recursive Penetration" logic to maximize efficiency.<br><br>
<img width="312" height="624" alt="屏幕截图 2026-01-27 155225" src="https://github.com/user-attachments/assets/b06d93e5-003a-4c70-8a93-8edf749aa875" /><br>

Smart Context Detection<br>
Selection Exists: Modifies the Source Comps of the selected layers.<br>
No Selection: Modifies the Active Composition currently open.<br>
Recursive Sub-Comp Penetration<br>
When the "Penetrate" checkbox is enabled, the script recursively finds and modifies all nested pre-comps deep within the hierarchy.<br>
Precise Duration Alignment (CTI + 1 Frame)<br>
Aligns the Out Point to the Current Time Indicator (Playhead).<br>
Smart Fix: Automatically adds 1 extra frame to ensure the last frame remains visible (solving the common "disappearing last frame" issue in AE).<br>
Flexible Duration Modes<br>
Mode 1: Modifies all layers + Penetrates sub-comps.<br>
Mode 2: Smart Logic – Only modifies layers that originally extended to the end of the comp + Penetration.<br>
Mode 3: Container Only – Changes the composition duration without affecting layer out-points.<br>
Quick Actions<br>
[Add 20s]: Instantly extends the duration of the active comp or selected layer sources by 20 seconds.<br><br>

## 📥 Installation<br>
Download the EasyEdit.jsx file.<br>
Copy the file to the ScriptUI Panels folder:<br>
Windows:...\Adobe After Effects [Version]\Support Files\Scripts\ScriptUI Panels\ <br>
Mac: /Applications/Adobe After Effects [Version]/Scripts/ScriptUI Panels/<br>
Restart After Effects.<br>
Go to the top menu: Window -> EasyEdit.<br>
The panel is dockable and can be placed anywhere in your workspace.<br><br>

## 🎮 How to Use<br>
### 1. Duration / Out Point Control<br>
Align to Playhead: Move the CTI to your desired end point and click. The script sets the duration/out-point exactly to this time (inclusive of the current frame).<br>
Add 20s: Quickly adds 20 seconds to the current duration.<br>
Modes:<br>
Use Mode 3 if you only want to change the container duration.<br>
Use Mode 1 or Mode 2 to recursively adjust internal layers and sub-comps.<br><br>

### 2. Frame Rate (FPS)<br>
Enter your desired FPS (e.g., 25, 30, 60).<br>
Check Sub-Comp Penetrate to apply this FPS to all nested compositions.<br>
Click Apply FPS.<br><br>

### 3. Comp Size<br>
Enter dimensions in Width * Height format (e.g., 1080 * 1920).<br>
Check Sub-Comp Penetrate to resize all nested compositions recursively.<br>
Click Apply Size.<br><br>

## 📝 Author & License<br>
Author: YueMoon (舟午)<br>
Blog: yuemoon.vip<br>
GitHub：@YueMoon99<br>
Bilibili: UID 223633562<br>
License: Open-source free software. Resale is prohibited.
