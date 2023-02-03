import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { CronTabKind, CronTabModel, cronTabModelRef } from '@crontab-model';
import { useModal } from '@crontab-utils/components/ModalProvider/ModalProvider';
import { DEFAULT_NAMESPACE } from '@crontab-utils/constants';
import { k8sDelete, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import {
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';

import ConfirmActionMessage from '../components/ConfirmActionMessage/ConfirmActionMessage';
import { AnnotationsModal } from '../modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '../modals/LabelsModal/LabelsModal';
import TabModal from '../modals/TabModal/TabModal';

type CronTabRowActionsProps = {
  obj?: CronTabKind;
};

const CronTabRowActions: React.FC<CronTabRowActionsProps> = ({ obj }) => {
  const { createModal } = useModal();
  const history = useHistory();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const onDelete = React.useCallback(() => {
    return k8sDelete({
      model: CronTabModel,
      resource: obj,
    }).catch(console.error);
  }, [obj]);

  const onEditLabelsModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <LabelsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onLabelsSubmit={(labels) =>
          k8sPatch({
            model: CronTabModel,
            resource: obj,
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
    ));
  };

  const onEditAnnotationsModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <AnnotationsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={(updatedAnnotations) =>
          k8sPatch({
            model: CronTabModel,
            resource: obj,
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
    ));
  };

  const onEditCronTab = () => {
    const cta = {
      href: `/k8s/ns/${obj.metadata.namespace || DEFAULT_NAMESPACE}/${cronTabModelRef}/${
        obj.metadata.name
      }/yaml`,
    };
    history.push(cta.href);
  };

  const onDeleteModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <TabModal<CronTabKind>
        onClose={onClose}
        isOpen={isOpen}
        obj={obj}
        onSubmit={onDelete}
        headerText={'Delete CronTab?'}
        submitBtnText={'Delete'}
        submitBtnVariant={ButtonVariant.danger}
      >
        <ConfirmActionMessage obj={obj} action="delete" />
      </TabModal>
    ));
  };

  return (
    <Dropdown
      menuAppendTo={getContentScrollableElement}
      onSelect={() => setIsDropdownOpen(false)}
      toggle={<KebabToggle onToggle={setIsDropdownOpen} id="toggle-id-disk" />}
      isOpen={isDropdownOpen}
      isPlain
      dropdownItems={[
        <DropdownItem onClick={onEditLabelsModalToggle} key="crontab-delete">
          {'Edit labels'}
        </DropdownItem>,
        <DropdownItem onClick={onEditAnnotationsModalToggle} key="crontab-delete">
          {'Edit annotations'}
        </DropdownItem>,
        <DropdownItem onClick={onEditCronTab} key="crontab-delete">
          {'Edit CronTab'}
        </DropdownItem>,
        <DropdownItem onClick={onDeleteModalToggle} key="crontab-delete">
          {'Delete Crontab'}
        </DropdownItem>,
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default CronTabRowActions;
