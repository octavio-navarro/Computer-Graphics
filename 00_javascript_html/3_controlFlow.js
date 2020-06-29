// Funciones

function random_int(start, end)
{
    return Math.floor(Math.random() * (end-start+1)) + start;
}

// While

let funds = 80;

while(funds > 1 && funds < 100)
// Los bloques de código se definen con llaves
{
    console.log(`Current Funds ${funds}.`)
    funds -= random_int(1, 10);
}

// If
let bet = random_int(1, 100);
funds = 100;

if(bet > funds)
{
    console.log(`Not enough funds`)
}
else if(bet > 10 && bet < 50)
{
    console.log(`Bet: ${bet}.`);
    funds -= bet;
    console.log(`Funds: ${funds}`);
}
else
{
    console.log(`Bet of ${bet} not placed`);
}

// Do while

do
{
    // Se puede definir bet de nuevo aquí, y es distinto a la variable que se definió anteriormente
    let bet = random_int(1, 100);
    funds -= bet;
    console.log(`bet: ${bet}, remaining funds:${funds}`);
}while(funds > 0);

console.log(`last bet: ${bet}, remaining funds:${funds}`);

// For loop

let rolls = [];

for(let roll = 0; roll < 3; roll++)
{
    rolls.push(random_int(1, 10));
}

console.log("rolls:", rolls);

// For in: da las llaves de las propiedades de un objeto

const persona = {nombre: "John Doe", edad: "34", profesion: "desconocida"};

console.log("Llaves del objeto:");
for(const prop in persona)
{
    console.log(prop);
}

// En el caso de una lista, las llaves son los índices de la lista

let lista_1 = [1, 2, 3, 4, 5];

console.log("Indices de la lista:");
for(const prop in lista_1){
    console.log(prop);
}

// For of: da todos los valores de las propiedades de un iterable

console.log("Valores de la lista:");
for(const valor of lista_1)
    console.log(valor);

// Los objetos por defecto no son iterables, pero podemos usar lo siguiente para recorrer sus propiedades

console.log("1. Valores del objeto:");
for(const prop in persona)
    console.log(persona[prop]);

// Crea un arreglo con las llaves del objeto
const keys = Object.keys(persona);
console.log(`Llaves:${keys}`);
// Crea un arreglo con los valores del objeto
const values = Object.values(persona);
console.log(`Valores:${values}`);
// Crea un arreglo con los valores y las llaves del objeto
const entries = Object.entries(persona);
console.log(`Properties:${entries}`);

// Usando un for of 
for(const [key, value] of Object.entries(persona))
{
    console.log(`Key: ${key} Value: ${value}`);
}