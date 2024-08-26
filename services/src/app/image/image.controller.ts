import { Controller, Post, Body, Get, Param, BadRequestException, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Buffer } from 'buffer';
import * as fs from 'fs/promises';
import * as path from 'path';
import CreateImageDto from './models/create-image.dto';
import { ImageModel } from './models/image.model';
import { ImageService } from './image.services';

@Controller('images')
export class ImageController {
  private readonly uploadPath = path.resolve('./uploads'); // Ensure absolute path

  constructor(private readonly imageService: ImageService) {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (err) {
      console.error('Error creating upload directory:', err);
    }
  }

  @Post('upload')
  async uploadImage(@Body() body: { base64: string, userId: number }): Promise<ImageModel> {
    const { base64, userId } = body;

    if (!base64) {
      throw new BadRequestException('No Base64 data provided');
    }

    const [header, data] = base64.split(',');
    const extension = header.split(';')[0].split('/')[1];

    if (!data || !extension) {
      throw new BadRequestException('Invalid Base64 data');
    }

    const buffer = Buffer.from(data, 'base64');
    const filename = `${Date.now()}.${extension}`;
    const filePath = path.join(this.uploadPath, filename);

    try {
      await fs.writeFile(filePath, buffer);
    } catch (err) {
      console.error('Error saving file:', err);
      throw new BadRequestException('Error saving file');
    }

    const createImageDto: CreateImageDto = {
      filename,
      path: filename, 
      userId
    };

    try {
      return await this.imageService.saveImage(createImageDto);
    } catch (err) {
      console.error('Error saving image information:', err);
      throw new BadRequestException('Error saving image information');
    }
  }

  @Get()
  async getAllImages(): Promise<ImageModel[]> {
    try {
      return await this.imageService.findAll();
    } catch (err) {
      console.error('Error fetching images:', err);
      throw new BadRequestException('Error fetching images');
    }
  }

  @Get('user/:userId')
  async getImagesByUserId(@Param('userId') userId: number): Promise<ImageModel[]> {
    try {
      return await this.imageService.findByUserId(userId);
    } catch (err) {
      console.error('Error fetching images for user:', err);
      throw new BadRequestException('Error fetching images for user');
    }
  }

  @Get('uploads/:filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const filePath = path.join(this.uploadPath, filename);

    try {
      const fileStat = await fs.stat(filePath);
      if (fileStat.isFile()) {
        res.sendFile(filePath);
      } else {
        res.status(HttpStatus.NOT_FOUND).send('File not found');
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.status(HttpStatus.NOT_FOUND).send('File not found');
      } else {
        console.error('Error serving file:', err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
      }
    }
  }
}
