import React, { useState } from "react"
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import CheckIcon from "@mui/icons-material/Check"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import { Todo } from "../types"
import { useMutation, useQueryClient } from "react-query"
import api from "../services/api"
import { enqueueSnackbar } from "notistack"

interface Props {
  item: Todo
}

const TodoEditUI: React.FC<{
  editValue: string
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSaveEdit: () => void
  isLoading: boolean
}> = ({ editValue, onEditChange, onSaveEdit, isLoading }) => (
  <>
    <TextField value={editValue} onChange={onEditChange} />
    <IconButton onClick={onSaveEdit} disabled={isLoading}>
      {isLoading ? <LoadingSpinner /> : <CheckIcon />}
    </IconButton>
  </>
)

const TodoDefaultUI: React.FC<{
  item: Todo
  onStartEdit: () => void
  onDelete: () => void
  onToggleCompleted: () => void
  isLoading: boolean
}> = ({ item, onStartEdit, onDelete, onToggleCompleted, isLoading }) => (
  <>
    <ListItemText primary={item.title} />
    <ListItemSecondaryAction>
      <IconButton onClick={onStartEdit}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={onDelete} disabled={isLoading}>
        {isLoading ? <LoadingSpinner /> : <DeleteIcon />}
      </IconButton>
      <Checkbox
        checked={item.completed}
        disabled={isLoading}
        onChange={onToggleCompleted}
      />
    </ListItemSecondaryAction>
  </>
)

const LoadingSpinner: React.FC = () => (
  <CircularProgress size={24} color="inherit" />
)

const TodoItem: React.FC<Props> = ({ item }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editValue, setEditValue] = useState<string>(item.title)
  const queryClient = useQueryClient()

  const deleteTodoMutation = useMutation(
    (id: number) => api.delete(`/todos/${id}`),
    {
      onSuccess: (data, id: number) => {
        queryClient.setQueryData<Todo[]>("todos", (oldTodos = []) => {
          return oldTodos.filter((todo) => todo.id !== id)
        })
      },
      onError: () => {
        enqueueSnackbar("Error occured when deleting TODO", {
          variant: "error",
        })
      },
    }
  )

  const updateTodoMutation = useMutation(
    (todo: Todo) => api.put(`/todos/${todo.id}`, todo),
    {
      onSuccess: (data, updatedTodo: Todo) => {
        queryClient.setQueryData<Todo[]>("todos", (oldTodos = []) => {
          return oldTodos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
        })
      },
      onError: () => {
        enqueueSnackbar("Error occured when updating TODO", {
          variant: "error",
        })
      },
    }
  )

  const toggleCompletedMutation = useMutation(
    (todo: Omit<Todo, "title">) => api.put(`/todos/${todo.id}/completed`, todo),
    {
      onError: () => {
        enqueueSnackbar("Error occured when updating complete status of TODO", {
          variant: "error",
        })
      },
      onSuccess: (data, updatedTodo: Omit<Todo, "title">) => {
        queryClient.setQueryData<Todo[]>("todos", (oldTodos = []) => {
          return oldTodos.map((todo) =>
            todo.id === updatedTodo.id
              ? { ...updatedTodo, title: todo.title }
              : todo
          )
        })
      },
    }
  )

  const saveEdit = () => {
    updateTodoMutation.mutate({ ...item, title: editValue })
    setIsEditing(false)
  }

  return (
    <ListItem>
      {isEditing || updateTodoMutation.isLoading ? (
        <TodoEditUI
          editValue={editValue}
          onEditChange={(e) => setEditValue(e.target.value)}
          onSaveEdit={saveEdit}
          isLoading={updateTodoMutation.isLoading}
        />
      ) : (
        <TodoDefaultUI
          item={item}
          onStartEdit={() => setIsEditing(true)}
          onDelete={() => deleteTodoMutation.mutate(item.id)}
          onToggleCompleted={() =>
            toggleCompletedMutation.mutate({
              id: item.id,
              completed: !item.completed,
            })
          }
          isLoading={deleteTodoMutation.isLoading}
        />
      )}
    </ListItem>
  )
}

export default TodoItem
