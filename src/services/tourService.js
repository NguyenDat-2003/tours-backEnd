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
  } catch (error) {
    throw new Error(error)
  }
}

export const tourService = { createNew }
