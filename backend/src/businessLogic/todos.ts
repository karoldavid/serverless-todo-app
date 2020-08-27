import { APIGatewayProxyEvent } from 'aws-lambda'
// import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { getUserId } from '../lambda/utils'

const logger = createLogger('todos')

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  logger.info('Getting all todos')
  return todoAccess.getAllTodos()
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  event: APIGatewayProxyEvent
): Promise<TodoItem> {
  const itemId = uuid.v4()
  const userId = getUserId(event)

  logger.info('Creating todo.', itemId, userId)

  return await todoAccess.createTodo({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function updateTodo(
  itemId: string,
  updateTodo: UpdateTodoRequest,
  event: APIGatewayProxyEvent
): Promise<TodoUpdate> {
  const userId = getUserId(event)

  logger.info('Updating todo.', itemId, userId)

  return await todoAccess.updateTodo(userId, itemId, updateTodo)
}

export async function deleteTodo(
  todoId: string,
  event: APIGatewayProxyEvent
): Promise<string> {
  const userId = getUserId(event)

  logger.info('Deleting todo.', todoId, userId)

  return await todoAccess.deleteTodo(todoId, userId)
}

export async function todoExists(
  todoId: string,
  event: APIGatewayProxyEvent
): Promise<boolean> {
  const userId = getUserId(event)
  logger.info('Checking if todo exists.', todoId, userId)

  return await todoAccess.todoExists(todoId, userId)
}
