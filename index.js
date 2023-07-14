var elements = [];
document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
});
function loadEvents() {
  document.querySelector("form").addEventListener("submit", (evt) => {
    evt.preventDefault();
  });
  document.querySelector("#addValue").addEventListener("click", (evt) => {
    addElement(document.querySelector("#elementValue").value);
  });
  document.querySelector("#print-button").addEventListener("click", (evt) => {
    var tab = window.open("about:blank", "_blank");
    tab.document.write(
      '<style type="text/css" media="print">@page { size: landscape; }</style>' +
        document.querySelector("svg").outerHTML
    ); // where 'html' is a variable containing your HTML
    tab.window.print(); // to finish loading the page
  });
  document.querySelector("#clear-button").addEventListener("click", (evt) => {
    document.querySelector("#liste-elements").innerHTML = "";
    elements = [];
    redraw();
  });
  document.querySelector("#title").addEventListener("input", (evt) => {
    document.querySelector("#chart-name").innerHTML = evt.target.value;
  });
}
/**
 * add section in half circle
 * @param {string} value text value 
 */
function addElement(value) {
  console.log("add->" + value);
  elements.push(value);
  var ligne = document.createElement("tr");
  ligne.innerHTML = "<li>" + value + '<button type="button">X</button></li>';
  ligne.querySelector("button").addEventListener("click", (evt) => {
    for (var i = 0; i < elements.length; i++) {
      if (elements[i] === value) {
        elements.splice(i, 1);
      }
    }
    evt.target.parentElement.parentElement.remove();
    redraw();
    console.log(elements);
  });
  document.querySelector("#liste-elements").append(ligne);

  redraw();
}
/**
 * draw datas
 */
function redraw() {
  var group = document.querySelector("#chart-content");
  group.innerHTML = "";
  var pasAlpha = Math.PI / elements.length;
  var rotateText = elements.length > 6 ? true : false;
  var fontSize=40
  elements.map((element, i) => {
    var newg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var xcos = Math.cos(Math.PI / 4);
    var ysin = Math.sin(Math.PI / 4);

    if (i > 0) {
      xcos = Math.cos(pasAlpha * i);
      ysin = Math.sin(pasAlpha * i);
      newg.id = "content-" + i.toString();
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", 0);
      line.setAttribute("y1", 0);
      line.setAttribute("x2", xcos * 500);
      line.setAttribute("y2", -ysin * 500);
      line.setAttribute("stroke-width", 2);
      line.setAttribute("stroke", "black");
      newg.append(line);
    }
    xcos = Math.cos(pasAlpha * i + 0.5 * pasAlpha);
    ysin = Math.sin(pasAlpha * i + 0.5 * pasAlpha);
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("text-anchor", "middle");
    if(elements.length>10){text.setAttribute("font-size", (40-elements.length).toString());}
    else{text.setAttribute("font-size", "40");}
    text.innerHTML = element;
    if (rotateText) {
      text.setAttribute("x", 260);
      text.setAttribute("y", -2);
      text.setAttribute(
        "transform",
        "rotate(-" +
          ((pasAlpha * i + 0.25 * pasAlpha) * 180) / Math.PI +
          ",0, 0)"
      );
    } else {
      text.setAttribute("x", xcos * 330);
      text.setAttribute("y", -ysin * 330);
    }

    newg.append(text);

    group.append(newg);
  });
}
