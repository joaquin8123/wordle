window.onload = function () {
  const form = document.getElementById('form');
  document.getElementById('timer').innerHTML = 05 + ':' + 00

  // INICIALIZA EL TIMER

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    startTimer();
    modal.style.display = "block";

  });

  function startTimer() {
    var presentTime = document.getElementById('timer').innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond((timeArray[1] - 1));
    if (s == 59) { m = m - 1 }
    if (m < 0) {
      return

    }
    if (m == 0 & s == 0) {
      alert("Termino el tiempo") //ACA ACTIVARIA EL MODAL
    }


    document.getElementById('timer').innerHTML =
      m + ":" + s;

    setTimeout(startTimer, 1000);
  }

  function checkSecond(sec) {
    if (sec < 10 && sec >= 0) { sec = "0" + sec }; // add zero in front of numbers < 10
    if (sec < 0) { sec = "59" };
    return sec;
  }

  /* MODAL */
  const modal = document.getElementById("myModalJuego");
  var span = document.getElementsByClassName("close")[0];

  // abrir modal
  span.onclick = function () {
    modal.style.display = "block";
  }


  // Cerrar modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // close modal, click fuera
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

// Objeto con constantes de los colores
let colores = {
  VERDE: 1,
  AMARILLO: 2,
  GRIS: 3,
  BLANCO: 0
}

// matriz del tablero
let tablaColores = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
]


// Recorre la tabla y la pinta según corresponda.
function pintaTabla() {
  for (let iFila = 0; iFila < 6; iFila++) {
    for (let iCol = 0; iCol < 5; iCol++) {
      let input = document.getElementById(`f${iFila}c${iCol}`)
      switch (tablaColores[iFila][iCol]) {
        case colores.VERDE:
          input.classList.add("verde");
          break;
        case colores.AMARILLO:
          input.classList.add("amarillo");
          break;
        case colores.GRIS:
          input.classList.add("gris");
          break;
        case colores.BLANCO:
          input.classList.add("blanco");
          break;
      }
    }
  }
}

// Tabla para cargar las respuestas que va dando el usuario.
let respuestas = [
  [],
  [],
  [],
  [],
  [],
  [],
]

// Guardar el progreso del usuario en el LocalStorage.
function GuardaProgreso() {
  let save = {};

  save.fecha = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Mendoza" });
  save.tiempo = document.querySelector("#time").innerHTML;
  save.respuestas = respuestas;
  save.usuario = document.getElementById("nombre-jugador-input").value;
  save.palabraGanadora = palabraGanadora;
  save.tablaColores = tablaColores;

  let savesArray = JSON.parse(localStorage.getItem("saves")) || [];
  savesArray.push(save);

  let savesArrayJSON = JSON.stringify(savesArray);

  localStorage.setItem("saves", savesArrayJSON);

  window.location.href = "index.html";
}

// Traerme todas las partidas guardadas desde LocalStorage
function ObtenerGuardadas() {

  let savesArray = JSON.parse(localStorage.getItem('saves')) || [];
  let body = "";
  let partida = savesArray.length + 1;
  for (let i = savesArray.length - 1; i >= 0; i--) {
    partida--;
    body += `<tr class="fila-partidas-guardadas" onclick=loadGame('${i}') role="row">
                    <td class="data-partida-guardadas" data-label="PARTIDA">${partida}</td>
                    <td class="data-partida-guardadas" data-label="NOMBRE">${(savesArray[i].usuario)}</td>
                    <td class="data-partida-guardadas" data-label="FECHA">${(savesArray[i].fecha)}</td>
                </tr>`
  }
  document.getElementById("puntajes").innerHTML = body;
}

