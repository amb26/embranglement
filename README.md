# Embranglements demo

A demonstration of Infusion to implement multilateral proximity-based embranglement (entanglement, co-occurrence).

The proximity of a triple of agents identified by selectors is signalised (in the FRP sense) into a space of "embranglement signals"
which is then transduced into the existence of corresponding embranglement instances bound to the matched reagents.

The signal space of current embranglements is held in the `fluid.embranglement.embranglementArena` which is then
imaged into the existence or nonexistence of corresponding `fluid.embranglement` instances in a more or less portable
way. The code to do this is currently of a stereotypical manual form but will eventually be driven by a dedicated
framework feature.

The space of actual interacting agents, and the particular embranglement engine in operation is encoded in
[arena.js](./js/arena.js). The particular engine implemented, `fluid.embranglement.pairwiseNimbusEmbrangler`,
uses a very simple-minded and highly polynomial exhaustive search algorithm looking for pairwise overlap of a "nimbus" region (see
[Benford and Fahlen, A Spatial Model of Interaction in Large Virtual Environments](https://link.springer.com/chapter/10.1007/978-94-011-2094-4_8) )
surrounding each instance of the categories of agents matching an IoCSS specification. The concept of this implementation
is to demonstrate that actual embranglement engines may be mixed and matched whilst sharing a common substrate
and syntax encoding their products (embranglements) in a shared arena. The encoding of arguments and products of
an engine can be made more or less declarative, especially in conjunction with a "reduced expression parser" as
described in https://issues.fluidproject.org/browse/FLUID-5894.

See also https://github.com/simonbates/co-occurrence-engine/blob/master/src/CoOccurrenceEngine.js for a very similar
concept and implementation.