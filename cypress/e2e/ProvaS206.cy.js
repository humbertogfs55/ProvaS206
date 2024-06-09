describe("Testes De uso de site para compra de cafe", () => {
  it("Teste acesso ao site e adicionar item ao carrinho sucesso", () => {
    AcessarSite()
    AdicionarItem(0)
    cy.get(':nth-child(2) > a').click()
    cy.get(':nth-child(2) > a').should("exist")
  })

  it("Adicionar multiplos itens no carrinho sucesso", () => {
    AcessarSite()
    AdicionarItem(5)
  })

  it("tentar Checkout sucesso", () => {
    AcessarSite()
    AdicionarItem(5)
    cy.get('[data-test="checkout"]').click()
    cy.get('#name').type("TesteUser")
    cy.get('#email').type("TestEmail@gmail.com")
    cy.get('#submit-payment').click()
    cy.get('[data-test="checkout"]').should("contain.text", "Total: $0.00")
  })

  it("tentar Checkout falha", () => {
    AcessarSite()
    AdicionarItem(5)
    cy.get('[data-test="checkout"]').click()
    cy.get('#name').type("TesteUser")
    cy.get('#email').type("TestEmail")
    cy.get('#submit-payment').click()
    cy.get('[data-test="checkout"]').should("not.contain.text", "Total: $0.00")
    cy.get('.modal-content').should("exist")
  })

  it("Remover itens do carrinho sucesso", () => {
    AcessarSite()
    AdicionarItem(5)
    cy.get(':nth-child(2) > a').click()
    cy.get(':nth-child(2) > :nth-child(4) > .delete')
  })

  it("Checkout Via Carrinho sucesso", () => {
    AcessarSite()
    AdicionarItem(5)
    cy.get(':nth-child(2) > a').click()
    cy.get('[data-test="checkout"]').click()
    cy.get('#name').type("TesteUser")
    cy.get('#email').type("TestEmail@gmail.com")
    cy.get('#submit-payment').click()
    cy.get('.snackbar').wait(2).should("exist") 
    cy.get('[data-test="checkout"]').should("contain.text", "Total: $0.00")
  })

  it("Ganhar cafe brinde ao adicionar 3 iguais no carrinho", () => {
    AcessarSite()
    cy.get('[data-cy="Espresso"]').click().click().click()
    cy.get('.promo > span').should("exist").should("contain.text", "It's your lucky day! Get an extra cup of Mocha for $4.")
    cy.get('.yes').click()
    cy.get(':nth-child(2) > a').click()
    cy.get('ul[data-v-8965af83=""] > :nth-child(2) > :nth-child(1)').should("exist")
  })

  it("Checkout sem itens no carrinho deve falhar", () => {
    AcessarSite()
    cy.get('[data-test="checkout"]').click()
    cy.get('#name').type("TesteUser")
    cy.get('#email').type("TestEmail@gmail.com")
    cy.get('#submit-payment').click()
    cy.get('.snackbar').wait(2).should("not.exist") 
  })//Falhando por erro de tratamento do site. deve ser corrigido no futuro!
})

function AcessarSite() {
  cy.visit('https://coffee-cart.app/')
}

function AdicionarItem(quant) {
  let items = ["Espresso", "Espresso-Macchiato", "Cappuccino", "Mocha", "Flat-White", "Americano"]
  let selectedItem 
  for(let i = 0; i < quant; i++){
    selectedItem = items[Math.floor(Math.random() * items.length)]
    cy.get(`[data-cy="${selectedItem}"]`).click();
  }
}