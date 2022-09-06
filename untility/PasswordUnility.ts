import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { VandorPayload } from '../dto';
import { APP_SECRET } from '../config/index';
import { AuthPayload } from '../dto/Auth.dto';

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async (password: string, salt: string) => {

    return await bcrypt.hash(password, salt);

}

export const ValidatePassword = async (enteredPassword: string, savePassword: string, salt: string) => {

    return await GeneratePassword(enteredPassword, salt,) === savePassword;
}


export const GenerateSignature = (payload: VandorPayload) => {

    return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' })

}

export const validateSignature = async (req: Request) => {

    const signature = req.get('Authorization');

    if(signature){

        const payload = jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;

        req.user = payload
        
        return true
    }

    return false
}