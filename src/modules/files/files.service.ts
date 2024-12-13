import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  constructor(private readonly configService: ConfigService) {}
  async uploadFile(
    file: Express.Multer.File,
    { id }: Partial<User>,
  ): Promise<any> {
    try {
      const destination = this.configService.get('multer.destination');
      const filename = `${id}-cv-${file.originalname}`;
      const fullPath = join(destination, filename);
      writeFileSync(fullPath, file.buffer);
      return fullPath;
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }
}
