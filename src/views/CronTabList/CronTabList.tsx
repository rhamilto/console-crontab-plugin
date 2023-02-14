import React from 'react';
import { CronTabKind } from '@crontab-model/types';
import {
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  Timestamp,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { useCronTabTranslation } from '@crontab-utils/hooks/useCronTabTranslation';
import { cronTabGroupVersionKind } from '@crontab-utils/utils';
import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

type CronTabListProps = {
  namespace: string;
};

const CronTabList: React.FC<CronTabListProps> = ({ namespace }) => {
  const [cronTabs, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: cronTabGroupVersionKind,
    namespaced: true,
    namespace,
  });
  const { t } = useCronTabTranslation();
  const columns = useCronTabColumns();
  const [data, filteredData, onFilterChange] = useListPageFilter(cronTabs);

  return (
    <>
      <ListPageHeader title={t('CronTab')}>
        {/* groupVersionKind should take an object but there is discrepancy in the prop types
        https://issues.redhat.com/browse/OCPBUGS-13808 will update the types */}
        <ListPageCreate groupVersionKind={"stable.example.com~v1~CronTab"}>Create CronTab</ListPageCreate>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<K8sResourceCommon>
          data={filteredData}
          unfilteredData={cronTabs}
          loaded={loaded}
          loadError={loadError}
          columns={columns}
          Row={cronTabListRow}
        />
      </ListPageBody>
    </>
  );
};

const cronTabListRow: React.FC<RowProps<CronTabKind>> = ({ obj, activeColumnIDs }) => {
  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs} >
        <ResourceLink
          groupVersionKind={cronTabGroupVersionKind}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs} >
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
      </TableData>
      <TableData id="cronspec" activeColumnIDs={activeColumnIDs} >
        {obj.spec.cronSpec}
      </TableData>
      <TableData id="image" activeColumnIDs={activeColumnIDs} >
        {obj.spec.image}
      </TableData>
      <TableData id="replicas" activeColumnIDs={activeColumnIDs}>
        {obj.spec.replicas}
      </TableData>
      <TableData id="created" activeColumnIDs={activeColumnIDs} >
        <Timestamp timestamp={obj.metadata.creationTimestamp} />
      </TableData>
    </>
  );
};

const useCronTabColumns = () => {
  const { t } = useCronTabTranslation();
  const columns: TableColumn<K8sResourceCommon>[] = React.useMemo(
    () => [
      {
        title: t('Name'),
        id: 'name',
        transforms: [sortable],
        sort: 'metadata.name',
      },
      {
        title: t('Namespace'),
        id: 'namespace',
        transforms: [sortable],
        sort: 'metadata.namespace',
      },
      {
        title: t('CronSpec'),
        id: 'cronspec',
        transforms: [sortable],
        sort: 'spec.cronSpec',
      },
      {
        title: t('Image'),
        id: 'image',
        transforms: [sortable],
        sort: 'spec.image',
      },
      {
        title: t('Replicas'),
        id: 'replicas',
        transforms: [sortable],
        sort: 'spec.replicas',
      },
      {
        title: t('Created'),
        id: 'created',
        transforms: [sortable],
        sort: 'metadata.creationTimestamp',
      },
    ],
    [],
  );

  return columns;
};

export default CronTabList;
