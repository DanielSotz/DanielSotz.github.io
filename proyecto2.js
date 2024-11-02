const operations = {
    "lr":{
        train: () => {
            const vals = getSelectedRegression();
            const linear = new LinearRegression()
            linear.fit(vals.xTrain, vals.yTrain)
            selectedModel.model = linear;
            const table = createTableFromObject(linear);
            document.getElementById("train").appendChild(table);
        },
        test: () => {
            const vals = getSelectedRegression();
            const y_pred = selectedModel.model.predict(vals.xTest)
            console.log(y_pred)
            const table = CreateArrayTable(y_pred); 
            selectedModel.result = y_pred
            document.getElementById("predict").appendChild(table);
        },
        graph: () => {
            console.log("graph");

            const vals = getSelectedRegression();
            console.log(vals, vals.xTrain);

            const data = {
                datasets: [
                    {
                        label: 'Datos de Entrenamiento',
                        data: vals.xTrain.map((d, i) => ({
                            x: d,
                            y: vals.yTrain[i]
                        })),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4, // Suavizado de la línea
                        fill: false
                    },
                    {
                        label: 'Predicción de Regresión Lineal',
                        data: vals.xTrain.map((d, i) => ({
                            x: d,
                            y: selectedModel.result[i]
                        })),
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            };

            const options = {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'X'
                        },
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Y'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            };

            const ctx = document.querySelector(".graphs").getContext("2d");
            new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });
        }
    },
    "pr": {
        train: () => {
            const vals = getSelectedRegression();
            const linear = new PolynomialRegression()
            linear.fit(vals.xTrain, vals.yTrain, Number(document.getElementById("degree").value))
            selectedModel.model = linear;
            const table = createTableFromObject(linear);
            console.log(document.getElementById("train"))
            document.getElementById("train").appendChild(table);
        },
        test: () => {
            const vals = getSelectedRegression();
            const y_pred = selectedModel.model.predict(vals.xTest)
            console.log(y_pred)
            const table = CreateArrayTable(y_pred); 
            selectedModel.result = y_pred
            document.getElementById("predict").appendChild(table);
        },
        graph: () => {
            console.log("graph");

            const vals = getSelectedRegression();
            console.log(vals, vals.xTrain);

            const data = {
                datasets: [
                    {
                        label: 'Datos de Entrenamiento',
                        data: vals.xTrain.map((d, i) => ({
                            x: d,
                            y: vals.yTrain[i]
                        })),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4, // Suavizado de la línea
                        fill: false
                    },
                    {
                        label: 'Predicción de Regresión Polinomial',
                        data: vals.xTrain.map((d, i) => ({
                            x: d,
                            y: selectedModel.result[i]
                        })),
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            };

            const options = {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'X'
                        },
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Y'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            };

            const ctx = document.querySelector(".graphs").getContext("2d");
            new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });
        }
    },
    "dt": {
        train: () => {
            let headers = Object.keys(data_array)
            const index = headers.indexOf(document.getElementById("predictFor").value)
            headers = moveElementToEnd(headers, index);
            const data_set = []
            data_set.push(headers)
            data_rows.forEach(row => {
                let newRow = []
                headers.forEach(col => {
                    newRow.push(row[col])
                })
                //newRow = moveElementToEnd(newRow, index) // ni idea...
                data_set.push(newRow)
            })
            console.log(data_set)
            const tree = new DecisionTreeID3(data_set)
            const root = tree.train(data_set)
            selectedModel.model = tree;
            selectedModel.result = root;
            const table = createTableFromObject(root);
            document.getElementById("train").appendChild(table);
            console.log(selectedModel.model.generateDotString(selectedModel.result))
        },
        test: () => {
            let headers = Object.keys(data_array)
            const index = headers.indexOf(document.getElementById("predictFor").value)
            headers = moveElementToEnd(headers, index);

            let data_set = []
            const data = getSelectedBayesTree()
            Object.keys(data).forEach(name => {
                data_set.push(data[name])
            })
            data_set = moveElementToEnd(data_set, index)
            const predict = selectedModel.model.predict([headers,data_set],selectedModel.result)
            document.getElementById('predict').innerHTML = `<pre>${headers[headers.length-1]} : ${predict.value}</pre>`
            //console.log(selectedModel.model.generateDotString(selectedModel.result))
        },
        graph: () => {
            const graphDOT = selectedModel.model.generateDotString(selectedModel.result)
            const convertedDOT = vis.parseDOTNetwork(graphDOT)
            const options = {
                layout: {
                    hierarchical: {
                        levelSeparation: 100,
                        nodeSpacing: 100,
                        parentCentralization: true,
                        direction: 'UD', // UD, DU, LR, RL
                        sortMethod: 'directed', // hubsize, directed
                        //shakeTowards: 'roots' // roots, leaves                        
                    },
                },
                edges: {
                    font: {
                        color: '#ffffff', // Color del texto
                        strokeWidth: 3, // Grosor del borde alrededor del texto
                        strokeColor: '#000000', // Color de fondo del borde del texto
                        background: '#000000', // Color de fondo del texto
                        align: 'horizontal' // Alineación del texto en la arista
                    }
                }
            }
            const container = document.getElementById("graphs")
            container.style.height = "500px"
            const visGraph = new vis.Network(container,convertedDOT,options)
            visGraph.fit({
                animation: false,
                maxZoomLevel: 0.8 
            });
        }
    },
    "nb": {
        train: () => {
            console.log(data_array)
            const bayes = new NaiveBayes();
            Object.keys(data_array).forEach(name => {
                bayes.insertCause(name, data_array[name])
            })
            selectedModel.model = bayes;
            const table = createTableFromObject(bayes);
            document.getElementById("train").appendChild(table);
        },
        test: () => {
            const causes = []
            const data = getSelectedBayesTree()
            Object.keys(data).forEach(name => {
                causes.push([name,data[name]])
            })
            const effect = document.getElementById("predictFor").value
            const predict = selectedModel.model.predict(effect,causes)
            selectedModel.result = predict;
            document.getElementById('predict').innerHTML = `<pre>${effect} : ${predict[0]} ${predict[1]} </pre>`
        },
        graph: () => {
            const effect = document.getElementById("predictFor").value;
            const element = document.getElementById("graphs");
            element.classList.add("fg-muted");
            const predict = selectedModel.result;
            const value = parseFloat(predict[1].replace("nothing :( ").replace('%', ''))
            const gaugeOptions = {
                hasNeedle: true,
                needleColor: 'gray',
                needleUpdateSpeed: 1000,
                arcColors: ['rgb(44, 151, 222)', 'lightgray'],
                arcDelimiters: [value == 0 ? 0.01 : value],
                arcLabels: [predict[1], ''],
                rangeLabel: ['0%', '100%'],
                centralLabel: `${predict[0]}`,
            }
            GaugeChart.gaugeChart(element, 500, gaugeOptions).updateNeedle(value)
        }
    },
    "nn": {
        train: () => {
            const input_cols = document.querySelectorAll(".neural-input");
            const output_cols = document.querySelectorAll(".neural-output");
            const hidden_neurons = document.querySelectorAll(".neural-hidden");
            const inputs = [];
            const outputs = [];
            const hidden = [];
            input_cols.forEach(col => {
                inputs.push(col.value);
            });
            output_cols.forEach(col => {
                outputs.push(col.value);
            });
            hidden_neurons.forEach(neuron => {
                hidden.push(neuron.value);
            });
            // chapuza
            const neuralNetwork = new NeuralNetwork([inputs.length,...hidden, 2]); 
            //console.log([inputs.length, ...hidden, outputs.length])

            for (let i = 0; i < data_rows.length; i++) {
                const row = data_rows[i];
                const input = [];
                const output = [];
                inputs.forEach(col => {
                    input.push(parseInt(row[col]));
                });
                outputs.forEach(col => {
                    output.push(...row[col] == 1 ? [1,0] : [0,1]);
                });
                neuralNetwork.Entrenar(input,output)
            }
            selectedModel.model = neuralNetwork;
            const table = createTableFromObject(neuralNetwork);
            document.getElementById("train").appendChild(table);

        },
        test: () => {
            const input_cols = document.querySelectorAll(".neural-predict");
            const inputs = [];
            input_cols.forEach(col => {
                inputs.push(parseInt(col.value));
            });
            const predict = selectedModel.model.Predecir(inputs)
            selectedModel.result = predict;
            console.log(predict)
            document.getElementById('predict').innerHTML = `<pre> ${inputs}: { probabilidad_1: ${predict[0]} probabilidad_0: ${predict[1]} } </pre>`

        },
        graph: () => {
            const data = {
                labels: ['Probabilidad 1', 'Probabilidad 0'],
                datasets: [{
                    label: 'Probabilidades',
                    data: selectedModel.result,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            };
            const options = {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            };
            const ctx = document.querySelector(".graphs").getContext("2d");
            new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: options
            });

        }
    },
    "km": {
        train: () => {
            const vals = getSelectedKmeans();
            const dimension = [];
            for (let i = 0; i < data_rows.length; i++) {
                const cell = [];
                vals.forEach(val => {
                    cell.push(parseInt(data_rows[i][val]));
                });
                dimension.push(cell.length == 1 ? cell[0] : cell);
            }
            console.log(dimension)
            const kmeans = vals.length == 1 ? new LinearKMeans() : new _2DKMeans();
            selectedModel.model = kmeans;
            selectedModel.data_dimension = dimension 
            const table = createTableFromObject(kmeans);
            document.getElementById("train").appendChild(table);
        },
        test: () => {
            const num_clusters = document.getElementById("numClusters").value;
            const iterations = document.getElementById("numIterations").value;
            const clusterized = selectedModel.model.clusterize(num_clusters,selectedModel.data_dimension, iterations);
            selectedModel.result = clusterized;
            console.log(clusterized);
            const arr_table = CreateArrayTable(clusterized);
            document.getElementById("predict").appendChild(arr_table);

        },
        graph: () => {
            let clusters = selectedModel.result
                .map(a => a[1])
                .filter((value, index, self) => self.indexOf(value) === index);
            clusters.forEach((cluster, i) => {
                clusters[i] = [cluster, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })]
            });
            const clusterized_data = selectedModel.result;

            const isOneDimensional = document.getElementById('numDimensions').value == 1;

            // Preparar datos para Chart.js
            const dataPoints = clusterized_data.map(e => ({
                x: isOneDimensional ? e[0] : e[0][0],
                y: isOneDimensional ? 0 : e[0][1],  // En 1D, la coordenada Y es 0
                backgroundColor: clusters.find(cluster => cluster[0] === e[1])[1],
                pointStyle: 'diamond',
                radius: 7
            }));

            const centroidPoints = clusters.map(cluster => ({
                x: isOneDimensional ? cluster[0] : cluster[0][0],
                y: isOneDimensional ? 0 : cluster[0][1],
                backgroundColor: '#ff0000',  // Color rojo para los centroides
                pointStyle: 'rect',  // Forma cuadrada para los centroides
                radius: 5
            }));

            const data = {
                datasets: [
                    {
                        label: 'Datos',
                        data: dataPoints,
                        showLine: false,
                    },
                    {
                        label: 'Centroides',
                        data: centroidPoints,
                        showLine: false,
                    }
                ]
            };
            const options = {
               responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'X',
                        },
                        min: 0,
                    },
                    y: {
                        title: {
                            display: true,
                            text: isOneDimensional ? '' : 'Y',
                        },
                        min: isOneDimensional ? -1 : undefined,
                        max: isOneDimensional ? 1 : undefined
                    }
                }
            }
            const ctx = document.querySelector(".graphs").getContext("2d");
            new Chart(ctx, {
                type: 'scatter',
                data: data,
                options: options
            });
        }
    },
    "kn": {
        train: () => {
            const vals = getSelectedKNeighbor();
            const kneighbor = new KNearestNeighbor(vals.individuals)
            kneighbor.inicializar(5,vals.data,vals.labels);
            selectedModel.model = kneighbor;
            const table = createTableFromObject(kneighbor);
            document.getElementById("train").appendChild(table);
        },
        test: () => {
            const coordinates = document.querySelectorAll(".kneighbor-predict:not([disabled])");
            const point = [];
            coordinates.forEach(coordinate => {
                point.push(Number(coordinate.value));
            });
            console.log(point)
            const euclidean = selectedModel.model.euclidean(point);
            const manhattan = selectedModel.model.manhattan(point);
            const predict = selectedModel.model.predecir(point); // no tengo la menor idea de que significa esto

            const predictHTML = document.getElementById("predict");
            predictHTML.innerHTML = "";

            // Crear el elemento <pre> para mostrar distancias Euclidean y Manhattan
            const pre = document.createElement("pre");
            pre.textContent = `Para "${document.getElementById('pointName').value}":\nEuclidean: ${euclidean}\nManhattan: ${manhattan}\n\nPredicción:\n`;

            // Mostrar los resultados de votos
            for (const key in predict.votosCounts) {
                const resultText = document.createElement("div");
                resultText.textContent = `Resultado: ${key}, Count Near: ${predict.votosCounts[key]}`;
                pre.appendChild(resultText);
            }
            predictHTML.appendChild(pre);

            selectedModel.result = predict;

        },
        graph: () => {
            // esta cosa realmente no entrega suficiente información para hacer una gráfica.
            const predict = selectedModel.result;

            const graphHTML = document.getElementById("graphs");
            graphHTML.innerHTML = ""; // Limpiar contenido previo


            // Crear tabla de resultados
            const table = document.createElement("table");

            // Crear encabezado de la tabla
            const headerRow = document.createElement("tr");
            ["Index", "Distance", "Label"].forEach(headerText => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            // Crear filas de la tabla con los datos de predict.votos
            predict.votos.forEach(item => {
                const row = document.createElement("tr");

                // Crear celdas para cada propiedad
                ["index", "distance", "label"].forEach(prop => {
                    const cell = document.createElement("td");
                    cell.textContent = item[prop];
                    row.appendChild(cell);
                });

                table.appendChild(row);
            });

            // Agregar la tabla al contenedor
            graphHTML.appendChild(table);


        }
    }
}

