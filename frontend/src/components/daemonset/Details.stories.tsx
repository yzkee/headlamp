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

import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import Details from './Details';
import { DAEMONSET_DUMMY_DATA, DAEMONSET_NO_TOLERATIONS } from './storyHelper';

const daemonSet = DAEMONSET_DUMMY_DATA[0];
const namespace = daemonSet.metadata.namespace ?? 'gadget';

const emptyList = { kind: 'List', apiVersion: 'v1', metadata: {}, items: [] };

const podMetricsList = {
  kind: 'PodMetricsList',
  apiVersion: 'metrics.k8s.io/v1beta1',
  metadata: {},
  items: [],
};

// DaemonSets are namespaced, so the owned pods, pod metrics, events and
// controller revisions the details view pulls in are all queried under the
// DaemonSet's namespace. The collection path is also handled because the
// details view fires a watch on it in addition to the get-by-name request.
const commonHandlers = [
  http.get(`http://localhost:4466/apis/apps/v1/namespaces/${namespace}/daemonsets`, () =>
    HttpResponse.json(emptyList)
  ),
  http.get(`http://localhost:4466/api/v1/namespaces/${namespace}/pods`, () =>
    HttpResponse.json(emptyList)
  ),
  http.get(`http://localhost:4466/apis/metrics.k8s.io/v1beta1/namespaces/${namespace}/pods`, () =>
    HttpResponse.json(podMetricsList)
  ),
  http.get(`http://localhost:4466/api/v1/namespaces/${namespace}/events`, () =>
    HttpResponse.json(emptyList)
  ),
  http.get(`http://localhost:4466/apis/apps/v1/namespaces/${namespace}/controllerrevisions`, () =>
    HttpResponse.json(emptyList)
  ),
];

export default {
  title: 'daemonset/DaemonSetDetailsView',
  component: Details,
  argTypes: {},
  decorators: [
    Story => (
      <TestContext routerMap={{ namespace, name: 'gadget' }}>
        <Story />
      </TestContext>
    ),
  ],
} as Meta;

const Template: StoryFn = () => <Details />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          `http://localhost:4466/apis/apps/v1/namespaces/${namespace}/daemonsets/gadget`,
          () => HttpResponse.json(daemonSet)
        ),
        ...commonHandlers,
      ],
    },
  },
};

export const NoTolerations = Template.bind({});
NoTolerations.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          `http://localhost:4466/apis/apps/v1/namespaces/${namespace}/daemonsets/gadget`,
          () => HttpResponse.json(DAEMONSET_NO_TOLERATIONS)
        ),
        ...commonHandlers,
      ],
    },
  },
};
