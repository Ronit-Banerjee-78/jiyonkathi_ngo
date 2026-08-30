/**
 * Settings Service
 * Clean Architecture Layer: Service / Domain Data Access
 */

import { apiClient } from "./apiClient";

export const settingsService = {
  async fetchSettings() {
    return apiClient.get("/api/settings");
  },

  async saveSettings(settingsData) {
    return apiClient.post("/api/settings", settingsData);
  },
};
