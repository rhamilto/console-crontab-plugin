export const annotationModal = {
  getRows: () => cy.byTestID("pairs-list-row"),
  getRow: (row: number) => annotationModal.getRows().eq(row),
  countShouldBe: (count: number) =>
    cy.byTestID("pairs-list-row").should("have.length", count),
  inputAnnotation: (row: number, key: string, value: string) =>
    annotationModal.getRow(row).within(() => {
      cy.byTestID("pairs-list-name").type(key);
      cy.byTestID("pairs-list-value").type(value);
    }),
  annotationEquals: (row: number, key: string, value: string) =>
    annotationModal.getRow(row).within(() => {
      cy.byTestID("pairs-list-name").should("have.value", key);
      cy.byTestID("pairs-list-value").should("have.value", value);
    }),
};
