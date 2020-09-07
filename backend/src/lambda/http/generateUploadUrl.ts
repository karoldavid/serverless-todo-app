import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { todoExists, getTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../../lambda/utils'

const logger = createLogger('generateUploadUrl')

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const imagesTable = process.env.IMAGES_TABLE

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('Generate upload url for todo:', todoId)

  const validTodoId = await todoExists(todoId, event)

  if (!validTodoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }

  const todo = await getTodo(todoId, event)

  const imageId = uuid.v4()
  
  await createImage(todoId, imageId, todo, event)

  const url = getUploadUrl(imageId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({

      uploadUrl: url
    })
  }
}

async function createImage(
  todoId: string,
  imageId: string,
  todo: TodoItem,
  event: APIGatewayProxyEvent
) {
  const timestamp = new Date().toISOString()
  const userId = getUserId(event)

  const newItem = {
    userId,
    todoId,
    timestamp,
    imageId,
    ...todo,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
  }

  await docClient
    .put({
      TableName: imagesTable,
      Item: newItem
    })
    .promise()

  return newItem
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}
