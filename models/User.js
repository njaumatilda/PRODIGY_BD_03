import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    trim: true,
  },
})

export default mongoose.model("user", userSchema)
