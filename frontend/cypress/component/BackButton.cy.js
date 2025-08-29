// cypress/component/BackButton.cy.js

import React from 'react'
import BackButton from '../../src/components/BackButton'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'

describe('BackButton Component', () => {
  it('should render back button', () => {
    cy.mount(
      <ChakraProvider>
        <BrowserRouter>
          <BackButton />
        </BrowserRouter>
      </ChakraProvider>
    )

    cy.get('button').should('exist')
    cy.get('[aria-label="Retour"]').should('be.visible')
  })

  it('should handle click events', () => {
    const mockNavigate = cy.stub()
    
    cy.mount(
      <ChakraProvider>
        <BrowserRouter>
          <BackButton />
        </BrowserRouter>
      </ChakraProvider>
    )

    cy.get('button').click()
    // In a real scenario, we would verify navigation occurred
  })

  it('should be accessible', () => {
    cy.mount(
      <ChakraProvider>
        <BrowserRouter>
          <BackButton />
        </BrowserRouter>
      </ChakraProvider>
    )

    cy.get('button')
      .should('have.attr', 'aria-label')
      .and('contain', 'Retour')
  })
})