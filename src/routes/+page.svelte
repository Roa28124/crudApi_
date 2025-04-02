<script>
  import { onMount } from 'svelte';

  export let data;
  let editando = null;
  let fotos = [];
  let nuevaFoto = { 
    title: "", 
    url: "https://via.placeholder.com/600/92c952", 
    thumbnailUrl: "https://via.placeholder.com/150/92c952" 
  };

  const obtenerFotos = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=15');
      fotos = await res.json();
    } catch (error) {
      console.error("Error al cargar fotos:", error);
    }
  };

  onMount(() => {
    obtenerFotos();
  });

  function setEditar(fotoSeleccionada) {
    editando = fotoSeleccionada.id;
    nuevaFoto = {
      title: fotoSeleccionada.title,
      url: fotoSeleccionada.url,
      thumbnailUrl: fotoSeleccionada.thumbnailUrl
    };
  }

  async function agregarFoto() {
    const newPhoto = {
      id: Date.now(),
      ...nuevaFoto,
      albumId: 1
    };
    
    fotos = [newPhoto, ...fotos];
    nuevaFoto = { title: "", url: "https://via.placeholder.com/600/92c952", thumbnailUrl: "https://via.placeholder.com/150/92c952" };
    editando = null;
  }

  function eliminarFoto(id) {
    if (confirm('¿Eliminar esta foto permanentemente?')) {
      fotos = fotos.filter(f => f.id !== id);
    }
  }

  function editarFoto() {
    fotos = fotos.map(f => 
      f.id === editando ? { ...f, ...nuevaFoto } : f
    );
    editando = null;
    nuevaFoto = { title: "", url: "https://via.placeholder.com/600/92c952", thumbnailUrl: "https://via.placeholder.com/150/92c952" };
  }
</script>

<div class="gallery-container">
  <header class="gallery-header">
    <h1>Galería de Imágenes</h1>
    <p class="subtitle">Colección de fotografías profesionales</p>
    
    <div class="actions">
      <button class="add-btn" on:click={() => editando = 'nuevo'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Añadir Foto</span>
      </button>
    </div>
  </header>

  <!-- Modales (se mantienen igual) -->
  {#if editando === 'nuevo'}
    <div class="form-modal">
      <div class="form-content">
        <h2>Nueva Fotografía</h2>
        <div class="form-group">
          <label>Título</label>
          <input type="text" bind:value={nuevaFoto.title} class="form-input" placeholder="Título descriptivo">
        </div>
        <div class="form-group">
          <label>URL Imagen</label>
          <input type="text" bind:value={nuevaFoto.url} class="form-input" placeholder="https://ejemplo.com/imagen.jpg">
        </div>
        <div class="form-group">
          <label>URL Miniatura</label>
          <input type="text" bind:value={nuevaFoto.thumbnailUrl} class="form-input" placeholder="https://ejemplo.com/miniatura.jpg">
        </div>
        <div class="form-actions">
          <button class="cancel-btn" on:click={() => editando = null}>Cancelar</button>
          <button class="submit-btn" on:click={agregarFoto}>Guardar</button>
        </div>
      </div>
    </div>
  {/if}

  {#if typeof editando === 'number'}
    <div class="form-modal">
      <div class="form-content">
        <h2>Editar Fotografía</h2>
        <div class="form-group">
          <label>Título</label>
          <input type="text" bind:value={nuevaFoto.title} class="form-input">
        </div>
        <div class="form-group">
          <label>URL Imagen</label>
          <input type="text" bind:value={nuevaFoto.url} class="form-input">
        </div>
        <div class="form-group">
          <label>URL Miniatura</label>
          <input type="text" bind:value={nuevaFoto.thumbnailUrl} class="form-input">
        </div>
        <div class="form-actions">
          <button class="cancel-btn" on:click={() => editando = null}>Cancelar</button>
          <button class="submit-btn" on:click={editarFoto}>Actualizar</button>
        </div>
      </div>
    </div>
  {/if}

  <div class="photo-grid">
    {#each fotos as foto}
      <div class="photo-card">
        <div class="photo-frame">
          <div class="photo-wrapper">
            <img 
              src={foto.thumbnailUrl} 
              alt={foto.title}
              class="photo-image"
              loading="lazy"
            >
            <div class="photo-overlay">
              <h3 class="photo-title">{foto.title}</h3>
              <div class="photo-actions">
                <button class="edit-btn" on:click={() => setEditar(foto)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="delete-btn" on:click={() => eliminarFoto(foto.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    color: #2d3436;
  }

  .gallery-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .gallery-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .gallery-header h1 {
    font-size: 2.8rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }

  .subtitle {
    font-size: 1.2rem;
    color: #636e72;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  .actions {
    display: flex;
    justify-content: center;
  }

  .add-btn {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1rem 2rem;
    background: linear-gradient(to right, #3498db, #2ecc71);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    position: relative;
    overflow: hidden;
  }

  .add-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #2ecc71, #3498db);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  .add-btn:hover::before {
    opacity: 1;
  }

  .add-btn svg {
    width: 20px;
    height: 20px;
    stroke-width: 3;
    z-index: 2;
  }

  .add-btn span {
    position: relative;
    z-index: 2;
  }

  .add-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
  }

  .photo-frame {
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
  }

  .photo-card:hover .photo-frame {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    border-color: #3498db;
  }

  /* Resto de los estilos se mantienen igual */
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  .photo-wrapper {
    position: relative;
    padding-top: 100%;
    overflow: hidden;
    border-radius: 4px;
  }

  .photo-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .photo-card:hover .photo-image {
    transform: scale(1.1);
  }

  .photo-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    padding: 1.5rem;
    color: white;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .photo-card:hover .photo-overlay {
    transform: translateY(0);
  }

  .photo-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .photo-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
    margin-top: 1rem;
  }

  .edit-btn, .delete-btn {
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .edit-btn:hover {
    background-color: rgba(52, 152, 219, 0.8);
    transform: scale(1.1);
  }

  .delete-btn:hover {
    background-color: rgba(231, 76, 60, 0.8);
    transform: scale(1.1);
  }

  
</style>