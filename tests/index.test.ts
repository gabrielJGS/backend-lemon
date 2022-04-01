import supertest from 'supertest';
import { app } from '../src/app';
import { bodyElegivel, bodyNaoElegivel, bodyNaoElegivelModalidade, bodyNaoElegivelConsumo } from './json';

describe('Testando rotas do messages', () => {
    it('POST /elegibilidade - Testa um cliente elegivel', async () => {
        const response = await supertest(app)
            .post('/elegibilidade')
            .send(bodyElegivel);
        expect(response.statusCode).toEqual(200);
        expect(response.body.elegivel).toEqual(true);
        expect(response.body.economiaAnualDeCO2).toEqual(5553.24);
    })
    it('POST /elegibilidade - Testa um cliente não elegivel por classe de consumo e modalidade nao aceita', async () => {
        const response = await supertest(app)
            .post('/elegibilidade')
            .send(bodyNaoElegivel);
        expect(response.statusCode).toEqual(200);
        expect(response.body.elegivel).toEqual(false);
        expect(response.body.razoesDeInelegibilidade.length).toEqual(2);
        expect(response.body.razoesDeInelegibilidade[0]).toEqual("Classe de consumo não aceita");
        expect(response.body.razoesDeInelegibilidade[1]).toEqual("Modalidade tarifária não aceita");
        expect(response.body.razoesDeInelegibilidade[2]).toEqual("Consumo muito baixo para tipo de conexão");
    })
    it('POST /elegibilidade - Testa um cliente não elegivel por modalidade', async () => {
        const response = await supertest(app)
            .post('/elegibilidade')
            .send(bodyNaoElegivelModalidade);
        expect(response.statusCode).toEqual(200);
        expect(response.body.elegivel).toEqual(false);
        expect(response.body.razoesDeInelegibilidade.length).toEqual(1);
        expect(response.body.razoesDeInelegibilidade[0]).toEqual("Modalidade tarifária não aceita");
    })

    it('POST /elegibilidade - Testa um cliente não elegivel por consumo', async () => {
        const response = await supertest(app)
            .post('/elegibilidade')
            .send(bodyNaoElegivelConsumo);
        expect(response.statusCode).toEqual(200);
        expect(response.body.elegivel).toEqual(false);
        expect(response.body.razoesDeInelegibilidade.length).toEqual(1);
        expect(response.body.razoesDeInelegibilidade[0]).toEqual("Consumo muito baixo para tipo de conexão");
    })
})