
window.onload = function() {
        const form = document.getElementById("form");
        const nombre = document.getElementById("nombre");
        const correo = document.getElementById("correo");
        const mensaje = document.getElementById("mensaje");
      
        const validador = {
            nombre: false,
            correo: false,
            mensaje: false,
          };
      
        form.addEventListener("submit", function(e){
            e.preventDefault();
            var regexName = new RegExp ("^[a-zA-Z0-9_]*$");
            let nameValue = nombre.value;
            let regexValueName = regexName.test(nameValue);
      
            var regexEmail = new RegExp ("[a-z0-9]+@[a-z]+\.[a-z]{2,3}");
            let emailValue = correo.value;
            let regexValueEmail = regexEmail.test(emailValue);
      
            if(nombre.value.length < 3 || regexValueName === false || nombre.value === ""){
                nombre.style.borderColor = 'red';
            }else {
              validador.nombre = true;
            }
      
            if(regexValueEmail === false || correo.value === ""){
                correo.style.borderColor= 'red';
            }else {
              validador.correo = true;
            }
      
            if(mensaje.value.length < 5 || mensaje.value === ""){
                mensaje.style.borderColor= 'red';
            }else {
              validador.mensaje = true;
            }
      
            if (validador.nombre && validador.correo && validador.mensaje){
              validador.nombre = false;
              validador.correo = false;
              validador.mensaje = false;
      
              window.open(`mailto:joaquin@gmail.com?subject=Mesaje de ${nombre.value}&body=${mensaje.value}`);
              form.reset();
              nombre.style.borderColor= 'black';
              correo.style.borderColor= 'black';
              mensaje.style.borderColor= 'black';
            }
        })
      
      };