let data_array = []; 
let data_rows = [];

let selectedModel = {
    model: null,
    train: () => {},
    test: () => {},
    graph: () => {},
    result: {}
};


document.getElementById("csv").addEventListener("change", async(e) => {
    const file = e.target.files[0];
    if (file){
        try{
            const {columns, rows} = await loadCSV(file);
            data_array = columns;
            data_rows = rows;
            const tableContainer = document.getElementById("dataset")
            tableContainer.innerHTML = ""
            tableContainer.appendChild(generateTable(rows));
            document.getElementById("model-selection").selectedIndex = 0;
            document.getElementById("selectors").innerHTML = "";
            document.getElementById("buttons").hidden = true;
            document.getElementById("btn-predict").disabled = true;
            document.getElementById("btn-graph").disabled = true;
            document.getElementById("tab-train").hidden = true;
            document.getElementById("tab-all").hidden = true;
            document.getElementById("tab-predict").hidden = true;
            document.getElementById("tab-graphs").hidden = true;
            document.getElementById("tabs").hidden = true;
            document.getElementById("graphs").classList.remove("fg-muted");
            document.getElementById("train").innerHTML = "";
            document.getElementById("predict").innerHTML = "";
            document.getElementById("graphs").innerHTML = "<canvas class='graphs' id='canvas-graph'></canvas>";
        }catch(err){
            console.error(err);
        }
    }
})

