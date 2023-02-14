# OpenShift CronTab Dynamic Plugin

This project serves as a minimal template for an Openshift dynamic plugin. It shows basic operations with a Custom Resource Definition (CRD), in this case CronTab CRD, such as creating, editing and deleting.

It requires OpenShift 4.11.

The CronTab Dynamic Plugin creates a new navigation entry, list page, details page, and YAML template for the CRD.

## Deployment on cluster

Before you can deploy your plugin on a cluster, you must build an image and
push it to an image registry.

1. Build the image:
   
   NOTE: If you have a Mac with Apple silicon, you will need to add the flag
   `--platform=linux/amd64` when building the image to target the correct platform
   to run in-cluster.

   ```sh
   docker build -f Dockerfile -t $NAME/crontab-plugin:latest . --no-cache
   ```

2. Push the image:

   ```sh
   docker push $NAME/crontab-plugin:latest
   ```


## Installing the Helm Chart
A [Helm](https://helm.sh) chart is available to deploy the plugin to an OpenShift environment.

To deploy the plugin on a cluster using a Helm chart:
```shell
helm upgrade -i crontab-plugin charts/crontab-plugin -n crontab-plugin-ns --create-namespace --set plugin.image=docker.io/$NAME/crontab-plugin:latest
```

`-i crontab-plugin`: specifies installation of a release named `crontab-plugin`

`-n crontab-plugin-ns --create-namespace`: creates a new namespace for the helm chart

`plugin.image`: Specifies the location of the image containing the plugin, to be deployed

Additional parameters can be specified if desired. Consult the chart [values](charts/openshift-console-plugin/values.yaml) file for the full set of supported parameters.

## Local development

In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login`
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman](https://podman.io))
