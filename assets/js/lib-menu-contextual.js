function hasParentWithClass(element, classSelector) {
	const className = classSelector.startsWith('.') ? classSelector.slice(1) : classSelector;

	while (element && element !== document) {
		if (element.classList.contains(className)) {
			return true;
		}
		element = element.parentNode;
	}
	return false;
}

// function fadeElement(a, b) {
// 	if (b !== 'show') { return a.style.opacity = setTimeout(function () { a.style.display = 'none'; }, 200) * 0; } a.style.display = 'block'; setTimeout(function () { a.style.opacity = 1; }, 30);
// }

function fadeElement(element, action) {
	if (action === 'show') {
		element.style.display = 'block';
		setTimeout(() => {
			element.style.opacity = 1;
		}, 30);
	} else {
		element.style.opacity = 0;
		setTimeout(() => {
			element.style.display = 'none';
		}, 200);
	}
}

function addListener(target, eventType, callback) {
	// Obtenemos una instancia del elemento objetivo, ya sea por selector de cadena o por referencia directa
	const element = (typeof target === "string")
		? document.querySelector(target)
		: target;

	// Si el elemento existe, añadimos el listener
	// Aseguramos que el elemento no sea nulo o indefinido antes de añadir el listener
	if (element) {
		element.addEventListener(eventType, callback);
	}
}


document.addEventListener("DOMContentLoaded", function () {

	// Todos los elementos que tienen la clase .jctx-host deben tener un menu contextual
	var elementos_con_menu = document.querySelectorAll(".jctx-host");

	// itineramos sobre los elementos que tienen un menu contextual
	Array.from(elementos_con_menu).forEach((nodo, indice) => {
		console.log("element: ", nodo);
		console.log("Indice: ", indice);
		
		// Añadimos un listener al nodo para el evento contextmenu
		addListener(nodo, "contextmenu", function (event) {
			// Esta funcion es la encargada de mostrar el menu contextual

			var menus = document.querySelector(".jctx");

			Array.from(menus).forEach( (menu, indice) => { 
				menu.style.display = 'none'; 
			});

			event.preventDefault();
			var id = '';

			Array.from(nodo.classList).forEach(
				(clase, indice) => { 
					if (~clase.indexOf("jctx-id-")) { 
						id = '.' + clase;
					}
				}
			);
			var ul = document.querySelector(".jctx" + id);
			
			var maxLeft = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 10 - ul.getBoundingClientRect().width;
			var maxTop = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 10 - ul.getBoundingClientRect().height;
			
			const x = event.clientX; // posición X respecto a la ventana
    		const y = event.pageY; // posición Y respecto a la ventana

			fadeElement(ul, 'show');

			ul.style.left = (event.pageX > maxLeft ? maxLeft : event.pageX) + "px";
			ul.style.top = event.pageY + "px";
			ul.style.top = y + "px";
		});
	});

	Array.from(document.querySelectorAll(".jctx li")).forEach((x, indice) => {
		addListener(x, "click", function () {
			if (eval("typeof(handleMenuAction)==typeof(Function)") && !x.classList.contains("disabled")) handleMenuAction(x.getAttribute("data-action"));
			fadeElement(x.parentElement, 'hide');
		});
	});

	addListener(document, "mousedown", function (e) {
		// si el nodo no tiene un nodo padre con la clase .jctx-host
		if (!hasParentWithClass(e.target, ".jctx-host"))
		{
			var menus = document.querySelector(".jctx");

			Array.from(menus).forEach((menu, indice) => { 
				fadeElement(x, 'hide'); 
			});
		}
	});
});