document.getElementById("model-selection").addEventListener("input", (e) => {

    const model = e.target.value;
    const selectorContainer = document.getElementById("selectors");

    if (!(model in operations)) {
        console.log("Model not found in operations.");
        return;
    }
    const ops = operations[model];
    selectedModel.train = ops.train;
    selectedModel.test = ops.test;
    selectedModel.graph = ops.graph;
    selectorContainer.innerHTML = "";

    const newForm = document.createElement("form");
    const selects = generateSelector(model,Object.keys(data_array));

    selects.forEach(select => {
        newForm.appendChild(select);
    });

    selectorContainer.appendChild(newForm);
    document.getElementById("buttons").hidden = false;

    document.getElementById("graphs").classList.remove("fg-muted");
    document.getElementById("train").innerHTML = "";
    document.getElementById("predict").innerHTML = "";
    document.getElementById("graphs").innerHTML = "<canvas class='graphs' id='canvas-graph'></canvas>";
});

function getSelectedRegression() {
    const selects = document.querySelectorAll(".option");
    const values = {};
    selects.forEach(select => {
        values[select.name] = data_array[select.value].map(Number);
    });
    console.log(values)
    return values;
}

function getSelectedBayesTree() {
    const selects = document.querySelectorAll(".option");
    const values = {};
    selects.forEach(select => {
        values[select.name] = select.value;
    });
    return values;
}

