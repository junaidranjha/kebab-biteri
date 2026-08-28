import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import cors from 'cors'
import express, { Express } from 'express'
import type { IncomingMessage, ServerResponse } from 'http'
import { AppModule } from '../src/app.module'

let cachedApp: Express | null = null
let bootstrapPromise: Promise<Express> | null = null

async function bootstrap(): Promise<Express> {
  if (cachedApp) return cachedApp
  if (bootstrapPromise) return bootstrapPromise

  bootstrapPromise = (async () => {
    const expressApp = express()

    // CORS FIRST so preflight OPTIONS is answered before anything else touches it
    expressApp.use(
      cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    )
    expressApp.options('*', cors())

    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
      logger: ['error', 'warn', 'log'],
    })

    nestApp.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    )
    // helmet with crossOriginResourcePolicy disabled — otherwise it blocks cross-origin XHR
    nestApp.use(helmet({ crossOriginResourcePolicy: false }))

    await nestApp.init()
    cachedApp = expressApp
    return expressApp
  })()

  return bootstrapPromise
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await bootstrap()
  return app(req as any, res as any)
}

export const config = {
  maxDuration: 30,
}
