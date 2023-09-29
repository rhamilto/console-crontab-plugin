import { PLUGIN_NAME } from "../../src/const";
import {
  KEBAB_ACTION_DELETE_ID,
  KEBAB_ACTION_EDIT_ANNOTATIONS_ID,
  KEBAB_ACTION_EDIT_LABELS_ID,
} from "../../src/views/CronTabList/const";
import { checkErrors, testName } from "../support";
import { getNamespacedListPageURL, setup, teardown } from "../views/common";
import { listPage } from "../views/list-page";
import { modal } from "../views/modal";
import { labelsModal } from "../views/labels-modal";
import {
  getNameValueEditorRow,
  nameValueEquals,
  setName,
  setValue,
} from "../views/pairs-list";

const namespacedListPageURL = getNamespacedListPageURL(testName);

const testLabel = "key1=value1";
const annotations = [
  {
    key: "ALPHA_Num_KEY-1",
    value: "ALPHA_Num_VALUE-1",
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

  it("renders the CronTabs list page", () => {
    cy.visit(namespacedListPageURL);
    listPage.titleShouldHaveText("CronTabs");
    cy.byTestID("item-create").should("exist");
    listPage.rows.countShouldBe(0);
  });

  // TODO (jon) - this test should be split into multiple tests
  // - create, edit annotations, edit labels, delete
  it("Create and interact with a CronTab from the list page", () => {
    cy.log("Create CronTab");
    cy.visit(namespacedListPageURL);
    listPage.titleShouldHaveText("CronTabs");
    listPage.clickCreateYAMLbutton();
    cy.byLegacyTestID("resource-title").should("contain", "Create CronTab");
    cy.byTestID("save-changes").click();
    cy.get(".pf-c-alert.pf-m-inline.pf-m-danger").should("not.exist");
    cy.byLegacyTestID("resource-title").should("contain", "my-new-cron-object");

    cy.log("Edit annotations");
    cy.visit(namespacedListPageURL);
    listPage.rows.shouldBeLoaded();
    listPage.rows.shouldExist("my-new-cron-object");
    listPage.rows.clickKebabAction(
      "my-new-cron-object",
      KEBAB_ACTION_EDIT_ANNOTATIONS_ID
    );
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit annotations");
    getNameValueEditorRow(0).then((row) => {
      setName(row, annotations[0].key);
      setValue(row, annotations[0].value);
    });
    modal.submit();
    modal.shouldBeClosed();
    // 3 seconds wait for the new CronTab annotation to be updated
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(3000);
    /* eslint-enable cypress/no-unnecessary-waiting */
    cy.log("Verify annotations");
    listPage.rows.clickKebabAction(
      "my-new-cron-object",
      KEBAB_ACTION_EDIT_ANNOTATIONS_ID
    );
    modal.shouldBeOpened();
    getNameValueEditorRow(0).then((row) => {
      nameValueEquals(row, annotations[0].key, annotations[0].value);
    });
    modal.cancel();
    modal.shouldBeClosed();

    cy.log("Edit labels");
    cy.visit(namespacedListPageURL);
    listPage.rows.shouldBeLoaded();
    listPage.rows.shouldExist("my-new-cron-object");
    listPage.rows.clickKebabAction(
      "my-new-cron-object",
      KEBAB_ACTION_EDIT_LABELS_ID
    );
    modal.shouldBeOpened();
    cy.byLegacyTestID("modal-title").should("have.text", "Edit labels");
    modal.submitShouldBeEnabled();
    labelsModal.inputLabel(testLabel);
    labelsModal.labelHasValue(0, testLabel);
    modal.submit();
    modal.shouldBeClosed();
    listPage.rows.clickRowByName("my-new-cron-object");
    cy.get("body").should("contain.text", testLabel);

    cy.log("Delete CronTab");
    cy.visit(namespacedListPageURL);
    listPage.rows.shouldBeLoaded();
    listPage.rows.shouldExist("my-new-cron-object");
    listPage.rows.clickKebabAction(
      "my-new-cron-object",
      KEBAB_ACTION_DELETE_ID
    );
    modal.shouldBeOpened();
    modal.submitShouldBeEnabled();
    modal.submit();
    modal.shouldBeClosed();
    listPage.rows.shouldNotExist("my-new-cron-object");
  });
});
