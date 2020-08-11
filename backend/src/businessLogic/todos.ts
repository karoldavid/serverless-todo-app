import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../lambda/utils'
import { getTodos } from '../__mock__/helpers'

// FIXME: remove mock
export async function getAllTodos(event: APIGatewayProxyEvent) {
  const userId = getUserId(event)

  const todos = getTodos(userId)

  return await Promise.resolve(todos)
}
