import React, { useState } from "react"
import { Button, CircularProgress, Stack, TextField } from "@mui/material"
import { useMutation, useQueryClient } from "react-query"
import { Todo } from "../types"
import api from "../services/api"
import { enqueueSnackbar } from "notistack"

const AddTodo: React.FC = () => {
  const [newTodo, setNewTodo] = useState<string>("")
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(
    (title: string) => api.post("/todos", { title }),
    {
      onSuccess: (resp) => {
        queryClient.setQueryData<Todo[]>("todos", (oldTodos = []) => {
          return [...oldTodos, resp.data]
        })
        setNewTodo("")
      },
      onError: (err) => {
        enqueueSnackbar("Error occured when adding TODO", {
          variant: "error",
        })
      },
    }
  )

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        label="New Todo"
        variant="outlined"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={newTodo === "" || isLoading}
        onClick={() => {
          mutate(newTodo)
        }}
      >
        {isLoading ? <CircularProgress size={20} /> : "Add Todo"}
      </Button>
    </Stack>
  )
}

export default AddTodo
