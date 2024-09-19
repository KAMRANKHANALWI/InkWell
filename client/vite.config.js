import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Load environment variables from a .env file if needed
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      // Specify only the variables you need
      REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
      // Add any other variables you want to expose here
    },
  },
});
