import { IServerConfig, IApiErrorResponse } from "../types/index.js";

/**
 * A central HTTP Client for making requests to Webex CC APIs.
 */
export class WebexClient {
  private config: IServerConfig;

  constructor(config: IServerConfig) {
    this.config = config;
  }

  /**
   * Helper to ensure basic headers are attached.
   */
  private getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
    return {
      "Authorization": `Bearer ${this.config.webexToken}`,
      "Accept": "application/json",
      ...extraHeaders,
    };
  }

  /**
   * Helper for standardizing error handling.
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: { reason: "Unknown error", message: await response.text() } };
      }
      const apiError = errorData as IApiErrorResponse;
      throw new Error(`Error ${response.status}: ${apiError.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(apiError.error?.message || errorData)}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    try {
      const data = await response.json();
      return data as T;
    } catch {
      return {} as T;
    }
  }

  public async get<T>(path: string, queryParams?: URLSearchParams): Promise<T> {
    const url = `${this.config.baseUrl}${path}${queryParams ? `?${queryParams.toString()}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  public async post<T>(path: string, body: any): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  public async put<T>(path: string, body: any): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  public async delete<T>(path: string): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  public async patch<T>(path: string, body: any): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: this.getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }
  
  public getOrgId(): string {
    return this.config.orgId;
  }
}
