// Los objetos se pueden definir de varias maneras:

let animal = {};

// Los atributos se pueden agregar despúes de la creación del objeto. En javascript, los atributos se llaman propiedades que consisten de un nombre o llave, y un valor.
animal.nombre = "Pajaro"
animal.color = "amarillo";
animal.tipo = "canario";
// En este caso, color sería la llave, y 'amarillo' el valor.

console.log(animal);

// Se pueden acceder a los atributos de los objetos directamente
console.log("nombre:", animal["nombre"])

// Los objetos también pueden tener metodos
animal.sonido = function() {
    console.log("CHIRP CHIRP");
}

animal.sonido();

// Se puede crear el objeto directamente con sus atributos
const Persona = {
    nombre: "Octavio",
    edad: 123,
    // Los atributos de un objeto pueden ser otros objetos
    propiedades: {
        hp: 234,
        stamina: 50,
        mp: 200
    }
}

console.log("HP:", Persona["propiedades"]["hp"]);

// Una manera más convencional de crear objetos es la siguiente:

class Auto
{
    constructor(marca, modelo)
    {
        this.marca = marca;
        this.modelo = modelo;
        this.velocidades = ['P','N', 'R', 'D'];
        this.velocidadActual = this.velocidades[0];
    }

    mostrarInformacion()
    {
        console.log(`Marca: ${this.marca} Modelo: ${this.modelo} Velocidades: ${this.velocidades}`);
    }

    cambioVelocidad(velocidad)
    {
        if(this.velocidades.indexOf(velocidad) < 0)
            console.log(`Velocidad invalida ${velocidad}`);
        else
        {
            console.log(`Cambio de velocidad ${this.velocidadActual} a ${velocidad}.`)
            this.velocidadActual = velocidad;
        }            
    }
}

let auto_1 = new Auto("Tesla", "model S");

auto_1.mostrarInformacion();
auto_1.cambioVelocidad("D");


