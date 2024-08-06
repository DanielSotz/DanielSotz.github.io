function reflex_agent(location, state) {
    if (state == "DIRTY") return "CLEAN";
    else if (location == "A") return "RIGHT";
    else if (location == "B") return "LEFT";
}

function test(states, visited_states) {
    var location = states[0];
    var state = states[0] == "A" ? states[1] : states[2];
    var action_result = reflex_agent(location, state);
    document.getElementById("log").innerHTML += "<br>Location: ".concat(location).concat(" | Action: ").concat(action_result);
    
    // Añadir el estado actual al conjunto de estados visitados
    visited_states.add(states.join(","));
    
    // Verificar si se han visitado los 8 estados
    if (visited_states.size == 8) {
        document.getElementById("log").innerHTML += "<br>Finalizado. Se pasó por los 8 estados";
        return;
    }

    if (action_result == "CLEAN") {
        if (location == "A") states[1] = "CLEAN";
        else if (location == "B") states[2] = "CLEAN";
    } else if (action_result == "RIGHT") states[0] = "B";
    else if (action_result == "LEFT") states[0] = "A";

    setTimeout(function() { test(states, visited_states); }, 2000);
}

var states = ["A", "DIRTY", "DIRTY"];
var visited_states = new Set();
test(states, visited_states);
