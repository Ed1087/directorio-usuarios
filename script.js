const books = [
  {id:1,title:"La vegetación del deseo",author:"Ana Blanco",category:"Ficción",price:62000,bg:"#b94a32",accent:"#d7ff45",tag:"NUEVO"},
  {id:2,title:"El arte de mirar",author:"Sofía Rojas",category:"Arte",price:78000,bg:"#334a52",accent:"#e7b3ff",tag:"CURADURÍA"},
  {id:3,title:"Pequeñas revoluciones",author:"Mario Salcedo",category:"Ensayo",price:54000,bg:"#5d6240",accent:"#ffcc58",tag:"IDEAS"},
  {id:4,title:"Atlas para perderse",author:"Lina Cárdenas",category:"Poesía",price:49000,bg:"#713b55",accent:"#9cf0e0",tag:"POESÍA"},
  {id:5,title:"La casa de los días",author:"Clara Vélez",category:"Ficción",price:59000,bg:"#80664a",accent:"#f4e4b5",tag:"FAVORITO"},
  {id:6,title:"Manual de curiosidades",author:"Tomás Gil",category:"Infantil",price:45000,bg:"#355b6b",accent:"#ff795f",tag:"8+ AÑOS"},
  {id:7,title:"El silencio también cuenta",author:"Mara León",category:"Poesía",price:52000,bg:"#483c5f",accent:"#c7ff71",tag:"POESÍA"},
  {id:8,title:"Ciudades imaginarias",author:"Nicolás Peña",category:"Arte",price:69000,bg:"#a2493b",accent:"#74d9ff",tag:"VISUAL"}
];

let cart = JSON.parse(localStorage.getItem("auroraCart") || "[]");
const money = n => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);

const grid = document.getElementById("bookGrid");
const count = document.getElementById("cartCount");
const drawer = document.getElementById("cartDrawer");
const modalBackdrop = document.getElementById("modalBackdrop");
const toast = document.getElementById("toast");

function renderBooks(category="Todos"){
  const visible = category==="Todos" ? books : books.filter(b=>b.category===category);
  grid.innerHTML = visible.map(b=>`
    <article class="book-card">
      <div class="book-visual" style="--book-bg:${b.bg};--book-accent:${b.accent}">
        <span class="mini-tag">${b.tag}</span>
        <div class="shape"></div>
        <h3>${b.title}</h3>
      </div>
      <div class="book-info">
        <div><h4>${b.title}</h4><p>${b.author} · ${b.category}</p></div>
        <span class="price">${money(b.price)}</span>
      </div>
      <button class="add-book" data-add="${b.id}">Añadir a la bolsa <span>+</span></button>
    </article>
  `).join("");
}

function saveCart(){localStorage.setItem("auroraCart",JSON.stringify(cart));}

function updateCart(){
  count.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
  const container=document.getElementById("cartItems");
  if(!cart.length){
    container.innerHTML=`<div style="padding:70px 0;text-align:center"><div style="font:70px Georgia,serif">∅</div><p>Tu bolsa está esperando una historia.</p></div>`;
  }else{
    container.innerHTML=cart.map(item=>`
      <div class="cart-item">
        <div class="cart-thumb" style="--book-bg:${item.bg}">${item.title.slice(0,1)}</div>
        <div><h4>${item.title}</h4><small>${item.qty} × ${money(item.price)}</small></div>
        <button class="remove" data-remove="${item.id}" aria-label="Eliminar ${item.title}">×</button>
      </div>
    `).join("");
  }
  const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  document.getElementById("cartTotal").textContent=money(total);
}

function addToCart(id){
  const book=books.find(b=>b.id===id);
  const existing=cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({...book,qty:1});
  saveCart();updateCart();showToast(`“${book.title}” encontró un lugar en tu bolsa.`);
}

function showToast(message){
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}

document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");
  if(add) addToCart(Number(add.dataset.add));
  const remove=e.target.closest("[data-remove]");
  if(remove){
    cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));
    saveCart();updateCart();
  }
  const pill=e.target.closest(".pill");
  if(pill){
    document.querySelectorAll(".pill").forEach(p=>p.classList.remove("active"));
    pill.classList.add("active");renderBooks(pill.dataset.category);
  }
});

document.getElementById("cartBtn").onclick=()=>drawer.classList.add("open");
document.getElementById("closeCart").onclick=()=>drawer.classList.remove("open");

