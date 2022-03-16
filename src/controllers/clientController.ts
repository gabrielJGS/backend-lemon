import express, { Request, Response } from 'express';
var Validator = require('jsonschema').Validator;
import { input, output } from '../models/schema';
import { classesAceitas, modalidadesAceitas } from '../models/tiposAceitos';

const elegibilidade = async (req: Request, res: Response) => {
    // Faz a validação do Schema do JSON recebido
    var v = new Validator();
    const valido = v.validate(req.body, input).errors;
    if (valido.length > 0) return res.status(400).send(valido);

    // Inicia as variáveis
    const { numeroDoDocumento, tipoDeConexao, classeDeConsumo, modalidadeTarifaria, historicoDeConsumo } = req.body;
    const razoes: string[] = [];
    // Checar a classe de consumo do cliente - Elegíveis: Comercial, Residencial e Industrial.
    if (!(classesAceitas.includes(classeDeConsumo))) razoes.push("Classe de consumo não aceita");
    // Checar a modalidade tarifária - Elegíveis: Convencional, Branca.
    if (!(modalidadesAceitas.includes(modalidadeTarifaria))) razoes.push("Modalidade tarifária não aceita");

    // Checar a regra de consumo mínimo
    //(Duvida: Utilizado historicoDeConsumo.length para calcular a média corretamente caso não envie o valor de 12 contas, ou o segundo json falharia por este motivo também)
    const consumoMedioAnual = historicoDeConsumo.reduce((soma: number, valor: number) => soma + valor, 0) / historicoDeConsumo.length;
    // Multipliquei o kwh por 10 para fazer a regra de acordo com os resultados fornecidos
    //- Clientes com tipo de conexão Monofásica só são elegíveis caso tenham consumo médio acima de 400 kWh.
    if (consumoMedioAnual < 4000 && tipoDeConexao === 'monofasico') razoes.push("Consumo muito baixo para tipo de conexão");
    //- Clientes com tipo de conexão Bifásica só são elegíveis caso tenham consumo médio acima de 500 kWh.
    if (consumoMedioAnual < 5000 && tipoDeConexao === 'bifasico') razoes.push("Consumo muito baixo para tipo de conexão");
    //- Clientes com tipo de conexão Trifásica só são elegíveis caso tenham consumo médio acima de 750 kWh.
    if (consumoMedioAnual < 7500 && tipoDeConexao === 'trifasico') razoes.push("Consumo muito baixo para tipo de conexão");

    let userOutput;
    if (razoes.length > 0) {
        // Monta o JSON para caso o cliente não seja aceito
        userOutput = {
            elegivel: false,
            razoesDeInelegibilidade: razoes
        }
    } else {
        //Para calcular a projeção da **economia anual** de CO2, considere que para serem gerados 1000 kWh no Brasil são emitidos em média 84kg de CO2.
        const economiaAnual = (consumoMedioAnual * 84) / 1000;
        userOutput = {
            elegivel: true,
            economiaAnualDeCO2: economiaAnual
        }
    }
    // Valida o JSON antes de ser enviado
    const checkOutput = v.validate(userOutput, output);
    // Pode ser trocado para escrever a um arquivo log para analise com cloudwatch
    if (checkOutput.errors.length > 0) console.log(checkOutput)

    return res.status(200).send(userOutput);
}

export { elegibilidade }