function getSelectedKmeans() {
    const selects = document.querySelectorAll(".kmeans-dimension:not([disabled])");
    const values = [];
    selects.forEach(select => {
        values.push(select.value);
    });
    return values;
}

function getSelectedKNeighbor(){
    const group = document.getElementById("group").value;
    const dimension = document.querySelectorAll(".kneighbor-dimension:not([disabled])");
    const arrays = []
    const data = []
    dimension.forEach(select => {
        const numericArray = data_array[select.value].map(Number);
        arrays.push(numericArray);
        data.push(numericArray);
    });
    const groups = data_array[group];
    arrays.push(groups);
    const individuals = zip(arrays)
    const values = {
        individuals: individuals,
        data: data,
        labels: groups
    }
    return values;
}

function createTableFromObject(obj){
    const table = document.createElement("table");
    const headers = Object.keys(obj);
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const tr = document.createElement("tr");
    headers.forEach(header => {
        const td = document.createElement("td");
        td.textContent = obj[header];
        tr.appendChild(td);
    });
    table.appendChild(tr);

    return table;
}

function CreateArrayTable(arr){
    const table = document.createElement("table");
    arr.forEach(cell => {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
        table.appendChild(tr);
    });
    return table;
}
       
document.getElementById("btn-train").addEventListener("click", () => {
    document.getElementById("train").innerHTML = "";
    selectedModel.train()
    document.getElementById("btn-predict").disabled = false;
    document.getElementById("btn-graph").disabled = true;
    document.getElementById("predict").innerHTML = "";
    document.getElementById("graphs").innerHTML = "<canvas class='graphs' id='canvas-graph'></canvas>";
    document.getElementById("tab-train").hidden = false;
    document.getElementById("tab-all").hidden = false;
    document.getElementById("tab-predict").hidden = true;
    document.getElementById("tab-graphs").hidden = true;
    document.getElementById("tabs").hidden = false;
    showTab("train");
});

