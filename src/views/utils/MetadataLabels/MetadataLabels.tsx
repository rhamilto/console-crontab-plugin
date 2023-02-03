import * as React from 'react';

import { Label, LabelGroup } from '@patternfly/react-core';

import './MetadataLabels.scss';

type MetadataLabelsProps = {
  labels?: { [key: string]: string };
};

const MetadataLabels: React.FC<MetadataLabelsProps> = ({ labels }) => {
  return (
    <LabelGroup numLabels={10} className="metadata-labels-group">
      {Object.keys(labels || {})?.map((key) => {
        return <Label key={key}>{labels[key] ? `${key}=${labels[key]}` : key}</Label>;
      })}
    </LabelGroup>
  );
};

export default MetadataLabels;
