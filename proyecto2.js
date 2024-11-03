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
                        borderColor: 'rgba(175, 192, 192, 1)',
                        backgroundColor: 'rgba(175, 192, 192, 0.2)',
                        tension: 0.5, // Suavizado de la línea
                        fill: false
                    },
                    {
                        label: 'Predicción de Regresión Lineal',
                        data: vals.xTrain.map((d, i) => ({
                            x: d,
                            y: selectedModel.result[i]
                        })),
                        borderColor: 'rgba(55, 99, 132, 1)',
                        backgroundColor: 'rgba(55, 99, 132, 0.2)',
                        tension: 0.5,
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
                        borderColor: 'rgba(155, 192, 192, 1)',
                        backgroundColor: 'rgba(155, 192, 192, 0.2)',
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
                        strokeColor: '#000001', // Color de fondo del borde del texto
                        background: '#000001', // Color de fondo del texto
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
