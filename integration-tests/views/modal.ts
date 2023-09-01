import { submitButton } from "./form";

export const modal = {
  shouldBeOpened: () =>
    cy.byLegacyTestID("modal-cancel-action").should("be.visible"),
  shouldBeClosed: () =>
    cy.byLegacyTestID("modal-cancel-action").should("not.exist"),
  submitShouldBeEnabled: () => cy.get(submitButton).should("not.be.disabled"),
  submit: (force = false) => cy.get(submitButton).click({ force }),
  modalTitleShouldContain: (modalTitle: string) =>
    cy.byLegacyTestID("modal-title").should("contain.text", modalTitle),
};
