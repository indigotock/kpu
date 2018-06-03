import {
    KPU,
    Register
} from "./kpu.mjs";
import {
    getOpcode,
    Instruction
} from "./instruction.mjs"
import {
    Parser
} from "./parser.mjs";
import {
    Tokenise
} from "./lexer.mjs";

import {
    KPULifecycle
} from "./lifecycle.mjs";

var lifecycle = new KPULifecycle()
console.log(lifecycle.ticksPerMillisecond)
lifecycle.load("add a 1 mov pc 0")
lifecycle.runUntilNop();
setTimeout(function(){
    lifecycle.stop()
    console.log(lifecycle.snapshot)
    process.exit()
},3000)