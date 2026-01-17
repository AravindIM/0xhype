import { LinkPreviewDto } from './link-preview.dto';

export class PostDto {
  title?: string;
  link: string;
  preview?: LinkPreviewDto;
}
