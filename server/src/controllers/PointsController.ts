import { Request, Response } from 'express'

import knex from '../database/connection'
import getLocalIPAdress from '../utils/getLocalIPAddress'

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query

    const myIPAdress = getLocalIPAdress()

    const parsedItems = String(items)
      .split(',')
      .map(specificItem => Number(specificItem.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://${myIPAdress}:3333/uploads/${point.image}`
      }
    })

    return response.json(serializedPoints)
  }

  async show(request: Request, response: Response) {
    const { id } = request.params

    const myIPAdress = getLocalIPAdress()

    const point = await knex('points').where('id', id).first()

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' })
    }

    const serializedPoint = {
      ...point,
      image_url: `http://${myIPAdress}:3333/uploads/${point.image}`
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return response.json({ point: serializedPoint, items })
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body

    const { filename } = request.file

    /**
     * trx -> Processo que controla todas as queries.
     *
     * Fazendo assim com que todas aconteçam em conjunto,
     * e não uma dar erro, enquanto a outra executa.
     *
     * E no fim, tem que dar fim ao processo, com o .commit()
     */
    const trx = await knex.transaction()

    const point = {
      image: filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }

    const idOfSignedPoint = await trx('points').insert(point)

    const point_id = idOfSignedPoint[0]

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id
        }
      })

    await trx('point_items').insert(pointItems)

    await trx.commit()

    return response.json({
      id: point_id,
      ...point
    })
  }
}

export default PointsController
