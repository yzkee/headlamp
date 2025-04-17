import { Cluster } from '../lib/k8s/cluster';
import { loadClusterSettings, storeClusterSettings } from './clusterSettings';
import { getBaseUrl } from './getBaseUrl';
import { isDevMode } from './isDevMode';
import { isDockerDesktop } from './isDockerDesktop';
import { isElectron } from './isElectron';
import { getTablesRowsPerPage, setTablesRowsPerPage } from './tablesRowsPerPage';

/**
 * @returns URL depending on dev-mode/electron/docker desktop, base-url, and window.location.origin.
 *
 * @example isDevMode | isElectron returns 'http://localhost:4466/'
 * @example isDockerDesktop returns 'http://localhost:64446/'
 * @example base-url set as '/headlamp' returns '/headlamp/'
 * @example isDevMode | isElectron and base-url is set
 *          it returns 'http://localhost:4466/headlamp/'
 * @example returns 'https://headlamp.example.com/'using the window.location.origin of browser
 *
 */
function getAppUrl(): string {
  let url = isDevMode() || isElectron() ? 'http://localhost:4466' : window.location.origin;
  if (isDockerDesktop()) {
    url = 'http://localhost:64446';
  }

  const baseUrl = getBaseUrl();
  url += baseUrl ? baseUrl + '/' : '/';

  return url;
}

declare global {
  interface Window {
    Buffer: typeof Buffer;
    clusterConfigFetchHandler: number;
  }
}

const recentClustersStorageKey = 'recent_clusters';

/**
 * Adds the cluster name to the list of recent clusters in localStorage.
 *
 * @param cluster - the cluster to add to the list of recent clusters. Can be the name, or a Cluster object.
 * @returns void
 */
function setRecentCluster(cluster: string | Cluster) {
  const recentClusters = getRecentClusters();
  const clusterName = typeof cluster === 'string' ? cluster : cluster.name;
  const currentClusters = recentClusters.filter(name => name !== clusterName);
  const newClusters = [clusterName, ...currentClusters].slice(0, 3);
  localStorage.setItem(recentClustersStorageKey, JSON.stringify(newClusters));
}

/**
 * @returns the list of recent clusters from localStorage.
 */
function getRecentClusters() {
  const currentClustersStr = localStorage.getItem(recentClustersStorageKey) || '[]';
  const recentClusters = JSON.parse(currentClustersStr) as string[];

  if (!Array.isArray(recentClusters)) {
    return [];
  }

  return recentClusters;
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

function storeTableSettings(tableId: string, columns: { id?: string; show: boolean }[]) {
  if (!tableId) {
    console.debug('storeTableSettings: tableId is empty!', new Error().stack);
    return;
  }

  const columnsWithIds = columns.map((c, i) => ({ id: i.toString(), ...c }));
  // Delete the entry if there are no settings to store.
  if (columnsWithIds.length === 0) {
    localStorage.removeItem(`table_settings.${tableId}`);
    return;
  }
  localStorage.setItem(`table_settings.${tableId}`, JSON.stringify(columnsWithIds));
}

function loadTableSettings(tableId: string): { id: string; show: boolean }[] {
  if (!tableId) {
    console.debug('loadTableSettings: tableId is empty!', new Error().stack);
    return [];
  }

  const settings = JSON.parse(localStorage.getItem(`table_settings.${tableId}`) || '[]');
  return settings;
}

/**
 * The backend token to use when making API calls from Headlamp when running as an app.
 * The token is requested from the main process via IPC once the renderer is ready,
 * and stored for use in the getHeadlampAPIHeaders function below.
 *
 * The app also sets HEADLAMP_BACKEND_TOKEN in the headlamp-server environment,
 * which the server checks to validate requests containing this same token.
 */
let backendToken: string | null = null;

export function setBackendToken(token: string | null) {
  backendToken = import.meta.env.REACT_APP_HEADLAMP_BACKEND_TOKEN || token;
}

/**
 * Returns headers for making API calls to the headlamp-server backend.
 */
export function getHeadlampAPIHeaders(): { [key: string]: string } {
  if (backendToken === null) {
    return {};
  }

  return {
    'X-HEADLAMP_BACKEND-TOKEN': backendToken,
  };
}

const exportFunctions = {
  getBaseUrl,
  isDevMode,
  getAppUrl,
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
  storeTableSettings,
  loadTableSettings,
};

export default exportFunctions;
