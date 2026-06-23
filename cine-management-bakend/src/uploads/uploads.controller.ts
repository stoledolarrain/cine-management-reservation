/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

// Le explicamos a TypeScript exactamente qué trae el archivo para evitar errores
interface ArchivoSubido {
  originalname: string;
  filename: string;
}

@UseGuards(AuthGuard, RolesGuard)
@Controller('uploads')
export class UploadsController {
  @Post('poster')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req: any, file: any, callback: any) => {
          // El linter ya no molestará por acceder a file.originalname
          const originalname = file.originalname;
          const uniqueSuffix =
            Date.now().toString() +
            '-' +
            Math.round(Math.random() * 1e9).toString();
          const ext = extname(originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req: any, file: any, callback: any) => {
        const originalname = file.originalname;
        if (!originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Solo se permiten archivos de imagen'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: ArchivoSubido) {
    if (!file) {
      throw new BadRequestException('No se envió ningún archivo');
    }
    // Devolvemos el texto que tu compañero guardará en la base de datos
    return {
      url: `http://localhost:3000/uploads/posters/${file.filename}`,
    };
  }
}
