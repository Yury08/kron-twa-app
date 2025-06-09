import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.enableCors({
		origin: [
			'http://localhost:3000',
<<<<<<< HEAD
			'https://5a5e-162-19-19-236.ngrok-free.app'
=======
			'https://7751-2001-41d0-403-4c04-00.ngrok-free.app'
>>>>>>> 1bbd4e0b19b66a21cad466dac28d9189f34c2810
		],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	await app.listen(5555)
}
bootstrap()
