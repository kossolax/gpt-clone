export interface ChatInput {
  role: "system" | "user" | "assistant";
  content: string;
}
export interface Branch {
  log: ChatInput[];

  forkParentBranchIndex: number | null;
  forkChildsBranchIndex: number[];
}
function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export class ChatHistory {
  private branches: Branch[] = [];
  private currentBranchIndex: number = 0;

  constructor() {
    this.branches.push({
      log: [],
      forkParentBranchIndex: 0,
      forkChildsBranchIndex: [0],
    });
  }

  get log(): ChatInput[] {
    return this.branches[this.currentBranchIndex].log;
  }

  get branchIndex(): number {
    return this.currentBranchIndex;
  }
  get branchCount(): number {
    return this.branches.length;
  }

  addMessage(message: ChatInput): void {
    this.branches[this.currentBranchIndex].log.push(message);
  }

  fork(messageIndex: number): void {
    const currentBranchIndex = this.currentBranchIndex;
    const currentBranch = this.branches[currentBranchIndex];
    const branchToForkIndex = currentBranch.forkParentBranchIndex ?? this.currentBranchIndex;
    const branchToFork = this.branches[branchToForkIndex];

    const newBranch: Branch = {
      log: deepCopy<ChatInput[]>(currentBranch.log.slice(0, messageIndex + 1)),
      forkParentBranchIndex: branchToForkIndex,
      forkChildsBranchIndex: []
    };

    this.branches.push(newBranch);
    this.currentBranchIndex = this.branches.length - 1;
    newBranch.forkChildsBranchIndex.push(this.currentBranchIndex);
    branchToFork.forkChildsBranchIndex.push(this.currentBranchIndex);
  }

  next(messageIndex: number): void {
    console.log(this);
    const currentBranch = this.branches[this.currentBranchIndex];
    if (currentBranch.forkParentBranchIndex !== null) {
      const parentBranch = this.branches[currentBranch.forkParentBranchIndex];
      const nextChildBranchIndexes = parentBranch.forkChildsBranchIndex.filter(
        (childIndex) => childIndex > this.currentBranchIndex
      );
      console.log(nextChildBranchIndexes);

      if (nextChildBranchIndexes.length > 0 ) {
        this.currentBranchIndex = nextChildBranchIndexes[0];
      }
    }
  }

  previous(messageIndex: number): void {
    const currentBranch = this.branches[this.currentBranchIndex];
    if (currentBranch.forkParentBranchIndex !== null) {
      const parentBranch = this.branches[currentBranch.forkParentBranchIndex];
      const nextChildBranchIndexes = parentBranch.forkChildsBranchIndex.filter(
        (childIndex) => childIndex < this.currentBranchIndex
      );
      console.log(nextChildBranchIndexes);

      if (nextChildBranchIndexes.length > 0 ) {
        this.currentBranchIndex = nextChildBranchIndexes[ nextChildBranchIndexes.length - 1];
      }
    }
  }

}
