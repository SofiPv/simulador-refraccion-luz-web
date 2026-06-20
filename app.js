const canvas = document.getElementById("refractionCanvas");
const ctx = canvas.getContext("2d");

const mediumOneSelect = document.getElementById("mediumOneSelect");
const mediumTwoSelect = document.getElementById("mediumTwoSelect");
const nOneInput = document.getElementById("nOneInput");
const nTwoInput = document.getElementById("nTwoInput");
const angleSlider = document.getElementById("angleSlider");
const angleValue = document.getElementById("angleValue");

const simulateBtn = document.getElementById("simulateBtn");
const swapBtn = document.getElementById("swapBtn");
const downloadBtn = document.getElementById("downloadBtn");
const copyTableBtn = document.getElementById("copyTableBtn");

const resultList = document.getElementById("resultList");
const experimentalTable = document.getElementById("experimentalTable");

const mediums = [
  { id: "air", name: "Aire", n: 1.0003 },
  { id: "water", name: "Agua", n: 1.33 },
  { id: "glass", name: "Vidrio", n: 1.50 },
  { id: "diamond", name: "Diamante", n: 2.42 },
  { id: "custom", name: "Personalizado", n: null }
];

const experimentalData = [
  { ray: "Normal", alpha: 0, gamma: 0 },
  { ray: "Rojo", alpha: 6, gamma: 8 },
  { ray: "Celeste", alpha: 20, gamma: 28 },
  { ray: "Violeta", alpha: 24, gamma: 32 },
  { ray: "Verde", alpha: 47, gamma: 78 }
];

let simulation = null;
let tableText = "";

function init() {
  populateMediums();

  mediumOneSelect.value = "water";
  mediumTwoSelect.value = "air";
  nOneInput.value = "1.33";
  nTwoInput.value = "1.0003";

  mediumOneSelect.addEventListener("change", () => applyMedium(mediumOneSelect, nOneInput));
  mediumTwoSelect.addEventListener("change", () => applyMedium(mediumTwoSelect, nTwoInput));
  angleSlider.addEventListener("input", () => {
    angleValue.textContent = `${angleSlider.value}°`;
    simulate();
  });

  simulateBtn.addEventListener("click", simulate);
  swapBtn.addEventListener("click", swapMedia);
  downloadBtn.addEventListener("click", downloadSummary);
  copyTableBtn.addEventListener("click", copyTable);

  renderExperimentalTable();
  simulate();

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function populateMediums() {
  mediums.forEach(medium => {
    const optionOne = document.createElement("option");
    optionOne.value = medium.id;
    optionOne.textContent = medium.name;

    const optionTwo = optionOne.cloneNode(true);

    mediumOneSelect.appendChild(optionOne);
    mediumTwoSelect.appendChild(optionTwo);
  });
}

function applyMedium(select, input) {
  const selected = mediums.find(medium => medium.id === select.value);

  if (selected && selected.n !== null) {
    input.value = selected.n;
  }

  simulate();
}

function readParams() {
  const n1 = Math.max(0.0001, Number(nOneInput.value));
  const n2 = Math.max(0.0001, Number(nTwoInput.value));
  const theta1 = Number(angleSlider.value);

  nOneInput.value = n1;
  nTwoInput.value = n2;

  return {
    n1,
    n2,
    theta1,
    mediumOneName: getMediumName(mediumOneSelect.value),
    mediumTwoName: getMediumName(mediumTwoSelect.value)
  };
}

function getMediumName(id) {
  const medium = mediums.find(item => item.id === id);

  return medium ? medium.name : "Medio";
}

function simulate() {
  const p = readParams();
  const theta1Rad = degreesToRadians(p.theta1);
  const sinTheta2 = (p.n1 / p.n2) * Math.sin(theta1Rad);
  const totalInternalReflection = Math.abs(sinTheta2) > 1;
  let theta2 = null;
  let criticalAngle = null;

  if (!totalInternalReflection) {
    theta2 = radiansToDegrees(Math.asin(sinTheta2));
  }

  if (p.n1 > p.n2) {
    criticalAngle = radiansToDegrees(Math.asin(p.n2 / p.n1));
  }

  simulation = {
    ...p,
    theta2,
    sinTheta2,
    totalInternalReflection,
    criticalAngle
  };

  renderResults();
  drawSimulation();
}

function renderResults() {
  resultList.innerHTML = "";

  const items = [];

  items.push(`Medio 1: ${simulation.mediumOneName} (n₁ = ${format(simulation.n1)})`);
  items.push(`Medio 2: ${simulation.mediumTwoName} (n₂ = ${format(simulation.n2)})`);
  items.push(`Ángulo de incidencia θ₁: ${format(simulation.theta1)}°`);

  if (simulation.totalInternalReflection) {
    items.push("Resultado: reflexión total interna. No hay rayo refractado real.");

    if (simulation.criticalAngle !== null) {
      items.push(`Ángulo crítico: ${format(simulation.criticalAngle)}°`);
    }
  } else {
    items.push(`Ángulo de refracción θ₂: ${format(simulation.theta2)}°`);

    if (simulation.theta2 > simulation.theta1) {
      items.push("Interpretación: el rayo se aleja de la normal.");
    } else if (simulation.theta2 < simulation.theta1) {
      items.push("Interpretación: el rayo se acerca a la normal.");
    } else {
      items.push("Interpretación: el rayo no cambia de dirección respecto a la normal.");
    }
  }

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    resultList.appendChild(li);
  });
}

