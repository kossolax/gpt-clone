export interface ChatInput {
  role: "system"|"user"|"assistant";
  content: string;
  writing: bool;
};
