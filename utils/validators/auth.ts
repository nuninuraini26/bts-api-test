import { body } from "express-validator"

export const registValidator = [
    body("username")
        .isString()
        .isAlphanumeric()
        .isLength({ min: 4, max: 20 })
        .withMessage(
            "Username must be an alphanumeric string between 4 to 20 characters",
        ),

    body("password")
        .isString()
        .isLength({ min: 6 })
        .matches(/[A-Z]/)
        .matches(/[0-9]/)
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage(
            "Password must contain at least one uppercase letter, one number, one special character, and be at least 6 characters long",
        ),

    body("confirmPassword")
        .isString()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm password must match the password")
            }
            return true
        }),
]

export const loginValidator = [
    body("username").isString(),
    body("password").isString(),
]
