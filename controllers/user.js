import mongoose from "mongoose"
import Joi from "joi"
import userModel from "../models/User.js"
import isValidEmailDomain from "../utils/validEmailDomainChecker.js"

const readAllUsers = async (req, res) => {
  try {
    const users = await userModel.find()

    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const readSingeleUser = async (req, res) => {
  try {
    const { id } = req.params

    const checkForValidId = mongoose.Types.ObjectId.isValid(id)
    if (!checkForValidId) {
      return res.status(400).json({
        message: "Invalid ID format",
      })
    }

    const findUser = await userModel.findById({ _id: id })
    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    res.status(200).json(findUser)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body

    const schema = Joi.object({
      name: Joi.string().min(3).max(20).trim().required(),
      email: Joi.string().email().trim().required(),
      age: Joi.number().positive().required(),
    })

    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const checkForExistingEmail = await userModel.findOne({ email })
    if (checkForExistingEmail) {
      return res.status(409).json({
        message: "Email is already in use",
      })
    }

    const checkForValidEmail = await isValidEmailDomain(email)
    if (!checkForValidEmail) {
      return res.status(400).json({
        message: "Invaid email domain",
      })
    }

    // TODO: to check further if email exists, send a verification email:
    // where the user will verify then a successful creation happens
    const newUser = await userModel.create({
      name,
      email,
      age,
    })

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, age } = req.body
    const updatedData = {}

    const checkForValidId = mongoose.Types.ObjectId.isValid(id)
    if (!checkForValidId) {
      return res.status(400).json({
        message: "Invalid ID format",
      })
    }

    if (name != null) updatedData.name = name
    if (email != null) updatedData.email = email
    if (age != null) updatedData.age = age

    if (name) {
      const nameSchema = Joi.string().min(3).max(20).trim()
      const { error } = nameSchema.validate(name)
      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }
    }

    if (email) {
      const emailSchema = Joi.string().email().trim()
      const { error } = emailSchema.validate(email)
      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }
    }

    if (age) {
      const ageSchema = Joi.number().positive()
      const { error } = ageSchema.validate(age)
      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }
    }

    const findUserToUpdate = await userModel.findById({ _id: id })
    if (!findUserToUpdate) {
      return res.status.json({
        message: "User not found",
      })
    }

    const checkForValidEmail = await isValidEmailDomain(email)
    if (!checkForValidEmail) {
      return res.status(400).json({
        message: "Invaid email domain",
      })
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: id },
      updatedData,
      { new: true }
    )

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const deleteSingleUser = async (req, res) => {
  try {
    const { id } = req.params

    const checkForValidId = mongoose.Types.ObjectId.isValid(id)
    if (!checkForValidId) {
      return res.status(400).json({
        message: "Invalid ID format",
      })
    }

    const findUser = await userModel.findById({ _id: id })
    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const deletedUser = await userModel.findByIdAndDelete({ _id: id })

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const deleteAllUsers = async (req, res) => {
  try {
    const deletedUsers = await userModel.deleteMany({})

    res.status(200).json({
      message: "Users deleted successfully",
      users: deletedUsers,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export {
  readSingeleUser,
  readAllUsers,
  createUser,
  updateUser,
  deleteSingleUser,
  deleteAllUsers,
}
