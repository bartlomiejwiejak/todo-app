import React, { useState } from "react"
import { useQuery } from "react-query"
import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material"
import TodoList from "./components/TodoList"
import AddTodo from "./components/AddTodo"
import SearchBar from "./components/SearchBar"
import api from "./services/api"
import { Todo } from "./types"

const fetchTodos = async () => {
  const response = await api.get("/todos")
  return response.data
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery<Todo[], Error>("todos", fetchTodos)

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <h1>TODO App</h1>
          <Stack spacing={2}>
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <AddTodo />
            {isLoading && (
              <Stack justifyContent="center" direction="row">
                <CircularProgress />
              </Stack>
            )}
            {error && <Alert severity="error">Could not retrieve todos.</Alert>}
          </Stack>
          <TodoList todos={filteredTodos} />
        </CardContent>
      </Card>
    </Container>
  )
}

export default App
