import { APIGatewayProxyEvent } from 'aws-lambda'
// import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
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

  logger.info('Creating todo for user: ', userId)

  return await todoAccess.createTodo({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
  })
}
