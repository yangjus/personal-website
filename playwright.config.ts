import { defineConfig, devices } from '@playwright/test';
const baseURL=process.env.PORTFOLIO_BASE_URL??'http://localhost:3000';
export default defineConfig({
  testDir:'./tests',fullyParallel:false,workers:1,
  use:{baseURL,trace:'retain-on-failure'},
  projects:[{name:'chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:960}}}],
  webServer:process.env.PORTFOLIO_BASE_URL?undefined:{command:'npm run start',url:baseURL,reuseExistingServer:!process.env.CI,timeout:60000},
});
