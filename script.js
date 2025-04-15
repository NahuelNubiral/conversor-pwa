const dolarBlueInput = document.getElementById("dolarBlue");
const dolarChilenoInput = document.getElementById("dolarChileno");

const precioCLPInput = document.getElementById("precioCLP");
const precioUSDInput = document.getElementById("precioUSD");
const precioARSInput = document.getElementById("precioARS");

const toggleThemeBtn = document.getElementById("toggle-theme");
const productoForm = document.getElementById("productoForm");
const nombreProductoInput = document.getElementById("nombreProducto");
const precioProductoInput = document.getElementById("precioProducto");
const listaProductos = document.getElementById("listaProductos");

let productos = JSON.parse(localStorage.getItem("productos")) || [];
let indexEditando = null;

function formatCurrency(value) {
  return parseFloat(value.toFixed(2));
}

function parseValor(valor) {
  const limpio = valor.replace(",", ".");
  return parseFloat(limpio) || 0;
}

function calcularDesde(origen) {
  const dolarBlue = parseValor(dolarBlueInput.value);
  const tasaCLPporUSD = parseValor(dolarChilenoInput.value);

  let clp, usd, ars;

  if (origen === "CLP") {
    clp = parseValor(precioCLPInput.value);
    usd = clp / tasaCLPporUSD;
    ars = usd * dolarBlue;

    if (document.activeElement !== precioUSDInput)
      precioUSDInput.value = formatCurrency(usd);
    if (document.activeElement !== precioARSInput)
      precioARSInput.value = formatCurrency(ars);

  } else if (origen === "USD") {
    usd = parseValor(precioUSDInput.value);
    clp = usd * tasaCLPporUSD;
    ars = usd * dolarBlue;

    if (document.activeElement !== precioCLPInput)
      precioCLPInput.value = formatCurrency(clp);
    if (document.activeElement !== precioARSInput)
      precioARSInput.value = formatCurrency(ars);

  } else if (origen === "ARS") {
    ars = parseValor(precioARSInput.value);
    usd = ars / dolarBlue;
    clp = usd * tasaCLPporUSD;

    if (document.activeElement !== precioCLPInput)
      precioCLPInput.value = formatCurrency(clp);
    if (document.activeElement !== precioUSDInput)
      precioUSDInput.value = formatCurrency(usd);
  }
}

precioCLPInput.addEventListener("input", () => calcularDesde("CLP"));
precioUSDInput.addEventListener("input", () => calcularDesde("USD"));
precioARSInput.addEventListener("input", () => calcularDesde("ARS"));

function renderizarProductos() {
  listaProductos.innerHTML = "";

  const tasaUSD = parseValor(dolarChilenoInput.value);
  const tasaARS = parseValor(dolarBlueInput.value);

  productos.forEach((producto, index) => {
    const valorUSD = producto.clp / tasaUSD;
    const valorARS = valorUSD * tasaARS;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${producto.nombre}</strong><br/>
      CLP: ${formatCurrency(producto.clp)} |
      USD: ${formatCurrency(valorUSD)} |
      ARS: ${formatCurrency(valorARS)}<br/>
      <button onclick="editarProducto(${index})">✏️ Editar</button>
      <button onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
    `;
    listaProductos.appendChild(li);
  });
}

window.editarProducto = function(index) {
  const producto = productos[index];
  nombreProductoInput.value = producto.nombre;
  precioProductoInput.value = producto.clp;
  indexEditando = index;
};

window.eliminarProducto = function(index) {
  if (confirm("¿Eliminar este producto?")) {
    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    renderizarProductos();
  }
};

productoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = nombreProductoInput.value.trim();
  const clp = parseValor(precioProductoInput.value);

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

  renderizarProductos();
});

[dolarBlueInput, dolarChilenoInput].forEach((input) => {
  input.addEventListener("input", () => {
    renderizarProductos();
    calcularDesde("CLP");
    guardarValores();
  });
});

// Ensure inputs allow decimal points
[precioCLPInput, precioUSDInput, precioARSInput].forEach((input) => {
  input.setAttribute("inputmode", "decimal");
  input.setAttribute("pattern", "[0-9]*[.,]?[0-9]+");
});

function guardarValores() {
  [dolarBlueInput, dolarChilenoInput].forEach((input) => {
    localStorage.setItem(input.id, input.value);
  });
}

function cargarValores() {
  [dolarBlueInput, dolarChilenoInput].forEach((input) => {
    const saved = localStorage.getItem(input.id);
    if (saved !== null) input.value = saved;
  });

  if (!dolarChilenoInput.value) dolarChilenoInput.value = "970.87";
  if (!dolarBlueInput.value) dolarBlueInput.value = "1355";
}

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
renderizarProductos();

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


const productosToggle = document.getElementById("productosToggle");

// Guardar el estado (abierto o cerrado) cuando el usuario hace clic
productosToggle.addEventListener("toggle", () => {
  localStorage.setItem("productosAbierto", productosToggle.open ? "1" : "0");
});

// Al cargar la página, restaurar el estado guardado
const estadoGuardado = localStorage.getItem("productosAbierto");
if (estadoGuardado === "1") {
  productosToggle.setAttribute("open", "true");
} else {
  productosToggle.removeAttribute("open");
}
