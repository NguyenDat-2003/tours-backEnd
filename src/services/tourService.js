/* eslint-disable no-useless-catch */
import { tourModel } from '~/models/tourModel'
import slugify from '~/utils/slugify'

const createNew = async (reqBody) => {
  try {
    // Xử lý logic tùy dự án
    const newTour = {
      ...reqBody,
      slug: slugify(reqBody.name)
    }

    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const createdTour = await tourModel.createNew(newTour)
    const getNewTour = await tourModel.findOneById(createdTour.insertedId)
    return getNewTour
  } catch (error) {
    throw error
  }
}

export const tourService = { createNew }
