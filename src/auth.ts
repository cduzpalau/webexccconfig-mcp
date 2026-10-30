/**
 * Token providers. The client asks for a token per request, so an OAuth provider that refreshes
 * tokens can replace the static one later without touching the client or the tools.
 *
 * Never log, print or persist the token.
 */

export interface TokenProvider {
  getToken(): Promise<string>;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/** Personal access token read from the WEBEX_TOKEN environment variable. */
export class StaticTokenProvider implements TokenProvider {
  readonly #token: string;

  constructor(token: string) {
    this.#token = token;
  }

  static fromEnv(env: NodeJS.ProcessEnv = process.env): StaticTokenProvider {
    const token = env.WEBEX_TOKEN?.trim();
    if (!token) throw new AuthError("WEBEX_TOKEN is not set: export a Webex access token");
    if (/\s/.test(token) || token.toLowerCase().startsWith("bearer")) {
      throw new AuthError("WEBEX_TOKEN looks malformed: set the bare token, without 'Bearer ' or spaces");
    }
    return new StaticTokenProvider(token);
  }

  async getToken(): Promise<string> {
    return this.#token;
  }

  /** Keeps the token out of accidental JSON.stringify / util.inspect output. */
  toJSON(): string {
    return "[StaticTokenProvider]";
  }

  [Symbol.for("nodejs.util.inspect.custom")](): string {
    return "[StaticTokenProvider]";
  }
}
