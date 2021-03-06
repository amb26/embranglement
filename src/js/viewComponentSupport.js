/*
Copyright 2017 Antranig Basman
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/
"use strict";

/** A variant of fluid.viewComponent that bypasses the wacky "initView" and variant signature
 * workflow, sourcing instead its "container" from an option of that name, so that this argument
 * can participate in standard ginger resolution. This enables useful results such as a component
 * which can render its own container into the DOM on startup, whilst the container remains immutable.
 */
// Hoisted up from fluid-authoring
fluid.defaults("fluid.newViewComponent", {
    gradeNames: ["fluid.modelComponent"],
    members: {
        // 3rd argument is throwaway to force evaluation of container
        dom: "@expand:fluid.initDomBinder({that}, {that}.options.selectors, {that}.container)",
        container: "@expand:fluid.container({that}.options.container)"
    }
});
