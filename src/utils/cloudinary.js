import {v2 as cloudinary} from 'cloudinary';
import { log } from 'console';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret:  CLOUDINARY_API_SECRET
});

const fileuploder = async (localpath) => {
    try {
        if(!localpath) return null;
        
        const response = await cloudinary.uploader.upload(localpath, {
            resource_type : "auto"
        });

        console.log(`File is uploaded on cloudinary.` , response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localpath);  // remove the locally saved file as the upload operation got field.
        return null;
    }
}