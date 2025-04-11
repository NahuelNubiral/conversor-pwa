// Obtener referencias a los elementos del DOM
const dolarBlueInput = document.getElementById("dolarBlue");
const precioCLPInput = document.getElementById("precioCLP");
const dolarPorPesoChilenoInput = document.getElementById("dolarPorPesoChileno");
const resultadoSpan = document.getElementById("resultado");
const toggleThemeBtn = document.getElementById("toggle-theme");
const productoForm = document.getElementById("productoForm");
const nombreProductoInput = document.getElementById("nombreProducto");
const precioProductoInput = document.getElementById("precioProducto");
const listaProductos = document.getElementById("listaProductos");

let productos = JSON.parse(localStorage.getItem("productos")) || [];

function renderizarProductos() {
  listaProductos.innerHTML = "";

  productos.forEach((producto, index) => {
    const dolares = producto.clp * (parseFloat(dolarPorPesoChilenoInput.value) || 0);
    const ars = dolares * (parseFloat(dolarBlueInput.value) || 0);

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${producto.nombre}</strong><br/>
      CLP: ${producto.clp.toFixed(0)} |
      USD: ${dolares.toFixed(2)} |
      ARS: ${ars.toFixed(2)}
    `;
    listaProductos.appendChild(li);
  });
}

productoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = nombreProductoInput.value.trim();
  const clp = parseFloat(precioProductoInput.value);

  if (!nombre || isNaN(clp)) return;

  productos.push({ nombre, clp });
  localStorage.setItem("productos", JSON.stringify(productos));

  nombreProductoInput.value = "";
  precioProductoInput.value = "";

  renderizarProductos();
});

// Renderizar al inicio y recalcular si cambian las tasas
renderizarProductos();

[dolarBlueInput, dolarPorPesoChilenoInput].forEach(input => {
  input.addEventListener("input", renderizarProductos);
});

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
