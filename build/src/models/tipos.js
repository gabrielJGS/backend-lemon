"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalidadesTarifarias = exports.classesDeConsumo = exports.tiposDeConexao = exports.cnpj = exports.cpf = void 0;
const cpf = {
    type: 'string',
    pattern: '^\\d{11}$',
    example: '21554495008',
};
exports.cpf = cpf;
const cnpj = {
    type: 'string',
    pattern: '^\\d{14}$',
    example: '33400689000109',
};
exports.cnpj = cnpj;
const tiposDeConexao = ['monofasico', 'bifasico', 'trifasico'];
exports.tiposDeConexao = tiposDeConexao;
const classesDeConsumo = [
    'residencial',
    'industrial',
    'comercial',
    'rural',
    'poderPublico',
];
exports.classesDeConsumo = classesDeConsumo;
const modalidadesTarifarias = ['azul', 'branca', 'verde', 'convencional'];
exports.modalidadesTarifarias = modalidadesTarifarias;
