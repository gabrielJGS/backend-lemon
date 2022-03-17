import supertest from 'supertest';
import { app } from '../src/app';
import { bodyElegivel, bodyNaoElegivel } from './json';

describe('Testando rotas do messages', () => {
    it('POST /elegibilidade - Testa um cliente elegivel', async () => {
        const response = await supertest(app)
            .post('/elegibilidade')
            .send(bodyElegivel);
        expect(response.statusCode).toEqual(200);
        expect(response.body.elegivel).toEqual(true);
        expect(response.body.economiaAnualDeCO2).toEqual(462.77);
    })
    it('POST /elegibilidade - Testa um cliente não elegivel', async () => {
        const response = await supertest(app)
            .post('/elegibilidade')
            .send(bodyNaoElegivel);
        expect(response.statusCode).toEqual(200);
        expect(response.body.elegivel).toEqual(false);
        expect(response.body.razoesDeInelegibilidade.length).toEqual(2);
        expect(response.body.razoesDeInelegibilidade[0]).toEqual("Classe de consumo não aceita");
        expect(response.body.razoesDeInelegibilidade[0]).toEqual("Classe de consumo não aceita");
    })
})