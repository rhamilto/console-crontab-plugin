import * as React from 'react';

import { CronTabKind, CronTabModel } from '@crontab-model';
import { useModal } from '@crontab-utils/components/ModalProvider/ModalProvider';
import { k8sPatch, ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Grid,
  GridItem,
  Popover,
} from '@patternfly/react-core';

import DescriptionItem from '../components/DescriptionItem/DescriptionItem';
import { LabelsModal } from '../modals/LabelsModal/LabelsModal';
import MetadataLabels from '../utils/MetadataLabels/MetadataLabels';
import { useCronTabTranslation } from '@crontab-utils/hooks/useCronTabTranslation';

export type CronTabDetailsGridProps = {
  cronTab: CronTabKind;
};

export const CronTabDetailsGrid: React.FC<CronTabDetailsGridProps> = ({ cronTab }) => {
  const { t } = useCronTabTranslation();
  const { createModal } = useModal();
  return (
    <Grid hasGutter>
      <GridItem span={5}>
        <DescriptionList>
          <DescriptionItem
            descriptionData={cronTab?.metadata?.name}
            descriptionHeader={t('Name')}
            isPopover
            bodyContent={t('Name must be unique within a namespace.')}
            moreInfoURL="http://kubernetes.io/docs/user-guide/identifiers#names"
            breadcrumb="CronTab.metadata.name"
            data-test-id={`${cronTab?.metadata?.name}-name`}
          />

          <DescriptionItem
            descriptionData={<ResourceLink kind="Namespace" name={cronTab?.metadata?.namespace} />}
            descriptionHeader={t('Namespace')}
            isPopover
            bodyContent={t('Namespace defines the space within which each name must be unique.')}
            moreInfoURL="http://kubernetes.io/docs/user-guide/namespaces"
            breadcrumb="CronTab.metadata.namespace"
          />

          <DescriptionItem
            descriptionData={<MetadataLabels labels={cronTab?.metadata?.labels} />}
            descriptionHeader={t('Labels')}
            isPopover
            bodyContent={t(
              'Map of string keys and values that can be used to organize and categorize (scope and select) objects.',
            )}
            moreInfoURL="http://kubernetes.io/docs/user-guide/labels"
            breadcrumb="CronTab.metadata.labels"
            isEdit
            showEditOnTitle
            onEditClick={() =>
              createModal(({ isOpen, onClose }) => (
                <LabelsModal
                  obj={cronTab}
                  isOpen={isOpen}
                  onClose={onClose}
                  onLabelsSubmit={(labels) =>
                    k8sPatch({
                      model: CronTabModel,
                      resource: cronTab,
                      data: [
                        {
                          op: 'replace',
                          path: '/metadata/labels',
                          value: labels,
                        },
                      ],
                    })
                  }
                />
              ))
            }
            data-test-id={`${cronTab?.metadata?.name}-labels`}
          />

          <DescriptionListTermHelpText>
            <Popover
              headerContent={<div>Cronspec</div>}
              bodyContent={<div>Additional cronSpec info</div>}
            >
              <DescriptionListTermHelpTextButton> Cronspec </DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
          <DescriptionListDescription>{cronTab.spec.cronSpec}</DescriptionListDescription>

          <DescriptionItem
            descriptionData={<Timestamp timestamp={cronTab?.metadata?.creationTimestamp} />}
            descriptionHeader={t('Created at')}
            isPopover
            bodyContent={t(
              'Time is a wrapper around time. Time which supports correct marshaling to YAML and JSON.',
            )}
            breadcrumb="DataImportCron.metadata.creationTimestamp"
          />
        </DescriptionList>
      </GridItem>
    </Grid>
  );
};