// Cargar una partida
const loadGame = function (i) {
  gameOver = false;
  let modal = document.getElementById("modalPartidas");
  modal.style.display = "none";

  for (let i = 0; i < 6; i++) {
    let fieldset = document.getElementById(`fila${i}`);
    fieldset.disabled = false;
  }

  let savesArray = JSON.parse(localStorage.getItem('saves'));
  let actualArray = savesArray[i].respuestas;
  let actualPalabra = savesArray[i].palabraGanadora;
  let actualTiempo = savesArray[i].tiempo
  let actualUsuario = savesArray[i].usuario;
  let actualTablaColores = savesArray[i].tablaColores;
  colorTablero = actualTablaColores;

  pintaTabla();

  palabraGanadora = actualPalabra;
  document.querySelector("#time").innerHTML = actualTiempo;
  document.getElementById("nombre-jugador-input").value = actualUsuario;


  for (let iFila = 0; iFila < 6; iFila++) {
    for (let iCol = 0; iCol < 5; iCol++) {
      let input = document.getElementById(`f${iFila}c${iCol}`);
      if (actualArray[iFila][iCol] !== undefined) {
        input.value = actualArray[iFila][iCol];
      }
    }
  }

  // Muestro datos varios de la partida guardada
  console.log("Datos partida guardada")
  console.log("Palabra: ", actualPalabra);
  console.log("Fecha: ", actualTiempo);
  console.log("Usuario: ", actualUsuario);

  hideBtn();

  //Calculos varios tiempo
  let sec = actualTiempo.slice(5);
  let min = actualTiempo.slice(0, 2);
  let secTransform = Math.round((sec / 60) * 100);
  let calculoTiempo = Math.round(((min + secTransform) / 100) * 60);
  let timer = calculoTiempo;
  display = document.querySelector("#time");
  startTimer(timer, display);



  function guardaRespPartidaCargada(i) {
    for (let iCol = 0; iCol < 5; iCol++) {
      let input = document.getElementById(`f${i}c${iCol}`).value;
      respuestas[i].push(input);
    }
    revisaResulPartidaCargada(respuestas[i], i);
  }

  function revisaResulPartidaCargada(respuesta, i) {
    respuesta.forEach(function (elemento, index) {
      if (elemento.toLowerCase() === arrayActualPalabra[index]) {
        tablaColores[i][index] = colores.VERDE;
      }
      else if (arrayActualPalabra.includes(elemento.toLowerCase())) {
        tablaColores[i][index] = colores.AMARILLO;
      }
      else if (!arrayActualPalabra.includes(elemento.toLowerCase())) {
        tablaColores[i][index] = colores.GRIS;
      }
    })
    pintaTabla();
  }

  arrayActualPalabra = actualPalabra.split("");


  //Guardo la respuesta de la partida solo de las filas con letras.
  for (let i = 0; i < 6; i++) {
    let fieldset = document.getElementById(`fila${i}`);
    let validaLetra = document.querySelectorAll(`#fila${i} input`);

    let valor0 = validaLetra[0].value;
    let valor1 = validaLetra[1].value;
    let valor2 = validaLetra[2].value;
    let valor3 = validaLetra[3].value;
    let valor4 = validaLetra[4].value;

    if (valor0 !== "" && valor1 !== "" && valor2 !== "" && valor3 !== "" && valor4 !== "") {
      guardaRespPartidaCargada(i);
      fieldset.disabled = true;
    }
    if (valor0 == "") {
      validaLetra[0].focus();
      break
    }
  }

  //Funcion para jugar con una partida cargada.
  for (let i = 0; i < 6; i++) {
    let fieldset = document.getElementById(`fila${i}`);
    fieldset.onkeydown = function (event) {
      if (event.key === `Enter`) {
        let validaLetra = document.querySelectorAll(`#fila${i} input`);
        let valor0 = validaLetra[0].value;
        let valor1 = validaLetra[1].value;
        let valor2 = validaLetra[2].value;
        let valor3 = validaLetra[3].value;
        let valor4 = validaLetra[4].value;


        if (valor0 == "" || valor1 == "" || valor2 == "" || valor3 == "" || valor4 == "") {
          return
        }
        else if (valor0.length > 1 || valor1.length > 1 || valor2.length > 1 || valor3.length > 1 || valor4.length > 1) {
          return
        }
        else {
          guardaRespPartidaCargada(i);

          let respuestaUsuario = respuestas[i];
          let respuestaUsuarioString = respuestaUsuario.join("").toLowerCase();
          
          if (respuestaUsuarioString == palabraGanadora) {
            gameOver = true;
            showBtn();
            document.getElementById("mensaje-resultado").style.color = "#000000";
            document.getElementById("mensaje-resultado").innerHTML = "Te felicito! Ganaste la partida!";
            scorePartidaGanada(i); // Guardamos los datos de la partida con el puntaje
            bloqueoFieldset();
          }

          if (i == 0 && respuestaUsuarioString != palabraGanadora) {
            document.getElementById("fila1").disabled = false;
            document.getElementById("fila0").disabled = true;
            document.getElementById("f1c0").focus();
          }
          if (i == 1 && respuestaUsuarioString != palabraGanadora) {
            document.getElementById("fila2").disabled = false;
            document.getElementById("fila1").disabled = true;
            document.getElementById("f2c0").focus();
          }
          if (i == 2 && respuestaUsuarioString != palabraGanadora) {
            document.getElementById("fila3").disabled = false;
            document.getElementById("fila2").disabled = true;
            document.getElementById("f3c0").focus();
          }
          if (i == 3 && respuestaUsuarioString != palabraGanadora) {
            document.getElementById("fila4").disabled = false;
            document.getElementById("fila3").disabled = true;
            document.getElementById("f4c0").focus();
          }
          if (i == 4 && respuestaUsuarioString != palabraGanadora) {
            document.getElementById("fila5").disabled = false;
            document.getElementById("fila4").disabled = true;
            document.getElementById("f5c0").focus();
          }
          if (i == 5 && respuestaUsuarioString != palabraGanadora) {
            gameOver = true;
            showBtn();
            document.getElementById("mensaje-resultado").innerHTML = `Perdiste. No quedan mas intentos. La palabra era: "${palabraGanadora}"`;
            bloqueoFieldset();
          }
        }
      }
    }
  }
}


//Setear puntaje
function scorePartidaGanada(fila) {

  let puntaje = {};

  puntaje.fecha = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
  puntaje.nombre = document.getElementById("nombre-jugador-input").value;

  //calcular puntaje
  switch (fila) {
    case 0:
      puntaje.puntaje = 150
      break;

    case 1:
      puntaje.puntaje = 100
      break;

    case 2:
      puntaje.puntaje = 80
      break;

    case 3:
      puntaje.puntaje = 60
      break;

    case 4:
      puntaje.puntaje = 30
      break;

    case 5:
      puntaje.puntaje = 10
      break;

    default:
      break;
  }

  //Traigo del localStorage el array "puntajes", si no esta le asigno "[]"
  let puntajesArray = JSON.parse(localStorage.getItem("puntajes")) || [];
  puntajesArray.push(puntaje);

  //Convierto mi array de puntajes a json
  let puntajeArrayJSON = JSON.stringify(puntajesArray);

  //Guardo mi array de puntajes en formato JSON en el local storage
  localStorage.setItem("puntajes", puntajeArrayJSON);

}

//Obtener puntajes. 
function ObtenerScore() {
  let puntajesArray = JSON.parse(localStorage.getItem("puntajes")) || [];
  let body = "";
  for (let i = 0; i < puntajesArray.length; i++) {
    body += `<tr role="row">
                        <td data-label="NOMBRE">${(puntajesArray[puntajesArray.length - 1 - i].nombre)}</td>
                        <td data-label="FECHA">${(puntajesArray[puntajesArray.length - 1 - i].fecha)}</td>
                        <td data-label="PUNTAJE">${(puntajesArray[puntajesArray.length - 1 - i].puntaje)}</td>
                    </tr>`
  }
  document.getElementById("puntajes").innerHTML = body;
}

// Ordenar puntajes
function ordenaTablaP() { 
  let puntajesArray = JSON.parse(localStorage.getItem('puntajes')) || [];
  puntajesArray.sort(function (a, b) {
    if (a.puntaje > b.puntaje) {
      return 1;
    }
    if (a.puntaje < b.puntaje) {
      return -1;
    }
    return 0;
  });

  //Muestro la lista de puntajes ordenado por puntaje
  let body = '';
  for (let i = 0; i < puntajesArray.length; i++) {
    body += `<tr role="row">
                        <td data-label="NOMBRE">${(puntajesArray[puntajesArray.length - 1 - i].nombre)}</td>
                        <td data-label="FECHA">${(puntajesArray[puntajesArray.length - 1 - i].fecha)}</td>
                        <td data-label="PUNTAJE">${(puntajesArray[puntajesArray.length - 1 - i].puntaje)}</td>
                    </tr>`
  }
  document.getElementById('puntajes').innerHTML = body;
}


