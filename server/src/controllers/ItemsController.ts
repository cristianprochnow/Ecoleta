import { Request, Response } from 'express'

import knex from '../database/connection'
import getLocalIPAdress from '../utils/getLocalIPAddress'

class ItemsController {
  async index(request: Request, response: Response) {
    const listedItems = await knex('items').select('*')

    const myIPAdress = getLocalIPAdress()

    const serializedItems = listedItems.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://${myIPAdress}:3333/uploads/${item.image}`
      }
    })

    return response.json(serializedItems)
  }
}

export default ItemsController
