# backend-lemon
Nem todos os clientes que desejam fazer parte da Lemon podem ser aceitos no momento. Seja por razões regulatórias ou porque não vale a pena para o cliente ou para a Lemon ter essa empresa como cliente. No processo de aquisição de clientes, fazemos a checagem de elegibilidade da mesma, através dos dados contidos na conta de luz do cliente. Caso a empresa não seja elegível, precisamos explicitar os motivos para tal. Caso ela seja elegível, precisamos calcular também a projeção da quantidade de CO2 que ela deixaria de emitir caso usasse energia limpa. 
<hr/>
Utilizar rota POST /elegibilidade, fornecendo um JSON de acordo com os [Exemplos](#exemplos) abaixo

# Schemas de Entrada e Saída

Considere os json schemas abaixo como as definições da entrada e saída para o cálculo de elegibilidade:

```jsx
const { tiposDeConexao, classesDeConsumo, modalidadesTarifarias, cpf, cnpj } = require('./tipos')

const enumOf = values => ({
  type: typeof values[0],
  enum: values,
  example: values[0],
})

const input = {
  type: 'object',
  additionalProperties: false,
  required: [
    'numeroDoDocumento',
    'tipoDeConexao',
    'classeDeConsumo',
    'modalidadeTarifaria',
    'historicoDeConsumo',
  ],
  properties: {
    numeroDoDocumento: { oneOf: [cpf, cnpj] },
    tipoDeConexao: enumOf(tiposDeConexao),
    classeDeConsumo: enumOf(classesDeConsumo),
    modalidadeTarifaria: enumOf(modalidadesTarifarias),
    historicoDeConsumo: {
      type: 'array',
      minItems: 3,
      maxItems: 12,
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 9999,
      },
    },
  },
}

const output = {
  oneOf: [
    {
      type: 'object',
      additionalProperties: false,
      required: ['elegivel', 'economiaAnualDeCO2'],
      properties: {
        elegivel: enumOf([true]), // always true
        economiaAnualDeCO2: { type: 'number', minimum: 0 },
      },
    },
    {
      type: 'object',
      additionalProperties: false,
      required: ['elegivel', 'razoesDeInelegibilidade'],
      properties: {
        elegivel: enumOf([false]), // always false
        razoesDeInelegibilidade: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string',
            enum: [
              'Classe de consumo não aceita',
              'Modalidade tarifária não aceita',
              'Consumo muito baixo para tipo de conexão',
            ],
          },
        },
      },
    },
  ],
}

module.exports = {
	input,
  output,
}
```

- Arquivo `tipos.js`
    
    ```jsx
    const cpf = {
      type: 'string',
      pattern: '^\\d{11}$',
      example: '21554495008',
    }
    
    const cnpj = {
      type: 'string',
      pattern: '^\\d{14}$',
      example: '33400689000109',
    }
    
    const tiposDeConexao = ['monofasico', 'bifasico', 'trifasico']
    
    const classesDeConsumo = [
      'residencial',
      'industrial',
      'comercial',
      'rural',
      'poderPublico',
    ]
    
    const modalidadesTarifarias = ['azul', 'branca', 'verde', 'convencional']
    
    module.exports = {
    	cpf,
      cnpj,
      tiposDeConexao,
      classesDeConsumo,
      modalidadesTarifarias,
    }
    ```
    

# Critérios de Elegibilidade

Para checar a elegibilidade iremos aplicar os seguintes critérios:

- Classe de consumo da cliente
    - Possíveis Valores: Comercial, Residencial, Industrial, Poder Público, e Rural.
    - Elegíveis: Comercial, Residencial e Industrial.
- Modalidade tarifária
    - Possíveis Valores: Branca, Azul, Verde, e Convencional.
    - Elegíveis: Convencional, Branca.
- Consumo mínimo do cliente
    - O cálculo deve ser feito utilizando a média dos 12 valores mais recentes do histórico de consumo.
        - Clientes com tipo de conexão Monofásica só são elegíveis caso tenham consumo médio acima de 400 kWh.
        - Clientes com tipo de conexão Bifásica só são elegíveis caso tenham consumo médio acima de 500 kWh.
        - Clientes com tipo de conexão Trifásica só são elegíveis caso tenham consumo médio acima de 750 kWh.
- Para calcular a projeção da **economia anual** de CO2, considere que para serem gerados 1000 kWh no Brasil são emitidos em média 84kg de CO2.

# Exemplos

Esses exemplos foram gerados utilizando o pacote [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker)

## Exemplo 1 - Elegível

Entrada

```json
{
  "numeroDoDocumento": "14041737706",
  "tipoDeConexao": "bifasico",
  "classeDeConsumo": "comercial",
  "modalidadeTarifaria": "convencional",
  "historicoDeConsumo": [
    3878, // mes atual
    9760, // mes anterior
    5976, // 2 meses atras
    2797, // 3 meses atras
    2481, // 4 meses atras
    5731, // 5 meses atras
    7538, // 6 meses atras
    4392, // 7 meses atras
    7859, // 8 meses atras
    4160, // 9 meses atras
    6941, // 10 meses atras
    4597  // 11 meses atras
  ]
}
```

Saída

```json
{
   "elegivel": true,
   "economiaAnualDeCO2": 462.77,
}
```

## Exemplo 2 - Não elegível

Entrada

```json
{
  "numeroDoDocumento": "14041737706",
  "tipoDeConexao": "bifasico",
  "classeDeConsumo": "rural",
  "modalidadeTarifaria": "verde",
  "historicoDeConsumo": [
    3878, // mes atual
    9760, // mes anterior
    5976, // 2 meses atras
    2797, // 3 meses atras
    2481, // 4 meses atras
    5731, // 5 meses atras
    7538, // 6 meses atras
    4392, // 7 meses atras
    7859, // 8 meses atras
    4160, // 9 meses atras
  ]
}
```

Saída

```json
{
  "elegível": false,
	"razoesInelegibilidade": [
    "Classe de consumo não atendida",
    "Modalidade tarifária não aceita"
  ]
}
```

# Instruções

- Sugerimos implementar a solução descrita em `Node.js`, porém não é um requisito. Você tem a liberdade de implementar na linguagem que desejar.
- Lembre-se de escrever testes
- Enviar o código fonte da solução para a pessoa da Lemon que te enviou esse teste, da forma desejada:
    - Zip com o código fonte
    - Link para o repositório git