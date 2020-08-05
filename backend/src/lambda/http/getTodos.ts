import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

// FIXME: remove mock
const mockTodos = {
  items: [
    {
      todoId: '123',
      createdAt: '2019-07-27T20:01:45.424Z',
      name: 'Buy milk',
      dueDate: '2019-07-29T20:01:45.424Z',
      done: false,
      attachmentUrl: 'http://example.com/image.png'
    },
    {
      todoId: '456',
      createdAt: '2019-07-27T20:01:45.424Z',
      name: 'Send a letter',
      dueDate: '2019-07-29T20:01:45.424Z',
      done: true,
      attachmentUrl: 'http://example.com/image.png'
    }
  ]
}

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('event', event)
  // TODO: Get all TODO items for a current user
  // FIXME: remove mock
  return { statusCode: 200, body: JSON.stringify(mockTodos) }
}
