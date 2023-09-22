import { PLUGIN_NAME } from "../../src/const";
import { checkErrors, testName } from "../support";
import { getNamespacedListPageURL, setup, teardown } from "../views/common";
import { listPage } from "../views/list-page";
import { modal } from "../views/modal";
import { pairsList, getNameValueEditorRow, nameValueEquals, setName, setValue } from "../views/pairs-list";

const namespacedListPageURL = getNamespacedListPageURL(testName);

const annotations = [
  {
    key: 'ALPHA_Num_KEY-1',
    value: 'ALPHA_Num_VALUE-1',
  },
];

describe(`${PLUGIN_NAME} list page test`, () => {
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

  it("Create, update annotations and delete a new CronTab from the list page", () => {
    cy.log("Creating a new CronTab from the list page");
    cy.visit(namespacedListPageURL);
    listPage.titleShouldHaveText("CronTabs");
    listPage.clickCreateYAMLbutton();
    cy.byLegacyTestID("resource-title").should("contain", "Create CronTab");
    cy.byTestID("save-changes").click();
    cy.get(".pf-c-alert.pf-m-inline.pf-m-danger").should("not.exist");
    cy.byLegacyTestID("resource-title").should("contain", "my-new-cron-object");

    cy.log("Edit annotations on the new CronTab from the list page");
    cy.visit(namespacedListPageURL);
    listPage.rows.shouldBeLoaded();
    listPage.rows.shouldExist("my-new-cron-object");
    listPage.rows.clickKebabAction("my-new-cron-object", "Edit annotations");
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit annotations");
    getNameValueEditorRow(0).then((row) => {
      setName(row, annotations[0].key);
      setValue(row, annotations[0].value);
    });
    modal.submit();
    modal.shouldBeClosed();
    // 3 seconds wait for the new CronTab annotation to be updated
    cy.wait(3000);
    cy.log('Verify annotations');
    listPage.rows.clickKebabAction("my-new-cron-object", "Edit annotations");
    modal.shouldBeOpened();
    getNameValueEditorRow(0).then((row) => {
      nameValueEquals(row, annotations[0].key, annotations[0].value);
    });
    modal.cancel();
    modal.shouldBeClosed();

    cy.log("Deleting the new CronTab from the list page");
    cy.visit(namespacedListPageURL);
    listPage.rows.shouldBeLoaded();
    listPage.rows.shouldExist("my-new-cron-object");
    listPage.rows.clickKebabAction("my-new-cron-object", "Delete CronTab");
    modal.shouldBeOpened();
    modal.submitShouldBeEnabled();
    modal.submit();
    modal.shouldBeClosed();
    listPage.rows.shouldNotExist("my-new-cron-object");
  });
});