document.getElementById("btn-predict").addEventListener("click", () => {
    document.getElementById("predict").innerHTML = "";
    selectedModel.test()
    document.getElementById("btn-graph").disabled = false;
    document.getElementById("graphs").innerHTML = "<canvas class='graphs' id='canvas-graph'></canvas>";
    document.getElementById("tab-predict").hidden = false;
    document.getElementById("tab-graphs").hidden = true;
    showTab("predict");
});

document.getElementById("btn-graph").addEventListener("click", () => {
    document.getElementById("graphs").innerHTML = "<canvas class='graphs' id='canvas-graph'></canvas>";
    selectedModel.graph()
    document.getElementById("tab-graphs").hidden = false;
    showTab("graphs");
});

/* CSV Functions */

async function loadCSV(file) {
    const reader = new FileReader();
    const content = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error("Error al leer el archivo."));
        reader.readAsText(file);
    });
    return processCSV(content);
}

function processCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(header => header.trim());

    const columns = {};
    headers.forEach(header => {
        columns[header] = [];
    });
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(value => value.trim());
        values.forEach((value, index) => {
            columns[headers[index]].push(value);
        });
        const row = {};
        values.forEach((value, index) => {
            row[headers[index]] = value;
        });
        rows.push(row);
    }
    return { columns, rows };
}

function generateTable(data) {
    const table = document.createElement("table");
    const headers = Object.keys(data[0]);

    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = row[header];
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    return table;
}

function generateSelector(model,cols) {

    if (["lr","pr"].includes(model)) {
        return regressionSelector(model,cols)
    } else if (["dt","nb"].includes(model)) {
        return bayesTreeSelector(model,cols,data_array /*variable global*/)
    }else if (model === "nn"){
        return neuralNetworkFormGenerator(model,cols);
    }else if (model === "km"){
        return kmeansSelector(model,cols);
    }else if (model === "kn"){
        return kNearestSelector(model,cols);
    }
}

function regressionSelector(model,cols){
    let selects = [];
    const data = ["xTrain", "yTrain","xTest"];
    data.forEach(name => {
        let label = document.createElement("label");
        label.setAttribute("for", name);
        label.textContent = name;
        let select = document.createElement("select");
        select.setAttribute("name", name);
        select.setAttribute("id", name);
        select.setAttribute("class", "option");

        cols.forEach(col => {
            let option = document.createElement("option");
            option.value = col;
            option.text = col;
            option.selected = col === name;
            select.appendChild(option);
        });

        const container = document.createElement("div");
        container.appendChild(label);
        container.appendChild(select);

        selects.push(container);
    });
    if (model === "pr"){
        let label = document.createElement("label");
        label.setAttribute("for", "degree");
        label.textContent = "Grado del Polinomio";
        let select = document.createElement("input");
        select.setAttribute("type", "number");
        select.setAttribute("id", "degree");
        select.setAttribute("name", "degree");
        select.setAttribute("min", "1");
        select.setAttribute("value", "1");
        const container = document.createElement("div");
        container.appendChild(label);
        container.appendChild(select);
        selects.push(container);
    }
    return selects;
}

function bayesTreeSelector(model,cols,arrays){
    let selects = [];
    const data = cols;

    const wLabel = document.createElement("label")
    wLabel.setAttribute("for", "wSelect");
    wLabel.textContent = "Predecir para";
    const wSelect = document.createElement("select")
    wSelect.setAttribute("name", "predictFor");
    wSelect.setAttribute("id", "predictFor");
    //wSelect.setAttribute("class", "option");
    data.forEach(name => {
        let option = document.createElement("option");
        option.value = name;
        option.text = name;
        wSelect.appendChild(option);
    });
    const wContainer = document.createElement("div");
    wContainer.appendChild(wLabel);
    wContainer.appendChild(wSelect);
    selects.push(wContainer);

    data.forEach(name => {
        const filteredArray = [... new Set(arrays[name])];

        const label = document.createElement("label");
        label.setAttribute("for", name);
        label.textContent = name;
        const select = document.createElement("select");
        select.setAttribute("name", name);
        select.setAttribute("id", name);
        select.setAttribute("class", "option");

        filteredArray.forEach(col => {
            let option = document.createElement("option");
            option.value = col;
            option.text = col;
            select.appendChild(option);
        });

        const container = document.createElement("div");
        container.appendChild(label);
        container.appendChild(select);
        selects.push(container);
    });
    return selects;
}