let gameOver = false;

function bloqueoFieldset() {
  for (let i = 0; i < 6; i++) {
    let fieldset = document.getElementById(`fila${i}`);
    if (gameOver);
    fieldset.disabled = true;
  }
}

// INICIO DEL JUEGO

function inicio() {
  for (let i = 0; i < 6; i++) {
    let fieldset = document.getElementById(`fila${i}`);
    fieldset.onkeydown = function (event) {
      if (event.key === `Enter`) {
        let validaLetra = document.querySelectorAll(`#fila${i} input`);
        let valor0 = validaLetra[0].value;
        let valor1 = validaLetra[1].value;
        let valor2 = validaLetra[2].value;
        let valor3 = validaLetra[3].value;
        let valor4 = validaLetra[4].value;

        if (valor0 == "" || valor1 == "" || valor2 == "" || valor3 == "" || valor4 == "") {
          return 
        } else if (valor0.length > 1 || valor1.length > 1 || valor2.length > 1 || valor3.length > 1 || valor4.length > 1) {
          return
        }else {
          guardaResp(i);
          setTablaColores(respuestas[i], i)
          pintaTabla()
          let respUserString =  respuestas[i].join("").toLowerCase();
          if (respUserString == palabraGanadora) {
            gameOver = true;
            showBtn();
            document.getElementById("mensaje-resultado").style.color = "#000000";
            document.getElementById("mensaje-resultado").innerHTML = "Ganaste la partida";
            scorePartidaGanada(i);
            bloqueoFieldset();
          }

          if (i == 0 && respUserString != palabraGanadora) {
            document.getElementById("fila1").disabled = false;
            document.getElementById("fila0").disabled = true;
            document.getElementById("f1c0").focus();
          }
          if (i == 1 && respUserString != palabraGanadora) {
            document.getElementById("fila2").disabled = false;
            document.getElementById("fila1").disabled = true;
            document.getElementById("f2c0").focus();
          }
          if (i == 2 && respUserString != palabraGanadora) {
            document.getElementById("fila3").disabled = false;
            document.getElementById("fila2").disabled = true;
            document.getElementById("f3c0").focus();
          }
          if (i == 3 && respUserString != palabraGanadora) {
            document.getElementById("fila4").disabled = false;
            document.getElementById("fila3").disabled = true;
            document.getElementById("f4c0").focus();
          }
          if (i == 4 && respUserString != palabraGanadora) {
            document.getElementById("fila5").disabled = false;
            document.getElementById("fila4").disabled = true;
            document.getElementById("f5c0").focus();
          }
          if (i == 5 && respUserString != palabraGanadora) {
            gameOver = true;
            showBtn();
            document.getElementById("mensaje-resultado").innerHTML = `Perdiste. La palabra era: "${palabraGanadora}"`;
            bloqueoFieldset();
          }
        }
      }
    }
  }
}

// Guardar respuesta
function guardaResp(i) {
  for (let iCol = 0; iCol < 5; iCol++) {
    let input = document.getElementById(`f${i}c${iCol}`).value;
    respuestas[i].push(input);
  }
}

// Setear tabla de colores
function setTablaColores(respuesta, i) {
  respuesta.forEach(function (elemento, index) {
    if (elemento.toLowerCase() === arrayPalabraGanadora[index]) {
      tablaColores[i][index] = colores.VERDE;
    }
    else if (arrayPalabraGanadora.includes(elemento.toLowerCase())) {
      tablaColores[i][index] = colores.AMARILLO;
    }
    else if (!arrayPalabraGanadora.includes(elemento.toLowerCase())) {
      tablaColores[i][index] = colores.GRIS;
    }
  })
}

