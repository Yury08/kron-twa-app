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
			'https://91e4-57-129-24-105.ngrok-free.app'
		],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	await app.listen(5555)
}
bootstrap()
