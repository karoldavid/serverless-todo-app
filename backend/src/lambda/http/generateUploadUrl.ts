import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { todoExists} from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('Generate upload url for todo:', todoId)

  const result = await todoExists(todoId, event)

  logger.info('Todo exists:', result)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 200,
    body: JSON.stringify({
      todoId,
      todoExists: result,
      url: 'image upload url',
    })
  }
}
