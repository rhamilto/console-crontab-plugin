import * as React from 'react';
import { Trans } from 'react-i18next';

import { CronTabKind } from '@crontab-model';
import { useCronTabTranslation } from '@crontab-utils/hooks/useCronTabTranslation';

type ConfirmActionMessageProps = {
  obj: CronTabKind;
  action?: string;
};

const ConfirmActionMessage: React.FC<ConfirmActionMessageProps> = ({ obj, action = 'delete' }) => {
  const { t } = useCronTabTranslation();
  const objNamespace = obj?.metadata?.namespace;

  return (
    <Trans t={t}>
      Are you sure you want to {action} <strong>{obj?.metadata?.name}</strong>
      {objNamespace && (
        <>
          {' '}
          in namespace <strong>{objNamespace}</strong>
        </>
      )}
      ?
    </Trans>
  );
};

export default ConfirmActionMessage;
