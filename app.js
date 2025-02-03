document.getElementById("usa-gas").addEventListener("change", function () {
    const preguntaGas = document.getElementById("pregunta-gas");
    if (this.value === "si") {
        preguntaGas.style.display = "block";
    } else {
        preguntaGas.style.display = "none";
    }
});

function seleccionarTipo(tipo) {
    document.getElementById("selector-inicial").style.display = "none";
    if (tipo === "persona") {
        document.getElementById("form-persona").style.display = "block";
    } else {
        document.getElementById("form-empresa").style.display = "block";
    }
}

function calcularHuellaTotal() {

    // Factores de emisión
    const factoresEmision = {
        auto_gasolina: 5.0,
        auto_diesel: 5.5,
        auto_hibrido: 2.0,
        moto: 3.0,
        transporte_publico_autobus: 1.4,
        transporte_publico_metro: 1.2,
        bicicleta: 0,
        a_pie: 0
    };

    const factoresAlimenticios = {
        carne: {
            "diario": 1.37,
            "2-3_veces_semana": 0.49,
            "1_vez_semana": 0.2,
            "menos_1_vez_semana": 0.1
        },
        lacteos: {
            "diario": 0.22,
            "2-3_veces_semana": 0.08,
            "1_vez_semana": 0.03,
            "menos_1_vez_semana": 0.02
        },
        granos: {
            "diario": 0.082,
            "2-3_veces_semana": 0.029,
            "1_vez_semana": 0.012,
            "menos_1_vez_semana": 0.006
        }
    };

    const factoresCompras = {
        ropa: {
            "mensual": 20,
            "3-6_meses": 10,
            "1_vez_año": 5,
            "menos_1_vez_año": 2
        },
        electrodomesticos: {
            "6_meses": 15,
            "1_vez_año": 7,
            "2_años": 4,
            "menos_1_vez_año": 1
        }
    };
    
    const factoresResiduos = {
        reciclaje: {
            siempre: 80,
            a_menudo: 160,
            a_veces: 240,
            nunca: 320
        },
        reutilizables: {
            siempre: 70,
            a_menudo: 140,
            a_veces: 210,
            nunca: 280
        },
        metodo: {
            incineracion: 300,
            vertedero: 500,
            compostaje: 150
        }
    };

    const EF_PERRO = 500; // kgCO2e/año
    const EF_GATO = 300; // kgCO2e/año
    const EF_OTRO = 400; // kgCO2e/año

    // Factores de emisión por tipo de alimentación en kgCO2e/año
    const factAlimento = {
        "concentrado": 150,
        "humedos": 200,
        "dieta-casera": 100,
        "sin-mascota": 0
    };
    
    const factorNacional = 250; // Tiempo < 3 h
    const factorInternacional = 300; // Tiempo > 3 h
    const factorElectricidad = 0.475; // kgCO2/kWh
    const factorGas = 2; // kgCO2/m³

    // Transporte terrestre
    const transporte = document.getElementById("transporte").value;
    const horasTransporte = parseInt(document.getElementById("horas-transporte").value);
    // Emisiones terrestres
    const factorTransporte = factoresEmision[transporte];
    const emisionesTerrestres = (factorTransporte * horasTransporte * 52) / 1000; // Toneladas
    console.log("emisones terrestres" , emisionesTerrestres)

    // Transporte aéreo
    const horasVueloNacional = parseInt(document.getElementById("vuelos-nacionales").value);
    const horasVueloInternacional = parseInt(document.getElementById("vuelos-internacionales").value);
    // Validación de datos
    if (isNaN(horasVueloNacional) || horasVueloNacional < 0 || isNaN(horasVueloInternacional) || horasVueloInternacional < 0) {
        alert("Por favor, ingresa números válidos y positivos para las horas de vuelo.");
        return;
    }
    // Emisiones aéreas     
    const emisionesNacionales = (factorNacional * horasVueloNacional) / 1000; // Toneladas
    const emisionesInternacionales = (factorInternacional * horasVueloInternacional) / 1000; // Toneladas
    // Sumar emisiones aéreas nacionales e internacionales
    const emisionesVuelos = emisionesNacionales + emisionesInternacionales; // Total de emisiones en toneladas
    console.log("Emisiones vuelos", emisionesVuelos)

   // Energía en el hogar
   const personasCasa = parseInt(document.getElementById("personas-casa").value);
   const consumoElectricidad = parseFloat(document.getElementById("consumo-electricidad").value);
   const usaGas = document.getElementById("usa-gas").value;
   const consumoGas = usaGas === "si" ? parseFloat(document.getElementById("consumo-gas").value) : 0;
   // Validación de datos
    if (isNaN(personasCasa) || personasCasa <= 0 || isNaN(consumoElectricidad) || consumoElectricidad < 0 || (usaGas === "si" && isNaN(consumoGas) || consumoGas < 0)) {
       alert("Por favor, ingresa valores numéricos válidos y positivos para los campos de energía.");
       return;
    }  
    // Cálculo de emisiones por electricidad
    const emisionesElectricidad = ((consumoElectricidad / personasCasa) * factorElectricidad * 12) / 1000; // Emisiones en toneladas de CO2
    // Cálculo de emisiones por gas
    const emisionesGas = ((consumoGas / personasCasa) * factorGas * 12) / 1000; // Emisiones en toneladas de CO2
    // Sumar emisiones por electricidad y gas
    const emisionesEnergia = emisionesElectricidad + emisionesGas; // Total de emisiones en toneladas
    console.log("Emisiones energia" , emisionesEnergia)

    // Consumo alimenticio
    const frecuenciaCarne = document.getElementById("frecuencia-carne").value;
    const frecuenciaLacteos = document.getElementById("frecuencia-lacteos").value;
    const frecuenciaGranos = document.getElementById("frecuencia-granos").value;
    // Validación de datos
    if (!factoresAlimenticios.carne[frecuenciaCarne] || !factoresAlimenticios.lacteos[frecuenciaLacteos] || !factoresAlimenticios.granos[frecuenciaGranos]) {
        alert("Por favor, selecciona una frecuencia de consumo válida para cada categoría de alimento.");
        return;
    }
    // Cálculo de emisiones anuales por categoría
    const emisionesAnualesCarne = factoresAlimenticios.carne[frecuenciaCarne] ;
    const emisionesAnualesLacteos = factoresAlimenticios.lacteos[frecuenciaLacteos];
    const emisionesAnualesGranos = factoresAlimenticios.granos[frecuenciaGranos];
    // Cálculo de emisiones alimentarias totales
    const emisionesAlimenticas = (emisionesAnualesCarne + emisionesAnualesLacteos + emisionesAnualesGranos); // Toneladas
    console.log("Emisiones alimenticias", emisionesAlimenticas)
                                
    // Hábitos de compras
    const frecuenciaRopa = document.getElementById("frecuencia-ropa").value;
    const frecuenciaElectrodomesticos = document.getElementById("frecuencia-electrodomesticos").value;
    // Validación de datos
    if (!factoresCompras.ropa[frecuenciaRopa] || !factoresCompras.electrodomesticos[frecuenciaElectrodomesticos]) {
        alert("Por favor, selecciona una frecuencia de compra válida para cada categoría.");
        return;
    }
    const emisionesCompras = (factoresCompras.ropa[frecuenciaRopa] / 1000 +
                               factoresCompras.electrodomesticos[frecuenciaElectrodomesticos] / 1000) / 12;  // Total emisiones anuales en toneladas
    console.log("Emisiones compras", emisionesCompras)

   
    // Disposición de residuos
    const frecuenciaReciclaje = document.getElementById("frecuencia-reciclaje").value;
    const frecuenciaReutilizables = document.getElementById("frecuencia-reutilizables").value;
    const metodoResiduos = document.getElementById("metodo-residuos").value;
    // Validación de datos
    if (!factoresResiduos.reciclaje[frecuenciaReciclaje] || 
        !factoresResiduos.reutilizables[frecuenciaReutilizables] || 
        !factoresResiduos.metodo[metodoResiduos]) {
        alert("Por favor, selecciona una opción válida para cada categoría de residuos.");
        return;
    }
    // Cálculo de emisiones por hogar 
    const emisionesReciclaje = factoresResiduos.reciclaje[frecuenciaReciclaje]; // kgCO2e por hogar
    const emisionesReutilizables = factoresResiduos.reutilizables[frecuenciaReutilizables]; // kgCO2e por hogar
    const emisionesMetodo = factoresResiduos.metodo[metodoResiduos]; // kgCO2e por hogar
    const emisionesResiduos = (emisionesReciclaje + emisionesReutilizables + emisionesMetodo) / 1000; // Convertir a toneladas 
    console.log("Emisiones de residuos" , emisionesResiduos)       
    
     // Mascotas
    const cantidadPerros = parseInt(document.getElementById("perros").value) || 0;
    const cantidadGatos = parseInt(document.getElementById("gatos").value) || 0;
    const cantidadOtros = parseInt(document.getElementById("otros").value) || 0;    
    const tipoAlimento = document.getElementById("tipo-alimento").value;
    const factorAlimento = factAlimento[tipoAlimento] ?? 0;    
    // Cálculo de emisiones por mascotas
    const emisionesMascotas = ((EF_PERRO * cantidadPerros) + (EF_GATO * cantidadGatos) + (EF_OTRO * cantidadOtros)) / 1000;
    // Cálculo de emisiones por alimento
    const emisionesAlimento = factorAlimento / 1000;
    // Suma total de emisiones
    const totalEmisionesMascotas = emisionesMascotas + emisionesAlimento;
    console.log("Emisiones mascotas" , totalEmisionesMascotas)

    // Total de emisiones    
    const emisionesTotales = emisionesTerrestres + emisionesVuelos + emisionesEnergia + totalEmisionesMascotas + emisionesAlimenticas + emisionesCompras + emisionesResiduos;
    // Cálculos adicionales
    const arboles = (emisionesTotales / 0.15) ; // CAntidad de arboles
    const huellaEcológica = emisionesTotales * 1.8; // Huella ecológica    

    //Huella total de personas
    document.getElementById("resultado-total").innerText =
        `Tu huella personal de carbono estimada es de ${emisionesTotales.toFixed(2)} toneladas de CO2 al año.\n` +
        `Esto equivale a la cantidad de carbono que ${arboles.toFixed(0)} árboles absorben en un año.\n` +
        `Tu huella ecológica también equivale a un impacto que necesitaría ${huellaEcológica.toFixed(2)} planetas Tierra para ser sostenible si todas las personas vivieran como tú.`;

    // Hacer visible el contenido de la huella ecológica
    document.getElementById("contenido-huella").style.display = "block";

    // Emisiones por categorías
    const emisionesPorCategoria = {
        transporte: emisionesTerrestres,
        Vuelos: emisionesVuelos,
        energia: emisionesEnergia,
        alimentos: emisionesAlimenticas,
        compras: emisionesCompras,
        residuos: emisionesResiduos,
        mascotas: totalEmisionesMascotas,
    };
    // Crear los gráficos al finalizar el cálculo de emisiones
    const categorias = Object.keys(emisionesPorCategoria);
    const emisiones = Object.values(emisionesPorCategoria);
    // Colores del gráfico
    const colores = [
        'rgba(255, 99, 132, 0.5)',  // Rojo
        'rgba(54, 162, 235, 0.5)',  // Azul
        'rgba(255, 206, 86, 0.5)',  // Amarillo
        'rgba(75, 192, 192, 0.5)',  // Verde
        'rgba(153, 102, 255, 0.5)', // Morado
        'rgba(255, 159, 64, 0.5)',  // Naranja
        'rgba(0, 0, 0, 0.5)'        // Negro
    ];
    const bordes = [
        'rgba(255, 99, 132, 1)',  
        'rgba(54, 162, 235, 1)',  
        'rgba(255, 206, 86, 1)',  
        'rgba(75, 192, 192, 1)',  
        'rgba(153, 102, 255, 1)', 
        'rgba(255, 159, 64, 1)',  
        'rgba(0, 0, 0, 1)'        
    ];
    // Gráfico de barras 
    const ctxBar = document.getElementById('bar-chart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: categorias,
            datasets: [{
                label: 'Emisiones de Carbono por Categoría (toneladas de CO2)',
                data: emisiones,
                backgroundColor: colores,
                borderColor: bordes,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

//Huella para empresas
function calcularHuellaEmpresa() {
    let emisionesAlcance1 = 0; // Emisiones directas
    let emisionesVehiculosPropios = 0;
    let emisionesCalderas = 0;
    let emisionesRefrigerantes = 0;
    let emisionesAlcance2 = 0; // Emisiones indirectas de energía
    let emisionesEnergia = 0;
    let emisionesAlcance3 = 0; // Otras emisiones indirectas
    let emisionesResiduos = 0
    let totalEmisionesEmpresa = 0;
    let inputs = document.querySelectorAll("input[type='number']"); // Capturar todos los campos numéricos
    let datosIngresados = false;

    // Verificar si al menos un campo tiene un valor ingresado
    inputs.forEach(input => {
        if (input.value.trim() !== "") {
            datosIngresados = true;
        }
    });

    // Mostrar alerta si no se ingresaron datos y detener la función
    if (!datosIngresados) {
        alert("Por favor, ingrese al menos un dato para calcular la huella de carbono.");
        return;
    }

    // Factores de emisión
    const factoresEmision = {
        gasolina: 8.78,
        diesel: 10.21,
        glp: 5.68,
        gasNatural: 2.0,
        carbon: 2.50 // t CO2/ton carbón
    };

    const gwpRefrigerantes = {
        r22: 1.760,
        r134a: 1.430,
        r404a: 3.922,
        r410a: 2.088,
        r407c: 1.774,
        r507a: 3.985
    };

    // Captura de valores de entrada con validación
    function obtenerValor(id, unidad) {
        const input = document.getElementById(id);
        if (!input) return 0;
        const valor = parseFloat(input.value);
        return isNaN(valor) ? 0 : valor;
    }

    // Cálculo de emisiones de combustibles (Alcance 1)
    const vehiculosCombustibles = [
        { id: "gasolina-vehiculos", factor: factoresEmision.gasolina },
        { id: "diesel-vehiculos", factor: factoresEmision.diesel },
        { id: "glp-vehiculos", factor: factoresEmision.glp },
        { id: "gas-natural-vehiculos", factor: factoresEmision.gasNatural }
    ];
    // Cálculo de emisiones por cada tipo de combustible (calderas)
    const calderasCombustibles = [
        { id: "gasolina-calderas", factor: factoresEmision.gasolina },
        { id: "diesel-calderas", factor: factoresEmision.diesel },
        { id: "glp-calderas", factor: factoresEmision.glp },
        { id: "gas-natural-calderas", factor: factoresEmision.gasNatural },
        { id: "carbon-calderas", factor: factoresEmision.carbon }
    ];    
    // Cálculo para cada tipo de combustible vehiculos
    vehiculosCombustibles.forEach(({ id, factor }) => {
        const cantidad = obtenerValor(id, "cantidad-vehiculos"); //Valor de cada combustible
        // Emisiones: factor * cantidad de combustible * (12/12)
        emisionesVehiculosPropios += factor * cantidad * 12 / 1000; console.log("vei", emisionesVehiculosPropios)
    });
    // Cálculo para cada tipo de combustible calderas
    calderasCombustibles.forEach(({ id, factor }) => {
    const cantidad = obtenerValor(id, "galones"); // Cantidad de combustible
    // Emisiones: factor * cantidad de combustible * (12 / 1000)
    emisionesCalderas += factor * cantidad * (12 / 1000); console.log("cal", emisionesCalderas)
    });   
   // Cálculo de emisiones por cada tipo de refrigerante
    for (const refrigerante in gwpRefrigerantes) {
        const cantidad = obtenerValor(refrigerante, "kg"); // Cantidad de refrigerante cargado al año        
        emisionesRefrigerantes += gwpRefrigerantes[refrigerante] * cantidad; // Emisiones: GWP * cantidad de refrigerante
    } console.log("ref", emisionesRefrigerantes)

    emisionesAlcance1 = emisionesVehiculosPropios + emisionesCalderas + emisionesRefrigerantes
    console.log("Emsiones alcance 1", emisionesAlcance1)

    // Cálculo de emisiones Alcance 2 (Electricidad)    
    const factorNoRen = 0.4; // kg CO2/kWh
    // Obtener el consumo de electricidad y el porcentaje de energía renovable
    const consumoElectricidad = obtenerValor("kwh-electricidad", "kWh"); // kWh mensuales
    const porcentajeRenovable = obtenerValor("porcentaje-energiaren", "%"); // porcentaje de energía renovable
    // Cálculo de emisiones por energía no renovable
    const emisionesNoRenovables = ((consumoElectricidad * (1 - porcentajeRenovable / 100)) * factorNoRen) / 1000 * 12;
    // Cálculo de emisiones por energía renovable
    const emisionesRenovables = ((consumoElectricidad * (porcentajeRenovable / 100)) / 1000) * 12;
    // Sumar ambas emisiones
    emisionesEnergia = emisionesNoRenovables + emisionesRenovables;
    emisionesAlcance2 =  emisionesEnergia
    console.log("Emisiones por energía Alcance 2:", emisionesEnergia);

    // Cálculo de emisiones Alcance 3 (Transporte y Residuos)
    const factoresTransporte = {
        diesel: 0.8,
        gasolina: 0.95,
        "gas-natural": 0.7,
        tren: 0.45,
        barco: 0.3,
        "avion-carga": 1.25
    };

    // 1. Emisiones por viajes de negocio en avión
    const kmAvion = obtenerValor("km-aereos", "km"); // Km al año en avión
    const factorEmisionAvion = 0.18; // factor de emisión para viajes en avión
    const emisionesAvion = (kmAvion * factorEmisionAvion) / 1000; // Emisiones por avión en toneladas
    emisionesAlcance3 += emisionesAvion; 

    // 2. Emisiones por transporte de proveedores logísticos
    const kmTransporte = obtenerValor("km-año-proveedores-logísticos", "km"); // Km al año transportados por proveedores logísticos
    // Obtener el tipo de transporte seleccionado
    const tipoTransporte = document.getElementById("tipo-transporte").value;
    // Asignar el factor de emisión según el tipo de transporte
    let factorTransporteSeleccionado;
    if (factoresTransporte[tipoTransporte]) {
        factorTransporteSeleccionado = factoresTransporte[tipoTransporte];        
    } else {
        factorTransporteSeleccionado = 0; // Si no se encuentra un tipo válido, se asigna 0 como factor de emisión        
    }
    // Calcular las emisiones por transporte
    const emisionesTransporte = (kmTransporte * factorTransporteSeleccionado) / 1000; // Emisiones por transporte en toneladas
    emisionesAlcance3 += emisionesTransporte;     
    // 3. Emisiones por residuos
    const residuosDisposicion = [
        { metodo: "incineracion", porcentaje: obtenerValor("porcentaje-incineracion", "%"), factor: 1.0 },
        { metodo: "reciclaje", porcentaje: obtenerValor("porcentaje-reciclaje", "%"), factor: 0.0 },
        { metodo: "compostaje", porcentaje: obtenerValor("porcentaje-compostaje", "%"), factor: 0.05 },
        { metodo: "vertedero", porcentaje: obtenerValor("porcentaje-vertedero", "%"), factor: 0.4 }
    ];     
    // Cálculo de emisiones por residuos
    residuosDisposicion.forEach(({ porcentaje, factor }) => {
        emisionesResiduos += (porcentaje / 100) * factor; 
    });
    // Validar que la suma de los porcentajes sea 100%
    const sumaPorcentajes = residuosDisposicion.reduce((suma, { porcentaje }) => suma + porcentaje, 0);
    if (sumaPorcentajes !== 100) {
        alert("La suma de los porcentajes de disposición de residuos debe ser igual a 100%");
        return; // Detener la ejecución si la suma no es 100
    }
    //Cantidad total de residuos generados al año
    const residuosAnuales = obtenerValor("cantidad-residuos", "kg"); // Total de residuos generados al año (en kg)
    // Multiplicar el total de emisiones por residuos por la cantidad total de residuos generados al año
    const emisionesTotalesResiduos = residuosAnuales * emisionesResiduos;
    // Sumar al total de emisiones por Alcance 3
    emisionesAlcance3 += emisionesTotalesResiduos;
    console.log("Emisiones por Alcance 3 (Otras emisiones indirectas):", emisionesAlcance3);

    //Total de la huella
    totalEmisionesEmpresa = emisionesAlcance1 + emisionesAlcance2 + emisionesAlcance3;
    // Cálculos adicionales
    const arboles = (totalEmisionesEmpresa / 0.15) ; // Emisiones en toneladas * 1000 / kg CO2 por árbol/año
    const huellaEcológica = totalEmisionesEmpresa * 1.8; // Huella ecológica

    // Mostrar resultados
    document.getElementById("resultado-empresa").innerText = `Huella de carbono total: ${(totalEmisionesEmpresa).toFixed(2)} toneladas de CO2e al año. \n` +
    `Esto equivale a la cantidad de carbono que ${arboles.toFixed(0)} árboles absorben en un año.\n` +
    `Tu huella ecológica también equivale a un impacto que necesitaría ${huellaEcológica.toFixed(2)} planetas Tierra para ser sostenible si todas las personas vivieran como tú.`;

    // Hacer visible el contenido de la huella ecológica
    document.getElementById("info-huella").style.display = "block";

    // Crear gráfico
    const ctx = document.getElementById("myChart").getContext("2d");
    const grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Alcance 1 (Emisiones Directas)", "Alcance 2 (Emisones indirectas de energia)", "Alcance 3 (Otras emisones indirectas)"],
            datasets: [{
                label: "Toneladas de CO2e",
                data: [emisionesAlcance1, emisionesAlcance2, emisionesAlcance3],
                backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Toneladas de CO2e"
                    }
                }
            }
        }
    });
}

