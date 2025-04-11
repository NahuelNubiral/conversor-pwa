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
let indexEditando = null;

function formatCurrency(value) {
  return value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function actualizarBarraImpuestos() {
  const tasaUSD = parseFloat(dolarPorPesoChilenoInput.value) || 0; // Tasa de conversión CLP a USD
  const totalUSD = productos.reduce((sum, producto) => sum + producto.clp * tasaUSD, 0); // Total en USD

  // Actualizar la barra de progreso
  const barraProgreso = document.getElementById("barra-progreso");
  const porcentaje = Math.min((totalUSD / 300) * 100, 100); // Porcentaje de llenado (máximo 100%)
  barraProgreso.style.width = `${porcentaje}%`;

  // Cambiar el color dinámicamente según el porcentaje
  if (porcentaje < 50) {
    barraProgreso.style.backgroundColor = "green";
  } else if (porcentaje < 80) {
    barraProgreso.style.backgroundColor = "yellow";
  } else {
    barraProgreso.style.backgroundColor = "red";
  }

  // Mostrar el excedente e impuestos si el total supera los 300 USD
  const infoExcedente = document.getElementById("info-excedente");
  if (totalUSD > 300) {
    const excedenteUSD = totalUSD - 300;
    const impuestosUSD = excedenteUSD / 2;
    const tasaARS = parseFloat(dolarBlueInput.value) || 0; // Tasa de conversión USD a ARS
    const impuestosARS = impuestosUSD * tasaARS;

    infoExcedente.innerHTML = `
      <strong>Excedente:</strong> ${formatCurrency(excedenteUSD)} USD |
      <strong>Impuestos:</strong> ${formatCurrency(impuestosUSD)} USD (${formatCurrency(impuestosARS)} ARS)
    `;
  } else {
    infoExcedente.textContent = "Dentro del límite de 300 USD.";
  }
}

function renderizarProductos() {
  listaProductos.innerHTML = "";

  productos.forEach((producto, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${producto.nombre}</strong><br/>
      CLP: ${formatCurrency(producto.clp)} |
      USD: ${formatCurrency(producto.clp * parseFloat(dolarPorPesoChilenoInput.value) || 0)}<br/>
      <button onclick="editarProducto(${index})">✏️ Editar</button>
      <button onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
    `;
    listaProductos.appendChild(li);
  });

  actualizarBarraImpuestos(); // Actualizar la barra después de renderizar los productos
}

window.editarProducto = function (index) {
  const producto = productos[index];
  nombreProductoInput.value = producto.nombre;
  precioProductoInput.value = producto.clp;
  indexEditando = index;
};

window.eliminarProducto = function (index) {
  if (confirm("¿Eliminar este producto?")) {
    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    renderizarProductos();
  }
};

productoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = nombreProductoInput.value.trim();
  const clp = parseFloat(precioProductoInput.value);

  if (!nombre || isNaN(clp)) return;

  if (indexEditando !== null) {
    productos[indexEditando] = { nombre, clp };
    indexEditando = null;
  } else {
    productos.push({ nombre, clp });
  }

  localStorage.setItem("productos", JSON.stringify(productos));

  nombreProductoInput.value = "";
  precioProductoInput.value = "";

  renderizarProductos(); // Actualizar la lista y la barra
});

[dolarBlueInput, dolarPorPesoChilenoInput].forEach(input => {
  input.addEventListener("input", () => {
    renderizarProductos();
    actualizarBarraImpuestos();
  });
});

function cargarValores() {
  [dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
    const saved = localStorage.getItem(input.id);
    if (saved !== null) input.value = saved;
  });

  if (!dolarPorPesoChilenoInput.value) dolarPorPesoChilenoInput.value = "0.0010"; // Valor predeterminado
  if (!dolarBlueInput.value) dolarBlueInput.value = "1355"; // Valor predeterminado
}

function calcular() {
  const dolarBlue = parseFloat(dolarBlueInput.value) || 0;
  const precioCLP = parseFloat(precioCLPInput.value) || 0;
  const dolarPorPesoChileno = parseFloat(dolarPorPesoChilenoInput.value) || 0;

  const dolares = precioCLP * dolarPorPesoChileno;
  const pesosArg = dolares * dolarBlue;

  resultadoSpan.textContent = formatCurrency(pesosArg);
}

function guardarValores() {
  [dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
    localStorage.setItem(input.id, input.value);
  });
}

[dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
  input.addEventListener("input", () => {
    calcular();
    guardarValores();
  });
});

function setTheme(mode) {
  document.body.classList.toggle("dark", mode === "dark");
  localStorage.setItem("theme", mode);
  toggleThemeBtn.textContent = mode === "dark" ? "☀️" : "🌙";
}

toggleThemeBtn.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  setTheme(newTheme);
});

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);
cargarValores();
calcular();
renderizarProductos();
actualizarBarraImpuestos();

const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("open-sidebar");
const closeSidebarBtn = document.getElementById("close-sidebar");
const overlay = document.getElementById("overlay");

function openSidebar() {
  sidebar.classList.add("open");
  overlay.style.display = "block";
}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.style.display = "none";
}

openSidebarBtn.addEventListener("click", openSidebar);
closeSidebarBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

window.addEventListener("load", () => {
  overlay.style.display = "none";
});
