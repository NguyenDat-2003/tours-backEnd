/* eslint-disable no-useless-catch */
import slugify from '~/utils/slugify'

const creatNew = async (reqBody) => {
  try {
    // Xử lý logic tùy dự án
    const newTour = {
      ...reqBody,
      slug: slugify(reqBody.name)
    }

    // Gọi đến tầng model để xử lý lưu bản ghi vào database
    return newTour
  } catch (error) {
    throw error
  }
}

export const tourService = { creatNew }
