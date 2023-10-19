"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailResetPasswordClientService = void 0;
const entities_1 = require("../../entities");
const data_source_1 = require("../../data-source");
const errors_1 = require("../../errors");
const node_crypto_1 = require("node:crypto");
const updateClient_service_1 = require("./updateClient.service");
const sendEmail_utils_1 = require("../../utils/sendEmail.utils");
const sendEmailResetPasswordClientService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const clientRepository = data_source_1.AppDataSource.getRepository(entities_1.Client);
    const client = yield clientRepository.findOneBy({
        email: email
    });
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    if (!client) {
        throw new errors_1.AppError('Cliente não encontrado', 404);
    }
    const resetToken = (0, node_crypto_1.randomUUID)();
    const data = {
        reset_password: resetToken,
        expires_reset_password: today.toLocaleDateString()
    };
    yield (0, updateClient_service_1.updateResetPasswordClientService)(client.id, data);
    const resetPasswordTemplate = sendEmail_utils_1.emailService.resetPasswordClientTemplate(client.name, client.email, resetToken);
    yield sendEmail_utils_1.emailService.senEmail(resetPasswordTemplate);
});
exports.sendEmailResetPasswordClientService = sendEmailResetPasswordClientService;
