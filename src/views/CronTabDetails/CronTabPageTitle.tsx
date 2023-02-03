import * as React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_NAMESPACE } from '@crontab-utils/constants';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { CronTabKind, cronTabModelRef } from '../../models/CronTabModel';
import { CronTabActions } from '../components/CronTabActions/CronTabActions';
import { useCronTabTranslation } from '@crontab-utils/hooks/useCronTabTranslation';

type CronTabPageTitleProps = {
  cronTab: CronTabKind;
  name: string;
  namespace: string;
};

const CronTabPageTitle: React.FC<CronTabPageTitleProps> = ({ cronTab, name, namespace }) => {
  const { t } = useCronTabTranslation();
  return (
    <>
      <div className="pf-c-page__main-breadcrumb">
        <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link to={`/k8s/ns/${namespace || DEFAULT_NAMESPACE}/${cronTabModelRef}`}>
              {t('CronTabs')}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{t('CronTab Details')}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="co-m-nav-title co-m-nav-title--detail co-m-nav-title--breadcrumbs">
        <span className="co-m-pane__heading">
          <h1 className="co-m-pane__name co-resource-item">
            <span className="co-m-resource-icon co-m-resource-icon--lg">{'DS'}</span>
            <span data-test-id="resource-title" className="co-resource-item__resource-name">
              {name ?? cronTab?.metadata?.name}{' '}
            </span>
          </h1>
          <div className="co-actions">
            <CronTabActions cronTab={cronTab} />
          </div>
        </span>
      </div>
    </>
  );
};

export default CronTabPageTitle;
