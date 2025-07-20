import multer from "multer";
import fs from 'fs'
export const multermiddelware = (destinationpath = "general", allowedtypes = []) => {
    try {
        // const destnationfolder = `assets/${destinationpath}`
        // if (!fs.existsSync(destnationfolder)) {
        //     fs.mkdirSync(destnationfolder, { recursive: true })
        // }
        const storage = multer.diskStorage({
        })

        const fileFilter = (req, file, cb) => {
            if (allowedtypes.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(new Error("Invalid file type"), false)
            }
        }
        const upload = multer({ fileFilter, storage })
        return upload

    } catch (error) {
        console.log(error);

    }
}


export const multermiddelwarehost = (allowedtypes = []) => {
    try {
        const storage = multer.diskStorage({ })

        const fileFilter = (req, file, cb) => {
            if (allowedtypes.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(new Error("Invalid file type"), false)
            }
        }
        const upload = multer({ fileFilter, storage })
        return upload

    } catch (error) {
        console.log(error);

    }
}