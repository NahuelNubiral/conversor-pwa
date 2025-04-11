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

function renderizarProductos() {
  listaProductos.innerHTML = "";

  productos.forEach((producto, index) => {
    const tasaUSD = parseFloat(dolarPorPesoChilenoInput.value) || 0;
    const tasaARS = parseFloat(dolarBlueInput.value) || 0;

    const dolares = producto.clp * tasaUSD;
    const ars = dolares * tasaARS;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${producto.nombre}</strong><br/>
      CLP: ${producto.clp.toFixed(0)} |
      USD: ${dolares.toFixed(2)} |
      ARS: ${ars.toFixed(2)}<br/>
      <button onclick="editarProducto(${index})">✏️ Editar</button>
      <button onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
    `;
    listaProductos.appendChild(li);
  });
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

  renderizarProductos();
});

[dolarBlueInput, dolarPorPesoChilenoInput].forEach(input => {
  input.addEventListener("input", renderizarProductos);
});

function cargarValores() {
  [dolarBlueInput, precioCLPInput, dolarPorPesoChilenoInput].forEach((input) => {
    const saved = localStorage.getItem(input.id);
    if (saved !== null) input.value = saved;
  });
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
