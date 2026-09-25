import { getAuthToken } from "../utils/session.js";

function getAuthHeaders(customHeaders = {}) {
  const headers = { ...customHeaders };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const apiClient = {
  async get(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: getAuthHeaders(options.headers),
      });
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`[API GET Error] ${url}:`, error);
      throw error;
    }
  },

  async post(url, body, options = {}) {
    try {
      const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
      const headers = getAuthHeaders(
        isFormData ? options.headers : { "Content-Type": "application/json", ...options.headers }
      );

      const response = await fetch(url, {
        method: "POST",
        ...options,
        headers,
        body: isFormData ? body : JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`[API POST Error] ${url}:`, error);
      throw error;
    }
  },

  async put(url, body, options = {}) {
    try {
      const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
      const headers = getAuthHeaders(
        isFormData ? options.headers : { "Content-Type": "application/json", ...options.headers }
      );

      const response = await fetch(url, {
        method: "PUT",
        ...options,
        headers,
        body: isFormData ? body : JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`[API PUT Error] ${url}:`, error);
      throw error;
    }
  },

  async delete(url, options = {}) {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        ...options,
        headers: getAuthHeaders(options.headers),
      });
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`[API DELETE Error] ${url}:`, error);
      throw error;
    }
  },
};