function neuralNetworkFormGenerator(model,cols) {
    let formElements = [];

    // Bloque para seleccionar el número de Inputs y Outputs
    const configContainer = document.createElement("div");
    configContainer.setAttribute("class", "config-container");

    const inputNumLabel = document.createElement("label");
    inputNumLabel.setAttribute("for", "numInputs");
    inputNumLabel.textContent = "Número de Inputs:";
    const inputNumField = document.createElement("input");
    inputNumField.setAttribute("type", "number");
    inputNumField.setAttribute("id", "numInputs");
    inputNumField.setAttribute("name", "numInputs");
    inputNumField.setAttribute("min", "1");
    inputNumField.setAttribute("value",  cols.length-1);
    inputNumField.onchange = () => generateInputSelectors();
    
    const outputNumLabel = document.createElement("label");
    outputNumLabel.setAttribute("for", "numOutputs");
    outputNumLabel.textContent = "Número de Outputs:";
    const outputNumField = document.createElement("input");
    outputNumField.setAttribute("type", "number");
    outputNumField.setAttribute("id", "numOutputs");
    outputNumField.setAttribute("name", "numOutputs");
    outputNumField.setAttribute("min", "1");
    outputNumField.setAttribute("max", "1");
    outputNumField.setAttribute("title", "Bloqueado a 1; dejo el output porque ya lo había dejado implementado para multiples ;(");
    outputNumField.setAttribute("value","1");
    outputNumField.onchange = () => generateOutputSelectors();

    const hiddenLayersLabel = document.createElement("label");
    hiddenLayersLabel.setAttribute("for", "numHiddenLayers");
    hiddenLayersLabel.textContent = "Número de Capas Ocultas:";
    const hiddenLayersField = document.createElement("input");
    hiddenLayersField.setAttribute("type", "number");
    hiddenLayersField.setAttribute("id", "numHiddenLayers");
    hiddenLayersField.setAttribute("name", "numHiddenLayers");
    hiddenLayersField.setAttribute("min", "1");
    hiddenLayersField.setAttribute("value", "1");
    hiddenLayersField.onchange = () => generateHiddenLayerConfig();

    configContainer.appendChild(inputNumLabel);
    configContainer.appendChild(inputNumField);
    configContainer.appendChild(outputNumLabel);
    configContainer.appendChild(outputNumField);
    configContainer.appendChild(hiddenLayersLabel);
    configContainer.appendChild(hiddenLayersField);
    configContainer.style.display = "block";
    formElements.push(configContainer);

    // Bloque para seleccionar los Inputs
    const inputSelectorsContainer = document.createElement("div");
    inputSelectorsContainer.setAttribute("id", "inputSelectorsContainer");
    inputSelectorsContainer.setAttribute("class", "selector-container");
    formElements.push(inputSelectorsContainer);

    // Bloque para seleccionar los Outputs
    const outputSelectorsContainer = document.createElement("div");
    outputSelectorsContainer.setAttribute("id", "outputSelectorsContainer");
    outputSelectorsContainer.setAttribute("class", "selector-container");
    formElements.push(outputSelectorsContainer);

    // Contenedor para configuración de capas ocultas específicas
    const hiddenLayerConfigContainer = document.createElement("div");
    hiddenLayerConfigContainer.setAttribute("id", "hiddenLayerConfigContainer");
    formElements.push(hiddenLayerConfigContainer);

    userInputsContainer = document.createElement("div");
    userInputsContainer.setAttribute("id", "userInputsContainer");
    userInputsContainer.setAttribute("class", "selector-container");
    formElements.push(userInputsContainer);

    // Función para generar campos de selección de inputs
    function generateInputSelectors() {
        inputSelectorsContainer.innerHTML = '';
        userInputsContainer.innerHTML = '';
        const numInputs = inputNumField.value;

        for (let i = 1; i <= numInputs; i++) {
            const label = document.createElement("label");
            label.textContent = `Input ${i}:`;
            const select = document.createElement("select");
            select.setAttribute("name", `input-${i}`);
            select.setAttribute("id", `input-${i}`);
            select.setAttribute("class", `neural-input`);
            let cnt = 0;
            cols.forEach(col => {
                let option = document.createElement("option");
                option.value = col;
                option.text = col;
                option.selected = cnt === (i-1);
                cnt++;
                select.appendChild(option);
            });
            const container = document.createElement("div");
            container.appendChild(label);
            container.appendChild(select);
            inputSelectorsContainer.appendChild(container);

            const labelU = document.createElement("label");
            labelU.textContent = `Valor ${i}:`;
            const input = document.createElement("input");
            input.setAttribute("name", `predict-${i}`);
            input.setAttribute("id", `predict-${i}`);
            input.setAttribute("class", `neural-predict`);
            const containerU = document.createElement("div");
            containerU.appendChild(labelU);
            containerU.appendChild(input);
            userInputsContainer.appendChild(containerU);
        }
    }

    // Función para generar campos de selección de outputs
    function generateOutputSelectors(){
        outputSelectorsContainer.innerHTML = '';
        const numOutputs = outputNumField.value;

        for (let i = 1; i <= numOutputs; i++) {
            const label = document.createElement("label");
            label.textContent = `Output ${i}:`;
            const select = document.createElement("select");
            select.setAttribute("name", `output-${i}`);
            select.setAttribute("id", `output-${i}`);
            select.setAttribute("class", `neural-output`);
            cols.forEach(col => {
                let option = document.createElement("option");
                option.value = col;
                option.text = col;
                select.appendChild(option);
            });
            select.selectedIndex = cols.length-i;
            const container = document.createElement("div");
            container.appendChild(label);
            container.appendChild(select);
            outputSelectorsContainer.appendChild(container);

        }
    }

    // Función para generar configuración de capas ocultas y neuronas
    function generateHiddenLayerConfig(){
        hiddenLayerConfigContainer.innerHTML = '';
        const numLayers = hiddenLayersField.value;

        for (let i = 1; i <= numLayers; i++) {
            const label = document.createElement("label");
            label.textContent = `Capas Ocultas ${i} - Neuronas:`;
            const neuronsField = document.createElement("input");
            neuronsField.setAttribute("type", "number");
            neuronsField.setAttribute("name", `hiddenLayer-${i}`);
            neuronsField.setAttribute("min", "1");
            neuronsField.setAttribute("value", "1");
            neuronsField.setAttribute("class", `neural-hidden`);
            const container = document.createElement("div");
            container.appendChild(label);
            container.appendChild(neuronsField);
            hiddenLayerConfigContainer.appendChild(container);
        }
    }
    inputNumField.onchange();
    outputNumField.onchange();
    hiddenLayersField.onchange();

    return formElements;
}

