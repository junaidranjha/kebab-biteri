import 'reflect-metadata'
import type { IncomingMessage, ServerResponse } from 'http'

let cachedHandler: any = null
let bootstrapPromise: Promise<any> | null = null

function setCorsHeaders(req: IncomingMessage, res: ServerResponse) {
  const origin = (req.headers.origin as string) || '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

async function bootstrap() {
  if (cachedHandler) return cachedHandler
  if (bootstrapPromise) return bootstrapPromise

  bootstrapPromise = (async () => {
    // Defer imports so any load error is catchable
    const { NestFactory } = require('@nestjs/core')
    const { ValidationPipe } = require('@nestjs/common')
    const { AppModule } = require('../src/app.module')

    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] })
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
        code: err?.code || null,
        node: process.version,
      }),
    )
  }
}

export const config = {
  maxDuration: 30,
}
