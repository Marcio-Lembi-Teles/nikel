//Declaração de variáveis - Sem alteração
console.log("Variáveis declaradas: FIXA");
const nome = "MárciolembiTeles";
console.log(nome);

//Declaração de outra variável - Com alteração
console.log("Variáveis declaradas: ALTERADA");
let nome2 = "Antes: Márcio";
console.log(nome2);

nome2 = "Depois: Lembi";
console.log(nome2);

let pessoa = {
    nome: "Márcio Lembi Teles",
    idade: 30,
    trabalho: "Programador"
};

function alterarNome() {
    nome2 = "Maria Silva";
    console.log("Valor alterado dentro da função:");
    console.log(nome2);
}

function recebeEalteraNome(novoNome) {
    nome2 = novoNome;
    console.log("Valor alterado dentro da função com parâmetro:");
    console.log(nome2);
}

alterarNome();

recebeEalteraNome("João Souza");
recebeEalteraNome("Maria Silva");

console.log(pessoa);

console.log("Nome da pessoa:", pessoa.nome);
console.log("Idade da pessoa:", pessoa.idade);
console.log("Trabalho da pessoa:", pessoa.trabalho);

function imprimirPessoa(pessoa){
    console.log("Nome da pessoa:", pessoa.nome);
    console.log("Idade da pessoa:", pessoa.idade);
    console.log("Trabalho da pessoa:", pessoa.trabalho);
}

imprimirPessoa(pessoa);

imprimirPessoa({
    nome: "Ana Paula",
    idade: "28",
    trabalho: "Designer"
});

let nomes = ["Ângela", "Murilo", "Lucca"];

console.log("Nomes na lista:", nomes);

console.log("Nomes na lista:", nomes[2]);

let pessoas = [
    {
    nome: "Márcio Lembi Teles",
    idade: 30,
    trabalho: "Programador"
    },
    {
    nome: "Ana Paula",
    idade: 28,
    trabalho: "Designer"
    },
    {
    nome: "Carlos Eduardo",
    nome: "João Souza",
    idade: 35,
    trabalho: "Gerente"
    }
];

console.log("Lista de pessoas:", pessoas);

function adicionarPessoa(pessoa){
    pessoas.push(pessoa);
}

adicionarPessoa({
    nome: "Mariana Silva",
    idade: 25,
    trabalho: "Analista"
});

console.log("Lista de pessoas após adicionar nova pessoa:", pessoas);

function imprimirPessoas(){
    console.log("----------Imprimindo todas as pessoas na lista----------");
    pessoas.forEach((item)=>{
        console.log("Nome:", item.nome);
        console.log("Idade:", item.idade);
        console.log("Trabalho:", item.trabalho);
    })
}

imprimirPessoas();