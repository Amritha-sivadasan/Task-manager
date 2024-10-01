import { NextFunction,Request,Response } from 'express';
import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Must be a valid email",
    "any.required": "Email is required"
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required"
  }),
});

