import todos from './todos'
import { createLogger } from '../utils/logger'

const logger = createLogger('getTodos')

export const getTodos = (userId: string) => {
    logger.info('get all todos for user', userId)
    return todos
}
