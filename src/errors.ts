/** Short, actionable errors shown to the model as tool errors. */
export class ToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToolError";
  }
}
