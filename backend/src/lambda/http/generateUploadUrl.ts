import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as uuid from 'uuid'
import { todoExists, getTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../../lambda/utils'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const logger = createLogger('generateUploadUrl')

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const imagesTable = process.env.IMAGES_TABLE

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const imageId = uuid.v4()

    await createImage(todoId, imageId, todo, event)

    const url = getUploadUrl(imageId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

async function createImage(
  todoId: string,
  imageId: string,
  todo: TodoItem,
  event: APIGatewayProxyEvent
) {
  const timestamp = new Date().toISOString()
  // const newImage = JSON.parse(event.body)
  const userId = getUserId(event)

  const newItem = {
    userId,
    todoId,
    timestamp,
    imageId,
    ...todo,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
  }
  console.log('Storing new item: ', newItem)

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
