let dataFile;

        // Evento para cargar el archivo CSV
        document.getElementById("fileInput").addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file && file.type === "text/csv") {
                const reader = new FileReader();
                reader.onload = function(e) {
                    dataFile = e.target.result;
                    console.log("Archivo CSV cargado:", dataFile);
                };
                reader.readAsText(file);
            } else {
                alert("Por favor, selecciona un archivo CSV.");
            }
        });

        // Funciones de los botones
        document.getElementById("entrenamientoBtn").addEventListener("click", function() {
            console.log("Entrenamiento iniciado");
            // Agregar lógica para el entrenamiento aquí
        });

        document.getElementById("prediccionBtn").addEventListener("click", function() {
            console.log("Predicción iniciada");
            // Agregar lógica para predicción aquí
        });

        document.getElementById("tendenciasBtn").addEventListener("click", function() {
            console.log("Tendencias analizadas");
            // Agregar lógica para tendencias aquí
        });

        document.getElementById("patronesBtn").addEventListener("click", function() {
            console.log("Patrones encontrados");
            // Agregar lógica para patrones aquí
        });

        document.getElementById("graficasBtn").addEventListener("click", function() {
            console.log("Generando gráficas");
            // Agregar lógica para gráficas aquí
        });