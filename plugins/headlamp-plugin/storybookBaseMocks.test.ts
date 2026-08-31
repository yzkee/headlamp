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

import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import { baseMocks, fallbackMocks } from './config/.storybook/baseMocks';

const server = setupServer();
const appsWorkloads = [
  { url: 'http://localhost:4466/apis/apps/v1/daemonsets', kind: 'DaemonSetList' },
  { url: 'http://localhost:4466/apis/apps/v1/deployments', kind: 'DeploymentList' },
  { url: 'http://localhost:4466/apis/apps/v1/replicasets', kind: 'ReplicaSetList' },
  { url: 'http://localhost:4466/apis/apps/v1/statefulsets', kind: 'StatefulSetList' },
];
const batchWorkloads = [
  { url: 'http://localhost:4466/apis/batch/v1/cronjobs', kind: 'CronJobList' },
  { url: 'http://localhost:4466/apis/batch/v1/jobs', kind: 'JobList' },
];

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Keep this executable contract in the plugin package, where its MSW and Vite
// dependencies are installed. It catches fallback handlers accidentally moving
// into baseMocks and verifies that each URL returns its matching Kubernetes kind.
test.each([
  ['apps', appsWorkloads],
  ['batch', batchWorkloads],
])('returns %s workload lists from plugin-template fallbacks', async (apiGroup, workloads) => {
  const basePaths = baseMocks.map(handler => String(handler.info.path));
  const fallbackPaths = fallbackMocks.map(handler => String(handler.info.path));
  server.use(...fallbackMocks);

  for (const workload of workloads) {
    expect(basePaths).not.toContain(workload.url);
    expect(fallbackPaths).toContain(workload.url);

    const response = await fetch(workload.url);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      kind: workload.kind,
      apiVersion: `${apiGroup}/v1`,
      metadata: {},
      items: [],
    });
  }
});
