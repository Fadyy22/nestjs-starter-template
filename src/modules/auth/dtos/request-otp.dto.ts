import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

import { normalizeEmail } from 'src/common/utils/normalize-email';

const RequestOtpSchema = z.object({
  email: z.email('Invalid email address').transform(normalizeEmail),
});

export class RequestOtpDto extends createZodDto(RequestOtpSchema) {}
