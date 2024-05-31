import { Joi as JoiCelebrate } from "celebrate";

export const loginValidation = () => {
  return JoiCelebrate.object().keys({
    email: JoiCelebrate.any()
      .required()
      .messages({ "any.required": "Provide  email" }),
    password: JoiCelebrate.string()
      .required()
      .messages({ "any.required": "Provide password" }),
  });
};

export const userCreationValidation = () => {
  return JoiCelebrate.object().keys({
    email: JoiCelebrate.any()
      .required()
      .messages({ "any.required": "Provide email" }),
    password: JoiCelebrate.string()
      .required()
      .messages({ "any.required": "Provide password" }),
    name: JoiCelebrate.string()
      .required()
      .messages({ "any.required": "Provide name" }),
  });
};

export const orderValidation = () => {
  return JoiCelebrate.object().keys({
    landSize: JoiCelebrate.any()
      .required()
      .messages({ "any.required": "Provide landSize" }),
    farmerEmail: JoiCelebrate.string()
      .required()
      .messages({ "any.required": "Provide Farmer Email" }),
    farmerName: JoiCelebrate.string()
      .required()
      .messages({ "any.required": "Provide Farmer Name" }),
    seedId: JoiCelebrate.string()
      .required()
      .messages({ "any.required": "Provide Seed ID" }),
    paymentMethod: JoiCelebrate.string().optional(),
  });
};

export const seedValidation = () => {
  return JoiCelebrate.object().keys({
    name: JoiCelebrate.any()
      .required()
      .messages({ "any.required": "Provide seed name" }),
    fertilizerId: JoiCelebrate.string()
      .required()
      .messages({ "any.required": "Provide Fertilizer ID" }),
    price: JoiCelebrate.number()
      .required()
      .messages({ "any.required": "Provide Price" }),
    description: JoiCelebrate.string().optional(),
  });
};

export const fertilizerValidation = () => {
  return JoiCelebrate.object().keys({
    name: JoiCelebrate.any()
      .required()
      .messages({ "any.required": "Provide seed name" }),
    price: JoiCelebrate.number()
      .required()
      .messages({ "any.required": "Provide Price" }),
    description: JoiCelebrate.string().optional(),
  });
};
