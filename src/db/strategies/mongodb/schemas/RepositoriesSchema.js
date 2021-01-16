const Mongoose = require("mongoose");

const repositoriesSchema = new Mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  url:{
    type: String,
    required: true,
    validate:{
      validator: function (v) {
        let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
        return urlRegex.test(v);
      },
      message: props => `${props.value} is not a valid url!`
    }
  },
  techs:{
    type: [String],
    required: true,
  },
  likes:{
    type: Number,
    default: 0,
  },
  insertedAt: {
    type: Date,
    default: new Date(),
  },
})

module.exports = Mongoose.model('repositories',repositoriesSchema);