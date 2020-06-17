import express, { request, response } from 'express'
import { celebrate } from 'celebrate'
import multer from 'multer'

import multerConfig from './config/multer'

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

import PointsValidator from './validators/PointsValidator'

const routes = express.Router()

const upload = multer(multerConfig)

const pointsController = new PointsController()
const itemsController = new ItemsController()

routes.get('/items', itemsController.index)

routes.post(
  '/points',
  upload.single('image'),
  PointsValidator.create,
  pointsController.create
)
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

export default routes