const searchOverlay=document.getElementById("searchOverlay");
const searchInput=document.getElementById("searchInput");
document.getElementById("searchBtn").onclick=()=>{searchOverlay.classList.add("open");searchOverlay.setAttribute("aria-hidden","false");setTimeout(()=>searchInput.focus(),100)};
document.getElementById("closeSearch").onclick=()=>{searchOverlay.classList.remove("open");searchOverlay.setAttribute("aria-hidden","true")};
searchInput.addEventListener("input",()=>{
  const q=searchInput.value.toLowerCase().trim();
  const results=books.filter(b=>`${b.title} ${b.author} ${b.category}`.toLowerCase().includes(q)).slice(0,6);
  document.getElementById("searchResults").innerHTML=q ? (results.length ? results.map(b=>`
    <button class="search-result" data-search-add="${b.id}"><span>${b.title} · ${b.author}</span><strong>${money(b.price)}</strong></button>`).join("") : "<p>No encontramos esa historia. Prueba con otro título, autor o categoría.</p>") : "";
});
document.getElementById("searchResults").addEventListener("click",e=>{
  const b=e.target.closest("[data-search-add]");if(!b)return;
  addToCart(Number(b.dataset.searchAdd));document.getElementById("closeSearch").click();drawer.classList.add("open");
});

function openQuiz(){
  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden","false");
  document.getElementById("modalContent").innerHTML=`
    <p class="eyebrow">CLUB AURORA / 01</p>
    <h2>Vamos a encontrarte un libro.</h2>
    <p>Elige una palabra por cada pregunta. No hay respuestas incorrectas, solo caminos diferentes.</p>
    <div class="quiz-step"><strong>¿Cómo llegaste hoy?</strong>
      <div class="quiz-option" data-q="mood">
        <button>Curiosa</button><button>Cansada</button><button>Inspirada</button><button>Inquieta</button>
      </div>
    </div>
    <div class="quiz-step"><strong>¿Qué quieres sentir?</strong>
      <div class="quiz-option" data-q="feel">
        <button>Asombro</button><button>Calma</button><button>Preguntas</button><button>Risa</button>
      </div>
    </div>
    <button class="btn btn-dark" id="recommendBtn">Dame mi lectura <span>✦</span></button>
    <div id="recommendation" style="margin-top:25px"></div>
  `;
  document.querySelectorAll(".quiz-option button").forEach(btn=>btn.onclick=()=>btn.classList.toggle("selected"));
  document.getElementById("recommendBtn").onclick=()=>{
    const picks=[...document.querySelectorAll(".quiz-option button.selected")].map(b=>b.textContent);
    const pool=picks.includes("Curiosa")||picks.includes("Preguntas") ? books.filter(b=>["Ensayo","Arte"].includes(b.category)) : books;
    const b=pool[Math.floor(Math.random()*pool.length)];
    document.getElementById("recommendation").innerHTML=`
      <div style="border-top:1px solid var(--line);padding-top:20px">
        <small>PARA TI, HOY:</small><h3 style="font:400 34px Georgia,serif;margin:8px 0">${b.title}</h3>
        <p>${b.author} · ${b.category} · ${money(b.price)}</p>
        <button class="btn btn-dark" data-modal-add="${b.id}">Me lo llevo <span>→</span></button>
      </div>`;
    document.querySelector("[data-modal-add]").onclick=()=>{addToCart(b.id);closeModal();drawer.classList.add("open")};
  };
}
function closeModal(){modalBackdrop.classList.remove("open");modalBackdrop.setAttribute("aria-hidden","true")}
document.getElementById("quizBtn").onclick=openQuiz;
document.getElementById("surpriseBtn").onclick=()=>{
  const b=books[Math.floor(Math.random()*books.length)];
  showToast(`Tu sorpresa de hoy: ${b.title} · ${money(b.price)}`);
  document.getElementById("explorar").scrollIntoView({behavior:"smooth"});
  setTimeout(()=>{document.querySelector(`[data-add="${b.id}"]`)?.click()},700);
};
document.getElementById("closeModal").onclick=closeModal;
modalBackdrop.addEventListener("click",e=>{if(e.target===modalBackdrop)closeModal()});
document.getElementById("mapBtn").onclick=()=>showToast("Demo local: aquí puedes conectar tu mapa o dirección real.");
document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){showToast("Primero elige al menos un libro.");return}
  showToast("Demo local: aquí comienza el flujo de compra.");
};
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){drawer.classList.remove("open");closeModal();document.getElementById("closeSearch").click()}
});

renderBooks();
updateCart();


const formulario = document.getElementById("formularioRegistro");

formulario.addEventListener("submit", function(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const edad = Number(document.getElementById("edad").value);
  const mensaje = document.getElementById("mensajeFormulario");

  if (!nombre || !correo || !Number.isInteger(edad) ||
      edad < 1 || edad > 120) {
    mensaje.textContent = "Por favor, verifica los datos ingresados.";
    return;
  }

  // Imprimir los datos en la consola del navegador
  console.log("Nombre:", nombre);
  console.log("Correo:", correo);
  console.log("Edad:", edad);

  mensaje.textContent =
    "¡Gracias, " + nombre +
    "! El formulario se completó correctamente.";

  formulario.reset();
});


