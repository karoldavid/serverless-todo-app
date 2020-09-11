import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    logger.info('Deleting todo.', todoId)
    await deleteTodo(todoId, event)

    return {
      statusCode: 200,
      body: JSON.stringify({ todoId })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
