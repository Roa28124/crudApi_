
let fotos = [];

export function load() {
    return { fotos };
}

export const actions = {
    crear: async ({ request }) => {
        const data = await request.formData();
        const nuevaFoto = {
            id: Date.now(),
            title: data.get("title"),
            url: data.get("url"),
            thumbnailUrl: data.get("thumbnailUrl")
        };
        fotos.push(nuevaFoto);
        return { success: true };
    },

    editar: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get("id"));
        const foto = fotos.find(f => f.id === id);
        if (foto) {
            foto.title = data.get("title");
            foto.url = data.get("url");
            foto.thumbnailUrl = data.get("thumbnailUrl");
        }
        return { success: true };
    },

    eliminar: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get("id"));
        fotos = fotos.filter(f => f.id !== id);
        return { success: true };
    },
    
    favorito: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get("id"));
        const foto = fotos.find(f => f.id === id);
        if (foto) {
            foto.favorito = !foto.favorito;
        }
        return { success: true };
    }
};