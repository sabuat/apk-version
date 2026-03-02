import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sabuat.apapacho',
  appName: 'Apapacho',
  webDir: 'out',
  plugins: {
    StatusBar: {
      hidden: true, // <-- ORDEN MILITAR: Ocultar la barra superior
    }
  }
};

export default config;
