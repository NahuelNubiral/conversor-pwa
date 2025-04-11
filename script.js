const dolarBlueInput = document.getElementById("dolarBlue");
const precioCLPInput = document.getElementById("precioCLP");
const dolarPorPesoChilenoInput = document.getElementById("dolarPorPesoChileno");
const resultadoSpan = document.getElementById("resultado");

// Cargar valores si es posible
function cargarValores() {
  try {
    [dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
      const saved = localStorage.getItem(input.id);
      if (saved !== null) input.value = saved;
    });
  } catch (e) {
    console.warn("No se pudo acceder a localStorage");
  }
}

function calcular() {
  const dolarBlue = parseFloat(dolarBlueInput.value) || 0;
  const precioCLP = parseFloat(precioCLPInput.value) || 0;
  const dolarPorPesoChileno = parseFloat(dolarPorPesoChilenoInput.value) || 0;

  const dolares = precioCLP * dolarPorPesoChileno;
  const pesosArg = dolares * dolarBlue;

  resultadoSpan.textContent = pesosArg.toFixed(2);
}

function guardarValores() {
  try {
    [dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
      localStorage.setItem(input.id, input.value);
    });
  } catch (e) {
    console.warn("No se pudo guardar en localStorage");
  }
}

// Eventos
[dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
  input.addEventListener("input", () => {
    calcular();
    guardarValores();
  });
});

// Inicializar
cargarValores();
calcular();
