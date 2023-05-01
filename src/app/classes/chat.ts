export interface SystemUserInput {
  role: "system" | "user";
  content: string;
}

export interface AssistantInput {
  role: "assistant";
  content: string;
  writing: boolean;
}

export type ChatInput = SystemUserInput | AssistantInput;