// ============================================================
// TALLER: CONSULTA DE USUARIOS Y PUBLICACIONES CON FETCH
// ============================================================

// Direcciones de la API JSONPlaceholder.
const URL_API_USUARIOS = "https://jsonplaceholder.typicode.com/users";
const URL_API_PUBLICACIONES = "https://jsonplaceholder.typicode.com/posts";

// Elementos HTML donde aparecerán los datos y mensajes.
const apiListaUsuarios = document.getElementById("listaUsuarios");
const apiEstadoUsuarios = document.getElementById("estadoUsuarios");
const apiListaPublicaciones = document.getElementById("listaPublicaciones");
const apiEstadoPublicaciones = document.getElementById("estadoPublicaciones");
const apiBotonRecargar = document.getElementById("recargarUsuarios");

// Consulta la lista de usuarios.
async function cargarUsuariosAPI() {
  apiEstadoUsuarios.textContent = "Cargando usuarios de nuestra comunidad...";
  apiListaUsuarios.replaceChildren();
  apiBotonRecargar.disabled = true;

  try {
    const respuesta = await fetch(URL_API_USUARIOS);

    if (!respuesta.ok) {
      throw new Error("La respuesta de usuarios no fue exitosa.");
    }

    const usuarios = await respuesta.json();
    apiEstadoUsuarios.textContent = `Se cargaron ${usuarios.length} usuarios.`;

    usuarios.forEach((usuario) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "api-user-card";

      const nombre = document.createElement("h4");
      nombre.textContent = usuario.name;

      const correo = document.createElement("p");
      correo.textContent = `Correo: ${usuario.email}`;

      const empresa = document.createElement("p");
      empresa.className = "api-company";
      empresa.textContent = `Empresa: ${usuario.company.name}`;

      const boton = document.createElement("button");
      boton.className = "api-select-user";
      boton.type = "button";
      boton.textContent = "Consultar historias →";
      boton.setAttribute("aria-pressed", "false");

      boton.addEventListener("click", () => {
        document.querySelectorAll(".api-select-user").forEach((otroBoton) => {
          otroBoton.setAttribute("aria-pressed", "false");
        });
        boton.setAttribute("aria-pressed", "true");
        cargarPublicacionesAPI(usuario.id, usuario.name);
      });

      tarjeta.append(nombre, correo, empresa, boton);
      apiListaUsuarios.appendChild(tarjeta);
    });
  } catch (error) {
    apiEstadoUsuarios.textContent =
      "No pudimos cargar los usuarios. Revisa tu conexión e inténtalo de nuevo.";
    console.error("Error al consultar usuarios:", error);
  } finally {
    apiBotonRecargar.disabled = false;
  }
}

// Consulta las publicaciones del usuario seleccionado.
async function cargarPublicacionesAPI(idUsuario, nombreUsuario) {
  apiEstadoPublicaciones.textContent = `Cargando publicaciones de ${nombreUsuario}...`;
  apiListaPublicaciones.replaceChildren();

  try {
    // El userId se reemplaza dinámicamente según el usuario seleccionado.
    const respuesta = await fetch(`${URL_API_PUBLICACIONES}?userId=${idUsuario}`);

    if (!respuesta.ok) {
      throw new Error("La respuesta de publicaciones no fue exitosa.");
    }

    const publicaciones = await respuesta.json();

    if (publicaciones.length === 0) {
      apiEstadoPublicaciones.textContent = `${nombreUsuario} no tiene publicaciones.`;
      return;
    }

    apiEstadoPublicaciones.textContent =
      `${publicaciones.length} publicaciones de ${nombreUsuario}.`;

    publicaciones.forEach((publicacion) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "api-post-card";

      const titulo = document.createElement("h4");
      titulo.textContent = publicacion.title;

      const contenido = document.createElement("p");
      contenido.textContent = publicacion.body;

      tarjeta.append(titulo, contenido);
      apiListaPublicaciones.appendChild(tarjeta);
    });
  } catch (error) {
    apiEstadoPublicaciones.textContent =
      "No pudimos cargar las publicaciones. Revisa tu conexión e inténtalo de nuevo.";
    console.error("Error al consultar publicaciones:", error);
  }
}

// Botón para volver a consultar usuarios.
apiBotonRecargar.addEventListener("click", cargarUsuariosAPI);

// Consulta los usuarios al cargar la página.
cargarUsuariosAPI();
