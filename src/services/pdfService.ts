
export interface MenuPdf {
  id: string;
  restaurantId: string;
  name: string;
  url: string;
  fileSize: number;
  uploadedAt: Date;
  isActive: boolean;
}

// Mock data per simulare il backend
let menuPdfs: MenuPdf[] = [
  {
    id: 'pdf1',
    restaurantId: 'rest1',
    name: 'Menu Completo 2024',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: 245760,
    uploadedAt: new Date('2024-01-15'),
    isActive: true
  }
];

export const pdfService = {
  // Ottieni PDF del menù per ristorante
  async getRestaurantMenuPdf(restaurantId: string): Promise<MenuPdf | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return menuPdfs.find(pdf => pdf.restaurantId === restaurantId && pdf.isActive) || null;
  },

  // Carica nuovo PDF del menù
  async uploadMenuPdf(file: File, restaurantId: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simula upload del file
    const newPdf: MenuPdf = {
      id: `pdf-${Date.now()}`,
      restaurantId,
      name: file.name.replace('.pdf', ''),
      url: URL.createObjectURL(file),
      fileSize: file.size,
      uploadedAt: new Date(),
      isActive: true
    };

    // Disattiva il PDF precedente
    menuPdfs = menuPdfs.map(pdf => 
      pdf.restaurantId === restaurantId 
        ? { ...pdf, isActive: false }
        : pdf
    );

    menuPdfs.push(newPdf);
    return newPdf.id;
  },

  // Elimina PDF del menù
  async deleteMenuPdf(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    menuPdfs = menuPdfs.filter(pdf => pdf.id !== id);
  },

  // Formatta dimensione del file
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};
