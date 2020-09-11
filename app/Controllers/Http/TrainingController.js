'use strict'

const Training = use("App/Models/Training");

class TrainingController {
  async index() {
    return await Training.all();
  }

  async show({ params }) {
    const training = await Training.findOrFail(params.id);
    return training
  }

  async store({ request }) {
    const {exercises, ...data } = request.only([
      "client_id",
      "name",
      "observation",
      "exercises"
    ])

    const training = await Training.create(data);

    if(exercises && exercises.length > 0) {
      await training.exercises().attach(exercises)
    }

    await training.load('exercises')
    return training;

  }

  async update({ params, request }) {
    const training = await Training.findOrFail(params.id);
    const {exercises, ...data } = request.only([
      "client_id",
      "name",
      "observation",
      "exercises"
    ])

    training.merge(data)
    await training.save()

    if(exercises && exercises.length > 0) {
      await training.exercises().sync(exercises)
    }

    await training.load('exercises')
    return training;

  }

  async destroy({ params }) {
    const training = await Training.findOrFail(params.id);
    return training.delete()
  }
}

module.exports = TrainingController
