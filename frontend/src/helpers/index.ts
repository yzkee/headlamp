import { Cluster } from '../lib/k8s/cluster';
import { loadClusterSettings, storeClusterSettings } from './clusterSettings';
import { getAppUrl } from './getAppUrl';
import { getBaseUrl } from './getBaseUrl';
import { getHeadlampAPIHeaders } from './getHeadlampAPIHeaders';
import { isDevMode } from './isDevMode';
import { isDockerDesktop } from './isDockerDesktop';
import { isElectron } from './isElectron';
import { getTablesRowsPerPage, setTablesRowsPerPage } from './tablesRowsPerPage';

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
};

export default exportFunctions;
