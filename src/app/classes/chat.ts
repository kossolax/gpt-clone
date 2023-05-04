export interface ChatInput {
  role: "system" | "user" | "assistant";
  content: string;
}
export interface Branch {
  log: ChatInput[];

  forkedFromBranchIndex: number | null;
  forkedAtMessageIndex : number | null;
  forkedMessageCount: number[];
}

export class ChatHistory {
  private branches: Branch[] = [];
  private currentBranchIndex: number = 0;
  private currentMessageIndex: number = 0;

  constructor() {
    this.branches.push({
      log: [],
      forkedFromBranchIndex: null,
      forkedAtMessageIndex: null,
      forkedMessageCount: [],
    });
  }

  get log(): ChatInput[] {
    return this.branches[this.currentBranchIndex].log;
  }

  addMessage(message: ChatInput): void {
    this.branches[this.currentBranchIndex].log.push(message);
    this.currentMessageIndex++;
  }

  fork(messageIndex: number): void {
    const forkedFromBranchIndex = this.currentBranchIndex;
    const newBranch: Branch = {
      log: this.branches[forkedFromBranchIndex].log.slice(0, messageIndex + 1),
      forkedFromBranchIndex,
      forkedAtMessageIndex: messageIndex,
      forkedMessageCount: [],
    };
    this.branches.push(newBranch);
    this.currentBranchIndex = this.branches.length - 1;
    this.currentMessageIndex = messageIndex;

    if (this.branches[forkedFromBranchIndex].forkedMessageCount[messageIndex] === undefined) {
      this.branches[forkedFromBranchIndex].forkedMessageCount[messageIndex] = 1;
    } else {
      this.branches[forkedFromBranchIndex].forkedMessageCount[messageIndex]++;
    }
  }

  next(messageIndex: number): void {
    const forkedCount = this.branches[this.currentBranchIndex].forkedMessageCount[messageIndex];
    if (forkedCount && this.currentBranchIndex < this.branches.length - 1) {
      this.currentBranchIndex++;
      this.currentMessageIndex = messageIndex;
    }
  }

  previous(messageIndex: number): void {
    const forkedFromBranchIndex = this.branches[this.currentBranchIndex].forkedFromBranchIndex;
    if (forkedFromBranchIndex !== null) {
      this.currentBranchIndex = forkedFromBranchIndex;
      this.currentMessageIndex = messageIndex;
    }
  }

  getCurrentBranchIndex(): number {
    return this.currentBranchIndex;
  }

  getCurrentMessageIndex(): number {
    return this.currentMessageIndex;
  }
}
