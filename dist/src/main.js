"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('app.port', 3000);
    const apiPrefix = configService.get('app.apiPrefix', 'api/v1');
    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('BoviControl API')
        .setDescription('Plataforma Inteligente para Gestión Ganadera — API REST')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth', 'Autenticación y sesiones')
        .addTag('Farms', 'Gestión de fincas')
        .addTag('Users', 'Gestión de usuarios')
        .addTag('Breeds', 'Razas del ganado')
        .addTag('Animals', 'Registro de animales')
        .addTag('Genealogy', 'Genealogía y genética')
        .addTag('Reproduction', 'Control reproductivo')
        .addTag('Health', 'Sanidad y vacunas')
        .addTag('Production', 'Producción (leche y pesajes)')
        .addTag('Finance', 'Finanzas y ventas')
        .addTag('Notifications', 'Notificaciones')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    await app.listen(port);
    console.log(`🚀 BoviControl API corriendo en http://localhost:${port}/${apiPrefix}`);
    console.log(`📚 Swagger docs en http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map