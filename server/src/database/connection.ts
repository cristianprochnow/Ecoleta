import knex from 'knex'
import path from 'path'

const knexConfig = require('../../knexfile')

const config  = process.env.NODE_ENV === 'test' ? knexConfig.test : knexConfig.development

const connection = knex(config)

export default connection
