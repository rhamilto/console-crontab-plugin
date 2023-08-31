import { checkErrors, testName } from "../support";
import { getNamespacedListPageURL, setup, teardown } from "../views/common";
import { listPage } from "../views/list-page";
import { modal } from "../views/modal";

const namespacedListPageURL = getNamespacedListPageURL(testName);

describe("crontab-plugin template test", () => {
  before(() => {
    cy.login();
    cy.createProject(testName);
    setup();
  });

  afterEach(() => {
    checkErrors();
  });

  after(() => {
    teardown();
    cy.deleteProject(testName);
    cy.logout();
  });

  it("Verify the CronTabs list page is loaded", () => {
    cy.visit(namespacedListPageURL);
    listPage.titleShouldHaveText("CronTabs");
    cy.byTestID("item-create").should("exist");
    listPage.rows.countShouldBe(0);
  });

  it("Create and delete a new CronTab from the list page", () => {
    cy.log("Creating a new CronTab from the list page");
    cy.visit(namespacedListPageURL);
    listPage.titleShouldHaveText("CronTabs");
    listPage.clickCreateYAMLbutton();
    cy.byLegacyTestID("resource-title").should("contain", "Create CronTab");
    cy.byTestID("save-changes").click();
    cy.get(".pf-c-alert.pf-m-inline.pf-m-danger").should("not.exist");
    cy.byLegacyTestID("resource-title").should("contain", "my-new-cron-object");

    cy.log("Deleting the new CronTab from the list page");
    cy.visit(namespacedListPageURL);
    listPage.rows.shouldBeLoaded();
    listPage.rows.shouldExist("my-new-cron-object");
    listPage.rows.clickKebabAction("my-new-cron-object", "Delete CronTab");
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Delete CronTab");
    modal.submitShouldBeEnabled();
    modal.submit();
    modal.shouldBeClosed();
    listPage.rows.shouldNotExist("my-new-cron-object");
  });
});
