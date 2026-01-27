// AE Script: Easy Edit v1.2 (Chinese Version)
// 功能：智能属性修改器（支持出点对齐、增加时长、帧率及尺寸递归修改）
(function(thisObj) { 
    var isDockablePanel = (thisObj instanceof Panel);
    var mainWindow;
    if (isDockablePanel) {
        mainWindow = thisObj;
        mainWindow.text = "Easy Edit v1.2 | 舟午YueMoon |";
    } else {
        mainWindow = new Window("palette", "Easy Edit", undefined, {resizeable: true});
    }

    // --- UI 界面布局设置 ---
    mainWindow.orientation = "column";
    mainWindow.alignChildren = "left";
    mainWindow.spacing = 10;
    mainWindow.margins = 15;
    var panelWidth = 280; 
    var buttonWidth = 250;
    var blogText = mainWindow.add("statictext", undefined, "博客：yuemoon.vip   B站：UID223633562");
    blogText.size = [panelWidth, 15];
    
    // --- 1. 时长与出点设置 ---
    var durationGroup = mainWindow.add("panel", undefined, "时长/出点控制");
    durationGroup.orientation = "column";
    durationGroup.alignChildren = "left";
    durationGroup.preferredSize.width = panelWidth;
    durationGroup.maximumSize.width = panelWidth;
    var radio1 = durationGroup.add("radiobutton", undefined, "1、强制修改所有图层 + 子合成穿透");
    var radio2 = durationGroup.add("radiobutton", undefined, "2、仅原本触及终点的图层 + 穿透");
    var radio3 = durationGroup.add("radiobutton", undefined, "3、仅修改选中合成时长 (不改内容)");
    radio1.value = true; 
    var durationBtnGroup = durationGroup.add("group");
    durationBtnGroup.orientation = "row";
    durationBtnGroup.spacing = 5;
    var setEndPointButton = durationBtnGroup.add("button", undefined, "对齐至播放头");
    setEndPointButton.size = [(buttonWidth/2)-2, 25];
    var addTimeButton = durationBtnGroup.add("button", undefined, "增加 20 秒");
    addTimeButton.size = [(buttonWidth/2)-2, 25];

    // --- 2. 帧率设置 ---
    var frPanel = mainWindow.add("panel", undefined, "帧率设置 (有选中改选中，没选中改当前)");
    frPanel.orientation = "column";
    frPanel.alignChildren = "left";
    frPanel.preferredSize.width = panelWidth;
    frPanel.maximumSize.width = panelWidth;
    var frInputGroup = frPanel.add("group");
    var frInput = frInputGroup.add("edittext", undefined, "25");
    frInput.size = [buttonWidth, 25]; // 微调宽度以适应标签
    var frPenetrate = frPanel.add("checkbox", undefined, "开启子合成穿透修改");
    var frButton = frPanel.add("button", undefined, "应用帧率修改");
    frButton.size = [buttonWidth, 25];

    // --- 3. 合成尺寸设置 ---
    var sizePanel = mainWindow.add("panel", undefined, "合成尺寸 (有选中改选中，没选中改当前)");
    sizePanel.orientation = "column";
    sizePanel.alignChildren = "left";
    sizePanel.preferredSize.width = panelWidth;
    sizePanel.maximumSize.width = panelWidth;
    var sizeInputGroup = sizePanel.add("group");
    var sizeInput = sizeInputGroup.add("edittext", undefined, "1920 * 1080");
    sizeInput.size = [buttonWidth, 25];
    var sizePenetrate = sizePanel.add("checkbox", undefined, "开启子合成穿透修改");
    var sizeButton = sizePanel.add("button", undefined, "应用尺寸修改");
    sizeButton.size = [buttonWidth, 25];

    // --- 页脚信息 ---
    var footerDivider = mainWindow.add("statictext", undefined, "——————————————————————");
    footerDivider.size = [panelWidth, 10];
    var copyText = mainWindow.add("statictext", undefined, "开源项目，禁止倒卖。");


    // --- 核心逻辑函数 ---

    function forceRefresh(layer) {
        var s = layer.enabled; layer.enabled = !s; layer.enabled = s;
        if (layer.canSetCollapseTransformation || layer.source instanceof CompItem) {
            var o = layer.outPoint; layer.outPoint = o + 0.01; layer.outPoint = o;
        }
    }

    // 递归处理时长的核心函数
    function processDurationRecursive(comp, newDuration, mode, processedComps) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        var oldDur = comp.duration;
        comp.duration = newDuration;
        for (var i = comp.numLayers; i >= 1; i--) {
            var layer = comp.layers[i];
            // 判断是否需要递归：模式1全改；模式2仅改原本对齐尾部的
            var shouldModify = (mode === 1) || (mode === 2 && layer.outPoint >= oldDur - 0.01);
            if (shouldModify) {
                if (layer.source instanceof CompItem) processDurationRecursive(layer.source, newDuration, mode, processedComps);
                layer.outPoint = newDuration;
                forceRefresh(layer);
            }
        }
    }

    function applyFrameRateRecursive(comp, fps, processedComps) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        comp.frameRate = fps;
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layers[i];
            if (layer.source instanceof CompItem) applyFrameRateRecursive(layer.source, fps, processedComps);
        }
    }

    function applySizeRecursive(comp, w, h, processedComps) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        comp.width = w; comp.height = h;
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layers[i];
            if (layer.source instanceof CompItem) applySizeRecursive(layer.source, w, h, processedComps);
        }
    }

    // --- 按钮点击事件 ---

    // 新增功能：增加 20 秒 (已移除弹窗)
    addTimeButton.onClick = function() {
        app.beginUndoGroup("Easy Edit: 增加20秒");
        try {
            var activeComp = app.project.activeItem;
            if (!(activeComp instanceof CompItem)) return;
            var addAmount = 20; // 增加的秒数
            var selectedLayers = activeComp.selectedLayers;
            var mode = radio1.value ? 1 : (radio2.value ? 2 : 3);

            if (selectedLayers.length === 0) {
                // 情况A：无选中，修改当前合成 (支持递归)
                if (mode !== 3) {
                    processDurationRecursive(activeComp, activeComp.duration + addAmount, mode, {});
                } else {
                    activeComp.duration += addAmount;
                }
                // alert removed
            } else {
                // 情况B：有选中，修改选中图层
                var processed = {};
                for (var j = 0; j < selectedLayers.length; j++) {
                    var layer = selectedLayers[j];
                    if (layer.source instanceof CompItem) {
                        var newDur = layer.source.duration + addAmount;
                        if (mode !== 3) processDurationRecursive(layer.source, newDur, mode, processed);
                        else layer.source.duration = newDur;
                    }
                    // 无论是否是合成，出点都后移20秒
                    layer.outPoint += addAmount;
                    forceRefresh(layer);
                }
                // alert removed
            }
        } catch (e) { alert("错误: " + e.toString()); }
        app.endUndoGroup();
    };

    // 原功能：对齐播放头 (+1帧)
    setEndPointButton.onClick = function() {
        app.beginUndoGroup("Easy Edit: 对齐出点");
        try {
            var activeComp = app.project.activeItem;
            if (!(activeComp instanceof CompItem)) return;
            // 逻辑：CTI位置 + 1帧
            var targetTime = activeComp.time + activeComp.frameDuration;
            var selectedLayers = activeComp.selectedLayers;

            if (selectedLayers.length === 0) {
                activeComp.duration = targetTime;
            } else {
                var mode = radio1.value ? 1 : (radio2.value ? 2 : 3);
                var processed = {};
                for (var j = 0; j < selectedLayers.length; j++) {
                    var layer = selectedLayers[j];
                    if (layer.source instanceof CompItem) {
                        var subDur = targetTime - layer.inPoint;
                        if (subDur <= 0) subDur = activeComp.frameDuration;
                        if (mode !== 3) processDurationRecursive(layer.source, subDur, mode, processed);
                        else layer.source.duration = subDur;
                    }
                    layer.outPoint = targetTime;
                    forceRefresh(layer);
                }
            }
        } catch (e) { alert("错误: " + e.toString()); }
        app.endUndoGroup();
    };

    // 帧率修改
    frButton.onClick = function() {
        app.beginUndoGroup("Easy Edit: 修改帧率");
        try {
            var activeComp = app.project.activeItem;
            if (!(activeComp instanceof CompItem)) return;
            var fps = parseInt(frInput.text, 10);
            if (isNaN(fps) || fps <= 0) throw new Error("请输入有效的帧率数值！");
            
            var selectedLayers = activeComp.selectedLayers;
            var processed = {};
            
            if (selectedLayers.length === 0) {
                if (frPenetrate.value) applyFrameRateRecursive(activeComp, fps, processed);
                else activeComp.frameRate = fps;
                alert("已应用至当前活跃合成。");
            } else {
                for (var i = 0; i < selectedLayers.length; i++) {
                    var L = selectedLayers[i];
                    if (L.source instanceof CompItem) {
                        if (frPenetrate.value) applyFrameRateRecursive(L.source, fps, processed);
                        else L.source.frameRate = fps;
                    }
                }
                alert("已应用至选中的图层。");
            }
        } catch (e) { alert("错误: " + e.toString()); }
        app.endUndoGroup();
    };

    // 尺寸修改
    sizeButton.onClick = function() {
        app.beginUndoGroup("Easy Edit: 修改尺寸");
        try {
            var activeComp = app.project.activeItem;
            if (!(activeComp instanceof CompItem)) return;
            var parts = sizeInput.text.split("*");
            var w = parseInt(parts[0]); var h = parseInt(parts[1]);
            if (isNaN(w) || isNaN(h)) throw new Error("格式错误，请使用：宽 * 高");

            var selectedLayers = activeComp.selectedLayers;
            var processed = {};

            if (selectedLayers.length === 0) {
                if (sizePenetrate.value) applySizeRecursive(activeComp, w, h, processed);
                else { activeComp.width = w; activeComp.height = h; }
                alert("已应用至当前活跃合成。");
            } else {
                for (var i = 0; i < selectedLayers.length; i++) {
                    var L = selectedLayers[i];
                    if (L.source instanceof CompItem) {
                        if (sizePenetrate.value) applySizeRecursive(L.source, w, h, processed);
                        else { L.source.width = w; L.source.height = h; }
                    }
                }
                alert("已应用至选中的图层。");
            }
        } catch (e) { alert("错误: " + e.toString()); }
        app.endUndoGroup();
    };

    if (isDockablePanel) { mainWindow.layout.layout(true); } 
    else { mainWindow.center(); mainWindow.show(); }
})(this);