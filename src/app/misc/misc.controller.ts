import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from '../authentication/decorators/is-public.decorator';
@ApiTags('Miscellaneous')
@Controller('misc')
export class MiscController {
  constructor() {}

  @Public()
  @Post('upload')
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 8, {
      storage: diskStorage({
        destination: './uploads',
        limits: { fileSize: 1024 * 1024 * 50 },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uplaod(@UploadedFiles() files) {
    files = files.map((f) => ({
      filename: f.filename,
      filepath: `${process.env.SITE_URL}/uploads/${f.filename}`,
    }));
    return { data: files };
  }
}
