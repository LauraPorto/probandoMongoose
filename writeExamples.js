const logger = (log) => { console.log(new Date, log) };

const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

logger('Librería mongoose obtenida');

const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || '27017';
const MONGO_DBNAME = process.env.MONGO_DBNAME || 'practicas';

const MONGO_USER = process.env.MONGO_USER || null;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || null;
/*Esta es la receta que hay que escribir siempre para conectar con la base de datos. Normalmente el usuario y contraseña se ponen al principio (antes de host y port, y con @) o no se ponen al tratarse de una BBDD a la que sólo se pueda acceder desde backend */


const QUERY_STRING = MONGO_USER ?
    `monbodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}` :

    `monbodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}`;
//Caso con o sin usuario ni contraseña

mongoose.connect(QUERY_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger('Conexión establecida')
    }).catch(error => {
        console.log(error.message)
    });

/* Connect nos devuelve la promesa de que se producirá la conexión */


/********************************/

logger('Esquema de pets');

/* A la estructura de la base de datos se le llama esquema. 
Aquí conectamos con la base de datos, en este caso en lugar del protocolo https para conectar con el servidor, el protocolo sería mongodb
El protocolo lo sacamos de las variables de entorno, desde las cuales configuramos esta conexión */

let petSchema = mongoose.Schema({
    id: {
        type: ObjectId
    },
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String
    },
    creationDate: {
        type: Date,
        default: new Date
    },
    sterilized: {
        type: Boolean,
        default: false
    }
});



/****************************/

logger('Creando modelo Cat y Dog a partir del esquema petSchema');

const Cat = mongoose.model('Cat', petSchema);
const Dog = mongoose.model('Dog', petSchema);


logger('Creando una instancia de Cat')

const kitty = new Cat({ name: 'Zildjan' });
kitty = 'Rudolf'; //Cambiamos valor de la propiedad required antes de guardarla


/******************************/

logger('Guardando en la base de datos la instancia');
kitty.save().then(() => logger('instancia de cat salvada')).catch((error) => console.log(error));

/* Definimos un modelo al que le daremos propiedades (de un modo similar a las propiedades de la clase botón en la calculadora). Se crea un objeto de propiedades sin constructor en las que se tipa las propiedades (string, numero...). Este objeto se realiza mediante un Schema, una función de mongoose, como una instancia de clase que aplica las normas o propiedades de mongoose y es lo que tenemos que meter como segundo parámetro al método model. 
Nos devuelve una instancia del objeto tipo Schema en el que definiremos cómo son los datos. Podemos construir objetos y clases dentro del objeto schema, esto incluye el required=true, lo cual hace de una propiedad un requerimiento haciendo indispensable que introduzcas X tipos de datos (cubrir datos obligatorios para poder instanciar, por ejemplo, el caso de un email para darse de alta en una página, llevando a cabo ese control el modelo y no nosotros mismos). De modo similar, con el default podemos indicar que se autorellenen datos que no han sido completados a nuestro criterio (default y required, aunque mongoose se lo traga, conceptualmente no son compatibles). Es común aplicar valores default, por ejemplo, a la fecha de creación de usuario o pedido... Aplicado al proyecto de las películas, cada esquema correspondería, por ejemplo, a pedidos, películas y usuarios. 
OBJECT ID: esta objeto de propiedad nos genera un ID para cada proceso no correlacional y no hackeable, como un código hash, que sería una instancia del objeto ID cada vez que lo genera. 
Se puede meter datos booleanos para optimizar la clasificación de los datos (ej. gatos esterilizados).

Este modelo se puede aplicar a Cat y a Dog, y se puede hacer nuevas instancias a partir de este objeto modelo que tendrán las propiedades definidas y métodos. Uno de los métodos es save, que guarda la instancia en la base de datos. Para instanciar sólamente será obligatorio los datos que sean required, y se pueden añadir más adelante más propiedades o rellenar las que no habíamos cubierto [Esquema - modelo - instancia]

SAVE() nos devuelve una promesa (por proceso interno de mongoose) de que la instancia se guardará una vez se haya establecido la conexión. Para conocer esto, encadenamos con una promesa hecha por nosotros en esta ocasión, un .then, para que nos avise de cuando se ha salvado la instancia y, por tanto, de cuando la conexión se ha establecido. 

EN BACKEND ES OBLIGATORIO HACER EL MANEJO DE ERROR.
*/




/*
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', funcion() {
    console.log("We are connected !")
});

const kittySchema = new mongoose.Schema({
    name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);
*/