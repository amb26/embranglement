/*
Copyright 2017 Antranig Basman
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/
"use strict";

fluid.defaults("fluid.embranglement.agent", {
    gradeNames: ["fluid.embranglement.nimbus", "fluid.embranglement.drawable"]
});

fluid.defaults("fluid.embranglement.nimbus", {
    model: {
        nimbusRadius: 100
    }
});

fluid.defaults("fluid.embranglement.drawable", {
    gradeNames: "fluid.modelComponent",
/*    modelListeners: {
        "": {
            func: "{that}.draw"
        }
    },*/
    invokers: {
        draw: {
            funcName: "fluid.notImplemented"
        }
    }
});
