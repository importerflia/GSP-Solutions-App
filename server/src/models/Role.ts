import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { Types } from 'mongoose'

@modelOptions({
    schemaOptions: {
        versionKey: false
    }
})
export class Role {
    public _id?: Types.ObjectId

    @prop({ type: String, required: true, unique: true, trim: true })
    name: string
}

export const RoleModel = getModelForClass(Role)