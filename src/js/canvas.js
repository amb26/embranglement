/*
Copyright 2017 Antranig Basman
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/
"use strict";

fluid.defaults("fluid.embranglement.demo", {
    gradeNames: "fluid.newViewComponent",
    selectors: {
        canvas: ".flc-embranglement-canvas"
    },
    components: {
        canvas: {
            type: "fluid.embranglement.canvas",
            options: {
                container: "{demo}.dom.canvas",
                gradeNames: "fluid.embranglement.arena"
            }
        }
    }
});

fluid.defaults("fluid.embranglement.arena", {
    gradeNames: "fluid.component",
    distributeOptions: {
        embranglementInArena: {
            target: "{that fluid.embranglement.embrangler}.options.gradeNames",
            record: "fluid.embranglement.embranglerInArena",
            priority: "last"
        }
    },
    components: {
        embranglementArena: {
            type: "fluid.embranglement.embranglementArena"
        },
        embrangler: { // Abstract definition
            type: "fluid.embranglement.embrangler"
        },
        timer: {
            type: "fluid.embranglement.timer.rAF",
            options: {
                modelListeners: {
                    "": [{
                        func: "{embrangler}.updateEmbranglements",
                        namespace: "updateEmbranglements",
                        priority: "before:refreshView"
                    }, {
                        func: "{canvas}.events.onRefreshView.fire",
                        namespace: "refreshView"
                    }]
                }
            }
        }
    }
});

fluid.defaults("fluid.embranglement.embranglerInArena", {
    // Abstract component, incomplete grade
    listeners: {
        "{drawBuilder}.events.onIndexAdd": {
            namespace: "updateTargets",
            func: "{that}.updateTargets",
            priority: "after:updateIndex"
        },
        "{drawBuilder}.events.onIndexRemove": {
            namespace: "updateTargets",
            func: "{that}.updateTargets",
            priority: "after:updateIndex"
        }
    },
    components: {
        embranglementArena: "{fluid.embranglement.embranglementArena}",
        sourceArena: "{fluid.embranglement.arena}"
    }
});

fluid.defaults("fluid.embranglement.canvas", {
    // pace souq.graph
    gradeNames: ["fluid.newViewComponent"],
    zoomFac: 1, // unused option to account for mismatch between device and logical pixels
    members: {
        canvasEl: "@expand:fluid.embranglement.canvas.measureCanvas({that}.container.0, {that}.options.zoomFac)",
        context: "@expand:fluid.bind({that}.canvasEl, getContext, 2d)",
        width: "{that}.canvasEl.width",
        height: "{that}.canvasEl.height",
        margin: "{that}.options.baseMargin"
    },
    invokers: {
        clear: "fluid.embranglement.canvas.clear({that}, {that}.context)",
        rectifyContext: "fluid.embranglement.canvas.rectifyContext({arguments}.0, {that}.height)"
    },
    events: {
        onRefreshView: null
    },
    listeners: {
        "onCreate.clear": "{that}.clear",
        "onCreate.rectifyContext": "{that}.rectifyContext({that}.context)",
        "onRefreshView.clear": "{that}.clear",
        "onRefreshView.drawDrawables": {
            priority: "after:clear",
            funcName: "fluid.embranglement.drawDrawables",
            args: ["{that}.drawBuilder.drawables"]
        },
        "onRefreshView.drawEmbranglements": { // TODO: first gear signal to components
            priority: "after:drawDrawables",
            funcName: "fluid.identity",
            args: ["{that}.embrangler.targetIndex"]
        }
    },
    components: {
        drawBuilder: {
            type: "fluid.embranglement.drawBuilder"
        }
    },
    backgroundColour: "black",
    foregroundColour: "#ddd",
    font:    "14px sans-serif",
    baseMargin: "@expand:fluid.embranglement.canvas.expandMargin({that}.options.margin)",
    margin: {left: 20, right: 20, bottom: 20, top: 20}
});



fluid.embranglement.canvas.measureCanvas = function (element, zoomFac) {
    if (!element.getAttribute("width")) {
        element.width = element.offsetWidth * zoomFac;
    }
    if (!element.getAttribute("height")) {
        element.height = element.offsetHeight * zoomFac;
    }
    return element;
};


fluid.embranglement.canvas.clear = function (that, context) {
    context.fillStyle = that.options.backgroundColour;
    context.fillRect(0, 0, that.width, that.height);
};

fluid.embranglement.canvas.rectifyContext = function (context, height) {
    context.translate(0, height);
    context.scale(1, -1);
};

fluid.embranglement.canvas.expandMargin = function (m) {
    return typeof(m) === "number" ?
        { x: {min: m, max: m}, y: {min: m, max: m} }
        : {x: {min: m.left, max: m.right}, y: {min: m.bottom, max: m.top} };
};

fluid.defaults("fluid.embranglement.drawBuilder", {
    gradeNames: "fluid.component",
    members: {
        drawables: {}
    },
    events: {
        onIndexAdd: null,
        onIndexRemove: null
    },
    listeners: {
        "onIndexAdd.updateIndex": "fluid.embranglement.indexedDynamicComponent.onIndexAdd({arguments}.0, {that}.drawables)",
        "onIndexRemove.updateIndex": "fluid.embranglement.indexedDynamicComponent.onIndexRemove({arguments}.0, {that}.drawables)"
    },
    distributeOptions: {
        // TODO: Note that since an embranglement is a drawable, it will incur one extra round of self-reaction
        // (hopefully a no-op) as it is created and destroyed
        target: "{fluid.embranglement.arena fluid.embranglement.drawable}.options",
        record: {
            gradeNames: "fluid.embranglement.indexedDynamicComponent",
            dynamicComponentIndex: "{drawBuilder}"
        }
    }
});

fluid.defaults("fluid.embranglement.indexedDynamicComponent", {
    mergePolicy: { // Obviously this will be replaced by a FLUID-XXXX scheme
        dynamicComponentIndex: "noexpand"
    },
    listeners: {
        "onCreate.indexComponent": {
            func: "{{that}.options.dynamicComponentIndex}.events.onIndexAdd",
            args: "{that}"
        },
        "onDestroy.indexComponent": {
            func: "{{that}.options.dynamicComponentIndex}.events.onIndexRemove",
            args: "{that}"
        }
    }
});

fluid.embranglement.indexedDynamicComponent.onIndexAdd = function (that, index) {
    index[that.id] = that;
};

fluid.embranglement.indexedDynamicComponent.onIndexRemove = function (that, index) {
    delete index[that.id];
};

fluid.embranglement.drawDrawables = function (drawables) {
    fluid.each(drawables, function (drawable) {
        drawable.draw();
    });
};
