import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Todo from './Todo'

describe('Todo Content', () => {
  it('should display the specific text "redis persistent data check"', () => {
    const specificTodo = { 
      text: 'redis persistent data check', 
      done: false 
    }

    // Mocking the curried functions
    const mockFn = vi.fn(() => vi.fn())

    render(
      <Todo 
        todo={specificTodo} 
        onClickComplete={mockFn} 
        onClickDelete={mockFn} 
      />
    )

    // Assertion: This will throw an error if the text is not found
    const todoElement = screen.getByText(/redis persistent data check/i)
    expect(todoElement).toBeInTheDocument()
  })
})