/*
Copyright 2017 Antranig Basman
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/
"use strict";

fluid.defaults("fluid.embranglement.agentTypes.red", {});
fluid.defaults("fluid.embranglement.agentTypes.green", {});
fluid.defaults("fluid.embranglement.agentTypes.blue", {});

fluid.defaults("demo.embrangler", {
    gradeNames: "fluid.embranglement.pairwiseNimbusEmbrangler",
    selectors: {
        red: "fluid.embranglement.agentTypes.red",
        green: "fluid.embranglement.agentTypes.green",
        blue: "fluid.embranglement.agentTypes.blue"
    },
    embranglementRecord: {
        type: "fluid.embranglement.drawableEmbranglement"
    }
});

fluid.construct("demo", {
    type: "fluid.embranglement.demo",
    container: "#flc-embranglement",
    distributeOptions: {
        record: "demo.embrangler",
        target: "{that fluid.embranglement.embrangler}.options.gradeNames"
    }
});


fluid.construct("demo.canvas.redCircle", {
    type: "fluid.embranglement.nimbusCircle",
    gradeNames: "fluid.embranglement.agentTypes.red",
    colour: "#d00",
    components: {
        motion: {
            type: "fluid.embranglement.circularMotion",
            options: {
                cx: 500,
                cy: 300,
                phase: 0,
                omega: 0.9
            }
        }
    }
});

fluid.construct("demo.canvas.greenCircle", {
    type: "fluid.embranglement.nimbusCircle",
    gradeNames: "fluid.embranglement.agentTypes.green",
    colour: "#0d0",
    components: {
        motion: {
            type: "fluid.embranglement.circularMotion",
            options: {
                cx: 400,
                cy: 400,
                phase: 1,
                omega: 1
            }
        }
    }
});

fluid.construct("demo.canvas.blueCircle", {
    type: "fluid.embranglement.nimbusCircle",
    gradeNames: "fluid.embranglement.agentTypes.blue",
    colour: "#00d",
    components: {
        motion: {
            type: "fluid.embranglement.circularMotion",
            options: {
                cx: 300,
                cy: 300,
                omega: 1.1,
                phase: 2
            }
        }
    }
});
