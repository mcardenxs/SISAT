import { Hono } from "hono";
import { injectable } from "tsyringe";

import { LoginController } from "../controllers/LoginController";
import { RegisterController } from "../controllers/RegisterController";
import { RefreshTokenController } from "../controllers/RefreshTokenController";
import { LogoutController } from "../controllers/LogoutController";
import { MeController } from "../controllers/MeController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

@injectable()
export class AuthRouter {
	public readonly router: Hono;

	constructor(
		private readonly loginController: LoginController,
		private readonly registerController: RegisterController,
		private readonly refreshTokenController: RefreshTokenController,
		private readonly logoutController: LogoutController,
		private readonly meController: MeController,
		private readonly authMiddleware: AuthMiddleware,
	) {
		this.router = new Hono();
		this.initRoutes();
	}

	private initRoutes() {
		// TODO: Implement rate limiting for Hono (e.g., using a custom middleware or a package)
		// - Rate limiting: máx 5 intentos por IP en 15 minutos para login
		// - Rate limiting: máx 4 registros por IP en 1 hora

		/**
		 * @openapi
		 * /api/auth/login:
		 *   post:
		 *     tags: [Auth]
		 *     summary: Iniciar sesión
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             required: [email, password]
		 *             properties:
		 *               email:
		 *                 type: string
		 *                 format: email
		 *                 example: user@example.com
		 *               password:
		 *                 type: string
		 *                 format: password
		 *                 example: SecurePass123!
		 *     responses:
		 *       200:
		 *         description: Login exitoso, retorna par de tokens y datos del usuario
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/AuthResponse'
		 *       400:
		 *         description: Datos inválidos
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/ErrorResponse'
		 *       401:
		 *         description: Credenciales inválidas
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/ErrorResponse'
		 */
		this.router.post("/login", this.loginController.run);

		/**
		 * @openapi
		 * /api/auth/register:
		 *   post:
		 *     tags: [Auth]
		 *     summary: Registrar un nuevo usuario
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             required: [name, email, password]
		 *             properties:
		 *               name:
		 *                 type: string
		 *                 example: John Doe
		 *               email:
		 *                 type: string
		 *                 format: email
		 *                 example: user@example.com
		 *               password:
		 *                 type: string
		 *                 format: password
		 *                 description: Mínimo 12 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
		 *                 example: SecurePass123!
		 *     responses:
		 *       201:
		 *         description: Usuario registrado exitosamente y sesión iniciada
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/AuthResponse'
		 *       400:
		 *         description: Validación fallida o correo ya registrado
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/ErrorResponse'
		 */
		this.router.post("/register", this.registerController.run);

		/**
		 * @openapi
		 * /api/auth/refresh:
		 *   post:
		 *     tags: [Auth]
		 *     summary: Renovar tokens usando un refresh token válido
		 *     description: >
		 *       Rota el refresh token: el token enviado se revoca y se genera
		 *       un nuevo par accessToken + refreshToken (Refresh Token Rotation).
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             required: [refreshToken]
		 *             properties:
		 *               refreshToken:
		 *                 type: string
		 *                 example: 550e8400-e29b-41d4-a716-446655440000
		 *     responses:
		 *       200:
		 *         description: Tokens renovados exitosamente
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 accessToken:
		 *                   type: string
		 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
		 *                 refreshToken:
		 *                   type: string
		 *                   example: 550e8400-e29b-41d4-a716-446655440000
		 *       400:
		 *         description: Token no provisto o formato inválido
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/ErrorResponse'
		 *       401:
		 *         description: Refresh token inválido o expirado
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/ErrorResponse'
		 */
		this.router.post("/refresh", this.refreshTokenController.run);

		/**
		 * @openapi
		 * /api/auth/logout:
		 *   post:
		 *     tags: [Auth]
		 *     summary: Cerrar sesión (revocar refresh token)
		 *     description: >
		 *       Revoca el refresh token proporcionado. El access token seguirá
		 *       siendo válido hasta que expire (máx 15 min), pero no se podrá
		 *       obtener uno nuevo.
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             required: [refreshToken]
		 *             properties:
		 *               refreshToken:
		 *                 type: string
		 *                 example: 550e8400-e29b-41d4-a716-446655440000
		 *     responses:
		 *       200:
		 *         description: Sesión cerrada correctamente
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: Sesión cerrada correctamente
		 *       400:
		 *         description: Refresh token inválido
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/ErrorResponse'
		 */
		this.router.post("/logout", this.logoutController.run);

		/**
		 * @openapi
		 * /api/auth/me:
		 *   get:
		 *     tags: [Auth]
		 *     summary: Obtener usuario autenticado actual
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Perfil del usuario autenticado
		 *       401:
		 *         description: No autenticado
		 */
		this.router.get("/me", this.authMiddleware.handle, this.meController.run);
	}
}
