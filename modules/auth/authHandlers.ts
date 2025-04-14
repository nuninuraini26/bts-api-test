import { PrismaClient } from "@prisma/client"
import { UnauthorizedError, NotFoundError, BadRequestError } from "../../errors"
import type { Auth, Registration } from "../../types"
import { compare, hash } from "bcrypt"
import jwt from "jsonwebtoken"

class AuthService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async _validateUser(payload: Auth) {
        try {
            const getUser = await this.prisma.users.findFirst({
                where: { email: payload.username, is_active: true },
            })

            if (!getUser) throw new UnauthorizedError()

            const passwordCompare = await compare(
                payload.password,
                getUser.password,
            )

            if (!passwordCompare)
                throw new BadRequestError("Password is not valid.")
            return getUser
        } catch (error: any) {
            throw error
        }
    }

    async userRegister(payload: Registration) {
        try {
            return await this.prisma.$transaction(async (prisma: any) => {
                if (!payload.email && !payload.username)
                    throw new BadRequestError(
                        "Registration data is not valid. You must fill the username and email first.",
                    )
                if (payload.email) {
                    const checkEmail = await prisma.users.findUnique({
                        where: { email: payload.email },
                    })

                    if (checkEmail) {
                        throw new BadRequestError(
                            "Email is exist, please use different account.",
                        )
                    }
                }

                if (payload.username) {
                    const checkUsername = await prisma.users.findUnique({
                        where: { username: payload.username },
                    })

                    if (checkUsername) {
                        throw new BadRequestError(
                            "Username is exist, please use different name",
                        )
                    }
                }

                const encryptedPassword = await hash(payload.password, 10)

                const createdUser = await prisma.users.create({
                    data: {
                        username: payload.username,
                        email: payload.email,
                        password: encryptedPassword,
                        is_active: true,
                    },
                })
            })
        } catch (error) {
            throw error
        }
    }
}

export default AuthService
