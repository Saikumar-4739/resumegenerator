import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entities'
import CreateImageDto from './models/create-image.dto';
import { ImageModel } from './models/image.model';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async saveImage(createImageDto: CreateImageDto): Promise<ImageModel> {
    const image = this.imageRepository.create(createImageDto);
    const savedImage = await this.imageRepository.save(image);
    return savedImage as ImageModel;
  }

  async findAll(): Promise<ImageModel[]> {
    const images = await this.imageRepository.find();
    return images as ImageModel[];
  }

  // Update this method
  async findByUserId(userId: number): Promise<ImageModel[]> {
    const images = await this.imageRepository.find({ where: { userId } });
    return images as ImageModel[];
  }
}
