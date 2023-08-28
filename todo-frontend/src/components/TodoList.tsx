import React from "react"
import { List } from "@mui/material"
import TodoItem from "./TodoItem"
import { Todo } from "../types"

interface Props {
  todos: Todo[]
}

const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <List>
      {todos.map((todo) => (
        <TodoItem key={todo.id} item={todo} />
      ))}
    </List>
  )
}

export default TodoList