function kmeansSelector(model,cols){

    let formElements = [];

    const configContainer = document.createElement("div");

    const inputNumLabel = document.createElement("label");
    inputNumLabel.setAttribute("for", "numDimensions");
    inputNumLabel.textContent = "Dimensiones:";
    const inputNumField = document.createElement("input");
    inputNumField.setAttribute("type", "number");
    inputNumField.setAttribute("min", "1");
    inputNumField.setAttribute("max", "2");
    inputNumField.setAttribute("value","1");
    inputNumField.setAttribute("id", "numDimensions");
               
    inputNumField.onchange = () => generateInputSelectors();

    configContainer.appendChild(inputNumLabel);
    configContainer.appendChild(inputNumField);
    formElements.push(configContainer);

    //const inputSelectorsContainer = document.createElement("div");
    //formElements.push(inputSelectorsContainer);

    for (let i = 1; i <= 2; i++) {
        const label = document.createElement("label");
        label.textContent = ` Dimension ${i}:`;
        const select = document.createElement("select");
        select.setAttribute("name", `dimension-${i}`);
        select.setAttribute("id", `dimension-${i}`);
        select.setAttribute("class", `kmeans-dimension`);
        select.disabled = i == 2;
        let cnt = 0;
        cols.forEach(col => {
            let option = document.createElement("option");
            option.value = col;
            option.text = col;
            option.selected = cnt === (i-1);
            cnt++;
            select.appendChild(option);
        });
        const container = document.createElement("div");
        container.appendChild(label);
        container.appendChild(select);
        //inputSelectorsContainer.appendChild(container);
        formElements.push(container);
    }

    function generateInputSelectors() {
        const numInputs = inputNumField.value;
        if (numInputs == 2){
            document.getElementById("dimension-2").disabled = false;
        }else{
            document.getElementById("dimension-2").disabled = true;
        }

    }

    const clusterNumContainer = document.createElement("div");
    const clusterNumLabel = document.createElement("label");
    clusterNumLabel.setAttribute("for", "numClusters");
    clusterNumLabel.textContent = "Número de Clusters";
    clusterNumField = document.createElement("input");
    clusterNumField.setAttribute("type", "number");
    clusterNumField.setAttribute("min", "1");
    clusterNumField.setAttribute("value", "3");
    clusterNumField.setAttribute("id","numClusters");
    clusterNumContainer.appendChild(clusterNumLabel);
    clusterNumContainer.appendChild(clusterNumField);
    formElements.push(clusterNumContainer);

    const iterationsContainer = document.createElement("div");
    const iterationsLabel = document.createElement("label");
    iterationsLabel.setAttribute("for", "numIterations");
    iterationsLabel.textContent = "Número de Iteraciones";
    const iterationsField = document.createElement("input");
    iterationsField.setAttribute("type", "number");
    iterationsField.setAttribute("min", "1");
    iterationsField.setAttribute("value", "3");
    iterationsField.setAttribute("id", "numIterations");
    iterationsContainer.appendChild(iterationsLabel);
    iterationsContainer.appendChild(iterationsField);
    formElements.push(iterationsContainer);

    return formElements;
}

