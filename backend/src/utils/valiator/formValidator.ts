    import { NextFunction,Request,Response } from 'express';
    import Joi from 'joi';

    export const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must not exceed 30 characters",
        "any.required": "Name is required"
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Must be a valid email",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required"
    }),
    });

export const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
       
        const errors = error.details.map((err) => err.message);
        console.log("errors",errors)
        res.status(400).json({ success: false,message:errors });
         return
      }

      next();
    };
  };
