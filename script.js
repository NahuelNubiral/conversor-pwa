// Obtener referencias a los elementos del DOM
const dolarBlueInput = document.getElementById("dolarBlue");
const precioCLPInput = document.getElementById("precioCLP");
const dolarPorPesoChilenoInput = document.getElementById("dolarPorPesoChileno");
const resultadoSpan = document.getElementById("resultado");
const toggleThemeBtn = document.getElementById("toggle-theme");

// Verificar que los elementos existen
if (!dolarBlueInput || !precioCLPInput || !dolarPorPesoChilenoInput || !resultadoSpan || !toggleThemeBtn) {
  console.error("Algunos elementos del DOM no se encontraron.");
} else {
  // Cargar valores desde localStorage
  function cargarValores() {
    [dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
      const saved = localStorage.getItem(input.id);
      if (saved !== null) input.value = saved;
    });
  }

  // Calcular el resultado
  function calcular() {
    const dolarBlue = parseFloat(dolarBlueInput.value) || 0;
    const precioCLP = parseFloat(precioCLPInput.value) || 0;
    const dolarPorPesoChileno = parseFloat(dolarPorPesoChilenoInput.value) || 0;

    const dolares = precioCLP * dolarPorPesoChileno;
    const pesosArg = dolares * dolarBlue;

    resultadoSpan.textContent = pesosArg.toFixed(2);
  }

  // Guardar valores en localStorage
  function guardarValores() {
    [dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
      localStorage.setItem(input.id, input.value);
    });
  }

  // Manejar eventos de entrada
  [dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
    input.addEventListener("input", () => {
      calcular();
      guardarValores();
    });
  });

  // Inicializar valores y cálculo
  cargarValores();
  calcular();

  // Cambiar tema oscuro/claro
  function setTheme(mode) {
    document.body.classList.toggle("dark", mode === "dark");
    localStorage.setItem("theme", mode);
    toggleThemeBtn.textContent = mode === "dark" ? "☀️" : "🌙";
  }

  toggleThemeBtn.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    setTheme(newTheme);
  });

  // Cargar preferencia de tema al inicio
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
}
