import React from 'react'
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  const onClickDelete = (todo) => () => {
    deleteTodo(todo)
  }

  const onClickComplete = (todo) => () => {
    completeTodo(todo)
  }

  return (
    <>
      {todos.map((todo, idx) => {
        return <Todo todo={todo} key={idx} onClickComplete={onClickComplete} onClickDelete={onClickDelete}/>
      }).reduce((acc, cur) => [...acc, <hr key={`hr-${cur.key}`}/>, cur], [])}
    </>
  )
}

export default TodoList