// Lista de palabras
const listaPalabras = [
    'aboyá',
    'aboya',
    'abran',
    'abras',
    'abrás',
    'abría',
    'acles',
    'acoja',
    'acojo',
    'acres',
    'actas',
    'actos',
    'actúo',
    'acuna',
    'acune',
    'acuno',
    'acuná',
    'acuné',
    'acunó',
    'acuso',
    'acusó',
    'acuña',
    'acuñe',
    'acuño',
    'acuñá',
    'acuñé',
    'acuñó',
    'afeas',
    'afeás',
    'aguda',
    'agudo',
    'alajú',
    'Aland',
    'albas',
    'albos',
    'alces',
    'alcés',
    'aleja',
    'alejá',
    'algas',
    'aliás',
    'almas',
    'alojo',
    'alojá',
    'alojó',
    'altas',
    'altos',
    'alías',
    'amina',
    'aminá',
    'ancas',
    'andas',
    'andes',
    'andés',
    'anima',
    'animo',
    'animá',
    'animó',
    'aojar',
    'aojas',
    'aojos',
    'aojás',
    'apees',
    'apeés',
    'apoda',
    'apodo',
    'apodá',
    'apodó',
    'aptas',
    'aptás',
    'apuré',
    'arces',
    'arcos',
    'ardan',
    'ardas',
    'ardes',
    'ardás',
    'ardés',
    'arias',
    'arios',
    'arlas',
    'arlos',
    'arlás',
    'armes',
    'armés',
    'arpas',
    'artes',
    'Aruba',
    'aruñe',
    'aruño',
    'aruñé',
    'aruñó',
    'aréis',
    'asate',
    'ascos',
    'asees',
    'aseos',
    'asida',
    'asido',
    'asiló',
    'asiré',
    'asnos',
    'asolo',
    'aspee',
    'aspeé',
    'aséis',
    'asían',
    'asías',
    'atoja',
    'atojo',
    'atojá',
    'atojó',
    'autos',
    'avale',
    'avara',
    'ayudá',
    'azoté',
    'aérea',
    'añoro',
    'añoró',
    'bacán',
    'bagas',
    'bagás',
    'bajas',
    'bajes',
    'bajos',
    'bajás',
    'bajés',
    'balas',
    'bales',
    'balás',
    'balés',
    'bares',
    'barre',
    'barrá',
    'barré',
    'basca',
    'bascá',
    'baste',
    'bastá',
    'basté',
    'batas',
    'bates',
    'bateá',
    'batás',
    'batís',
    'bayas',
    'bañas',
    'bañes',
    'Baños',
    'baños',
    'bañés',
    'bebed',
    'bebes',
    'bebés',
    'Benín',
    'besen',
    'beses',
    'besos',
    'besés',
    'betas',
    'bodas',
    'bogad',
    'bogas',
    'bogue',
    'bogué',
    'bogás',
    'bojar',
    'bojas',
    'bojos',
    'bojás',
    'bolar',
    'bollá',
    'bondi',
    'bonos',
    'borre',
    'borré',
    'boses',
    'bosés',
    'botad',
    'botan',
    'botas',
    'boten',
    'botes',
    'botás',
    'botés',
    'boyas',
    'boyás',
    'bozos',
    'bramo',
    'bramó',
    'Bruno',
    'bruta',
    'bruño',
    'bruñó',
    'bríos',
    'bulas',
    'bulos',
    'buscá',
    'bacán',
    'bagas',
    'bagás',
    'bajas',
    'bajes',
    'bajos',
    'bajás',
    'bajés',
    'balas',
    'bales',
    'balás',
    'balés',
    'bares',
    'barre',
    'barrá',
    'barré',
    'basca',
    'bascá',
    'baste',
    'bastá',
    'basté',
    'batas',
    'bates',
    'bateá',
    'batás',
    'batís',
    'bayas',
    'bañas',
    'bañes',
    'Baños',
    'baños',
    'bañés',
    'bebed',
    'bebes',
    'bebés',
    'Benín',
    'besen',
    'beses',
    'besos',
    'besés',
    'betas',
    'bodas',
    'bogad',
    'bogas',
    'bogue',
    'bogué',
    'bogás',
    'bojar',
    'bojas',
    'bojos',
    'bojás',
    'bolar',
    'bollá',
    'bondi',
    'bonos',
    'borre',
    'borré',
    'boses',
    'bosés',
    'botad',
    'botan',
    'botas',
    'boten',
    'botes',
    'botás',
    'botés',
    'boyas',
    'boyás',
    'bozos',
    'bramo',
    'bramó',
    'Bruno',
    'bruta',
    'bruño',
    'bruñó',
    'bríos',
    'bulas',
    'bulos',
    'buscá',
    'buscó',
    'buses',
    'Bután',
    'cabrá',
    'caceo',
    'caces',
    'cachó',
    'cacés',
    'cafés',
    'cagas',
    'cagás',
    'cajas',
    'calce',
    'calcé',
    'calcó',
    'cales',
    'callo',
    'calló',
    'calme',
    'calmo',
    'calmé',
    'calmó',
    'calés',
    'campó',
    'canas',
    'canes',
    'cansa',
    'cansá',
    'canta',
    'cantó',
    'capas',
    'capen',
    'capes',
    'cappa',
    'capta',
    'capto',
    'captá',
    'captó',
    'capás',
    'capés',
    'cargá',
    'cargó',
    'Carla',
    'caros',
    'casad',
    'casan',
    'casas',
    'casca',
    'cascá',
    'cascó',
    'casen',
    'cases',
    'casos',
    'casás',
    'casés',
    'Catar',
    'catas',
    'catás',
    'cause',
    'causé',
    'cavas',
    'cavos',
    'cazad',
    'cazan',
    'cazas',
    'cazos',
    'caída',
    'caído',
    'cañas',
    'cañeo',
    'cañás',
    'cañís',
    'cebos',
    'cedan',
    'cedas',
    'ceded',
    'ceden',
    'cedes',
    'cedás',
    'cedés',
    'cefos',
    'cejas',
    'cejás',
    'celes',
    'Celia',
    'celta',
    'cenas',
    'cepas',
    'ceras',
    'cercá',
    'cercó',
    'cerdo',
    'ceros',
    'cerrá',
    'cerró',
    'chefs',
    'Chile',
    'China',
    'chiís',
    'chocó',
    'chuzá',
    'ciega',
    'cimas',
    'cimás',
    'cines',
    'citas',
    'citás',
    'clamo',
    'clamó',
    'Clara',
    'clava',
    'clavá',
    'clavé',
    'clavó',
    'clubs',
    'coces',
    'cocés',
    'codeo',
    'codos',
    'coged',
    'cogen',

    'cabrá',
    'caceo',
    'caces',
    'cachó',
    'cacés',
    'cafés',
    'cagas',
    'cagás',
    'cajas',
    'calce',
    'calcé',
    'calcó',
    'cales',
    'callo',
    'calló',
    'calme',
    'calmo',
    'calmé',
    'calmó',
    'calés',
    'campó',
    'canas',
    'canes',
    'cansa',
    'cansá',
    'canta',
    'cantó',
    'capas',
    'capen',
    'capes',
    'cappa',
    'capta',
    'capto',
    'captá',
    'captó',
    'capás',
    'capés',
    'cargá',
    'cargó',
    'Carla',
    'caros',
    'casad',
    'casan',
    'casas',
    'casca',
    'cascá',
    'cascó',
    'casen',
    'cases',
    'casos',
    'casás',
    'casés',
    'Catar',
    'catas',
    'catás',
    'cause',
    'causé',
    'cavas',
    'cavos',
    'cazad',
    'cazan',
    'cazas',
    'cazos',
    'caída',
    'caído',
    'cañas',
    'cañeo',
    'cañás',
    'cañís',
    'cebos',
    'cedan',
    'cedas',
    'ceded',
    'ceden',
    'cedes',
    'cedás',
    'cedés',
    'cefos',
    'cejas',
    'cejás',
    'celes',
    'Celia',
    'celta',
    'cenas',
    'cepas',
    'ceras',
    'cercá',
    'cercó',
    'cerdo',
    'ceros',
    'cerrá',
    'cerró',
    'chefs',
    'Chile',
    'China',
    'chiís',
    'chocó',
    'chuzá',
    'ciega',
    'cimas',
    'cimás',
    'cines',
    'citas',
    'citás',
    'clamo',
    'clamó',
    'Clara',
    'clava',
    'clavá',
    'clavé',
    'clavó',
    'clubs',
    'coces',
    'cocés',
    'codeo',
    'codos',
    'coged',
    'cogen',
    'coger',
    'coges',
    'cogés',
    'cogía',
    'cojan',
    'cojas',
    'cojos',
    'cojás',
    'colas',
    'coles',
    'colma',
    'colmá',
    'colás',
    'colón',
    'coman',
    'comas',
    'combó',
    'comed',
    'comes',
    'comás',
    'comés',
    'conos',
    'copas',
    'copos',
    'copta',
    'copás',
    'coral',
    'coras',
    'Corea',
    'corea',
    'coreá',
    'corra',
    'corre',
    'corro',
    'corré',
    'corrí',
    'corsa',
    'cosas',
    'coses',
    'costó',
    'cosás',
    'cosés',
    'coños',
    'crasa',
    'creas',
    'crees',
    'creme',
    'cremo',
    'cremé',
    'cremó',
    'creés',
    'croar',
    'cruje',
    'críen',
    'cubas',
    'cubos',
    'cucas',
    'cucos',
    'cucás',
    'cuida',
    'cuide',
    'cuidá',
    'cuidé',
    'culos',
    'culta',
    'cunas',
    'cunás',
    'cupos',
    'cural',
    'curas',
    'curdo',
    'cures',
    'curio',
    'curró',
    'cursó',
    'curás',
    'curés',
    'cuñas',
    'cuñás',
    'dados',
    'dagas',
    'dance',
    'dados',
    'dagas',
    'dance',
    'dancé',
    'datos',
    'dañes',
    'daños',
    'dañés',
    'debas',
    'debed',
    'deben',
    'debes',
    'debés',
    'dedos',
    'dejas',
    'dejás',
    'densa',
    'dices',
    'dijes',
    'diles',
    'divas',
    'divos',
    'doblé',
    'dolos',
    'doman',
    'domas',
    'domes',
    'domos',
    'domás',
    'domés',
    'donan',
    'donas',
    'donen',
    'dones',
    'donás',
    'donés',
    'dores',
    'doria',
    'dorio',
    'dotas',
    'dotes',
    'dotás',
    'dotés',
    'doñas',
    'drupa',
    'Dubai',
    'Dubái',
    'dudan',
    'dunas',
    'dures',
    'duros',
    'durés',
    'dúhos',
    'echas',
    'eches',
    'echos',
    'echés',
    'edita',
    'editá',
    'eleve',
    'elevé',
    'ellos',
    'emana',
    'emaná',
    'emoji',
    'emoyi',
    'emula',
    'emule',
    'emulo',
    'emulá',
    'emulé',
    'emuló',
    'emúes',
    'enoja',
    'enojo',
    'enojá',
    'entes',
    'envío',
    'erizo',
    'errar',
    'erres',
    'errés',
    'espiá',
    'estad',
    'estas',
    'euros',
    'evita',
    'evitá',
    'falle',
    'fallé',
    'falos',
    'faltá',
    'ferio',
    'fetos',
    'ficad',
    'ficas',
    'ficás',
    'fijas',
    'fijás',
    'filas',
    'files',
    'filás',
    'finco',
    'fincó',
    'fines',
    'fique',
    'fiqué',
    'firmé',
    'focos',
    'folia',
    'foliá',
    'folla',
    'follo',
    'folló',
    'fomes',
    'forcé',
    'forme',
    'formo',
    'formá',
    'formé',
    'formó',
    'fosos',
    'fotos',
    'Frida',
    'frita',
    'fritá',
    'frías',
    'fugas',
    'fugue',
    'fugué',
    'fugás',
    'fumes',
    'fumés',
    'fúsil',
    'Gabón',
    'gafas',
    'galas',
    'Gales',
    'Galia',
    'galos',
    'ganes',
    'ganás',
    'ganés',
    'gases',
    'gastó',
    'gatos',
    'genes',
    'Ghana',
    'gimen',
    'gimes',
    'giras',
    'giros',
    'girás',
    'godas',
    'godos',
    'goles',
    'gorda',
    'gorra',
    'grabe',
    'grabé',
    'grave',
    'gravé',
    'grite',
    'gritá',
    'grité',
    'gritó',
    'groar',
    'grúas',
    'gurús',
    'güera',
    'habas',
    'habed',
    'hablá',
    'habrá',
    'habré',
    'había',
    'hacen',
    'haces',
    'hacés',
    'hacía',
    'hagan',
    'hagas',
    'hagás',
    'Haití',
    'halan',
    'halas',
    'hallo',
    'hallá',
    'halos',
    'halás',
    'harte',
    'harán',
    'harás',
    'haría',
    'hayan',
    'hayas',
    'hayás',
    'heces',
    'hecha',
    'hecho',
    'hemos',
    'hiero',
    'higos',
    'hijas',
    'hijos',
    'hilan',
    'hilos',
    'hinca',
    'hinco',
    'hincó',
    'hipos',
    'hitos',
    'hoces',
    'hocés',
    'hojas',
    'horne',
    'horné',
    'huera',
    'huero',
    'hunas',
    'hunos',
    'hurgo',
    'husos',
    'ibais',
    'ideas',
    'ideás',
    'iglús',
    'India',
    'infle',
    'inflé',
    'intis',
    'iréis',
    'irían',
    'irías',
    'isbas',
    'islas',
    'Ivana',
    'Jabes',
    'jadee',
    'jades',
    'jadeé',
    'jalan',
    'jalón',
    'Japón',
    'jefes',
    'jemal',
    'jemes',
    'jerga',
    'jodas',
    'jodes',
    'jodás',
    'jodés',
    'jonia',
    'joyas',
    'joyel',
    'jugos',
    'jujeo',
    'Julio',
    'jures',
    'jurés',
    'kanes',
    'Kenia',
    'kunas',
    'kurda',
    'labes',
    'labia',
    'labre',
    'labré',
    'lacra',
    'lacta',
    'lactá',
    'lados',
    'ladro',
    'ladró',
    'Lagos',
    'lagos',
    'lamas',
    'lamen',
    'lames',
    'lamió',
    'lamás',
    'lamés',
    'lancé',
    'lapas',
    'larga',
    'latas',
    'latás',
    'laves',
    'lavés',
    'laxas',
    'laxos',
    'laxás',
    'lazan',
    'lazos',
    'legas',
    'legos',
    'lejos',
    'lemas',
    'lenta',
    'levas',
    'leves',
    'levás',
    'levés',
    'leyes',
    'leías',
    'Libia',
    'libia',
    'libré',
    'libró',
    'licua',
    'licuá',
    'licúa',
    'lides',
    'limas',
    'linda',
    'liras',
    'lises',
    'locas',
    'locha',
    'locos',
    'locus',
    'logró',
    'lomos',
    'lores',
    'loros',
    'losas',
    'losás',
    'loteo',
    'lotes',
    'lozas',
    'luces',
    'luche',
    'lucho',
    'luchá',
    'luché',
    'luchó',
    'lunas',
    'lusas',
    'lusos',
    'Macao',
    'maceo',
    'magos',
    'Maine',
    'malas',
    'males',
    'malos',
    'Malta',
    'malís',
    'mamas',
    'mamás',
    'manas',
    'manca',
    'mancá',
    'mancó',
    'manda',
    'mandó',
    'mangó',
    'manos',
    'manás',
    'mapas',
    'marcó',
    'mares',
    'marro',
    'Marín',
    'masco',
    'mascó',
    'mases',
    'matas',
    'mates',
    'matás',
    'matés',
    'mayas',
    'mayás',
    'mazos',
    'mañas',
    'meaba',
    'mecen',
    'meces',
    'mecés',
    'mediá',
    'memes',
    'menes',
    'mentá',
    'menés',
    'menús',
    'meras',
    'merco',
    'mercó',
    'meros',
    'merás',
    'mesas',
    'mesen',
    'meses',
    'mesás',
    'mesés',
    'metas',
    'metes',
    'metás',
    'mezas',
    'mezás',
    'micas',
    'midas',
    'midás',
    'migro',
    'miles',
    'minas',
    'mines',
    'Minsk',
    'minás',
    'minés',
    'miras',
    'miren',
    'mires',
    'mirás',
    'mirés',
    'misad',
    'misas',
    'misma',
    'mista',
    'mistá',
    'misás',
    'mitos',
    'mitro',
    'mitró',
    'mocos',
    'modas',
    'modos',
    'mofas',
    'mofes',
    'mofás',
    'mofés',
    'mojan',
    'mojar',
    'mojas',
    'mojen',
    'mojos',
    'mojás',
    'molas',
    'moles',
    'molás',
    'molés',
    'monas',
    'monos',
    'monté',
    'montó',
    'mopas',
    'moras',
    'mores',
    'moros',
    'morro',
    'morás',
    'morés',
    'Moscú',
    'motas',
    'moved',
    'mozas',
    'moños',
    'mucas',
    'mucos',
    'mudas',
    'mudos',
    'mudás',
    'mueve',
    'mugen',
    'muges',
    'mugid',
    'mugió',
    'mugís',
    'mujan',
    'mujas',
    'mulas',
    'multe',
    'multá',
    'multé',
    'muros',
    'musas',
    'musás',
    'nabos',
    'naces',
    'nacés',
    'nadas',
    'nades',
    'nadés',
    'narre',
    'narré',
    'natas',
    'natos',
    'Nauru',
    'Naurú',
    'naves',
    'nazca',
    'nazis',
    'necia',
    'Nepal',
    'netos',
    'nexos',
    'niños',
    'nomos',
    'notas',
    'notes',
    'notás',
    'notés',
    'nubes',
    'nucas',
    'nudas',
    'nudos',
    'nulas',
    'nulos',
    'Níger',
    'obras',
    'odias',
    'odios',
    'odiás',
    'odres',
    'ogros',
    'ollas',
    'omaní',
    'ombús',
    'ondas',
    'onzas',
    'opera',
    'operá',
    'optas',
    'optás',
    'orbes',
    'orcas',
    'orden',
    'oriná',
    'ornan',
    'ornee',
    'orneé',
    'oseas',
    'oseás',
    'osito',
    'otras',
    'ovulo',
    'ovuló',
    'oírte',
    'pacas',
    'pacen',
    'pacta',
    'pactá',
    'pactó',
    'pacés',
    'pagan',
    'pague',
    'pagué',
    'pajas',
    'pajes',
    'palas',
    'palme',
    'palmá',
    'palmé',
    'palos',
    'palpa',
    'panes',
    'papúa',
    'papús',
    'paras',
    'parda',
    'Pardo',
    'paree',
    'paren',
    'pares',
    'pareé',
    'parta',
    'partí',
    'parás',
    'paría',
    'París',
    'parís',
    'pasas',
    'pasen',
    'pases',
    'paseó',
    'pasás',
    'pasés',
    'patas',
    'patea',
    'pateá',
    'patos',
    'patés',
    'pavos',
    'pañal',
    'pecas',
    'peces',
    'pedos',
    'pegas',
    'pegue',
    'pelos',
    'penan',
    'penas',
    'penda',
    'pende',
    'penen',
    'penes',
    'pensá',
    'pensé',
    'penás',
    'penés',
    'peras',
    'perdí',
    'peros',
    'pesad',
    'pesas',
    'pescá',
    'pesen',
    'peses',
    'pesos',
    'pesás',
    'pesés',
    'petas',
    'petás',
    'peáis',
    'peñas',
    'pican',
    'picas',
    'picos',
    'picás',
    'pidas',
    'pides',
    'pidás',
    'pines',
    'pipas',
    'pisad',
    'pises',
    'pitan',
    'pitos',
    'playá',
    'plena',
    'pleno',
    'pobló',
    'pocas',
    'pocos',
    'podas',
    'poded',
    'poder',
    'podes',
    'podrá',
    'podré',
    'podás',
    'podés',
    'podía',
    'polos',
    'poned',
    'ponen',
    'poner',
    'pones',
    'ponga',
    'ponés',
    'ponía',
    'porfa',
    'poros',
    'posas',
    'posee',
    'posen',
    'poses',
    'poseé',
    'posos',
    'posás',
    'posés',
    'potos',
    'poyas',
    'poyás',
    'pozos',
    'Prada',
    'prado',
    'prevé',
    'preña',
    'preño',
    'preñá',
    'preñó',
    'primó',
    'probó',
    'pueda',
    'puede',
    'puedo',
    'pujan',
    'pujas',
    'pujen',
    'pujás',
    'pulen',
    'pumas',
    'puras',
    'purgá',
    'puros',
    'putas',
    'Qatar',
    'quede',
    'quedé',
    'queme',
    'quemo',
    'quemá',
    'quemé',
    'quemó',
    'queré',
    'quise',
    'quiso',
    'Quito',
    'quito',
    'quitó',
    'rabiá',
    'rabos',
    'rabón',
    'ralbe',
    'ralbé',
    'ramos',
    'ranas',
    'rapas',
    'rapás',
    'raras',
    'raros',
    'rasas',
    'rasco',
    'rascá',
    'raspá',
    'rasás',
    'ratas',
    'ratos',
    'razas',
    'razás',
    'raéis',
    'reces',
    'recia',
    'recés',
    'redes',
    'regia',
    'regía',
    'reinó',
    'rejas',
    'remas',
    'remes',
    'remos',
    'remás',
    'remés',
    'renos',
    'rento',
    'rentá',
    'rentó',
    'reses',
    'reste',
    'resté',
    'restó',
    'retes',
    'retos',
    'retés',
    'reyes',
    'rezan',
    'rezas',
    'rezás',
    'reíos',
    'reúna',
    'rices',
    'rifas',
    'rimas',
    'rimen',
    'rimes',
    'rimás',
    'rimés',
    'rinda',
    'ritos',
    'roban',
    'robes',
    'robés',
    'rocas',
    'rodas',
    'rodás',
    'rojas',
    'rojos',
    'roles',
    'rolla',
    'rollá',
    'rolló',
    'romas',
    'romos',
    'rompa',
    'rompe',
    'rompé',
    'rones',
    'rotas',
    'rotos',
    'rotás',
    'royas',
    'royos',
    'royás',
    'rubís',
    'rudos',
    'rueis',
    'rugen',
    'ruges',
    'rugió',
    'rugís',
    'rujan',
    'rulos',
    'runas',
    'rusas',
    'Rusia',
    'rusos',
    'rutas',
    'ruéis',
    'ruñas',
    'ruñás',
    'sabia',
    'sabía',
    'sacan',
    'sacas',
    'sacos',
    'sacra',
    'sacás',
    'sajón',
    'sakes',
    'saldó',
    'salga',
    'salgo',
    'salgá',
    'salgó',
    'salta',
    'saltá',
    'saltó',
    'salva',
    'salve',
    'salvá',
    'salvé',
    'salvó',
    'salís',
    'Samoa',
    'sanad',
    'sanas',
    'sanos',
    'santa',
    'sanás',
    'sapos',
    'saudí',
    'sañas',
    'sebos',
    'secan',
    'sedad',
    'sedan',
    'sedas',
    'seden',
    'sedes',
    'sedás',
    'sedés',
    'sentá',
    'senté',
    'sentó',
    'sepas',
    'sepás',
    'seres',
    'seria',
    'seriá',
    'serró',
    'serán',
    'serás',
    'sería',
    'setas',
    'sexos',
    'señás',
    'siega',
    'siego',
    'sigan',
    'Siria',
    'siria',
    'siseo',
    'sitúo',
    'soban',
    'sobas',
    'sobes',
    'sobré',
    'sobés',
    'sogas',
    'Solas',
    'solas',
    'soles',
    'solos',
    'solés',
    'solía',
    'somos',
    'sonad',
    'sonar',
    'sondá',
    'sonás',
    'sopas',
    'soplo',
    'sopló',
    'sopás',
    'sorbe',
    'sorbé',
    'soñad',
    'soñar',
    'soñás',
    'soñés',
    'subas',
    'subes',
    'sucia',
    'sucre',
    'sudan',
    'sudar',
    'sudas',
    'sudes',
    'Sudán',
    'tabas',
    'tabús',
    'tacos',
    'talas',
    'talás',
    'talés',
    'tapas',
    'tapen',
    'tapes',
    'tapás',
    'tapés',
    'tardé',
    'Tegus',
    'Tejas',
    'tejas',
    'telas',
    'temas',
    'temen',
    'temes',
    'temás',
    'temés',
    'tened',
    'tenga',
    'tengo',
    'tenia',
    'tensa',
    'tensá',
    'tensó',
    'tenés',
    'tenía',
    'terca',
    'tersa',
    'terse',
    'tersá',
    'tersé',
    'tersó',
    'testo',
    'testá',
    'testó',
    'tetar',
    'tetas',
    'tetás',
    'Texas',
    'teñía',
    'tiene',
    'times',
    'timés',
    'tipos',
    'tiras',
    'tiros',
    'tirás',
    'tisús',
    'titán',
    'tocás',
    'todas',
    'todos',
    'togas',
    'togás',
    'tomad',
    'toman',
    'tomas',
    'tomes',
    'tomás',
    'tomés',
    'Tonga',
    'tonos',
    'tonta',
    'topas',
    'topos',
    'topás',
    'toqué',
    'torpe',
    'tosed',
    'toses',
    'traed',
    'traen',
    'traer',
    'traes',
    'tragá',
    'trajo',
    'tramá',
    'trató',
    'traés',
    'traía',
    'trinó',
    'trocó',
    'tronó',
    'troté',
    'tríos',
    'tubos',
    'Tulio',
    'tumbá',
    'tunas',
    'tunás',
    'tólar',
    'Túnez',
    'untes',
    'unías',
    'urbes',
    'urdas',
    'Uribe',
    'urnas',
    'usaos',
    'usate',
    'uséis',
    'uñoso',
    'vacan',
    'vacas',
    'vados',
    'vagas',
    'vagos',
    'vague',
    'vagué',
    'vagás',
    'vales',
    'valga',
    'valgo',
    'valsa',
    'valse',
    'valsá',
    'valsé',
    'valés',
    'vamos',
    'vasca',
    'vasos',
    'vasta',
    'vates',
    'vayan',
    'vayas',
    'vayás',
    'veces',
    'vecés',
    'vedas',
    'velas',
    'velen',
    'veles',
    'velos',
    'velás',
    'velés',
    'vemos',
    'venas',
    'vendé',
    'vengo',
    'vengó',
    'vente',
    'venté',
    'Verde',
    'veros',
    'verás',
    'vería',
    'vetas',
    'vetos',
    'veían',
    'veías',
    'viajé',
    'vidas',
    'viene',
    'viera',
    'vigas',
    'viles',
    'vinos',
    'vires',
    'vivás',
    'voces',
    'volar',
    'volví',
    'volás',
    'votad',
    'votan',
    'votar',
    'votas',
    'voten',
    'votes',
    'votos',
    'votás',
    'votés',
    'vudús',
    'vídeo',
    'wikis',
    'wones',
    'yates',
    'yemas',
    'Yemen',
    'yendo',
    'yenes',
    'yesca',
    'yogur',
    'yugos',
    'zacas',
    'zarca',
    'zares',
    'zedas',
    'zetas',
    'zonas',
    'zorro',
    'zulús',
    'zurda',
    'zurro']


