// src/common/file-upload.config.ts

import { diskStorage } from 'multer';
// 👆 multer ka diskStorage — file disk par save karne ke liye

import { extname } from 'path';
// 👆 File ka extension nikalne ke liye — .jpg, .png etc

import { BadRequestException } from '@nestjs/common';

// 👇 Multer Options — File kaise save karein
export const multerConfig = {

  // 👇 Storage — File kahan aur kaise save karein
  storage: diskStorage({

    // 👇 Destination — Kahan save karein
    destination: './uploads',
    // 👆 Root folder ke andar uploads/ folder mein

    // 👇 Filename — Kya naam dein
    filename: (req, file, callback) => {
      // file.originalname = "my laptop.jpg"

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // 👆 Unique number banao — taaki same naam ki files overwrite na hon
      // Date.now() = 1234567890123
      // Math.random() * 1e9 = 987654321
      // uniqueSuffix = "1234567890123-987654321"

      const ext = extname(file.originalname);
      // 👆 Extension nikalo → ".jpg"

      const filename = `product-${uniqueSuffix}${ext}`;
      // 👆 Final naam → "product-1234567890123-987654321.jpg"

      callback(null, filename);
      // 👆 null = koi error nahi, filename = yeh naam use karo
    },
  }),

  // 👇 File Filter — Kaun si files allow karein
  fileFilter: (req, file, callback) => {

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    // 👆 Sirf yeh image types allow hain

    if (!allowedTypes.includes(file.mimetype)) {
      // 👆 mimetype = file ka type → "image/jpeg", "video/mp4" etc
      return callback(
        new BadRequestException('Sirf JPG, PNG, WEBP images allowed hain'),
        false
        // 👆 false = file reject karo
      );
    }

    callback(null, true);
    // 👆 null = koi error nahi, true = file accept karo
  },

  // 👇 Limits — File size limit
  limits: {
    fileSize: 5 * 1024 * 1024,
    // 👆 5MB maximum
    // 5 * 1024 * 1024 = 5,242,880 bytes = 5MB
  },
};