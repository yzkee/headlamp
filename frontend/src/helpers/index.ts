import { loadClusterSettings, storeClusterSettings } from './clusterSettings';
import { getBaseUrl } from './getBaseUrl';
import { getHeadlampAPIHeaders } from './getHeadlampAPIHeaders';
import { isDevMode } from './isDevMode';
import { isDockerDesktop } from './isDockerDesktop';
import { isElectron } from './isElectron';
import { getRecentClusters, setRecentCluster } from './recentClusters';
import { getTablesRowsPerPage, setTablesRowsPerPage } from './tablesRowsPerPage';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    clusterConfigFetchHandler: number;
  }
}

/**
 * @returns the 'VERSION' of the app and the 'GIT_VERSION' of the app.
 */
function getVersion() {
  return {
    VERSION: import.meta.env.REACT_APP_HEADLAMP_VERSION,
    GIT_VERSION: import.meta.env.REACT_APP_HEADLAMP_GIT_VERSION,
  };
}

/**
 * @returns the product name of the app, or undefined if it's not set.
 */
function getProductName(): string | undefined {
  return import.meta.env.REACT_APP_HEADLAMP_PRODUCT_NAME;
}

const exportFunctions = {
  getBaseUrl,
  isDevMode,
  isElectron,
  isDockerDesktop,
  setRecentCluster,
  getRecentClusters,
  getTablesRowsPerPage,
  setTablesRowsPerPage,
  getVersion,
  getProductName,
  storeClusterSettings,
  loadClusterSettings,
  getHeadlampAPIHeaders,
};

export default exportFunctions;
