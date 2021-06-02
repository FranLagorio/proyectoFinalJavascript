// IMPORTS

import nuevoCliente from "./ingresoClientes.js";

//READY

$(document).ready(function () {
    $(".masthead, .page-section").fadeIn(1500);
});

// EVENTOS

//BOTON PRINCIPAL

/* Defino variables que permiten animacion de ampliacion del bloque del form cuando se inserta
un mensaje nuevo. ESTO SI ABRE DEVTOOLS SE APRECIA MEJOR*/

let altura = 0;
let altura2 = 0;

// Boton que oculta presentacion y aparece formulario

$("#botonComienzo").click(() => {
    $("#presentacion").fadeOut(1400);
    $("#formularioPrincipal")
        .delay(1400)
        .fadeIn(1500, () => {
            // Tomo la altura del form
            altura = $("form")[0].clientHeight;
            altura2 = altura;
        });
});

// VERIFICO SI EN EL LOCAL STORAGE YA HAY DATOS PARA NO VOLVER A DEFINIRLO VACIO

let arrayObjsClientes = [];
let clientesEnLocalStorage = JSON.parse(localStorage.getItem("clientes"));
if (clientesEnLocalStorage) {
    arrayObjsClientes = clientesEnLocalStorage;
}

// BOTON ENVIAR FORMULARIO

let formPrincipal = $("#submit");
formPrincipal.click(sendClick);

function sendClick(e) {
    //PARA EVITAR QUE EL ENTER ME ACTUALICE LA PAGINA
    e.preventDefault();

    //CONTROLO QUE CARGUE TODOS LOS INPUTS
    let values = $(".inputsFormPrincipal");
    let condicion = true;
    for (const iterator of values) {
        if (iterator.value) {
        } else {
            condicion = false;
        }
    }

    if (condicion) {
        $("form").animate({ height: altura + 140 }, 1000, "linear", () => {
            altura += 140;
        });

        $(
            `<div class="divMensaje">Hola ${nombre.value} ${apellido.value}, registramos su pedido de consultoria para el ${dia.value} a las ${horario.value}. Recibiras un mail una vez con la confirmacion una vez que revisemos nuestra disponibilidad. </div>`
        )
            .appendTo($("#formularioPrincipal"))
            .fadeIn(1500);
    } else {
        $("form").animate({ height: altura + 70 }, 500, () => {
            $("form").delay(1500);
            $("form").animate({ height: altura }, 1000);
        });

        $(`<div class="divMensaje" > Porfavor completa todos los campos </div>`)
            .appendTo($("#formularioPrincipal"))
            .fadeIn(1000)
            .fadeOut(1000, () => {
                $(".divMensaje").remove();
            });
    }

    if (condicion) {
        console.log("Se cargo el cliente");

        //AGREGO VALORES AL LOCAL STORAGE

        let datosLocalStorage = $(".inputsFormPrincipal, select");

        //CREO UN ARRAY PARA TOMAR LOS VALUE DE LOS INPUTS
        let arrayTemporario = [];

        for (const iterator of datosLocalStorage) {
            arrayTemporario.push(iterator.value);
        }

        // CREO UN OBJETO CON LOS VALUES
        let newUser = new nuevoCliente(
            arrayTemporario[0],
            arrayTemporario[1],
            arrayTemporario[2],
            arrayTemporario[3],
            arrayTemporario[4],
            arrayTemporario[5],
            arrayTemporario[6]
        );

        //PUSHEO AL ARRAY DE CLIENTES DE MI LOCAL STORAGE , ANTES LO PARSEO PARA TENERLO EN FORMATO ARRAY DE OBJETOS Y NO STRING
        arrayObjsClientes.push(newUser);

        //AGREGO A MI LOCAL STORAGE EN FORMATO JSON

        let JsonArrayObjsClientes = JSON.stringify(arrayObjsClientes);

        localStorage.setItem("clientes", JsonArrayObjsClientes);

        clientesEnLocalStorage = JSON.parse(localStorage.getItem("clientes"));
    }
}

//BOTON BORRAR

let myButtonBorrar = $("#clean");
myButtonBorrar.click(borrado);

function borrado(e) {
    e.preventDefault();
    console.log("Se limpia formulario");

    //Restauro valores a 0
    let valueForms = $("#formularioPrincipal input, textarea");

    for (const iterator of valueForms) {
        iterator.value = "";
    }

    // Comando para que las opciones se reestablezcan

    $("#dia")[0].selectedIndex = 0;
    $("#horario")[0].selectedIndex = 0;
    /* Otra forma
                document.getElementById("dia").options[0].selected = true; */

    //Borro el nodo del mensaje para que no ocupe lugar en el HTML

    $(".divMensaje").fadeOut(1500, () => {
        $(".divMensaje").remove();
    });

    $("form").animate({ height: altura2 }, 2000, () => {
        altura = altura2;
    });
}

//log in

$("#botonIniciarSesion").click((e) => {
    e.preventDefault();
    $("#login").fadeToggle();
    alert("El usuario y contraseña es 'francisco' ");
});

//funcion del login

$("#botonLogIn").click((e) => {
    e.preventDefault();

    // Controlo que el usuario y contraseña sean correctos
    if ($("#usuario").val() == "francisco" && $("#contrasena").val() == "francisco") {
        // $("#botonLogIn").attr("onClick", (location.href = "clientes.html"));
        $("#clientes").show();
        $("#botonLogIn").attr("onClick", (location.href = "#clientes"));
        $("#login").hide();
    } else {
        alert("USUARIO/CONTRASEÑA INCORRECTA - (usr: francisco, psw: francisco)");
    }
});

////// TRAIGO DATOS DESDE AJAX LOCAL Y DESDE LOCALSTORAGE
// ES IMPORTANE QUE CARGUE UN CLIENTE PARA QUE HAYA UNO EN LOCAL STORAGE

$("#botonAjax").append(
    `<button id="ajaxButton" class="btn-primary"> Consultorias solicitadas para esta semana </button>`
);

$("#ajaxButton").click((e) => {
    e.preventDefault();
    $("#ajaxButton").attr("disabled", true);

    $.getJSON("./data/jsonClientesSemanaPasada.json", (respuesta, estado) => {
        console.log("El estado de la operacion es " + estado);

        $("#clientesSemanaPasada").show();

        for (const iterator of respuesta) {
            $("#clientesSemanaPasada").append(`<div class="mensajeAjax" >
     
                    <p>${iterator.nombre} ${iterator.apellido} (${iterator.profesion})  es de la empresa ${iterator.empresa}, solicitó una consultoria el dia ${iterator.dia} a las ${iterator.hora}. La consulta es sobre: ${iterator.consulta}</p>
                    </div>`);
        }
    });

    $("#clientesSemanaActual").show();
    for (const iterator2 of clientesEnLocalStorage) {
        $("#clientesSemanaActual").append(`<div class="mensajeAjax">

                    <p>${iterator2.nombre} ${iterator2.apellido} (${iterator2.profesion})  es de la empresa ${iterator2.empresa}, solicitá una consultoria el dia ${iterator2.dia} a las ${iterator2.hora}. La consulta es sobre: ${iterator2.consulta}</p>
                    </div>`);
    }
});
