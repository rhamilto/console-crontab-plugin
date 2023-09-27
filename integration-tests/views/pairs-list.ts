export const getNameValueEditorRow = (row: number) => {
  return cy.byTestID("pairs-list-row").eq(row);
};

export const setName = (row: JQuery<HTMLElement>, nameValue: string) => {
  cy.wrap(row).within(() => {
    cy.byTestID("pairs-list-name").type(nameValue);
  });
};

export const setValue = (row: JQuery<HTMLElement>, value: string) => {
  cy.wrap(row).within(() => {
    cy.byTestID("pairs-list-value").type(value);
  });
};

export const nameValueEquals = (
  row: JQuery<HTMLElement>,
  name: string,
  value: string
) => {
  cy.wrap(row).within(() => {
    cy.byTestID("pairs-list-name").should("have.value", name);
    cy.byTestID("pairs-list-value").should("have.value", value);
  });
};
