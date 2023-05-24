import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export type CronTabKind = K8sResourceCommon & {
  spec?: {
    cronSpec: string;
    image: string;
    replicas: number;
  };
};
