import Joi from 'joi'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import { GET_DB } from '~/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  userName: Joi.string().required().trim().strict(),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().required().min(8),
  passwordConfirm: Joi.string(),
  displayName: Joi.string().trim().strict(),
  avatar: Joi.string().trim().strict().default('default.jpg'),
  role: Joi.string().valid('user', 'guide', 'lead-guide', 'admin').default('user'),
  isAcive: Joi.boolean().default(true),

  passwordResetToken: Joi.string(),
  passwordResetExpires: Joi.date(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    //--- Kiểm tra data trước khi insert vào database
    const validData = await validateBeforeCreate(data)
    // console.log(validData.locations)

    delete validData.passwordConfirm
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (userId) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId) })
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).find().toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const getDetail = async (userId) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId) })
  } catch (error) {
    throw new Error(error)
  }
}

const deleteDetail = async (userId) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(userId) })
  } catch (error) {
    throw new Error(error)
  }
}

const updateDetail = async (userId, reqBody) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(userId) }, { $set: reqBody }, { returnDocument: 'after' })
  } catch (error) {
    throw new Error(error)
  }
}

const login = async (reqBody) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: reqBody.email })
  } catch (error) {
    throw new Error(error)
  }
}

const findEmailResetToken = async (email) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })

    // Create Password Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex')

    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // I need to specify a time to expire this token. In this example is (10 min)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(user._id) }, { $set: user }, { returnDocument: 'after' })
  } catch (error) {
    throw new Error(error)
  }
}

const findTokenResetPass = async (hashedToken) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ passwordResetToken: hashedToken })
  } catch (error) {
    throw new Error(error)
  }
}

const updateMe = async (reqUserId, filteredBody) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(reqUserId) }, { $set: filteredBody }, { returnDocument: 'after' })
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getAll,
  getDetail,
  deleteDetail,
  updateDetail,
  login,
  findEmailResetToken,
  findTokenResetPass,
  updateMe
}
