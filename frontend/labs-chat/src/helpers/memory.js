
export class Memory {
    constructor(verbose = false) {
        this.sessions = {};
        this.history = [];
        this.ai_stream = "";
        this.verbose = verbose;
        this.human_role = "user";
        this.ai_role = "assistant";
    }

     addHumanMessage(message) {
        // todo: add a limit to the context size, plus auto reduce context size
        if (this.verbose) {
            console.log(`Adding human message: ${message}`);
        }
        this.history.push({role: this.human_role, content: message});
    }

    commitAIStream() {
        // todo: add a limit to the context size, plus auto reduce context size
        if (this.verbose) {
            console.log(`Adding AI message: ${this.ai_stream}`);
        }
        this.history.push({role: this.ai_role, content: this.ai_stream});
        // clear the stream upon committing
        this.clearAIStream();
    };

    accumulateAIStream(textDelta) {
        if (this.verbose) {
            console.log(`Accumulating AI stream: ${textDelta}`);
        }
        this.ai_stream += textDelta;
    }

    clearAIStream() {
        if (this.verbose) {
            console.log(`Clearing AI stream`);
        }
        this.ai_stream = "";
    }

}