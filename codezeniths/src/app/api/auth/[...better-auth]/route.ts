import { AuthService } from "@/lib/auth/auth.service";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(AuthService.auth);
