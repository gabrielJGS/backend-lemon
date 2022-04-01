const bodyElegivel = {
    "numeroDoDocumento": "14041737706",
    "tipoDeConexao": "bifasico",
    "classeDeConsumo": "comercial",
    "modalidadeTarifaria": "convencional",
    "historicoDeConsumo": [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160,
        6941,
        4597
    ]
};

const bodyNaoElegivel = {
    "numeroDoDocumento": "14041737706",
    "tipoDeConexao": "bifasico",
    "classeDeConsumo": "rural",
    "modalidadeTarifaria": "verde",
    "historicoDeConsumo": [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160
    ]
};

const bodyNaoElegivelModalidade = {
    "numeroDoDocumento": "14041737706",
    "tipoDeConexao": "bifasico",
    "classeDeConsumo": "comercial",
    "modalidadeTarifaria": "azul",
    "historicoDeConsumo": [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160
    ]
};

const bodyNaoElegivelConsumo = {
    "numeroDoDocumento": "14041737706",
    "tipoDeConexao": "trifasico",
    "classeDeConsumo": "comercial",
    "modalidadeTarifaria": "convencional",
    "historicoDeConsumo": [
        578,
        460,
        376,
    ]
};
export { bodyElegivel, bodyNaoElegivel, bodyNaoElegivelModalidade, bodyNaoElegivelConsumo }