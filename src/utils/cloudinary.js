import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: 'dcfalmc7e', 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: 233176893371434, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: "0-N971MkpD_9BWYsK0p9GSkXEhU" 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
});

// console.log(process.env.CLOUDINARY_CLOUD_NAME);

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}