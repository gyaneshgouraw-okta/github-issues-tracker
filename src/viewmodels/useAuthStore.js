import { create } from "zustand";
import { persist } from "zustand/middleware";
import githubService from "../services/github-service";

/**
 * Authentication store using Zustand
 * Handles GitHub authentication state and token management
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      /**
       * Set the GitHub token and authenticate the user
       * @param {string} token - GitHub personal access token
       */
      authenticate: async (token) => {
        try {
          set({ isLoading: true, error: null });
          
          // Initialize the GitHub service
          githubService.initialize(token);
          
          // Validate the token
          const user = await githubService.validateToken();
          
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return user;
        } catch (error) {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || "Authentication failed",
          });
          
          throw error;
        }
      },
      
      /**
       * Log out user by clearing authentication state
       */
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      /**
       * Clear any authentication errors
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "github-auth-storage", // Storage key
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

export default useAuthStore;