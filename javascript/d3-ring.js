let isRendered = false;

const CREST_ARC_PRIMARY =
  "M 215.89,56.24 C 126.27,16.78 34.35,44.73 33.66,122.24 C 32.47,254.64 238.34,335.32 349.08,232.88";
const CREST_ARC_SECONDARY =
  "M 53.48,88.74 C 24.85,194.6 188.51,278.93 273.97,228.24";
const CREST_OUTLINE =
  "M349.082,232.883C238.34,335.317,32.471,254.635,33.656,122.244" +
  "c0.693-77.516,92.615-105.469,182.234-66.003" +
  "c-93.611-34.067-153.29-0.713-153.29,52.746" +
  "c0,70.809,99.048,138.641,175.37,116.037" +
  "l-57.64-38.326h7.254l86.388,41.546" +
  "C188.508,278.925,24.852,194.6,53.475,88.735" +
  "C14.3,203.958,198.087,313.593,312.612,232.038" +
  "l-119.462-45.34h5.533L349.082,232.883z";

const CREST_BASE_W = 400;
const CREST_BASE_H = 370;

const LEAF_OUTLINE = "m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z";

function initVisualization() {
  if (!isRendered) {
    isRendered = true;
    buildChart("chart-container");
  }
}

function buildChart(targetId) {
  const wrapper = document.getElementById(targetId);
  const w = wrapper.clientWidth;
  const h = wrapper.clientHeight;

  const totalSites = webringData.sites.length;
  const dotSize = 8;
  const dotColor = "#4a4a54";
  const hoverColor = "#0077c2";
  const lineColor = "#2a2a30";
  const crestColor = "#1e1e22";

  const svgEl = d3
    .select(`#${targetId}`)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${w} ${h}`)
    .style("background-color", "#111114")
    .style("cursor", "move");

  const canvas = svgEl.append("g");

  const zoomBehavior = d3
    .zoom()
    .scaleExtent([0.02, 4])
    .on("zoom", (ev) => {
      canvas.attr("transform", ev.transform);
    });

  svgEl.call(zoomBehavior);

  webringData.sites.forEach((entry, idx) => {
    entry.id = `node-${idx}`;
  });

  const scaleX = w / CREST_BASE_W;
  const scaleY = h / CREST_BASE_H;
  const crestScale = Math.min(scaleX, scaleY) * 1;
  const crestOffsetX = (w - CREST_BASE_W * crestScale) / 2 -40;
  const crestOffsetY = (h - CREST_BASE_H * crestScale) / 2 +80;

  const outlineScale = Math.min(w, h) / 2500;
  const tracePath = svgEl.append("path")
    .attr("d", LEAF_OUTLINE)
    .attr("fill", "none")
    .attr("stroke", "none")
    .attr("transform", `translate(${w / 2},${h / 2}) scale(${outlineScale})`);

  const traceEl = tracePath.node();
  const traceLength = traceEl.getTotalLength();

  webringData.sites.forEach((entry, i) => {
    const along = (traceLength * i) / totalSites;
    const point = traceEl.getPointAtLength(along);
    entry.x = w / 2 + point.x * outlineScale;
    entry.y = h / 2 + point.y * outlineScale;
  });

  tracePath.remove();

  canvas.append("path")
    .attr("d", CREST_OUTLINE)
    .attr("fill", crestColor)
    .attr("stroke", "none")
    .attr("transform", `translate(${crestOffsetX},${crestOffsetY}) scale(${crestScale})`);

  const titleGroup = canvas.append("g")
    .attr("transform", `translate(${crestOffsetX},${crestOffsetY}) scale(${crestScale})`);

  titleGroup.append("text")
    .attr("x", 100).attr("y", 110)
    .attr("fill", crestColor)
    .attr("font-family", "Georgia, 'Times New Roman', serif")
    .attr("font-size", "60px").attr("font-weight", "bold")
    .attr("letter-spacing", "6px").text("GEORGE");

  titleGroup.append("text")
    .attr("x", 130).attr("y", 165)
    .attr("fill", crestColor)
    .attr("font-family", "Georgia, 'Times New Roman', serif")
    .attr("font-size", "56px").attr("font-weight", "bold")
    .attr("letter-spacing", "5px").text("BROWN");

  titleGroup.append("text")
    .attr("x", 240).attr("y", 192)
    .attr("fill", crestColor)
    .attr("font-family", "Georgia, 'Times New Roman', serif")
    .attr("font-size", "28px").attr("font-weight", "bold")
    .attr("letter-spacing", "5px").text("POLYTECHNIC");

  const edges = webringData.sites.map((entry, idx) => ({
    source: entry.id,
    target: webringData.sites[(idx + 1) % totalSites].id,
  }));

  const edgeSelection = canvas
    .append("g")
    .selectAll("line")
    .data(edges)
    .enter()
    .append("line")
    .attr("stroke", lineColor)
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 1);

  const dotSelection = canvas
    .append("g")
    .selectAll("g")
    .data(webringData.sites)
    .enter()
    .append("g")
    .call(
      d3
        .drag()
        .on("start", onDragStart)
        .on("drag", onDrag)
        .on("end", onDragEnd)
    );

  dotSelection
    .append("circle")
    .attr("r", dotSize)
    .attr("fill", dotColor)
    .on("mouseover", onHover)
    .on("mouseout", onLeave)
    .on("click", onSelect);

  dotSelection
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", dotSize + 12)
    .text((d) => d.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))
    .attr("fill", "#6b6b75")
    .attr("font-family", "Inter, system-ui, sans-serif")
    .style("font-size", "9px")
    .style("pointer-events", "none");

  const forceSim = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id((d) => d.id).distance(40).strength(0.15)
    )
    .force("collision", d3.forceCollide().radius(dotSize * 1.2))
    .alphaDecay(0.05)
    .velocityDecay(0.6);

  forceSim.nodes(webringData.sites).on("tick", onTick);
  forceSim.force("link").links(edges);

  function onTick() {
    edgeSelection
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    dotSelection.attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  function centerView(animate) {
    let xMin = Infinity, yMin = Infinity;
    let xMax = -Infinity, yMax = -Infinity;
    dotSelection.each((d) => {
      xMin = Math.min(xMin, d.x);
      yMin = Math.min(yMin, d.y);
      xMax = Math.max(xMax, d.x);
      yMax = Math.max(yMax, d.y);
    });
    const margin = 60;
    xMin -= margin; yMin -= margin;
    xMax += margin; yMax += margin;
    const vw = wrapper.clientWidth;
    const vh = wrapper.clientHeight;
    const viewScale = Math.min(vw / (xMax - xMin), vh / (yMax - yMin)) * 0.8;
    const midX = (xMin + xMax) / 2;
    const midY = (yMin + yMax) / 2;
    const t = d3.zoomIdentity.translate(vw / 2, vh / 2).scale(viewScale).translate(-midX, -midY);
    if (animate) {
      svgEl.transition().duration(1500).call(zoomBehavior.transform, t);
    } else {
      svgEl.call(zoomBehavior.transform, t);
    }
  }

  centerView(false);

  forceSim.on("tick", () => {
    onTick();
    if (forceSim.alpha() < 0.1) {
      forceSim.alphaTarget(0);
      centerView(true);
      forceSim.on("tick", onTick);
    }
  });

  function onDragStart(ev, d) {
    if (!ev.active) forceSim.alphaTarget(0.3).restart();
    svgEl.style("cursor", "grabbing");
    d.fx = d.x;
    d.fy = d.y;
  }

  function onDrag(ev, d) {
    d.fx = ev.x;
    d.fy = ev.y;
  }

  function onDragEnd(ev, d) {
    if (!ev.active) forceSim.alphaTarget(0);
    svgEl.style("cursor", "grab");
    d.fx = null;
    d.fy = null;
  }

  function onHover() {
    d3.select(this).attr("fill", hoverColor);
    svgEl.style("cursor", "pointer");
  }

  function onLeave() {
    d3.select(this).attr("fill", dotColor);
    svgEl.style("cursor", "move");
  }

  function onSelect(ev, d) {
    window.open(d.website, "_blank");
  }

  window.addEventListener("resize", () => {
    const rw = wrapper.clientWidth;
    const rh = wrapper.clientHeight;
    svgEl.attr("viewBox", `0 0 ${rw} ${rh}`);
    forceSim.alpha(0.3).restart();
  });

  const hintLabel = svgEl.append("text")
    .attr("x", w / 2).attr("y", 24)
    .attr("text-anchor", "middle")
    .attr("fill", "#6b6b75")
    .attr("font-family", "Inter, system-ui, sans-serif")
    .attr("font-size", "13px")
    .text("Zoom in to find your fellow friends' sites");

  const counterBg = svgEl.append("rect")
    .attr("fill", "#1a1a1f").attr("opacity", 0.7)
    .attr("x", 5).attr("y", h - 30)
    .attr("rx", 5).attr("ry", 5);

  const counterLabel = svgEl.append("text")
    .attr("x", 10).attr("y", h - 13)
    .attr("fill", "#4a4a54")
    .attr("font-family", "Inter, system-ui, sans-serif")
    .attr("font-size", "12px");

  counterBg.raise();
  counterLabel.raise();
  counterLabel.text(`Students contributed: ${totalSites}`);
  const labelWidth = counterLabel.node().getComputedTextLength();
  counterBg.attr("width", labelWidth + 20).attr("height", 25);
}

window.addEventListener("resize", initVisualization);
