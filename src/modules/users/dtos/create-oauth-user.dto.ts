import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

import { normalizeEmail } from 'src/common/utils/normalize-email';
import { AuthProvider } from '../../auth/enums/auth-provider';

const CreateOAuthUserSchema = z.object({
  email: z.email('Invalid email address').transform(normalizeEmail),
  full_name: z.string(),
  provider: z.enum(AuthProvider),
});

export class CreateOAuthUserDto extends createZodDto(CreateOAuthUserSchema) {}