function kNearestSelector(model,cols){
    let formElements = [];

    const configContainer = document.createElement("div");

    const inputNumLabel = document.createElement("label");
    inputNumLabel.setAttribute("for", "numDimensions");
    inputNumLabel.textContent = "Dimensiones:";
    const inputNumField = document.createElement("input");
    inputNumField.setAttribute("type", "number");
    inputNumField.setAttribute("min", "2");
    inputNumField.setAttribute("max", "3");
    inputNumField.setAttribute("value","2");
    inputNumField.setAttribute("id", "numDimensions");
    inputNumField.onchange = () => generateInputSelectors();
    configContainer.appendChild(inputNumLabel);
    configContainer.appendChild(inputNumField);
    formElements.push(configContainer);

    const colsContainer = document.createElement("div");
    const groupLabel = document.createElement("label");
    groupLabel.setAttribute("for", "group");
    groupLabel.textContent = "Grupos";
    groupSelect = document.createElement("select");
    groupSelect.setAttribute("name", "group");
    groupSelect.setAttribute("id", "group");
    cols.forEach(col => {
        let option = document.createElement("option");
        option.value = col;
        option.text = col;
        if (col === "group"){
            option.selected = true;
        }
                       
        groupSelect.appendChild(option);
    });
    colsContainer.appendChild(groupLabel);
    colsContainer.appendChild(groupSelect);
    formElements.push(colsContainer);

    const pointInput = document.createElement("div");
    const pointNameLabel = document.createElement("label");
    pointNameLabel.setAttribute("for", "pointName");
    pointNameLabel.textContent = "Nombre del punto:";
    const pointNameField = document.createElement("input");
    pointNameField.setAttribute("type", "text");
    pointNameField.setAttribute("name", "pointName");
    pointNameField.setAttribute("id", "pointName");
    const pointNameContainer = document.createElement("div");
    pointNameContainer.appendChild(pointNameLabel);
    pointNameContainer.appendChild(pointNameField);
    pointInput.appendChild(pointNameContainer);

    const dimensionContainer = document.createElement("div");

    for (let i = 1; i <= 3; i++) {
        const label = document.createElement("label");
        label.textContent = ` Dimension ${i}:`;
        label.setAttribute("for", `dimension-${i}`);
        const select = document.createElement("select");
        select.setAttribute("name", `dimension-${i}`);
        select.setAttribute("id", `dimension-${i}`);
        select.setAttribute("class", `kneighbor-dimension`);
        select.disabled = i == 3;
        cols.forEach(col => {
            let option = document.createElement("option");
            option.value = col;
            option.text = col;
            option.selected = ( i==1 && col == "x") || (i==2 && col == "y") || (i==3 && col == "z");
            select.appendChild(option);
        });
        const container = document.createElement("div");
        container.appendChild(label);
        container.appendChild(select);
        dimensionContainer.appendChild(container);
        const labelPoint = document.createElement("label");
        labelPoint.textContent = `Coordenada ${i}:`;
        labelPoint.setAttribute("for", `point-${i}`);
        const input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("name", `point-${i}`);
        input.setAttribute("id", `point-${i}`);
        input.setAttribute("class", "kneighbor-predict");
        input.disabled = i == 3;
        const pointContainer = document.createElement("div");
        pointContainer.appendChild(labelPoint);
        pointContainer.appendChild(input);
        pointInput.appendChild(pointContainer);
        
    }
    formElements.push(dimensionContainer);
    formElements.push(pointInput);

    function generateInputSelectors() {
        const numInputs = inputNumField.value;
        if (numInputs == 3){
            document.getElementById("dimension-3").disabled = false;
            document.getElementById("point-3").disabled = false;
        }else{
            document.getElementById("dimension-3").disabled = true;
            document.getElementById("point-3").disabled = true;
        }
    }
    return formElements;

}

function showTab(tabId) {
    const allDivs = document.querySelectorAll(".result");
    allDivs.forEach(div => {
        div.style.display = "none";
    });

    if (tabId === "all") {
        allDivs.forEach(div => {
            div.style.display = "block";
        });
    } else {
        document.getElementById(tabId).style.display = "block";
    }

    const allButtons = document.querySelectorAll(".tabs button");
    allButtons.forEach(button => {
        button.classList.remove("default");
        if (button.id === `tab-${tabId}`) {
            button.classList.add("default");
        }
    });
}

/* Helper */
function moveElementToEnd(array, pos) {
    const n = Number(pos);
    if (n >= 0 && n < array.length) {
        const element = array.splice(n, 1)[0];
        array.push(element);
    }
    return array;
}
