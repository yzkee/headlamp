/*
 * Copyright 2026 The Kubernetes Authors
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

import { expect, test } from '@playwright/test';
import { HeadlampPage } from './headlampPage';

const appsWorkloads = [
  {
    resource: 'daemonsets',
    kind: 'DaemonSet',
    name: 'logging-agent',
    title: /DaemonSets/,
  },
  {
    resource: 'deployments',
    kind: 'Deployment',
    name: 'web-server',
    title: /Deployments/,
  },
  {
    resource: 'replicasets',
    kind: 'ReplicaSet',
    name: 'web-server-replica',
    title: /ReplicaSets/,
  },
  {
    resource: 'statefulsets',
    kind: 'StatefulSet',
    name: 'database',
    title: /StatefulSets/,
  },
];

test('loads apps workload list pages', async ({ page }) => {
  const requestedResources = new Set<string>();

  for (const workload of appsWorkloads) {
    const collectionUrl = new RegExp(`/clusters/test/apis/apps/v1/${workload.resource}(?:\\?.*)?$`);
    await page.route(collectionUrl, async route => {
      requestedResources.add(workload.resource);
      await route.fulfill({
        json: {
          apiVersion: 'apps/v1',
          kind: `${workload.kind}List`,
          metadata: { resourceVersion: '1' },
          items: [
            {
              apiVersion: 'apps/v1',
              kind: workload.kind,
              metadata: {
                name: workload.name,
                namespace: 'default',
                resourceVersion: '1',
                creationTimestamp: '2026-01-01T00:00:00Z',
                uid: `${workload.resource}-uid`,
              },
              spec: { replicas: 1 },
              status: {
                desiredNumberScheduled: 1,
                numberReady: 1,
                readyReplicas: 1,
                replicas: 1,
              },
            },
          ],
        },
      });
    });
  }

  const headlampPage = new HeadlampPage(page);
  await headlampPage.navigateToCluster('test', process.env.HEADLAMP_TEST_TOKEN);

  for (const workload of appsWorkloads) {
    await headlampPage.navigateTopage(`/c/test/${workload.resource}`, workload.title);
    await expect.poll(() => requestedResources.has(workload.resource)).toBe(true);
    await expect(page.getByRole('link', { name: workload.name, exact: true })).toBeVisible();
  }
});
