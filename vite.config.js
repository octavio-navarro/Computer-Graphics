import { defineConfig } from "vite";
import 'dotenv/config'

export default defineConfig({
    server: {
        port: process.env.PORT || 5000
    }
})