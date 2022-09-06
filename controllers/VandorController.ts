import { Request, Response, NextFunction } from 'express'
import { EditVandorInputs, VadorLoginInputs } from '../dto';
import { CreateFoodInputs } from '../dto';
import { Food } from '../models';
import { GenerateSignature, ValidatePassword } from '../untility';
import { FideVandor } from './AdminController';

export const vandorLogin = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = <VadorLoginInputs>req.body;

    const existingVandor = await FideVandor('', email);

    if (existingVandor !== null) {

        const validation = await ValidatePassword(password, existingVandor.password, existingVandor.salt);

        if (validation) {

            const signature = GenerateSignature({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodType: existingVandor.foodType,
                name: existingVandor.name
            })

            return res.json(signature);

        } else {

            return res.json({ "message": "Login Password not valid" })

        }
    }

    return res.json({ "message": "Login credentail not valid" })

}

export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if (user) {

        const existingVandor = await FideVandor(user._id)

        return res.json(existingVandor)

    }
    return res.json({ "message": "Vador infomation Not found" })
}

export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const { foodType, name, address, phone } = <EditVandorInputs>req.body;

    const user = req.user;

    if (user) {

        const existingVandor = await FideVandor(user._id)

        if (existingVandor !== null) {
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.foodType = foodType;


            const saveResult = await existingVandor.save()

            return res.json(saveResult);
        }

        return res.json(existingVandor)

    }
    return res.json({ "message": "Vador infomation Not found" })
}

export const UpdateVandorCoverImage = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if (user) {



        const vandor = await FideVandor(user._id)

        if (vandor !== null) {

            const files = req.files as [Express.Multer.File]

            const images = files.map((file: Express.Multer.File) => file.filename);

            vandor.coverImages.push(...images);

            const result = await vandor.save();

            return res.json(result);

        }
    }
    return res.json({ "message": "something went wrong with add food" })
}

export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if (user) {

        const existingVandor = await FideVandor(user._id)

        if (existingVandor !== null) {

            existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
            const saveResult = await existingVandor.save()
            return res.json(saveResult)
        }

        return res.json(existingVandor)
    }
    return res.json({ "message": "Vador infomation Not found" })
}


export const AddFood = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if (user) {

        const { name, description, category, foodType, readyTime, price, } = <CreateFoodInputs>req.body;

        const vandor = await FideVandor(user._id)

        if (vandor !== null) {

            const files = req.files as [Express.Multer.File]

            const images = files.map((file: Express.Multer.File) => file.filename);

            const createFood = await Food.create({

                vandorId: vandor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                readyTime: readyTime,
                price: price,
                rating: 0
            })

            vandor.foods.push(createFood);
            const result = await vandor.save();

            return res.json(result);

        }
    }
    return res.json({ "message": "something went wrong with add food" })
}

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if (user) {

        const foods = await Food.find({ vandorId: user._id })

        if (foods !== null) {
            return res.json(foods)
        }

    }
    return res.json({ "message": "Foods infomation Not found" })
}