import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/Interfaces/file";

// Configuration
cloudinary.config({
  cloud_name: "duthiv22y",
  api_key: "939611967734855",
  api_secret: "c6Hlb1Q7Z0hjoG_aX7TyImhfMV4", // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  // console.log({ file });
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      {
        public_id: file.originalname,
      },
      // function (error: any, result: any) {
      //   console.log(result);
      // }
      (error: any, result: any) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// (async function () {
//   // Upload an image
//   const uploadResult = await cloudinary.uploader
//     .upload(
//       "D:/Lavel 2/Main Course/Prisma Pro/PH HealthCare/practics_01/uploads/profileImg.jpg",
//       {
//         public_id: "shoes",
//       }
//     )
//     function async(error: any, result: any) {
//       console.log(result);
//     }
//     // .catch((error) => {
//     //   console.log(error);
//     // });

//   console.log(uploadResult);

//   // Optimize delivery by resizing and applying auto-format and auto-quality
//   // const optimizeUrl = cloudinary.url("shoes", {
//   //   fetch_format: "auto",
//   //   quality: "auto",
//   // });

//   // console.log(optimizeUrl);

//   // Transform the image: auto-crop to square aspect_ratio
//   // const autoCropUrl = cloudinary.url("shoes", {
//   //   crop: "auto",
//   //   gravity: "auto",
//   //   width: 500,
//   //   height: 500,
//   // });

//   // console.log(autoCropUrl);
// })();

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
