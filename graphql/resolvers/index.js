const bcrypt = require('bcryptjs')
const EventModel = require('../../models/event')
const UserModel = require('../../models/user')

const user = async userId => {
  try {
    const user = await UserModel.findById(userId)
    return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) }
  }

  catch (err) {
    throw err
  }
}

const events = async eventIds => {
  try {
    const events = await EventModel.find({ _id: { $in: eventIds } })
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event.creator),
        date: new Date(event._doc.date).toISOString()
      }
    })
  }
  catch (error) {
    throw error
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await EventModel.find()
      return events.map(event => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          _id: event.id,
          creator: user.bind(this, event._doc.creator)
        }
      })
    }
    catch (error) { throw error }
  },
  createEvent: async args => {
    try {
      const event = new EventModel({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5c9de2c443cad9266c74fce5'
      })

      let createdEvent;
      const result = await event.save()
      createdEvent = {
        ...res._doc,
        _id: res._doc._id.toString(),
        creator: user.bind(this, res._doc.creator),
        date: new Date(res._doc.date).toISOString()
      }

      const user = await UserModel.findById('5c9de2c443cad9266c74fce5')
      if (!user) {
        throw new Error('User not found.')
      }
      user.createdEvents.push(event)
      await user.save()
      return createdEvent

    } catch (error) {
      throw error
    }
  },

  createUser: async (args) => {
    try {
      const existingUser = await UserModel.findOne({ email: args.userInput.email })

      if (existingUser) {
        throw new Error('User already exists.')
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
      const creator = new UserModel({
        email: args.userInput.email,
        password: hashedPassword,
      })
      const result = await creator.save()

      return { ...result._doc, password: null, _id: result.id }

    } catch (error) {
      throw error
    }

  }
}