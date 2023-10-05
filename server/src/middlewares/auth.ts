import jwt from "jsonwebtoken"
import { SECRET } from "../config/env"
import { User } from "../models/User"

export const createJWTToken = (user: User) => {
    const userRoles = user.roles.map((role: {[key:string]: any}) => {
        return { _id: role._id.toString(), name: role.name }
    })
    return jwt.sign(
        { 
            userId: user._id,
            userEmail: user.email,
            userName: user.username,
            userRoles
        }, SECRET, {
            expiresIn: '24h'
        }
    )
}