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

function noww() {
    return Date.now()
}

export class KPULifecycle {
    constructor(ticksPerSecond = 1000) {
        this.cpu = new KPU(0xff + 1)
        this.isRunning = false
        this.ticksPerSecond = ticksPerSecond
        this.reset()
        this.updateSnapshot();
    }
    get secondsPerTick() {
        return 1 / this.ticksPerSecond
    }
    get timesToTick() {
        let now = noww()
        if (!this.startTimestamp) {
            return 0
        }
        let secondsPassed = (now - (this.startTimestamp)) / 1000
        let res = (secondsPassed) * this.ticksPerSecond
        return res
    }
    reset() {
        this.isRunning = false
        this.cpu.reset()
    }

    stop() {
        this.isRunning = false
        this.catchUp()
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
    }

    getSnapshot() {
        if (this.isRunning) {
            this.startTimestamp = noww()
            Vue.nextTick(() => {
                this.updateSnapshot()
            });
            this.startTimestamp = noww()
        }
        return {
            memory: this.cpu.memory.slice(),
            registers: this.cpu.registers.slice()
        }
    }
    updateSnapshot() {
        this.catchUp()
    }
    catchUp() {
        let ttt = this.timesToTick
        for (let i = 0; i < ttt; i++) {
            let res = this.step()
            if (!res) break;
        }
    }
    clearRunning() {
        this.isRunning = false
    }

    step() {
        var pc = this.cpu.registers[Register.PC]
        var instruction = Instruction.build(this.cpu, pc)
        if (!instruction || instruction.op == getOpcode('NOP')) {
            return null
        }
        let opc = this.cpu.registers[Register.PC]
        // this.cpu.setRegister(Register.PC, this.cpu.registers[Register.PC] + instruction.length)
        instruction.execute(this.cpu)
        this.startTimestamp = noww()
        return instruction
    }
}