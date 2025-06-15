
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.celiacotablebooking',
  appName: 'celiaco-table-booking',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://71710b01-68d9-4c5a-a163-a996ee7cd6f4.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;
