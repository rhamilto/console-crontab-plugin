import { checkErrors } from "../support";
import { setup, teardown } from "../views/common";

describe("crontab-plugin template test", () => {
  before(() => {
    cy.login();
    setup();
  });

  afterEach(() => {
    checkErrors();
  });

  after(() => {
    teardown();
    cy.logout();
  });

  it("Verify the url", () => {
    cy.url().should(
      "include",
      "k8s/all-namespaces/stable.example.com~v1~CronTab"
    );
  });
  it("Verify the CronTabs list title", () => {
    cy.get('[data-test-id="resource-title"]').should("contain", "CronTabs");
  });
});
