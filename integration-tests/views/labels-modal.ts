export const labelsModal = {
  getTitle: () => cy.byLegacyTestID("modal-title"),
  inputLabel: (value: string) =>
    cy.byTestID("tags-input").type(`${value}{enter}`),
  getLabel: (index: number) =>
    cy.get(".tag-item-content .pf-c-label__content").eq(index),
  labelHasValue: (index: number, value: string) =>
    labelsModal.getLabel(index).should("have.text", value),
};
