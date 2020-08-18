import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')


const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  logger.info('Getting all todos')
  return todoAccess.getAllTodos()
}
