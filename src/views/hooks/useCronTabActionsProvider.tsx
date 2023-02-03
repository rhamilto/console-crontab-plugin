import React from 'react';
import { useHistory } from 'react-router-dom';

import { CronTabKind, CronTabModel, cronTabModelRef } from '@crontab-model';
import { useModal } from '@crontab-utils/components/ModalProvider/ModalProvider';
import { Action, k8sDelete, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';

import { AnnotationsModal } from '../modals/AnnotationsModal/AnnotationsModal';
import DeleteModal from '../modals/DeleteModal/DeleteModal';
import { LabelsModal } from '../modals/LabelsModal/LabelsModal';

type UseCronTabActionsProvider = (
  cronTab: CronTabKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useCronTabActionsProvider: UseCronTabActionsProvider = (cronTab) => {
  const { createModal } = useModal();
  const history = useHistory();

  const actions = React.useMemo(
    () => [
      {
        id: 'dataimportcron-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
        cta: () =>
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
          )),
      },
      {
        id: 'crontab-action-edit-annotations',
        disabled: false,
        label: t('Edit annotations'),
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <AnnotationsModal
              obj={cronTab}
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={(updatedAnnotations) =>
                k8sPatch({
                  model: CronTabModel,
                  resource: cronTab,
                  data: [
                    {
                      op: 'replace',
                      path: '/metadata/annotations',
                      value: updatedAnnotations,
                    },
                  ],
                })
              }
            />
          )),
      },
      {
        id: 'crontab-action-edit-crontab',
        disabled: false,
        label: t('Edit'),
        cta: () =>
          history.push(
            `/k8s/ns/${cronTab.metadata.namespace}/${cronTabModelRef}/${cronTab.metadata.name}/yaml`,
          ),
      },
      {
        id: 'crontab-action-delete',
        label: t('Delete'),
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <DeleteModal
              obj={cronTab}
              isOpen={isOpen}
              onClose={onClose}
              headerText={t('Delete CronTab?')}
              onDeleteSubmit={() =>
                k8sDelete({
                  model: CronTabModel,
                  resource: cronTab,
                })
              }
            />
          )),
        //   ,accessReview: asAccessReview(DataImportCronModel, cronTab, 'delete'),
      },
    ],
    [/*t, */ cronTab, createModal /*, dataSource*/, history],
  );

  return [actions];
};
