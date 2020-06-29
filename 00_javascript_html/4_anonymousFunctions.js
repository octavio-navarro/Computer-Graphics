// Declarar una funcion sin identificador
const suma = function(a, b){
    return a+b;
}

// No aporta mucho: Terminamos con una variable que ahora sirve como identificador de la función
console.log(suma(5, 6));

// Declarar funciones de esa manera sirve para usarlas como parametro de otras funciones
let descending = function(a, b){
    return b - a;
}
let lista = [12, 3, 1, 5, 4]

lista.sort(descending)

console.log(lista);

// Arrow notation
// Es una forma de representar funciones anónimas simplemente. Permiten omitir la palabra function; si la función recibe solo un argumento se pueden omitir los paréntesis, y si es cuerpo de la función es solo una expresión, se pueden omitir las llaves.

function helloWorld(name)
{
    return `hello world, ${name}`;
}

const hello = name => `hello world, ${name}`;

const resta = (a, b) => a - b;

console.log(hello("Octavio"));
console.log(resta(5,2));

// También se puede usar directamente como argumento de otros métodos

lista.forEach( a => console.log(a*2));

lista = [9, 2, 4, 5, 1, 3, 7];

lista.sort((a,b) => b - a);

console.log(lista);