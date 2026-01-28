(function(thisObj) { 
    var isDockablePanel = (thisObj instanceof Panel);
    var mainWindow;
    if (isDockablePanel) {
        mainWindow = thisObj;
        mainWindow.text = "Easy Edit v1.2 | 舟午YueMoon |";
    } else {
        mainWindow = new Window("palette", "Easy Edit", undefined, {resizeable: true});
    }

    mainWindow.orientation = "column";
    mainWindow.alignChildren = "left";
    mainWindow.spacing = 10;
    mainWindow.margins = 15;
    var panelWidth = 280; 
    var buttonWidth = panelWidth - 30;
    var blogText = mainWindow.add("statictext", undefined, "Blog: yuemoon.vip   Bilibili: UID223633562");
    blogText.size = [buttonWidth, 15];
    
    // --- 1. DURATION / OUT POINT SECTION ---
    var durationGroup = mainWindow.add("panel", undefined, "Duration / Out Point Control");
    durationGroup.orientation = "column";
    durationGroup.alignChildren = "left";
    durationGroup.preferredSize.width = panelWidth;
    durationGroup.maximumSize.width = panelWidth;
    durationGroup.margins = 10;
    var radio1 = durationGroup.add("radiobutton", undefined, "1. Selected + Sub-comp penetration");
    var radio2 = durationGroup.add("radiobutton", undefined, "2. Layers at end + Penetration");
    var radio3 = durationGroup.add("radiobutton", undefined, "3. Just Active Comp duration only");
    radio1.value = true; 
    var durationBtnGroup = durationGroup.add("group");
    durationBtnGroup.orientation = "row";
    durationBtnGroup.spacing = 5;
    var setEndPointButton = durationBtnGroup.add("button", undefined, "Align to Playhead");
    setEndPointButton.size = [(buttonWidth/2)-2, 25];
    var addTimeButton = durationBtnGroup.add("button", undefined, "Add 20s");
    addTimeButton.size = [(buttonWidth/2)-2, 25];

    // --- 2. FRAME RATE SETTINGS ---
    var frPanel = mainWindow.add("panel", undefined, "Frame Rate (Selected first, If no then Active Comp)");
    frPanel.orientation = "column";
    frPanel.alignChildren = "left";
    frPanel.preferredSize.width = panelWidth;
    frPanel.maximumSize.width = panelWidth;
    frPanel.margins = 10;
    var frInputGroup = frPanel.add("group");
    var frInput = frInputGroup.add("edittext", undefined, "25");
    frInput.size = [buttonWidth, 25];
    var frPenetrate = frPanel.add("checkbox", undefined, "Sub-Comp Penetrate");
    var frButton = frPanel.add("button", undefined, "Apply FPS");
    frButton.size = [buttonWidth, 25];

    // --- 3. COMP SIZE SETTINGS ---
    var sizePanel = mainWindow.add("panel", undefined, "Comp Size (Selected first, If no then Active Comp)");
    sizePanel.orientation = "column";
    sizePanel.alignChildren = "left";
    sizePanel.preferredSize.width = panelWidth;
    sizePanel.maximumSize.width = panelWidth;
    sizePanel.margins = 10;
    var sizeInputGroup = sizePanel.add("group");
    var sizeInput = sizeInputGroup.add("edittext", undefined, "1920 * 1080");
    sizeInput.size = [buttonWidth, 25];
    var sizePenetrate = sizePanel.add("checkbox", undefined, "Sub-Comp Penetrate");
    var sizeButton = sizePanel.add("button", undefined, "Apply Size");
    sizeButton.size = [buttonWidth, 25];

    // --- FOOTER ---
    var footerDivider = mainWindow.add("statictext", undefined, "——————————————————————");
    footerDivider.size = [panelWidth, 10];
    var copyText = mainWindow.add("statictext", undefined, "Open-source, Resale Prohibited.");


    function forceRefresh(layer) {
        var s = layer.enabled; layer.enabled = !s; layer.enabled = s;
        if (layer.canSetCollapseTransformation || layer.source instanceof CompItem) {
            var o = layer.outPoint; layer.outPoint = o + 0.01; layer.outPoint = o;
        }
    }

    function processDurationRecursive(comp, newDuration, mode, processedComps) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        var oldDur = comp.duration;
        comp.duration = newDuration;
        for (var i = comp.numLayers; i >= 1; i--) {
            var layer = comp.layers[i];
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

    // --- BUTTON CLICK EVENTS ---

    // New Function: Add 20 Seconds
    addTimeButton.onClick = function() {
        app.beginUndoGroup("Easy Edit: Add 20s");
        try {
            var activeComp = app.project.activeItem;
            if (!(activeComp instanceof CompItem)) return;
            var addAmount = 20;
            var selectedLayers = activeComp.selectedLayers;
            var mode = radio1.value ? 1 : (radio2.value ? 2 : 3);

            if (selectedLayers.length === 0) {
                // If no selection, apply to active comp (with optional recursive logic)
                if (mode !== 3) {
                    processDurationRecursive(activeComp, activeComp.duration + addAmount, mode, {});
                } else {
                    activeComp.duration += addAmount;
                }
            } else {
                // If layers selected, apply to them
                var processed = {};
                for (var j = 0; j < selectedLayers.length; j++) {
                    var layer = selectedLayers[j];
                    if (layer.source instanceof CompItem) {
                        var newDur = layer.source.duration + addAmount;
                        if (mode !== 3) processDurationRecursive(layer.source, newDur, mode, processed);
                        else layer.source.duration = newDur;
                    }
                    layer.outPoint += addAmount;
                    forceRefresh(layer);
                }
            }
        } catch (e) { alert(e.toString()); }
        app.endUndoGroup();
    };

    setEndPointButton.onClick = function() {
        app.beginUndoGroup("Easy Edit: Align to Playhead + 1 Frame");
        try {
            var activeComp = app.project.activeItem;
            if (!(activeComp instanceof CompItem)) return;
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
        } catch (e) { alert(e.toString()); }
        app.endUndoGroup();
    };

    frButton.onClick = function() {
        app.beginUndoGroup("Easy Edit: Frame Rate");
        try {
            var activeComp = app.project.activeItem;
            if (!(activeComp instanceof CompItem)) return;
            var fps = parseInt(frInput.text, 10);
            if (isNaN(fps) || fps <= 0) throw new Error("Please enter a valid FPS!");
            
            var selectedLayers = activeComp.selectedLayers;
            var processed = {};
            
            if (selectedLayers.length === 0) {
                if (frPenetrate.value) applyFrameRateRecursive(activeComp, fps, processed);
                else activeComp.frameRate = fps;
                alert("Applied to Active Comp.");
            } else {
                for (var i = 0; i < selectedLayers.length; i++) {
                    var L = selectedLayers[i];
                    if (L.source instanceof CompItem) {
                        if (frPenetrate.value) applyFrameRateRecursive(L.source, fps, processed);
                        else L.source.frameRate = fps;
                    }
                }
                alert("Applied to Selected Layers.");
            }
        } catch (e) { alert(e.toString()); }
        app.endUndoGroup();
    };

    sizeButton.onClick = function() {
        app.beginUndoGroup("Easy Edit: Size");
        try {
            var activeComp = app.project.activeItem;
            if (!(activeComp instanceof CompItem)) return;
            var parts = sizeInput.text.split("*");
            var w = parseInt(parts[0]); var h = parseInt(parts[1]);
            if (isNaN(w) || isNaN(h)) throw new Error("Use Width * Height format!");

            var selectedLayers = activeComp.selectedLayers;
            var processed = {};

            if (selectedLayers.length === 0) {
                if (sizePenetrate.value) applySizeRecursive(activeComp, w, h, processed);
                else { activeComp.width = w; activeComp.height = h; }
                alert("Applied to Active Comp.");
            } else {
                for (var i = 0; i < selectedLayers.length; i++) {
                    var L = selectedLayers[i];
                    if (L.source instanceof CompItem) {
                        if (sizePenetrate.value) applySizeRecursive(L.source, w, h, processed);
                        else { L.source.width = w; L.source.height = h; }
                    }
                }
                alert("Applied to Selected Layers.");
            }
        } catch (e) { alert(e.toString()); }
        app.endUndoGroup();
    };

    if (isDockablePanel) { mainWindow.layout.layout(true); } 
    else { mainWindow.center(); mainWindow.show(); }
})(this);
