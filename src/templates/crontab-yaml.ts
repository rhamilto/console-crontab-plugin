import { CRONTAB_APIGROUP, CRONTAB_APIVERSION } from "src/const";

export const defaultCronTabYamlTemplate = `
apiVersion: "${CRONTAB_APIGROUP}/${CRONTAB_APIVERSION}"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  replicas: 1
`;
