import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { PageSection, Title } from '@patternfly/react-core';
import { CronTabDetailsGrid } from './CronTabDetails/CronTabDetailsGrid';
import { useCronTabTranslation } from '@crontab-utils/hooks/useCronTabTranslation';

type CronTabDetailsPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: any;
};

const CronTabDetailsPage: React.FC<CronTabDetailsPageProps> = ({ obj }) => {
  const { t } = useCronTabTranslation();
  return (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('CronTab details')}
        </Title>
        <CronTabDetailsGrid cronTab={obj} />
      </PageSection>
    </div>
  );
};

export default CronTabDetailsPage;
