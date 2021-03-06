import {
    Instruction,
    getOpcode
} from "./instruction.mjs";
export var Register;
(function (Register) {
    Register[Register["PC"] = 0] = "PC";
    Register[Register["SP"] = 1] = "SP";
    Register[Register["SR"] = 2] = "SR";
    Register[Register["A"] = 3] = "A";
    Register[Register["B"] = 4] = "B";
    Register[Register["IOX"] = 5] = "IOX";
    Register[Register["IOD"] = 6] = "IOD";
})(Register || (Register = {}));


export class KPU {
    constructor(ramSize, wordSize = 16) {
        this.ramSize = ramSize;
        this.wordSize = wordSize;
        this.maxWord = parseInt(new Array(16).fill('1').join(''), 2)
        this.memoryCallbacks = []
        this.registerCallbacks = []
        this.startTimestamp = null
        this.hertz = 1
    }
    setRegister(reg, newvalue) {
        this.registers[reg] = newvalue % this.maxWord
    }
    setMemory(index, newvalue) {
        this.memory[index] = newvalue% this.maxWord
    }
    runUntilNOP(verbosely) {
        this.startTimestamp = performance.now()
        // while (true) {
        //     var pc = this.registers[Register.PC];
        //     var instruction = Instruction.build(this, pc);
        //     if (!instruction || instruction.op == getOpcode('NOP'))
        //         break;
        //     this.registers[Register.PC] += instruction.length;
        //     instruction.execute(this);
        //     if (verbosely) {
        //         this.printOut();
        //     }
        // }
    }
    getRegister(name) {
        return Register[name];
    }
    reset() {
        this.memory = new Array(this.ramSize).fill(0);
        this.registers = new Array(Object.keys(Register).length / 2).fill(0);
        this.setRegister(Register.SP, this.memory.length - 1)
    }
    get maxValue() {
        return Math.pow(2, this.wordSize) - 1;
    }
    printOut() {
        console.log(this.memory.join());
        console.log(this.registers.map((e, i) => Register[i] + ": " + e));
    }
    updateRegisterCallbacks(reg, newvalue, oldvalue) {
        this.registerCallbacks.forEach(cb => cb.bind(this)(reg, newvalue, oldvalue))
    }
    onUpdateRegister(callback) {
        this.registerCallbacks.push(callback)
    }
    updateMemoryCallbacks(index, newvalue, oldvalue) {
        this.memoryCallbacks.forEach(cb => cb.bind(this)(index, newvalue, oldvalue))
    }
    onUpdateMemory(callback) {
        this.memoryCallbacks.push(callback)
    }
}