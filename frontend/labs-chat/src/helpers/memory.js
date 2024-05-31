
export class Memory {
    constructor(verbose = false) {
        this.history = "";
        this.ai_stream = "";
        this.verbose = verbose;
        this.human_prefix = "Human: ";
        this.ai_prefix = "AI: ";
    }

     addHumanMessage (message) {
        // todo: add a limit to the context size
        if (this.verbose) {
            console.log(`Adding human message: ${message}`);
        }
        this.history += this.human_prefix + message + "\n\n";
    }

    addAIMessage = function () {
        // todo: add a limit to the context size
        if (this.verbose) {
            console.log(`Adding AI message: ${this.ai_stream}`);
        }
        this.history += this.ai_prefix + this.ai_stream + "\n\n";
    };

    accumulateAIStream = function (chunk) {
        if (this.verbose) {
            console.log(`Accumulating AI stream: ${chunk}`);
        }
        this.ai_stream += chunk;
    }

    clearAIStream = function () {
        if (this.verbose) {
            console.log(`Clearing AI stream`);
        }
        this.ai_stream = "";
    }

}