function elegirPalabraAlAzar(listaPalabras) {
  return listaPalabras[Math.floor(Math.random() * listaPalabras.length)]
}

let palabraGanadora = elegirPalabraAlAzar(listaPalabras);
let arrayPalabraGanadora = palabraGanadora.split("");

function tabular(e) {
  let obj = e.target
  let frm = obj.form;
  let largo = obj.value.length;
  let tam = obj.maxLength;
  if (largo == tam) {
    for (i = 0; i < frm.elements.length; i++) {
      if (frm.elements[i] == obj) {
        if (i == frm.elements.length - 1) { i = -1; }
        break;
      }
    }
    frm.elements[i + 1].focus();
    return false;
  }
}

function hideBtn() {
  document.getElementById("nueva-partida").style.display = "none";
  document.getElementById("cargar-partida").style.display = "none";
  document.getElementById("guardar-partida").style.display = "inline-block";
  document.getElementById("timer").style.display = "block";
  document.getElementById("time").style.display = "inline";
}

function showBtn() {
  document.getElementById("volver-jugar-partida").style.display = "inline-block";
  document.getElementById("guardar-partida").style.display = "none";
  document.getElementById("mensaje-resultado").style.display = "inline-block";
  document.getElementById("time").style.display = "none";
  document.getElementById("timer").style.display = "none";
}

