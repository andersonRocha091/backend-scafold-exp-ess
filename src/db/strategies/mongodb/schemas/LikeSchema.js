const Mongoose = require("mongoose");

const likeSchema = new Mongoose.Schema({
  repositoryId:{
    type: String,
    required: true,
    validate:{
      validator: function (item) {
        return Mongoose.isValidObjectId(item);
      },
      message: props => `${props.value} not valid mongo id!`
    }
  },
  likes:{
    type: Number,
    default: 0
    // validate:{
    //   validator: function (v) {
    //     let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    //     return urlRegex.test(v);
    //   },
    //   message: props => `${props.value} is not a valid url!`
    // }
  },
  users:{
    type: [String],
    default:[]
  },
  insertedAt: {
    type: Date,
    default: new Date(),
  },
})

module.exports = Mongoose.model('likes',likeSchema);