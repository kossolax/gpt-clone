export interface ChatInput {
  role: "system" | "user" | "assistant";
  content: string;
}
interface Node {
  log: ChatInput;

  parent: Node|null;
  children: Node[];
}

export class ChatHistory {
  title: string|null = null;
  date: Date|null = null;
  private root: Node|null = null;
  private currentBranch: Node|null = null;

  constructor() {
    this.date = new Date();
  }

  get log(): ChatInput[] {
    const log: ChatInput[] = [];
    let node: Node|null = this.currentBranch;
    while( node !== null ) {
      log.unshift( node.log );
      node = node.parent;
    }
    return log;
  }
  get nodes(): Node[] {
    const nodes: Node[] = [];
    let node: Node|null = this.currentBranch;
    while( node !== null ) {
      nodes.unshift( node );
      node = node.parent;
    }
    return nodes;
  }

  branchIndex(messageIndex: number): number {
    const currentNode = this.nodes[messageIndex];

    if (currentNode.parent === null)
      return 0;

    const siblings = currentNode.parent.children;
    const currentNodeIndex = siblings.indexOf(currentNode);

    return currentNodeIndex;
  }

  branchCount(messageIndex: number): number {
    const currentNode = this.nodes[messageIndex];

    if (currentNode.parent === null)
      return 0;

    const siblings = currentNode.parent.children;
    return siblings.length;
  }

  addMessage(message: ChatInput): void {
    if( this.currentBranch === null ) {
      this.currentBranch = {
        log: message,
        parent: null,
        children: []
      };
      this.root = this.currentBranch;
    }
    else {
      const newNode: Node = {
        log: message,
        parent: this.currentBranch,
        children: []
      };

      this.currentBranch.children.push(newNode);
      this.currentBranch = newNode;
    }

  }

  fork(messageIndex: number): void {
    const currentNode = this.nodes[messageIndex];

    if (currentNode.parent === null)
      throw new Error("Root node has no siblings.");

    const siblings = currentNode.parent.children;
    const newNode = {
      log: {
        role: currentNode.log.role,
        content: currentNode.log.content
      },
      parent: currentNode.parent,
      children: []
    };
    siblings.push(newNode);
    this.currentBranch = newNode;
  }

  next(messageIndex: number): void {
    const currentNode = this.nodes[messageIndex];

    if (currentNode.parent === null)
      throw new Error("Root node has no siblings.");

    const siblings = currentNode.parent.children;
    const currentNodeIndex = siblings.indexOf(currentNode);

    if (currentNodeIndex === siblings.length - 1)
      throw new Error("Current node is the last sibling. No next sibling available.");

    const nextSibling = siblings[currentNodeIndex + 1];

    let bottomNode = nextSibling;
    while (bottomNode.children.length > 0) {
      bottomNode = bottomNode.children[0];
    }

    this.currentBranch = bottomNode;
  }

  previous(messageIndex: number): void {
    const currentNode = this.nodes[messageIndex];

    if (currentNode.parent === null)
      throw new Error("Root node has no siblings.");

    const siblings = currentNode.parent.children;
    const currentNodeIndex = siblings.indexOf(currentNode);

    if (currentNodeIndex === 0)
      throw new Error("Current node is the first sibling. No previous sibling available.");

    const previousSibling = siblings[currentNodeIndex - 1];
    let bottomNode = previousSibling;
    while (bottomNode.children.length > 0) {
      bottomNode = bottomNode.children[bottomNode.children.length - 1];
    }

    this.currentBranch = bottomNode;
  }

  serialize(): string {
    return JSON.stringify(this, (key: string, value: any) => {
      if (key === 'parent')
        return undefined;
      return value;
    });
  }
  static deserialize(serialized: string): ChatHistory {
    function restoreParents(node: Node, parent: Node | null): void {
      node.parent = parent;

      for (const child of node.children)
        restoreParents(child, node);
    }

    const history = new ChatHistory();
    const json = JSON.parse(serialized);
    history.title = json.title;
    history.date = new Date(json.date);
    history.root = json.root;

    if (history.root) {
      restoreParents(history.root, null);

      history.currentBranch = history.root;
      while (history.currentBranch.children.length > 0)
        history.currentBranch = history.currentBranch.children[0];
    }

    return history;
  }
}
