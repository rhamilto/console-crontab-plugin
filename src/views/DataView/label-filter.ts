import * as _ from "lodash";
import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";

// Local implementation to avoid SDK internal dependencies
const labelsToStrings = (labels: Record<string, string> = {}): string[] => {
  return Object.entries(labels).map(([key, value]) =>
    value ? `${key}=${value}` : key
  );
};

export const getLabelsAsString = (
  obj: K8sResourceCommon,
  path = "metadata.labels"
): string[] => {
  const labels = _.get(obj, path);
  return labelsToStrings(labels);
};
