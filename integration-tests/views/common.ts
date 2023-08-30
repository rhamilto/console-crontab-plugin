const PLUGIN_TEMPLATE_NAME = "crontab-plugin";
const PLUGIN_TEMPLATE_PULL_SPEC = Cypress.env("PLUGIN_TEMPLATE_PULL_SPEC");

export const listPageURL = "/k8s/all-namespaces/stable.example.com~v1~CronTab";

export const installHelmChart = (path: string) => {
  cy.exec(
    `cd ../../crontab-plugin && ${path} upgrade -i ${PLUGIN_TEMPLATE_NAME} charts/crontab-plugin -n ${PLUGIN_TEMPLATE_NAME} --create-namespace --set plugin.image=${PLUGIN_TEMPLATE_PULL_SPEC}`,
    {
      failOnNonZeroExit: false,
    }
  )
    .get('[data-test="refresh-web-console"]', { timeout: 300000 })
    .should("exist")
    .then((result) => {
      cy.reload();
      cy.visit(listPageURL);
      cy.log("Error installing helm chart: ", result.stderr);
      cy.log("Successfully installed helm chart: ", result.stdout);
    });
};

export const deleteHelmChart = (path: string) => {
  cy.exec(
    `cd ../../crontab-plugin && ${path} uninstall ${PLUGIN_TEMPLATE_NAME} -n ${PLUGIN_TEMPLATE_NAME} && oc delete namespaces ${PLUGIN_TEMPLATE_NAME}`,
    {
      failOnNonZeroExit: false,
    }
  ).then((result: any) => {
    cy.log("Error uninstalling helm chart: ", result.stderr);
    cy.log("Successfully uninstalled helm chart: ", result.stdout);
  });
};

export const isLocalDevEnvironment =
  Cypress.config("baseUrl").includes("localhost");

export const setup = () => {
  if (!isLocalDevEnvironment) {
    console.log("this is not a local env, installig helm");

    cy.exec("cd ../../crontab-plugin && ./install_helm.sh", {
      failOnNonZeroExit: false,
    }).then((result) => {
      cy.log("Error installing helm binary: ", result.stderr);
      cy.log(
        'Successfully installed helm binary in "/tmp" directory: ',
        result.stdout
      );

      installHelmChart("/tmp/helm");
    });
  } else {
    console.log("this is a local env, not installing helm");

    cy.visit(listPageURL);
  }
};

export const teardown = () => {
  if (!isLocalDevEnvironment) {
    deleteHelmChart("/tmp/helm");
  }
};
