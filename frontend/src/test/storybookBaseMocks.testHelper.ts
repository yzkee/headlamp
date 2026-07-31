/*
 * Copyright 2025 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { http } from 'msw';

export const CLUSTER_WIDE_PODS_URL = 'http://localhost:4466/api/v1/pods';
export const NAMESPACED_PODS_URL = 'http://localhost:4466/api/v1/namespaces/default/pods';
/** The apps/v1 workload collection fallbacks maintained by Storybook. */
export const APPS_WORKLOAD_COLLECTION_URLS = [
  'http://localhost:4466/apis/apps/v1/daemonsets',
  'http://localhost:4466/apis/apps/v1/deployments',
  'http://localhost:4466/apis/apps/v1/replicasets',
  'http://localhost:4466/apis/apps/v1/statefulsets',
];
/** The batch/v1 workload collection fallbacks maintained by Storybook. */
export const BATCH_WORKLOAD_COLLECTION_URLS = [
  'http://localhost:4466/apis/batch/v1/cronjobs',
  'http://localhost:4466/apis/batch/v1/jobs',
];

const POD_COLLECTION_PATH = /\/api\/v1(?:\/namespaces\/[^/]+)?\/pods$/;

type HttpHandler = ReturnType<typeof http.get>;

/**
 * Returns the Pod collection URLs handled by a Storybook mock set.
 *
 * @param handlers - Storybook request handlers to inspect.
 * @returns Sorted Pod collection URLs.
 */
export function podCollectionUrls(handlers: HttpHandler[]): string[] {
  return handlers
    .filter(
      handler =>
        handler.info.method === 'GET' && POD_COLLECTION_PATH.test(String(handler.info.path))
    )
    .map(handler => String(handler.info.path))
    .sort();
}

/**
 * Returns workload collection URLs for an API group handled by a Storybook mock set.
 *
 * @param handlers - Storybook request handlers to inspect.
 * @param apiGroup - Kubernetes API group whose v1 collection handlers should be returned.
 * @returns Sorted workload collection URLs.
 */
export function workloadCollectionUrls(handlers: HttpHandler[], apiGroup: string): string[] {
  const collectionPathPrefix = `/apis/${apiGroup}/v1/`;

  return handlers
    .filter(handler => {
      if (handler.info.method !== 'GET') {
        return false;
      }

      const pathname = new URL(String(handler.info.path)).pathname;
      const resourcePath = pathname.slice(collectionPathPrefix.length);
      return pathname.startsWith(collectionPathPrefix) && !resourcePath.includes('/');
    })
    .map(handler => String(handler.info.path))
    .sort();
}
