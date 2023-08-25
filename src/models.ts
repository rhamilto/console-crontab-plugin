import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { CRONTAB_APIGROUP, CRONTAB_APIVERSION } from './const';

export const CronTabModel: K8sModel = {
  apiGroup: CRONTAB_APIGROUP,
  apiVersion: CRONTAB_APIVERSION,
  kind: 'CronTab',
  plural: 'crontabs',
  label: 'CronTab',
  // t('plugin__crontab-plugin~CronTab')
  labelKey: 'plugin__crontab-plugin~CronTab',
  labelPlural: 'CronTabs',
  // t('plugin__crontab-plugin~CronTabs')
  labelPluralKey: 'plugin__crontab-plugin~CronTabs',
  id: 'CronTab',
  abbr: 'CT',
  namespaced: true,
  crd: true,
};
