const cercos = ["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10"];
const galpones = ["G6","G5","G4","G7A","G7B","G8A"];

// ESTILO GLOBAL AUTOTABLE
const estiloTabla = {
  theme: "grid",
  styles: {
    fontSize: 9,
    textColor: [0, 0, 0],
    fillColor: [255, 255, 255],
    halign: "center",
    valign: "middle",
    lineColor: [0, 0, 0]
  },
  headStyles: {
    fillColor: [143, 0, 0],
    textColor: [255, 255, 255],
    fontStyle: "bold"
  }
};

// GENERAR TABLA HTML
function generarTabla() {
  const tbody = document.querySelector("#tablaCercos tbody");
  tbody.innerHTML = "";

  galpones.forEach(g => {
    let fila = `<tr><th>${g}</th>`;
    cercos.forEach(() => {
      fila += `<td><input type="number" value="0" class="muerte"></td>`;
    });
    fila += "</tr>";
    tbody.innerHTML += fila;
  });

  document.querySelectorAll(".muerte")
    .forEach(i => i.addEventListener("input", calcularTotal));
}

// TOTAL
function calcularTotal() {
  let total = 0;
  document.querySelectorAll(".muerte").forEach(i => {
    total += parseInt(i.value) || 0;
  });
  document.getElementById("totalMuertes").textContent = total;
}

// PDF
function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");

  // CABECERA
  doc.setFontSize(14);
  doc.setFont(undefined,"bold");
  doc.text("REPORTE DIARIO DE INVENTARIO AVÍCOLA",105,15,{align:"center"});

  doc.setFontSize(11);
  doc.setFont(undefined,"normal");

  const fecha = document.getElementById("fecha").value || "—";
  const tipo = document.getElementById("tipoGalpon").value || "—";
  const galpon = document.getElementById("galpon").value || "—";

  doc.text(`Fecha: ${fecha}`,14,25);
  doc.text(`Tipo de Galpón: ${tipo}`,14,31);
  doc.text(`Galpón: ${galpon}`,14,37);

  let y = 45;

  // =========================
  // MORTALIDAD POR CERCO
  // =========================
  doc.setFont(undefined,"bold");
  doc.text("MORTALIDAD POR CERCO",14,y);
  y += 4;

  const bodyMortalidad = [];
  document.querySelectorAll("#tablaCercos tbody tr").forEach(tr => {
    const fila = [];
    fila.push(tr.querySelector("th").innerText);
    tr.querySelectorAll("input").forEach(i => fila.push(i.value || "0"));
    bodyMortalidad.push(fila);
  });

  doc.autoTable({
    startY: y,
    head: [["Galpón", ...cercos]],
    body: bodyMortalidad,
    ...estiloTabla
  });

  y = doc.lastAutoTable.finalY + 6;
  doc.text(`TOTAL DE MUERTES: ${document.getElementById("totalMuertes").textContent}`,14,y);

  // =========================
  // CANTIDAD TOTAL DE AVES
  // =========================
  y += 10;
  doc.text("CANTIDAD TOTAL DE AVES",14,y);
  y += 4;

  doc.autoTable({
    startY: y,
    head: [["Galpón","Cantidad de Aves"]],
    body: [
      ["G6", document.getElementById("aves_g6").value || "0"],
      ["G5", document.getElementById("aves_g5").value || "0"],
      ["G4", document.getElementById("aves_g4").value || "0"],
      ["G7A", document.getElementById("aves_g7a").value || "0"],
      ["G7B", document.getElementById("aves_g7b").value || "0"],
      ["G8A", document.getElementById("aves_g8a").value || "0"]
    ],
    ...estiloTabla
  });

  // =========================
  // INVENTARIO INICIADOR
  // =========================
  y = doc.lastAutoTable.finalY + 10;
  doc.text("INVENTARIO DE ALIMENTO – INICIADOR",14,y);
  y += 4;

  doc.autoTable({
    startY: y,
    head: [["Entrada","Inicial","Consumo","Final"]],
    body: [[
      ini_entrada.value || "0",
      ini_inicial.value || "0",
      ini_consumo.value || "0",
      ini_final.value || "0"
    ]],
    ...estiloTabla
  });

  // =========================
// INVENTARIO GRANULADO
// =========================
y = doc.lastAutoTable.finalY + 10;
doc.text("INVENTARIO DE ALIMENTO – GRANULADOS HUBBAR (G6/G7A-9B)", 14, y);
y += 4;

doc.autoTable({
  startY: y,
  head: [["Entrada","Inicial","Consumo","Final"]],
  body: [[
    gra_entrada.value || "0",
    gra_inicial.value || "0",
    gra_consumo.value || "0",
    gra_final.value || "0"
  ]],
  ...estiloTabla
});

// =========================
// INVENTARIO GRANULADO 2
// =========================
y = doc.lastAutoTable.finalY + 10;
doc.text("INVENTARIO DE ALIMENTO – GRANULADOS ROSS (G5/G7B)", 14, y);
y += 4;

doc.autoTable({
  startY: y,
  head: [["Entrada","Inicial","Consumo","Final"]],
  body: [[
    gra2_entrada.value || "0",
    gra2_inicial.value || "0",
    gra2_consumo.value || "0",
    gra2_final.value || "0"
  ]],
  ...estiloTabla
});


  doc.save("Reporte_Diario_Inventario.pdf");
}

// INIT
document.addEventListener("DOMContentLoaded", generarTabla);

