
import{v2 as cloudinary} from 'cloudinary';
export const cloudinaryConfig = () => {
    cloudinary.config({

        cloud_name: process.env.cloudnary_name,
        api_key: process.env.cloudnary_api_key,
        api_secret: process.env.cloudnary_api_secret
    })
return cloudinary
}
    