import { app } from '../utils/variables'

describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit(app)
    cy.login()
  })

  const createProject = () => {
    cy.get('#projects').click()
    cy.get('#create-project').click()
    cy.get('#name').type('Test Project')
    cy.get('#objective').type('Test Description')
    cy.get('#start_date').type('2023-01-01')
    cy.get('#deadline').type('2024-01-01')
    cy.get('#submit').click()
    const project = cy.get('#project-list-item').last()
    return project
  }
  it('should create a project -  Projects Page', () => {
    const project = createProject()
  })

  it('should Delete a Project - Projects Page', () => {
    const project = createProject()
    project.get('#delete-project').click()
    cy.get('#confirm-delete').click()
  })

  it('should Delete a Project - Homepage', () => {
    createProject()
    const project = cy.get('#project-list-item').last()
    cy.get('#dashboard').click()
    project.get('#delete-project').click()
    cy.get('#confirm-delete').click()
  })

  it('should Edit a Project - Projects Page', () => {
    const project = createProject()
    project.get('#edit-project').click()
    cy.get('#name').clear()
    cy.get('#name').type('Test Project 2')
    cy.get('#objective').clear()
    cy.get('#objective').type('Test Description 2')
    cy.get('#start_date').clear()
    cy.get('#start_date').type('2023-01-01')
    cy.get('#deadline').clear()
    cy.get('#deadline').type('2024-01-01')
    cy.get('#submit').click()
  })

  it('should Edit a Project - Homepage', () => {
    createProject()
    const project = cy.get('#project-list-item').last()
    cy.get('#dashboard').click()
    project.get('#edit-project').click()
    cy.get('#name').clear()
    cy.get('#name').type('Test Project 2')
    cy.get('#objective').clear()
    cy.get('#objective').type('Test Description 2')
    cy.get('#start_date').clear()
    cy.get('#start_date').type('2023-01-01')
    cy.get('#deadline').clear()
    cy.get('#deadline').type('2024-01-01')
    cy.get('#submit').click()
  })

  it.only('should Create a Note', () => {
    const project = createProject()
    project.get('#project-link').click()
    project.get('#tabs-notes-tab').click()
    cy.get('#open-create-note').click()
    cy.get('#newNote').type('Test Note')
    cy.get('#submit').click()
  })

  // * create - Homepage Generator
  // * Create Note
  // * Delete Note
  // * Add team members
  // * Remove team members
})
