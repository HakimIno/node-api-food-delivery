import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { AdminRoute, VandorRoute } from "./routes";
import { MONGO_URL } from "./config";

import path from 'path'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/admin', AdminRoute);
app.use('/vandor', VandorRoute);
app.use('/iamges', express.static(path.join(__dirname, 'images')))


mongoose.connect(MONGO_URL).then(result => {
    // console.log(result)
    console.log('DB connected!!')
}).catch(err => console.log("error" + err))

app.listen(8888, () => {
    console.clear();
    console.log('App is listening to the prot 8888')
})