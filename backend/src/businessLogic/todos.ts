import { APIGatewayProxyEvent } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('getAllTodos')

import { getUserId } from '../lambda/utils'

// Serverless Framework Lesson 3: Port Get All Groups Demo
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

// FIXME: remove mock
export async function getAllTodos(event: APIGatewayProxyEvent) {
  const result = await docClient
    .scan({
      TableName: todosTable
    })
    .promise()

  const userId = getUserId(event)

  logger.info('get todos from dynamoDB success', userId)

  const items = result.Items

  return items
}
