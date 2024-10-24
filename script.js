const graph = {
    "Loperena": { "El Centro": 1, "Altagracia": 4 },
    "El Centro": { "Loperena": 1, "Altagracia": 2, "La Garita": 5 },
    "Altagracia": { "Loperena": 4, "El Centro": 2, "La Garita": 1, "El Cerezo": 3 },
    "La Garita": { "El Centro": 5, "Altagracia": 1, "El Cerezo": 2, "El Carmen": 6 },
    "El Cerezo": { "Altagracia": 3, "La Garita": 2, "El Carmen": 1, "Gaitan": 7 },
    "El Carmen": { "La Garita": 6, "El Cerezo": 1, "Gaitan": 2 },
    "Gaitan": { "El Cerezo": 7, "El Carmen": 2, "Kennedy": 3, "Guatapuri": 5 },
    "Kennedy": { "Gaitan": 3, "Sicarare": 1 },
    "Sicarare": { "Kennedy": 1, "Guatapuri": 2 },
    "Guatapuri": { "Sicarare": 2, "Gaitan": 5 }
};


let barriosAgregados = 0; // Contador de barrios agregados
let barriosEliminados = 0; // Contador de barrios eliminados

document.getElementById('agregar-barrio').onclick = function() {
    const nuevoBarrio = document.getElementById('nuevo-barrio').value;
    if (/\d/.test(nuevoBarrio)) {
        alert("Error: El nombre del barrio no puede contener números.");
        return;
    }
    if (Object.keys(graph).some(barrio => barrio.toLowerCase() === nuevoBarrio.toLowerCase())) {
        alert("Error: El barrio ya existe.");
        return;
    }
    // Verificar si se puede agregar un nuevo barrio
    if (barriosAgregados >= 2) {
        alert("Error: Solo se permiten agregar 2 barrios más.");
        return;
    }
    
    if (nuevoBarrio) {
        // Generar distancias aleatorias para las conexiones
        const conexiones = {};
        for (const barrio in graph) {
            // Generar un valor aleatorio entre 1 y 10 para la distancia
            conexiones[barrio] = Math.floor(Math.random() * 10) + 1; 
            graph[barrio][nuevoBarrio] = conexiones[barrio]; // Agregar la conexión al barrio existente
            graph[nuevoBarrio] = graph[nuevoBarrio] || {}; // Inicializar el nuevo barrio si no existe
            graph[nuevoBarrio][barrio] = conexiones[barrio]; // Agregar la conexión inversa
        }

        barriosAgregados++; // Incrementar el contador de barrios agregados
        document.getElementById('nuevo-barrio').value = '';
        mostrarBarrios();
    
    }
};

document.getElementById('eliminar-barrio').onclick = function() {
    const barrioEliminar = document.getElementById('barrio-eliminar').value;
    if (/\d/.test(barrioEliminar)) {
        alert("Error: El nombre del barrio no puede contener números.");
        return;
    }
    // Verificar si se puede eliminar un barrio
    if (barriosEliminados >= 2) {
        alert("Error: Solo se permiten eliminar 2 barrios.");
        return;
    }   
    if (graph[barrioEliminar]) {
        delete graph[barrioEliminar];
        for (const barrio in graph) {
            delete graph[barrio][barrioEliminar];
        }
        barriosEliminados++; // Incrementar el contador de barrios eliminados
        document.getElementById('barrio-eliminar').value = '';
        mostrarBarrios();
    }
    
};
mostrarBarrios();

document.getElementById('calcular-distancias').onclick = function() {
    const barrioDistancia = document.getElementById('barrio-distancia').value;

    // Validar si el input está vacío
    if (!barrioDistancia) {
        alert("Error: Debes ingresar un nombre de barrio.");
        return;
    }

    // Validar si el nombre del barrio contiene números
    if (/\d/.test(barrioDistancia)) {
        alert("Error: El nombre del barrio no puede contener números.");
        return;
    }

    // Verificar si el barrio existe en el grafo
    if (!graph[barrioDistancia]) {
        alert("Error: El barrio no existe en el grafo.");
        return;
    }

    // Si todas las validaciones pasan, calcular las distancias
    const distances = dijkstra(graph, barrioDistancia);
    mostrarResultados(distances);
};

function mostrarBarrios() {
    const barriosList = document.getElementById('barrios-list');
    barriosList.innerHTML = '';
    let isBlue = true; // Variable para alternar colores

    for (const barrio in graph) {
        const barrioElement = document.createElement('tr'); // Crear una fila para la tabla
        const barrioNombre = document.createElement('td'); // Crear una celda para el nombre del barrio
        barrioNombre.textContent = barrio;

        // Alternar la clase CSS para el color de fondo
        if (isBlue) {
            barrioElement.classList.add('barrio-fila');
        } else {
            barrioElement.classList.add('barrio-fila-alt');
        }
        isBlue = !isBlue; // Cambiar el valor para el siguiente barrio

        barrioElement.appendChild(barrioNombre); // Añadir la celda a la fila
        barriosList.appendChild(barrioElement); // Añadir la fila a la tabla
    }
}

function mostrarResultados(distances) {
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = ''; // Limpiar el contenido anterior

    // Crear una tabla
    const tabla = document.createElement('table');
    tabla.classList.add('center'); // Añadir clase para centrar la tabla

    // Crear el encabezado de la tabla
    const encabezado = document.createElement('tr');
    const encabezadoBarrio = document.createElement('th');
    encabezadoBarrio.textContent = 'Barrio';
    const encabezadoDistancia = document.createElement('th');
    encabezadoDistancia.textContent = 'Distancia';

    encabezado.appendChild(encabezadoBarrio);
    encabezado.appendChild(encabezadoDistancia);
    tabla.appendChild(encabezado); // Añadir encabezado a la tabla

    // Agregar los resultados a la tabla
    for (const barrio in distances) {
        const resultadoElement = document.createElement('tr'); // Crear una fila para cada resultado
        const barrioNombre = document.createElement('td'); // Celda para el nombre del barrio
        barrioNombre.textContent = barrio;

        const distanciaValor = document.createElement('td'); // Celda para la distancia
        distanciaValor.textContent = distances[barrio];

        resultadoElement.appendChild(barrioNombre); // Añadir nombre del barrio a la fila
        resultadoElement.appendChild(distanciaValor); // Añadir distancia a la fila
        tabla.appendChild(resultadoElement); // Añadir fila a la tabla
    }

    resultados.appendChild(tabla); // Añadir la tabla al contenedor de resultados
}


function dijkstra(graph, start) {
    const distances = {};
    const queue = [start];

    // Inicializar las distancias
    for (const node in graph) {
        distances[node] = Infinity;
    }
    distances[start] = 0;

    while (queue.length > 0) {
        const node = queue.shift();
        for (const neighbor in graph[node]) {
            const distance = distances[node] + graph[node][neighbor];
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                queue.push(neighbor);
            }
        }
    }
    
    return distances;
}
