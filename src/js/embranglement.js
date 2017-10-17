/*
Copyright 2017 Antranig Basman
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/
"use strict";

fluid.defaults("fluid.embranglement", {
    gradeNames: "fluid.component",
    listeners: {
        "onCreate.mountReagents": {
            funcName: "fluid.embranglement.mountReagents",
            args: "{that}",
            priority: "first"
        },
        "onCreate.updateIndex": "fluid.embranglement.updateEmbranglementIndex({that}, {embranglementArena}, true)",
        "onDestroy.updateIndex": "fluid.embranglement.updateEmbranglementIndex({that}, {embranglementArena}, false)"
    },
    embranglementElements: {} // map of selector names to ids of bound components
});

fluid.embranglement.mountReagents = function (that) {
    fluid.each(that.options.embranglementElements, function (id, key) {
        var component = fluid.embranglement.idToComponent(id);
        fluid.globalInstantiator.recordKnownComponent(that, component, key, false);
    });
};

fluid.embranglement.updateEmbranglementIndex = function (embranglement, embranglementArena, isCreate) {
    var path = fluid.pathForComponent(embranglement);
    var memberName = path[path.length - 1], key = embranglement.options.embranglementKey;
    if (isCreate) {
        embranglementArena.keyToMemberName[key] = memberName;
    } else {
        delete embranglementArena.keyToMemberName[key];
    }
};


fluid.defaults("fluid.embranglement.drawableEmbranglement", {
    gradeNames: ["fluid.embranglement", "fluid.embranglement.drawable"],
    invokers: {
        draw: "fluid.embranglement.drawableEmbranglement.draw({canvas}, {that})"
    },
    colour: "#aaa"
});

fluid.embranglement.transforms = {
    identity: [1, 0, 0, 1, 0, 0],
    invert: [1, 0, 0, -1, 0, 0]
};

fluid.embranglement.drawText = function (context, height, text, x, y, transform) {
    transform = transform || fluid.embranglement.transforms.identity;
    context.save();
    context.setTransform.apply(context, transform);
    context.fillText(text, x, height - y);
    context.restore();
};

fluid.embranglement.centroid = function (points) {
    var x = 0, y = 0;
    for (var i = 0; i < points.length; ++i) {
        x += points[i].x; y += points[i].y;
    };
    return {
        x: x / points.length,
        y: y / points.length
    };
};

fluid.embranglement.drawableEmbranglement.draw = function (canvas, that) {
    var context = canvas.context;
    context.save();
    context.strokeStyle = context.fillStyle = fluid.colour.hexToRGBA(that.options.colour);
    context.beginPath();
    var keys = fluid.keys(that.options.embranglementElements);
    var models = fluid.transform(keys, function (key) {
        return that[key].model;
    });
    context.moveTo(models[0].x, models[0].y);
    for (var i = 1; i < keys.length; ++i) {
        context.lineTo(models[i].x, models[i].y);
    }
    context.closePath();
    context.lineWidth = 2;
    context.stroke();
    var centroid = fluid.embranglement.centroid(models);
    context.textAlign = "center";
    context.font = "15px Arial";
    fluid.embranglement.drawText(context, canvas.height, "Embranglement id " + that.id, centroid.x, centroid.y);
    context.restore();
};

fluid.defaults("fluid.embranglement.embranglementArena", {
    gradeNames: "fluid.modelComponent",
    members: {
        keyToMemberName: {}
    },
    events: {
        createEmbranglement: null
    },
    dynamicComponents: {
        embranglements: {
            createOnEvent: "createEmbranglement",
            type: "{arguments}.0.type",
            options: "{arguments}.0.options"
        }
    },
    modelListeners: {
        "*": "fluid.embranglement.updateEmbranglement({that}, {change})"
    }
});

fluid.embranglement.updateEmbranglement = function (that, change) {
    if (change.value) {
        var totalOptions = fluid.freezeRecursive($.extend(true, {}, change.value.record, {
            options: {
                embranglementKey: change.path
            }
        }));
        that.events.createEmbranglement.fire(totalOptions);
        fluid.log("Embranglement CREATED with key ", change.path, " value ", change.value);
    } else {
        that[that.keyToMemberName[change.path]].destroy();
        fluid.log("Embranglement DESTROYED with key ", change.path);
    }
};

fluid.defaults("fluid.embranglement.embrangler", {
    gradeNames: "fluid.modelComponent",
    members: {
        targetIndex: []
    },
    selectors: {
    },
    // Any material output here forms the construction record of the embranglement
    embranglementRecord: {
    },
    components: {
        embranglementArena: "fluid.mustBeOverridden",
        sourceArena: "fluid.mustBeOverridden"
    },
    invokers: {
        outputEmbranglement: {
            funcName: "fluid.embranglement.outputEmbranglement"
        },
        updateTargets: {
            funcName: "fluid.notImplemented"
        },
        updateEmbranglements: {
            funcName: "fluid.notImplemented"
        }
    }
});

fluid.defaults("fluid.embranglement.pairwiseNimbusEmbrangler", {
    gradeNames: "fluid.embranglement.embrangler",
    invokers: {
        updateTargets: "fluid.embranglement.pairwiseNimbusEmbrangler.updateTargets({that})",
        updateEmbranglements: "fluid.embranglement.pairwiseNimbusEmbrangler.updateEmbranglements({that})"
    }
});

fluid.embranglement.pairwiseNimbusEmbrangler.updateTargets = function (that) {
    that.targetIndex = [];
    var index = 0;
    fluid.each(that.options.selectors, function (selector, name) {
        var targets = fluid.queryIoCSelector(that.sourceArena, selector);
        that.targetIndex[index++] = {
            name: name,
            targets: targets
        };
    });
};

fluid.embranglement.nimbusIntersect = function (nimbused1, nimbused2) {
    // Simplistic implementation assuming matched nimbus radii and circular profile
    var m1 = nimbused1.model, m2 = nimbused2.model;
    return Math.sqrt((m1.x - m2.x) * (m1.x - m2.x) + (m1.y - m2.y) * (m1.y - m2.y)) <= (m1.nimbusRadius + m2.radius);
};

fluid.embranglement.pairwiseNimbusEmbrangler.bumpIndices = function (targetIndex, indices) {
    for (var b = 0; b < indices.length; ++b) {
        ++indices[b];
        if (indices[b] === targetIndex[b].targets.length) {
            indices[b] = 0;
        } else {
            return true;
        }
    }
    return false;
};

fluid.embranglement.idToComponent = function (id) {
    return fluid.globalInstantiator.idToShadow[id].that;
};

fluid.embranglement.elementsToRecord = function (embranglementRecord, embranglementElements) {
//    var components = fluid.transform(embranglementElements, function (id) {
//        return "@expand:fluid.embranglement.idToComponent(" + id + ")";
//    });
    return $.extend(true, embranglementRecord, {
        options: {
            embranglementElements: embranglementElements
// This cannot function because of FLUID-XXXX
//            components: components
        }
    });
};

fluid.embranglement.outputEmbranglement = function (embranglementRecord, trans, indices, targetIndex) {
    var targets = fluid.transform(indices, function (index, i) {
        return targetIndex[i].targets[index];
    });
    var ids = fluid.getMembers(targets, "id");
    var embranglementKey = ids.sort().join("|");
    var embranglementElements = {};
    fluid.each(targetIndex, function (indexEl, i) {
        embranglementElements[indexEl.name] = targets[i].id;
    });
    trans.change(embranglementKey, {
        record: fluid.embranglement.elementsToRecord(embranglementRecord, embranglementElements)
    });
};

fluid.embranglement.pairwiseNimbusEmbrangler.updateEmbranglements = function (that) {
    if (that.targetIndex.length === 0 || fluid.find(that.targetIndex, function (indexEl) {
        return indexEl.targets.length === 0 ? true : undefined;
    })) {
        return;
    } else {
        var indices = fluid.generate(that.targetIndex.length, 0);
        var trans = that.embranglementArena.applier.initiate();
        trans.change("", null, "DELETE");
        do {
            var intersections = 0;
            for (var a = 0; a < indices.length; ++a) {
                var b = (a + 1) % indices.length;
                intersections += fluid.embranglement.nimbusIntersect(that.targetIndex[a].targets[indices[a]],
                    that.targetIndex[b].targets[indices[b]]) ? 1 : 0;
            }
            if (intersections === indices.length) {
                that.outputEmbranglement(that.options.embranglementRecord, trans, indices, that.targetIndex);
            }
        } while (fluid.embranglement.pairwiseNimbusEmbrangler.bumpIndices(that.targetIndex, indices));
        trans.commit();
    }
};
