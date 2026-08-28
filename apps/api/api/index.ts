import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import type { IncomingMessage, ServerResponse } from 'http'
import { AppModule } from '../src/app.module'

let cachedHandler: any = null
let bootstrapPromise: Promise<any> | null = null

async function bootstrap() {
  if (cachedHandler) return cachedHandler
  if (bootstrapPromise) return bootstrapPromise

  bootstrapPromise = (async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log'],
    })

    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    )

    await app.init()
    cachedHandler = app.getHttpAdapter().getInstance()
    return cachedHandler
  })()

  return bootstrapPromise
}

function setCorsHeaders(req: IncomingMessage, res: ServerResponse) {
  const origin = (req.headers.origin as string) || '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res)
    res.statusCode = 204
    res.end()
    return
  }

  try {
    const app = await bootstrap()
    return app(req, res)
  } catch (err: any) {
    setCorsHeaders(req, res)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    console.error('BOOTSTRAP_ERROR', err?.stack || err)
    res.end(
      JSON.stringify({
        error: 'BOOTSTRAP_ERROR',
        message: err?.message || String(err),
        stack: err?.stack || null,
      }),
    )
  }
}

export const config = {
  maxDuration: 30,
}
