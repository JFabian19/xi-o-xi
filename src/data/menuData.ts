export interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
}

export interface Category {
  id: string;
  nombre: string;
  items: Dish[];
}

export const DEFAULT_MENU_DATA: Category[] = [
  {
    id: "recomendacion",
    nombre: "Recomendación",
    items: [
      {
        nombre: "Recomendación 1 Pollo a la Leña",
        descripcion: "1 pollo a la leña + papas nativas + ensalada fresca + Arroz chaufa + Salsas + Gaseosa de 1.5 L.",
        precio: "S/. 90.00",
        imagen: ""
      },
      {
        nombre: "Monstrito con su Pirañita",
        descripcion: "1/8 pollo a la leña + chaufa + papas nativas + ensalada + gaseosa (7up o Pepsi)",
        precio: "S/. 16.99",
        imagen: ""
      },
      {
        nombre: "Mostro Especial",
        descripcion: "1/4 pollo a la leña + Chaufa + papas nativas + ensalada + salsas + Inka Kola de 500 ml.",
        precio: "S/. 30.00",
        imagen: ""
      }
    ]
  },
  {
    id: "pollos-a-la-lena",
    nombre: "Pollos a la Leña",
    items: [
      {
        nombre: "Pollo a la Leña (1 Pollo)",
        descripcion: "1 pollo a la leña + papas nativas + ensalada + salsas",
        precio: "S/. 70.00",
        imagen: ""
      },
      {
        nombre: "Pollo con Chaufa",
        descripcion: "1 pollo a la leña + chaufa + ensalada + papas nativas + salsas",
        precio: "S/. 75.00",
        imagen: ""
      },
      {
        nombre: "Pollo con Gaseosa",
        descripcion: "1 pollo a la leña + papas nativas + salsas + ensalada + Pepsi 1 1/2",
        precio: "S/. 75.00",
        imagen: ""
      }
    ]
  },
  {
    id: "combos-xi-o-xi",
    nombre: "Combos XI O XI",
    items: [
      {
        nombre: "1/2 Pollo",
        descripcion: "1/2 pollo a la leña + papas nativas + ensalada + salsas",
        precio: "S/. 40.00",
        imagen: ""
      },
      {
        nombre: "1/2 Pollo Mostro",
        descripcion: "1/2 pollo a la leña + papas nativas + chaufa + ensalada + salsas",
        precio: "S/. 45.00",
        imagen: ""
      },
      {
        nombre: "Dúo con Gaseosas",
        descripcion: "1/2 pollo a la leña + salsas + 2 Pepsi 355 ml. + papas nativas + ensalada",
        precio: "S/. 45.00",
        imagen: ""
      }
    ]
  },
  {
    id: "personal-xi-o-xi",
    nombre: "Personal XI O XI",
    items: [
      {
        nombre: "1/4 Personal",
        descripcion: "1/4 pollo a la leña + papas nativas + ensalada + salsas",
        precio: "S/. 22.00",
        imagen: ""
      },
      {
        nombre: "Mostro Personal",
        descripcion: "1/4 Pollo a la leña + chaufa + papas nativas + ensalada + salsas",
        precio: "S/. 25.00",
        imagen: ""
      },
      {
        nombre: "Personal con Gaseosa",
        descripcion: "1/4 Pollo a la leña + papas nativas + salsas + Pepsi",
        precio: "S/. 25.00",
        imagen: ""
      },
      {
        nombre: "Mostro con Gaseosa",
        descripcion: "1/4 Pollo a la leña con arroz chaufa + papas nativas + ensalada + salsas + Pepsi",
        precio: "S/. 28.00",
        imagen: ""
      },
      {
        nombre: "Porción de Papas Nativas",
        descripcion: "Deliciosas papas nativas crujientes",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Mostrito",
        descripcion: "1/8 Pollo a la leña + chaufa + papas nativas",
        precio: "S/. 15.00",
        imagen: ""
      }
    ]
  },
  {
    id: "festival-de-pastas",
    nombre: "Festival de Pastas",
    items: [
      {
        nombre: "Tallarines al Pesto con 1/4 Pollo",
        descripcion: "Tallarines al pesto con queso y 1/4 pollo a la leña",
        precio: "S/. 27.99",
        imagen: ""
      },
      {
        nombre: "Tallarines a lo Alfredo con 1/4 Pollo",
        descripcion: "Tallarines a lo alfredo con jamón y 1/4 pollo a la leña",
        precio: "S/. 27.99",
        imagen: ""
      },
      {
        nombre: "Tallarines en Salsa Huancaína con 1/4 Pollo",
        descripcion: "Tallarines en salsa huancaína con 1/4 pollo a la leña",
        precio: "S/. 27.99",
        imagen: ""
      }
    ]
  },
  {
    id: "platos-a-la-carta",
    nombre: "Platos a la Carta",
    items: [
      {
        nombre: "Arroz Chaufa Amazónico",
        descripcion: "Arroz chaufa con cecina y plátano frito",
        precio: "S/. 25.00",
        imagen: ""
      },
      {
        nombre: "Arroz Chaufa con Pollo a la Leña",
        descripcion: "Arroz chaufa con trozos de pollo a la leña al wok",
        precio: "S/. 16.00",
        imagen: ""
      },
      {
        nombre: "Lomo Saltado de Lomo Fino",
        descripcion: "Lomo fino salteado con cebolla, tomate, papas nativas y arroz",
        precio: "S/. 39.99",
        imagen: ""
      },
      {
        nombre: "Tallarín Saltado de Lomo Fino",
        descripcion: "Tallarines salteados con lomo fino, cebolla y tomate",
        precio: "S/. 39.99",
        imagen: ""
      },
      {
        nombre: "Pollo Saltado",
        descripcion: "Trozos de pollo salteados con cebolla, tomate, papas nativas y arroz",
        precio: "S/. 27.99",
        imagen: ""
      },
      {
        nombre: "Tallarín Saltado de Pollo",
        descripcion: "Fideos salteados al wok con pollo y vegetales",
        precio: "S/. 27.99",
        imagen: ""
      },
      {
        nombre: "Salchi Xioxi Personal",
        descripcion: "Salchipapa con papas nativas y salchicha",
        precio: "S/. 15.99",
        imagen: ""
      }
    ]
  },
  {
    id: "bebidas",
    nombre: "Bebidas",
    items: [
      {
        nombre: "Gaseosa personal (Inka cola o Coca cola)",
        descripcion: "Botella personal helada 500 ml",
        precio: "S/. 5.00",
        imagen: ""
      },
      {
        nombre: "Gaseosa Pepsi familiar 3 litros",
        descripcion: "Botella familiar 3 litros",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Gaseosa 1.5 litros (Inka cola o Coca cola)",
        descripcion: "Botella 1.5 litros",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Gaseosa 3 litros (Inka cola o Coca cola)",
        descripcion: "Botella 3 litros",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Jarra de Limonada",
        descripcion: "Jarra de limonada recién preparada",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Jarra de Maracuya",
        descripcion: "Jarra de refresco de maracuyá natural",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Jarra Chicha",
        descripcion: "Jarra de chicha morada tradicional",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Infusiones",
        descripcion: "Manzanilla, anís o té caliente",
        precio: "S/. 3.00",
        imagen: ""
      }
    ]
  }
];

