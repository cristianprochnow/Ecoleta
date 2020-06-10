import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemsController {
  async index(request: Request, response: Response) {
    const listedItems = await knex('items').select('*')

    const serializedItems = listedItems.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.2.4:3333/uploads/${item.image}`
      }
    })

    return response.json(serializedItems)
  }
}

export default ItemsController