function drawSimulation() {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const boundaryY = height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  drawMedia(width, height, boundaryY);
  drawBoundary(width, boundaryY);
  drawNormal(centerX, height);
  drawRays(centerX, boundaryY);
  drawAngles(centerX, boundaryY);
  drawLabels(width, height, centerX, boundaryY);
}

function drawMedia(width, height, boundaryY) {
  ctx.save();

  ctx.fillStyle = "rgba(224, 242, 254, 0.65)";
  ctx.fillRect(0, 0, width, boundaryY);

  ctx.fillStyle = "rgba(209, 250, 229, 0.65)";
  ctx.fillRect(0, boundaryY, width, height - boundaryY);

  ctx.restore();
}

function drawBoundary(width, boundaryY) {
  ctx.save();

  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, boundaryY);
  ctx.lineTo(width - 40, boundaryY);
  ctx.stroke();

  ctx.restore();
}

function drawNormal(centerX, height) {
  ctx.save();

  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(centerX, 40);
  ctx.lineTo(centerX, height - 40);
  ctx.stroke();

  ctx.restore();
}

function drawRays(centerX, boundaryY) {
  const length = 245;
  const theta1 = degreesToRadians(simulation.theta1);

  const incidentStart = {
    x: centerX - Math.sin(theta1) * length,
    y: boundaryY - Math.cos(theta1) * length
  };

  drawArrowLine(incidentStart.x, incidentStart.y, centerX, boundaryY, "#f97316", 5);

  if (simulation.totalInternalReflection) {
    const reflectedEnd = {
      x: centerX + Math.sin(theta1) * length,
      y: boundaryY - Math.cos(theta1) * length
    };

    drawArrowLine(centerX, boundaryY, reflectedEnd.x, reflectedEnd.y, "#dc2626", 5);
    return;
  }

  const theta2 = degreesToRadians(simulation.theta2);
  const refractedEnd = {
    x: centerX + Math.sin(theta2) * length,
    y: boundaryY + Math.cos(theta2) * length
  };

  drawArrowLine(centerX, boundaryY, refractedEnd.x, refractedEnd.y, "#2563eb", 5);
}

function drawArrowLine(x1, y1, x2, y2, color, lineWidth) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowSize = 14;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - arrowSize * Math.cos(angle - Math.PI / 6),
    y2 - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x2 - arrowSize * Math.cos(angle + Math.PI / 6),
    y2 - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawAngles(centerX, boundaryY) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.font = "14px Segoe UI";

  const radius = 70;
  const theta1 = degreesToRadians(simulation.theta1);

  ctx.strokeStyle = "#f97316";
  ctx.beginPath();
  ctx.arc(centerX, boundaryY, radius, -Math.PI / 2, -Math.PI / 2 - theta1, true);
  ctx.stroke();

  ctx.fillStyle = "#9a3412";
  ctx.fillText(`θ₁ = ${format(simulation.theta1)}°`, centerX - 130, boundaryY - 78);

  if (simulation.totalInternalReflection) {
    ctx.strokeStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(centerX, boundaryY, radius + 22, -Math.PI / 2, -Math.PI / 2 + theta1, false);
    ctx.stroke();

    ctx.fillStyle = "#991b1b";
    ctx.fillText("Reflexión total interna", centerX + 24, boundaryY - 78);
  } else {
    const theta2 = degreesToRadians(simulation.theta2);

    ctx.strokeStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(centerX, boundaryY, radius, Math.PI / 2, Math.PI / 2 - theta2, true);
    ctx.stroke();

    ctx.fillStyle = "#1e40af";
    ctx.fillText(`θ₂ = ${format(simulation.theta2)}°`, centerX + 28, boundaryY + 95);
  }

  ctx.restore();
}