// SETEA E INICIA EL TIMER
function timer() {
  let tresminutos = 60 * 5,
    display = document.querySelector("#time");
  startTimer(tresminutos, display);
}

function startTimer(duration, display) {
  let timer = duration, minutes, seconds;
  let reloj = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (gameOver) {
      clearInterval(reloj);
    }

    if (--timer < 0) {
      gameOver = true;
      timer = duration;
      showBtn();
      document.getElementById("mensaje-resultado").innerHTML = `Termnó el tiempo`;
      bloqueoFieldset();
    }
  }, 1000);
}


window.onload = function () {
  console.log(palabraGanadora)

  let inputsForm = document.getElementById("grilla").querySelectorAll("input");

  inputsForm.forEach(function (x) {
    x.addEventListener("keyup", tabular);
  })

  const nuevaPartida = document.getElementById("nueva-partida");
  const volverAJugar = document.getElementById("volver-jugar-partida");
  const gurdarPartida = document.getElementById("guardar-partida");
  const rankingPartida = document.getElementById("ranking-partida");
  const cargarPartida = document.getElementById("cargar-partida");

  const form = document.getElementById("formulario-usuario");
  const name = document.getElementById("nombre-jugador-input");

  const ordenFecha = document.getElementById("orden-por-fecha");
  const ordenPuntaje = document.getElementById("orden-por-puntaje");
  const numeroPartida = document.getElementById("numero-partida");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let regexName = new RegExp("^[A-Za-z]+$");
    let nameValue = name.value;
    let regexValue = regexName.test(nameValue);

    if (name.value.length < 3 || regexValue === false || name.value === "") {
      errorNombre.innerHTML = "Ingrese un nombre mayor a 2 digitos. Solo letras sin espacios."
      return false;
    } else {
      document.getElementById("nombre-jugador").style.display = "none";
      gameOver = false;
      inicio();
      timer();
      hideBtn();
      document.getElementById("fila0").disabled = false;
      document.getElementById("f0c0").focus();
    }
  })

  nuevaPartida.addEventListener("click", function () {
    document.getElementById("nombre-jugador").style.display = "flex";
    name.focus();
  })

  volverAJugar.addEventListener("click", function () {
    gameOver = false;
    location.reload();
  })

  gurdarPartida.addEventListener("click", function () {
    GuardaProgreso();
  })

  rankingPartida.addEventListener("click", function () {
    ordenPuntaje.style.display = "table-cell"
    numeroPartida.style.display = "none"
    ObtenerScore();
    mostrarModal();

    ordenFecha.addEventListener("click", function () {
      ObtenerScore();
    })

    ordenPuntaje.addEventListener("click", function () {
      ordenaTablaP();
    })
  })

  cargarPartida.addEventListener("click", function () {
    document.getElementById("nombre-jugador").style.display = "none";
    ordenPuntaje.style.display = "none"
    numeroPartida.style.display = "table-cell"
    ObtenerGuardadas();
    mostrarModal();

    ordenFecha.addEventListener("click", function () {
      ObtenerGuardadas();
    })
  })

  // modal

  function mostrarModal() {
    let modal = document.getElementById("modalPartidas");
    let span = document.getElementById("close");

    
    modal.style.display = "block";

    // cerrar modal
    span.onclick = function () {
      modal.style.display = "none";
    }

    // cerrar modal, click afuera
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }
}  