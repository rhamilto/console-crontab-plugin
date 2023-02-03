FROM docker.io/library/node:16 AS build

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN yarn install && yarn build

FROM docker.io/library/nginx:stable

LABEL io.k8s.display-name="OpenShift CronTab Plugin" \
      io.k8s.description="OpenShift Console dynamic plugin used for Crontab CRD." \
      io.openshift.tags="openshift" \
      maintainer="Jakub Hadvig <jhadvig@redhat.com>"

RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html