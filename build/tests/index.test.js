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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const json_1 = require("./json");
describe('Testando rotas do messages', () => {
    it('POST /elegibilidade - Testa um cliente elegivel', () => __awaiter(void 0, void 0, void 0, function* () {
        // Retorno: elegivel:true, economiaAnualDeCO2": 462.77
        const response = yield (0, supertest_1.default)(app_1.app)
            .post('/elegibilidade')
            .send(json_1.bodyElegivel);
        expect(response.statusCode).toEqual(200);
        expect(response.body.elegivel).toEqual(true);
        expect(response.body.economiaAnualDeCO2).toEqual(462.77);
    }));
    it('POST /elegibilidade - Testa um cliente não elegivel', () => __awaiter(void 0, void 0, void 0, function* () {
        // Retorno: elegivel:false, razoesInelegibilidade:"Classe de consumo não atendida","Modalidade tarifária não aceita"
        const response = yield (0, supertest_1.default)(app_1.app)
            .post('/elegibilidade')
            .send(json_1.bodyNaoElegivel);
        expect(response.statusCode).toEqual(200);
        expect(response.body.elegivel).toEqual(false);
        expect(response.body.razoesDeInelegibilidade.length).toEqual(2);
        expect(response.body.razoesDeInelegibilidade[0]).toEqual("Classe de consumo não aceita");
        expect(response.body.razoesDeInelegibilidade[0]).toEqual("Classe de consumo não aceita");
    }));
});
