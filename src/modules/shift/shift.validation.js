import Joi from 'joi';

const shiftSchema = Joi.object({
  name: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required()
});

export default shiftSchema;