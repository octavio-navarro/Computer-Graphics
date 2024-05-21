// Definicion de variables

let a = 5;
let b = 6.6;

// Variable constante - no se puede modificar posteriormente
const c = 10;

console.log(a);

// En javascript tenemos Number, String, Boolean, Null, Undefined
let number_variable = 10;
let hex_variable = 0x00aabb;
let exp_variable = 3.05e6;

let bool_variable = true;
let string_variable = 'Se puede definir un string con comilla sencilla usar "comilla doble" dentro. También hay \t caracteres especiales \n' + 'tambien se puede concatener con el operador +';

// Usando el acento grave `` para definir un string, se puede definir un template string
const template_string = `El valor de la variable number_variables es: ${number_variable}`;

console.log(template_string);

// La variable está undefined hasta que se asigne un valor
let undefined_variable;
// Null sirve para darle un valor a una variable antes de asignarle otro
let null_variable = null;

// Arrays

let lista_1 = [];
lista_1.push(1, 2, 3, 4, "asdasd", true);

console.log("lista 1:", lista_1);

lista_1[3] = 123;
console.log("lista con nuevo valor:", lista_1);

console.log("ultimo valor de la lista:", lista_1[lista_1.length - 1]);

let lista_2 = [2, 4, 6, 7, 9];
console.log("lista 2:", lista_2);

// Funciones

function hola(nombre)
{
    console.log(`Hola ${nombre}`);
}

hola("Octavio");

function suma(a, b)
{
    return a+b;
}

console.log("Suma:", suma(5, 6));