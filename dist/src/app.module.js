"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_config_1 = __importDefault(require("./config/app.config"));
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
const cloudinary_config_1 = __importDefault(require("./config/cloudinary.config"));
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const prisma_module_1 = require("./prisma/prisma.module");
const supabase_module_1 = require("./supabase/supabase.module");
const auth_module_1 = require("./modules/auth/auth.module");
const farms_module_1 = require("./modules/farms/farms.module");
const users_module_1 = require("./modules/users/users.module");
const breeds_module_1 = require("./modules/breeds/breeds.module");
const animals_module_1 = require("./modules/animals/animals.module");
const genealogy_module_1 = require("./modules/genealogy/genealogy.module");
const reproduction_module_1 = require("./modules/reproduction/reproduction.module");
const health_module_1 = require("./modules/health/health.module");
const production_module_1 = require("./modules/production/production.module");
const finance_module_1 = require("./modules/finance/finance.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default, jwt_config_1.default, cloudinary_config_1.default],
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            supabase_module_1.SupabaseModule,
            auth_module_1.AuthModule,
            farms_module_1.FarmsModule,
            users_module_1.UsersModule,
            breeds_module_1.BreedsModule,
            animals_module_1.AnimalsModule,
            genealogy_module_1.GenealogyModule,
            reproduction_module_1.ReproductionModule,
            health_module_1.HealthModule,
            production_module_1.ProductionModule,
            finance_module_1.FinanceModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
        ],
        providers: [
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.AllExceptionsFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: response_interceptor_1.ResponseInterceptor },
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map