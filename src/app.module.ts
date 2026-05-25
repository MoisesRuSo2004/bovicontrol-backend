import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import cloudinaryConfig from './config/cloudinary.config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { FarmsModule } from './modules/farms/farms.module';
import { UsersModule } from './modules/users/users.module';
import { BreedsModule } from './modules/breeds/breeds.module';
import { AnimalsModule } from './modules/animals/animals.module';
import { GenealogyModule } from './modules/genealogy/genealogy.module';
import { ReproductionModule } from './modules/reproduction/reproduction.module';
import { HealthModule } from './modules/health/health.module';
import { ProductionModule } from './modules/production/production.module';
import { FinanceModule } from './modules/finance/finance.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, cloudinaryConfig],
      envFilePath: '.env',
    }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    FarmsModule,
    UsersModule,
    BreedsModule,
    AnimalsModule,
    GenealogyModule,
    ReproductionModule,
    HealthModule,
    ProductionModule,
    FinanceModule,
    NotificationsModule,
    AdminModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
