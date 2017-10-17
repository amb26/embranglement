/*
Copyright 2017 Antranig Basman
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/
"use strict";

fluid.defaults("fluid.embranglement.nimbusCircle", {
    gradeNames: "fluid.embranglement.agent",
    model: {
        x: 0,
        y: 0,
        radius: 75,
        nimbusRadius: 150
    },
    drawAlpha: 0.5,
    nimbusAlpha: 0.2,
    invokers: {
        draw: "fluid.embranglement.nimbusCircle.draw({canvas}.context, {that})"
    },
    colour: "#00d"
});

fluid.drawCircle = function (context, x, y, r, hollow) {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.closePath();
    context[hollow ? "stroke" : "fill"] ();
};

fluid.embranglement.nimbusCircle.draw = function (context, that) {
    context.save();
    context.globalAlpha = that.options.nimbusAlpha;
    context.globalCompositeOperation = "lighter";
    context.fillStyle = fluid.colour.hexToRGBA(that.options.colour);
    fluid.drawCircle(context, that.model.x, that.model.y, that.model.nimbusRadius);
    context.globalAlpha = that.options.drawAlpha;
    fluid.drawCircle(context, that.model.x, that.model.y, that.model.radius);
    context.restore();
};

fluid.defaults("fluid.embranglement.circularMotion", {
    gradeNames: "fluid.modelComponent",
    cx: 0,
    cy: 0,
    radius: 100,
    phase: 0,
    omega: 1,
    components: {
        source: "{fluid.embranglement.timer}",
        target: "{fluid.embranglement.drawable}"
    },
    modelRelay: {
        motionCoupling: {
            target: "{that}.target.model",
            singleTransform: {
                type: "fluid.transforms.free",
                func: "fluid.embranglement.circularMotion.compute",
                args: ["{circularMotion}.options", "{that}.source.model.time"]
            }
        }
    }
});

fluid.embranglement.circularMotion.compute = function (options, time) {
    var phase = time * options.omega / 1000 + options.phase;
    return {
        x: options.cx + options.radius * Math.cos(phase),
        y: options.cy + options.radius * Math.sin(phase)
    };
};
