/*
Copyright 2017 Antranig Basman
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/
"use strict";

fluid.defaults("fluid.embranglement.timer", {
});

fluid.defaults("fluid.embranglement.timer.rAF", {
    gradeNames: ["fluid.modelComponent", "fluid.embranglement.timer"],
    model: {
        time: 0
    },
    events: {
        onUpdate: null
    },
    listeners: {
        "onCreate.startUpdates": {
            func: "{that}.events.onUpdate.fire"
        },
        "onUpdate.updateTime": "fluid.embranglement.timer.rAF.onUpdate({that}, {arguments}.0)"
    }
});

fluid.embranglement.timer.rAF.onUpdate = function (timer, now) {
    if (now) {
        timer.applier.change("time", now);
    }
    window.requestAnimationFrame(timer.events.onUpdate.fire);
};

fluid.embranglement.updateTime = function (applier, path, now) {
    applier.change(path, now);
};
