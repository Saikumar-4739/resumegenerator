// image.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, Body, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageService } from './image.services';
import { CreateImageDto } from './models/create.image.model';
import { ImageModel } from './models/image.model';


@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const filename = `${Date.now()}${extname(file.originalname)}`;
        callback(null, filename);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: CreateImageDto): Promise<ImageModel> {
    console.log('Uploaded file:', file);
    console.log('Additional fields:', body);

    if (!file) {
      throw new Error('No file uploaded');
    }

    const { userId } = body;
    const createImageDto: CreateImageDto = {
      filename: file.filename,
      path: file.path,
      userId
    };
    const savedImage = await this.imageService.saveImage(createImageDto);
    return savedImage;
  }

  @Get()
  async getAllImages(): Promise<ImageModel[]> {
    return this.imageService.findAll();
  }

  @Get('user/:userId')
  async getImagesByUserId(@Param('userId') userId: number): Promise<ImageModel[]> {
    return this.imageService.findByUserId(userId);
  }
}
