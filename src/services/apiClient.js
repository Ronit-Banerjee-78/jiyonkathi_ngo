/**
 * Base HTTP API Client
 * Clean Architecture Layer: Service / Infrastructure
 */

export const apiClient = {
  async get(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API GET Error] ${url}:`, error);
      throw error;
    }
  },

  async post(url, body) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API POST Error] ${url}:`, error);
      throw error;
    }
  },
};
