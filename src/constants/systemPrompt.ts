export const OFFICIAL_SYSTEM_PROMPT = `Role & Objective: You are an elite Motion Graphics Technical Director and Senior Adobe After Effects Scripter. Your job is to act as the core intelligence for an all-in-one After Effects assistant plugin. You generate clean, optimized, and error-free ExtendScript (JSX) code, expressions, and workflow automation scripts tailored specifically for motion designers.

Core Capabilities You Provide:
1. Expression Generation: Write robust expressions for looping (loopOut()), easing, inertial bounce, wiggle dampening, dynamic text counting, auto-sizing bounding boxes (sourceRectAtTime), and parent-child linking.
2. Automated Layouts & Rigging: Create scripts that instantly auto-rig shapes, generate grid layouts, set up kinetic typography controllers, or build lower-third templates from scratch.
3. Timeline & Layer Management: Code utilities to color-code layers, sequence layers with staggered offsets, rename layers with regex, and manage render queue presets.
4. Math & Geometry Helpers: Solve complex trigonometry or vector math problems for motion paths, radial arrays, and particle-like effects using native shape layers.

Rules for Output:
- When the user asks for an automated tool/action, provide valid ExtendScript (JSX) wrapped in a clean code block that can be executed directly via app.executeCommand() or evaluated via BridgeTalk. Always wrap in an undo group: app.beginUndoGroup("Action"); ... app.endUndoGroup(); and check if an active composition exists.
- When the user asks for property behavior, provide clean, modern After Effects JavaScript Expressions with comments explaining how to hook them up to slider controls.
- Always prioritize performance (avoid heavy loops in expressions where possible) and include error-handling (e.g., checking if a composition is selected before running a script).
- Keep your tone professional, concise, and deeply knowledgeable about After Effects terminology (comp, layer, property group, keyframe interpolation, etc.).`;

export const CEP_EXTENSION_TEMPLATE = {
  manifestXml: `<?xml version="1.0" encoding="UTF-8"?>
<ExtensionManifest Version="7.0" ExtensionBundleId="com.aemaster.mograph.plugin" ExtensionBundleVersion="1.0.0"
    ExtensionBundleName="AE Master TD Assistant" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <ExtensionList>
        <Extension Id="com.aemaster.mograph.plugin.panel" Version="1.0.0" />
    </ExtensionList>
    <ExecutionEnvironment>
        <HostList>
            <Host Name="AFTM" Version="[16.0,99.9]" />
        </HostList>
        <LocaleList>
            <Locale Code="All" />
        </LocaleList>
        <RequiredRuntimeList>
            <RequiredRuntime Name="CSXS" Version="9.0" />
        </RequiredRuntimeList>
    </ExecutionEnvironment>
    <DispatchInfoList>
        <Extension Id="com.aemaster.mograph.plugin.panel">
            <DispatchInfo>
                <Resources>
                    <MainPath>./index.html</MainPath>
                    <ScriptPath>./jsx/hostscript.jsx</ScriptPath>
                </Resources>
                <Lifecycle>
                    <AutoVisible>true</AutoVisible>
                </Lifecycle>
                <UI>
                    <Type>Panel</Type>
                    <Menu>AE Master AI Command Center</Menu>
                    <Geometry>
                        <Size>
                            <Height>650</Height>
                            <Width>420</Width>
                        </Size>
                        <MinSize>
                            <Height>400</Height>
                            <Width>320</Width>
                        </MinSize>
                    </Geometry>
                </UI>
            </DispatchInfo>
        </Extension>
    </DispatchInfoList>
</ExtensionManifest>`,

  hostScriptJsx: `/**
 * AE Master - ExtendScript Host Engine
 * Connects After Effects CEP Panel to AE DOM
 */

function applyExpressionToSelected(propName, expressionStr) {
    app.beginUndoGroup("AE Master: Apply Expression");
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return "ERROR: Please select an active composition.";
        }
        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            return "ERROR: Please select at least one layer.";
        }
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var prop = null;
            if (propName === "Scale") prop = layer.property("ADOBE Transform Group").property("ADOBE Scale");
            else if (propName === "Position") prop = layer.property("ADOBE Transform Group").property("ADOBE Position");
            else if (propName === "Opacity") prop = layer.property("ADOBE Transform Group").property("ADOBE Opacity");
            else if (propName === "Rotation") prop = layer.property("ADOBE Transform Group").property("ADOBE Rotation");
            else if (propName === "Source Text" && layer instanceof TextLayer) prop = layer.property("ADOBE Text Properties").property("ADOBE Text Document");
            
            if (prop && prop.canSetExpression) {
                prop.expression = expressionStr;
            }
        }
        return "SUCCESS: Expression applied to " + selectedLayers.length + " layer(s).";
    } catch (err) {
        return "ERROR: " + err.toString();
    } finally {
        app.endUndoGroup();
    }
}

function executeGeneratedJSX(codeString) {
    app.beginUndoGroup("AE Master: Execute Script");
    try {
        var result = eval(codeString);
        return "SUCCESS: Script executed successfully.";
    } catch (err) {
        return "ERROR: " + err.toString();
    } finally {
        app.endUndoGroup();
    }
}`,

  scriptUiWrapper: `// AE Master - ScriptUI Standalone Palette
// Save this file as "AEMaster.jsx" and put it into:
// Windows: C:\\Program Files\\Adobe\\Adobe After Effects <version>\\Support Files\\Scripts\\ScriptUI Panels
// macOS: /Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels

(function(thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "AE Master Assistant", undefined, {resizeable: true});
        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 8;
        win.margins = 12;

        var title = win.add("statictext", undefined, "AE Master AI Command Center");
        title.graphics.font = ScriptUI.newFont("Tahoma", "Bold", 14);

        var promptGroup = win.add("group");
        promptGroup.orientation = "column";
        promptGroup.alignChildren = ["fill", "top"];

        var inputPrompt = promptGroup.add("edittext", undefined, "Bouncy scale with slider control", {multiline: true});
        inputPrompt.preferredSize.height = 60;

        var btnGroup = win.add("group");
        btnGroup.alignment = ["fill", "top"];
        var btnRun = btnGroup.add("button", undefined, "Generate & Apply");
        var btnOpenWeb = btnGroup.add("button", undefined, "Open Web Center");

        win.layout.layout(true);
        return win;
    }

    var myPanel = buildUI(thisObj);
    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    }
})(this);`
};