function drawLabels(width, height, centerX, boundaryY) {
  ctx.save();

  ctx.fillStyle = "#102338";
  ctx.font = "bold 20px Segoe UI";
  ctx.fillText("Simulación de refracción", 24, 34);

  ctx.font = "15px Segoe UI";
  ctx.fillStyle = "#075985";
  ctx.fillText(`${simulation.mediumOneName} · n₁ = ${format(simulation.n1)}`, 28, 70);

  ctx.fillStyle = "#047857";
  ctx.fillText(`${simulation.mediumTwoName} · n₂ = ${format(simulation.n2)}`, 28, height - 34);

  ctx.fillStyle = "#64748b";
  ctx.fillText("Normal", centerX + 12, 58);
  ctx.fillText("Superficie de separación", width - 230, boundaryY - 12);

  ctx.fillStyle = "#f97316";
  ctx.fillText("Rayo incidente", 70, boundaryY - 125);

  if (simulation.totalInternalReflection) {
    ctx.fillStyle = "#dc2626";
    ctx.fillText("Rayo reflejado", width - 245, boundaryY - 125);
  } else {
    ctx.fillStyle = "#2563eb";
    ctx.fillText("Rayo refractado", width - 245, boundaryY + 145);
  }

  ctx.restore();
}

function renderExperimentalTable() {
  experimentalTable.innerHTML = "";
  const expected = 1.0003 / 1.33;
  const rows = ["Rayo\tα\tγ\tsen α\tsen γ\tsen α/sen γ\tComparación"];

  experimentalData.forEach(item => {
    const sinAlpha = Math.sin(degreesToRadians(item.alpha));
    const sinGamma = Math.sin(degreesToRadians(item.gamma));
    const ratio = item.alpha === 0 && item.gamma === 0 ? null : sinAlpha / sinGamma;
    const diff = ratio === null ? null : Math.abs(ratio - expected);
    const status = ratio === null ? "Referencia" : diff <= 0.04 ? "Cercano a n₂/n₁" : "Revisar medición";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.ray}</td>
      <td>${item.alpha}°</td>
      <td>${item.gamma}°</td>
      <td>${ratio === null ? "—" : format(sinAlpha)}</td>
      <td>${ratio === null ? "—" : format(sinGamma)}</td>
      <td>${ratio === null ? "—" : format(ratio)}</td>
      <td><span class="${diff !== null && diff <= 0.04 ? "status-good" : "status-warn"}">${status}</span></td>
    `;

    experimentalTable.appendChild(tr);
    rows.push(`${item.ray}\t${item.alpha}°\t${item.gamma}°\t${ratio === null ? "—" : format(sinAlpha)}\t${ratio === null ? "—" : format(sinGamma)}\t${ratio === null ? "—" : format(ratio)}\t${status}`);
  });

  tableText = rows.join("\n");
}

function swapMedia() {
  const mediumOne = mediumOneSelect.value;
  const mediumTwo = mediumTwoSelect.value;
  const nOne = nOneInput.value;
  const nTwo = nTwoInput.value;

  mediumOneSelect.value = mediumTwo;
  mediumTwoSelect.value = mediumOne;
  nOneInput.value = nTwo;
  nTwoInput.value = nOne;

  simulate();
}

function downloadSummary() {
  const resultItems = Array.from(resultList.querySelectorAll("li")).map(li => `- ${li.textContent}`).join("\n");

  const text = [
    "SIMULADOR DE REFRACCIÓN DE LA LUZ",
    "==================================",
    "",
    "Parámetros y resultado:",
    resultItems,
    "",
    "Tabla experimental:",
    tableText
  ].join("\n");

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "resumen_refraccion_luz.txt";
  link.click();

  URL.revokeObjectURL(url);
}

async function copyTable() {
  await navigator.clipboard.writeText(tableText);
  copyTableBtn.textContent = "Copiado";
  setTimeout(() => copyTableBtn.textContent = "Copiar tabla", 1200);
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}

function format(value) {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value * 10000) / 10000;

  if (Object.is(rounded, -0)) return "0";

  return String(rounded);
}

init();
