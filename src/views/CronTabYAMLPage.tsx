import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { CronTabKind } from '@crontab-model';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, Title } from '@patternfly/react-core';
import { useCronTabTranslation } from '@crontab-utils/hooks/useCronTabTranslation';

type CronTabYAMLPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: CronTabKind;
};

const CronTabYAMLPage: React.FC<CronTabYAMLPageProps> = ({ obj: cronTab }) => {
  const { t } = useCronTabTranslation();
  return !cronTab ? (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('CronTab details')}
        </Title>
      </PageSection>
    </div>
  ) : (
    <ResourceYAMLEditor initialResource={cronTab} header={'CronTab'} />
  );
};

export default CronTabYAMLPage;
