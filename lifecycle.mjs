import {
    KPU,
    Register
} from "./kpu.mjs"
import {
    Parser
} from './parser.mjs';
import {
    Tokenise
} from "./lexer.mjs";
import {
    Instruction,
    getOpcode
} from "./instruction.mjs";

function noww(){
    return Date.now()
}

export class KPULifecycle {
    constructor(hertz = 1000) {
        this.cpu = new KPU(0xff + 1)
        this.isRunning = false
        this.hertz = hertz
        this.reset()

    }
    get secondsPerTick() {
        return 1 / this.hertz
    }
    get ticksPerSecond() {
        return (this.hertz)
    }
    get timesToTick() {
        let now = noww()
        if (!this.startTimestamp) {
            return 0
        }
        let secondsPassed = (now - (this.startTimestamp))/1000
        let res = (secondsPassed) * this.ticksPerSecond
        return res
    }
    reset() {
        this.isRunning = false
        this.cpu.reset()
    }

    stop() {
        this.isRunning = false
        for (let i = 0; i < this.timesToTick; i++) {
            let res = this.step()
            if (!res) break;
        }
        this.startTimestamp = noww()
    }

    load(code) {
        let parser = new Parser(this.cpu)
        let excluded = ['Whitespace', 'NewLine']
        let tokens = Tokenise(code).filter(e => excluded.indexOf(e.type) == -1)
        let res = parser.parse(tokens)
        let position = 0
        res.result.forEach(lexeme => {
            lexeme.write(this.cpu, position);
            position += lexeme.length;
        });
    }

    runUntilNop() {
        this.isRunning = true
        this.startTimestamp = noww()
        // let executed;
        // let interval;

        // function tick() {
        //     if (this.isRunning == false) {
        //         clearInterval(interval)
        //         return
        //     }
        //     executed = this.step()
        //     if (executed = null) {
        //         this.clearRunning()
        //     }
        // }


        // interval = setInterval(tick.bind(this), 1 / (HERTZ / 1000))
    }

    get snapshot() {
        return {
            memory: this.cpu.memory,
            registers: this.cpu.registers
        }
    }
    clearRunning() {
        this.isRunning = false
    }

    step() {
        var pc = this.cpu.registers[Register.PC]
        var instruction = Instruction.build(this.cpu, pc)
        if (!instruction || instruction.op == getOpcode('NOP')) {
            debugger
            return null
        }
        debugger
        let opc = this.cpu.registers[Register.PC]
        // this.cpu.setRegister(Register.PC, this.cpu.registers[Register.PC] + instruction.length)
        instruction.execute(this.cpu)
        return instruction
    }
}