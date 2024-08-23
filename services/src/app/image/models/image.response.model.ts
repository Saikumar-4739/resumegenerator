import { ImageModel } from "./image.model";


export class ImageResponse {
    status: boolean;
    internalMessage: string;
    data: ImageModel[] | null;
    errorCode: number;
}