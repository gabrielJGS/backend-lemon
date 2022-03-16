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
exports.elegibilidade = void 0;
var Validator = require('jsonschema').Validator;
const schema_1 = require("../models/schema");
const tiposAceitos_1 = require("../models/tiposAceitos");
const elegibilidade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Faz a validação do Schema do JSON enviado
    var v = new Validator();
    const valido = v.validate(req.body, schema_1.input).errors;
    // return res.status(400).send(valido);
    if (valido.length > 0)
        return res.status(400).send(valido);
    // Inicia as variáveis
    const { numeroDoDocumento, tipoDeConexao, classeDeConsumo, modalidadeTarifaria, historicoDeConsumo } = req.body;
    const razoes = [];
    // Checar a classe de consumo do cliente
    //- Elegíveis: Comercial, Residencial e Industrial.
    if (!(tiposAceitos_1.classesAceitas.includes(classeDeConsumo)))
        razoes.push("Classe de consumo não aceita");
    // Checar a modalidade tarifária
    //- Elegíveis: Convencional, Branca.
    if (!(tiposAceitos_1.modalidadesAceitas.includes(modalidadeTarifaria)))
        razoes.push("Modalidade tarifária não aceita");
    // Checar a regra de consumo mínimo
    const consumoMedioAnual = historicoDeConsumo.reduce((soma, valor) => soma + valor, 0) / historicoDeConsumo.length;
    //- Clientes com tipo de conexão Monofásica só são elegíveis caso tenham consumo médio acima de 400 kWh.
    if (consumoMedioAnual < 4000 && tipoDeConexao === 'monofasico')
        razoes.push("Consumo muito baixo para tipo de conexão");
    //- Clientes com tipo de conexão Bifásica só são elegíveis caso tenham consumo médio acima de 500 kWh.
    if (consumoMedioAnual < 5000 && tipoDeConexao === 'bifasico')
        razoes.push("Consumo muito baixo para tipo de conexão");
    //- Clientes com tipo de conexão Trifásica só são elegíveis caso tenham consumo médio acima de 750 kWh.
    if (consumoMedioAnual < 7500 && tipoDeConexao === 'trifasico')
        razoes.push("Consumo muito baixo para tipo de conexão");
    let userOutput;
    if (razoes.length > 0) {
        userOutput = {
            elegivel: false,
            razoesDeInelegibilidade: razoes
        };
    }
    else {
        //Para calcular a projeção da **economia anual** de CO2, considere que para serem gerados 1000 kWh no Brasil são emitidos em média 84kg de CO2.
        const economiaAnual = (consumoMedioAnual * 84) / 1000;
        userOutput = {
            elegivel: true,
            economiaAnualDeCO2: economiaAnual
        };
    }
    // Valida o JSON antes de ser enviado
    const checkOutput = v.validate(userOutput, schema_1.output);
    if (checkOutput.errors.length > 0)
        console.log(checkOutput);
    return res.status(200).send(userOutput);
});
exports.elegibilidade = elegibilidade;
