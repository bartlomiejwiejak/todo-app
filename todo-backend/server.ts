import express, { Request, Response } from "express"
import cors from "cors"
import { body, validationResult, param } from "express-validator"

const app = express()

app.use(cors())
app.use(express.json())

interface Todo {
  id: number
  title: string
  completed: boolean
}

let todos: Todo[] = []
let id = 1

const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

app.get("/todos", (req: Request, res: Response) => {
  res.json(todos)
})

app.post(
  "/todos",
  body("title")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must be a non-empty string."),
  handleValidationErrors,
  (req: Request, res: Response) => {
    const newTodo: Todo = {
      id: id++,
      title: req.body.title,
      completed: false,
    }
    todos.push(newTodo)
    res.json(newTodo)
  }
)

app.put(
  "/todos/:id",
  param("id").isInt().withMessage("ID must be an integer."),
  body("title")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must be a non-empty string."),
  handleValidationErrors,
  (req: Request, res: Response) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id))
    if (!todo) return res.status(404).send("Todo not found.")
    todo.title = req.body.title
    res.json(todo)
  }
)

app.put(
  "/todos/:id/completed",
  param("id").isInt().withMessage("ID must be an integer."),
  body("completed")
    .isBoolean()
    .withMessage("Completed status must be a boolean."),
  handleValidationErrors,
  (req: Request, res: Response) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id))
    if (!todo) return res.status(404).send("Todo not found.")
    todo.completed = req.body.completed
    res.json(todo)
  }
)

app.delete(
  "/todos/:id",
  param("id").isInt().withMessage("ID must be an integer."),
  handleValidationErrors,
  (req: Request, res: Response) => {
    todos = todos.filter((t) => t.id !== parseInt(req.params.id))
    res.json({ message: "Todo deleted." })
  }
)

const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
