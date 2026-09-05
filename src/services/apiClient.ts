/**
 * HTTP API Client for FastAPI Backend
 * Handles authentication, Bearer tokens, token refresh, base URLs, and connection status
 */

import { AuthTokens, HealthCheckResponse } from '../types/api';

const DEFAULT_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const TOKEN_KEY = 'mplads_access_token';
const REFRESH_KEY = 'mplads_refresh_token';
const BASE_URL_KEY = 'mplads_api_base_url';

export type BackendStatus = 'ONLINE' | 'OFFLINE' | 'CHECKING';

export interface ApiClientConfig {
  baseUrl?: string;
  timeoutMs?: number;
}

class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;
  private status: BackendStatus = 'CHECKING';
  private lastHealthCheck?: HealthCheckResponse;
  private statusListeners: Array<(status: BackendStatus) => void> = [];

  constructor(config?: ApiClientConfig) {
    const savedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem(BASE_URL_KEY) : null;
    this.baseUrl = savedUrl || config?.baseUrl || DEFAULT_API_URL;
    this.timeoutMs = config?.timeoutMs || 8000;
  }

  // Base URL Configuration
  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(BASE_URL_KEY, this.baseUrl);
    }
    this.checkHealth();
  }

  // Auth Token Management
  getAccessToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(REFRESH_KEY);
  }

  setTokens(tokens: AuthTokens) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
    }
  }

  clearTokens() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Status & Health Check
  getStatus(): BackendStatus {
    return this.status;
  }

  getLastHealthCheck(): HealthCheckResponse | undefined {
    return this.lastHealthCheck;
  }

  onStatusChange(listener: (status: BackendStatus) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.status);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  private notifyStatus(status: BackendStatus) {
    this.status = status;
    this.statusListeners.forEach(l => l(status));
  }

  async checkHealth(): Promise<HealthCheckResponse | null> {
    try {
      // Try /api/v1/health first, then /health
      let res: Response;
      try {
        res = await this.fetchWithTimeout(`${this.baseUrl}/api/v1/health`, { method: 'GET' }, 3000);
      } catch {
        res = await this.fetchWithTimeout(`${this.baseUrl}/health`, { method: 'GET' }, 3000);
      }

      if (res.ok) {
        const data = await res.json();
        this.lastHealthCheck = data;
        this.notifyStatus('ONLINE');
        return data;
      } else {
        this.notifyStatus('OFFLINE');
        return null;
      }
    } catch {
      this.notifyStatus('OFFLINE');
      return null;
    }
  }

  // Request Helpers
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = this.timeoutMs): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeout);
      return response;
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };

    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers = this.getHeaders(options.headers as Record<string, string>);

    try {
      const response = await this.fetchWithTimeout(url, {
        ...options,
        headers
      });

      // Handle 401 Unauthorized - Attempt Token Refresh
      if (response.status === 401) {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          // Retry with new token
          const retryHeaders = this.getHeaders(options.headers as Record<string, string>);
          const retryResponse = await this.fetchWithTimeout(url, {
            ...options,
            headers: retryHeaders
          });
          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        }
      }

      if (!response.ok) {
        let errorBody: any;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text();
        }
        const error = new Error(errorBody?.detail || errorBody?.message || `HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).body = errorBody;
        throw error;
      }

      // If status 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error(`API Request to ${endpoint} timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    }
  }

  private async tryRefreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      }, 5000);

      if (res.ok) {
        const tokens: AuthTokens = await res.json();
        this.setTokens(tokens);
        return true;
      }
    } catch {
      // Refresh failed
    }

    this.clearTokens();
    return false;
  }

  // Standard REST methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      const queryString = query.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
