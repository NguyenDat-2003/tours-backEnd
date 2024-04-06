/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { tourModel } from '~/models/tourModel'
import ApiError from '~/utils/ApiError'
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
    const getNewTour = await tourModel.getDetail(createdTour.insertedId)
    return getNewTour
  } catch (error) {
    throw error
  }
}
const getDetail = async (tourId) => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const Tour = await tourModel.getDetail(tourId)
    if (!Tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tour not found')
    }
    return Tour
  } catch (error) {
    throw error
  }
}
const getAll = async () => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const Tour = await tourModel.getAll()
    // Tour.forEach((tour) => {
    //   tour.guides.forEach(guide => {
    //     delete guide
    //   })
    // })
    return Tour
  } catch (error) {
    throw error
  }
}

const deleteDetail = async (tourId) => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const Tour = await tourModel.deleteDetail(tourId)
    if (!Tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tour not found!')
    }

    return { delete: 'Delete Successfully!' }
  } catch (error) {
    throw error
  }
}

const updateDetail = async (tourId, reqBody) => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const Tour = await tourModel.updateDetail(tourId, reqBody)
    if (!Tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tour not found!')
    }
    return { update: 'Update Successfully!' }
  } catch (error) {
    throw error
  }
}

export const tourService = { createNew, getDetail, getAll, deleteDetail, updateDetail }
