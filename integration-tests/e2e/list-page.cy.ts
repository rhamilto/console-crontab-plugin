import { PLUGIN_NAME } from "../../src/const";
import {
  KEBAB_ACTION_DELETE_ID,
  KEBAB_ACTION_EDIT_ANNOTATIONS_ID,
  KEBAB_ACTION_EDIT_LABELS_ID,
} from "../../src/views/CronTabList/const";
import { checkErrors, testName } from "../support";
import {
  common,
  getNamespacedListPageURL,
  setup,
  teardown,
} from "../views/common";
import { listPage } from "../views/list-page";
import { modal } from "../views/modal";
import { labelsModal } from "../views/labels-modal";
import { annotationModal } from "../views/annotations-modal";
import { detailsPage } from "../views/details-page";

const listPageURL = getNamespacedListPageURL(testName);
const cronTabName = "my-new-cron-object";
const detailsPageURL = `${listPageURL}/${cronTabName}`;
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
    cy.visit(listPageURL);
    common.resourceTitleShouldHaveText("CronTabs");
    cy.byTestID("item-create").should("exist");
    listPage.rows.countShouldBe(0);
  });

  // TODO (jon) - this test should be split into 4 independent cases.
  // - create, edit annotations, edit labels, delete
  it("Create and interact with a CronTab from the list page", () => {
    cy.log("Create CronTab");
    cy.visit(listPageURL);
    common.resourceTitleShouldHaveText("CronTabs");
    listPage.clickCreateYAMLbutton();
    cy.byLegacyTestID("resource-title").should("contain", "Create CronTab");
    cy.byTestID("save-changes").click();
    common.inlineDangerAlert().should("not.exist");
    common.resourceTitleShouldHaveText(cronTabName);

    cy.log("Edit annotations");
    cy.visit(detailsPageURL);
    detailsPage.detailsItemValueShouldContain("Annotations", "0 annotations");
    cy.visit(listPageURL);
    listPage.rows.clickKebabAction(
      cronTabName,
      KEBAB_ACTION_EDIT_ANNOTATIONS_ID
    );
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit annotations");
    annotationModal.countShouldBe(1);
    annotations.forEach(({ key, value }, index) => {
      annotationModal.annotationEquals(index, "", "");
      annotationModal.inputAnnotation(index, key, value);
      annotationModal.annotationEquals(index, key, value);
    });
    annotationModal.countShouldBe(annotations.length);
    modal.submit();
    modal.shouldBeClosed();
    cy.visit(detailsPageURL);
    detailsPage.detailsItemValueShouldContain("Annotations", "1 annotation");
    detailsPage.clickEditAnnotations();
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit annotations");
    annotationModal.countShouldBe(annotations.length);
    annotations.forEach(({ key, value }, index) => {
      annotationModal.annotationEquals(index, key, value);
    });

    cy.log("Edit labels");
    cy.visit(detailsPageURL);
    detailsPage.detailsItemValueShouldContain("Labels", "No labels");
    cy.visit(listPageURL);
    listPage.rows.clickKebabAction(cronTabName, KEBAB_ACTION_EDIT_LABELS_ID);
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit labels");
    modal.submitShouldBeEnabled();
    labelsModal.countShouldBe(0);
    labelsModal.inputLabel(testLabel);
    labelsModal.countShouldBe(1);
    labelsModal.labelEquals(0, testLabel);
    modal.submit();
    modal.shouldBeClosed();
    cy.visit(detailsPageURL);
    detailsPage.detailsItemValueShouldContain("Labels", testLabel);
    detailsPage.clickEditLabels();
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit labels");
    labelsModal.countShouldBe(1);
    labelsModal.labelEquals(0, testLabel);

    cy.log("Delete CronTab");
    cy.visit(listPageURL);
    listPage.rows.shouldBeLoaded();
    listPage.rows.shouldExist(cronTabName);
    listPage.rows.clickKebabAction(cronTabName, KEBAB_ACTION_DELETE_ID);
    modal.shouldBeOpened();
    modal.submitShouldBeEnabled();
    modal.submit();
    modal.shouldBeClosed();
    listPage.rows.shouldNotExist(cronTabName);
  });
});
