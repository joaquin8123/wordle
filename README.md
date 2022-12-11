# Wordle

## Alumno: Suarez Joaquin
## Materia: LPPA - UAI

## Consigna:
- Código prolijo.
- Consistencia en comentarios, commits y estilos de código.
- Diseño responsivo, estética agradable del juego y de la web (usando Flexbox).
- Juego completamente funcional siguiendo las reglas mencionadas en wikipedia.
- Debe existir un botón “Jugar” el cual el usuario debe apretar para poder comenzar el juego. Al presionar el botón mencionado, el jugador debe ingresar su nombre y luego un contador deberá aparecer en pantalla, el mismo debe detenerse cuando el participante haya ganado o perdido el juego.
- Cada vez que el juego se carga, se debe elegir aleatoriamente una palabra de la lista de palabras disponibles (utilizar https://wordle.danielfrg.com/words/5.json), es decir, si se carga el juego y la palabra ganadora es “poeta”, al volver a cargar la página la palabra ganadora ya no es más “poeta” y pasa a ser otra palabra elegida aleatoriamente de la lista mencionada.
- Agregar funcionalidad de guardar y cargar partida en el juego usando LocalStorage. El jugador puede guardar el progreso de una a más partidas, haciendo click en un botón que diga “guardar partida”, guardando la palabra ganadora elegida y el progreso realizado por el usuario hasta el momento de guardar la partida en LocalStorage. Las partidas guardadas se deben mostrar en una lista y se deben poder cargar para continuar jugando.
- Detectar el momento en que un jugador ha ganado la partida y mostrar un cartel informativo.
- Detectar el momento en que un jugador ha perdido la partida y mostrar un cartel informativo.
- Crear una página de Contacto, con un formulario que permita ingresar nombre, mail y mensaje, y al
enviar se abra la herramienta de envío de emails predeterminada del sistema operativo.
- Validaciones del formulario de contacto (nombre requerido alfanumérico, mail requerido válido y mensaje con más de 5 caracteres).
## Deseables:
- Guardar el resultado de las partidas ganadas, nombre del jugador, fecha de partida y el puntaje obtenido.
- Agregar un botón para mostrar un popup con la lista de partidas con jugadores, puntajes y fechas.
- Agregar la opción de ordenar la lista de partidas por fecha o puntaje.
- Agregar un link a la página de Github donde se alojó el código del juego, que al apretarlo se abre en una nueva pestaña