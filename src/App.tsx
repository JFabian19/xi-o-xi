import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, ChevronRight, X, Trash2, Utensils, Facebook, MapPin, Loader2, Gift, Star, Flame, Truck, Sparkles, Clock3, Phone, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSheetData, submitSheetData, SheetDish, SheetCategory, SHEET_ID } from './services/googleSheets';
import { DEFAULT_MENU_DATA } from './data/menuData';

// ==========================================
// 📋 CONFIGURACIÓN DE LA PLANTILLA DEL MENÚ
// ==========================================
const RESTAURANTE_NAME = "XI O XI";
const RESTAURANTE_SLOGAN = "Pollos a la Leña • Deliciosas Papas Nativas";
const WHATSAPP_NUMBER = "51987037010"; // Delivery: 987037010 / 943841509
const FACEBOOK_URL = "https://facebook.com/xioxi.pollosalalena";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Av.+Huachipa+Mz.+D+Lote+2A";
const LOGO_PATH = "/logo.png";
const MARQUEE_TEXT = "🔥 ¡BIENVENIDOS A XI O XI POLLOS A LA LEÑA! • DELICIOSAS PAPAS NATIVAS • PEDIDOS DELIVERY: 987037010 / 943841509 • YAPE DISPONIBLE • ";
const CATEGORY_MARKS = ['★', '♨', '✦', '♥', '◎', '✺', '◌'];
// ==========================================

// Mapa de imágenes locales por defecto para platos conocidos (vacío por defecto para la plantilla)
const LOCAL_IMAGES: Record<string, string> = {
  // "Nombre del Plato": "nombre_imagen.jpg",
};

interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
}

interface Category {
  id: string;
  nombre: string;
  items: Dish[];
}

interface CartItem {
  nombre: string;
  precio: string;
  cantidad: number;
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // States for Birthday Form
  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [isSubmittingBirthday, setIsSubmittingBirthday] = useState(false);
  const [birthdaySuccess, setBirthdaySuccess] = useState(false);
  const [birthdayData, setBirthdayData] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: '',
    distrito: '',
    correo: ''
  });

  // States for Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewData, setReviewData] = useState({
    estrellasMozo: 0,
    estrellasComida: 0,
    comentario: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!SHEET_ID) {
          setCategories(DEFAULT_MENU_DATA);
          if (DEFAULT_MENU_DATA.length > 0) {
            setActiveCategory(DEFAULT_MENU_DATA[0].id);
          }
          return;
        }

        const [cats, dishes] = await Promise.all([
          fetchSheetData<SheetCategory>('Categorías'),
          fetchSheetData<SheetDish>('Platos')
        ]);

        if (cats.length === 0 && dishes.length === 0) {
          setCategories(DEFAULT_MENU_DATA);
          if (DEFAULT_MENU_DATA.length > 0) {
            setActiveCategory(DEFAULT_MENU_DATA[0].id);
          }
          return;
        }

        const formattedCategories: Category[] = cats.map(c => ({
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'),
          nombre: c.nombre,
          items: dishes
            .filter(d => d.categoría === c.nombre)
            .map(d => ({
              nombre: d['nombre del plato'],
              descripcion: d.descripción,
              precio: d.precio,
              imagen: LOCAL_IMAGES[d['nombre del plato']] || d['URL de imagen'] || null
            }))
        }));

        setCategories(formattedCategories);
        if (formattedCategories.length > 0) {
          setActiveCategory(formattedCategories[0].id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setCategories(DEFAULT_MENU_DATA);
        if (DEFAULT_MENU_DATA.length > 0) {
          setActiveCategory(DEFAULT_MENU_DATA[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.cantidad, 0), [cart]);

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.nombre === dish.nombre && i.precio === dish.precio);
      if (existing) {
        return prev.map(i =>
          (i.nombre === dish.nombre && i.precio === dish.precio)
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { nombre: dish.nombre, precio: dish.precio, cantidad: 1 }];
    });
  };

  const updateQuantity = (nombre: string, precio: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.nombre === nombre && i.precio === precio) {
            const newQty = i.cantidad + delta;
            return newQty > 0 ? { ...i, cantidad: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const cleanPrice = item.precio.replace(/^[^\d]*/, '');
      const num = parseFloat(cleanPrice) || 0;
      return acc + num * item.cantidad;
    }, 0);
  };

  const sendToWhatsApp = () => {
    const total = calculateTotal();
    let message = `*Hola ${RESTAURANTE_NAME}, deseo realizar un pedido:*\n\n`;
    cart.forEach(item => {
      message += `• ${item.cantidad} x ${item.nombre} (${item.precio})\n`;
    });
    message += `\n*TOTAL: S/.${total.toFixed(2)}*`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBirthdaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBirthday(true);
    const success = await submitSheetData('Cumpleaños', {
      timestamp: new Date().toLocaleString('es-PE'),
      nombre: birthdayData.nombre,
      telefono: birthdayData.telefono,
      fechaNacimiento: birthdayData.fechaNacimiento,
      distrito: birthdayData.distrito,
      correo: birthdayData.correo || 'No indicado'
    });
    
    setIsSubmittingBirthday(false);
    if (success) {
      setBirthdaySuccess(true);
      setTimeout(() => {
        setShowBirthdayForm(false);
        setBirthdaySuccess(false);
        setBirthdayData({ nombre: '', telefono: '', fechaNacimiento: '', distrito: '', correo: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tus datos. Por favor, inténtalo de nuevo.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewData.estrellasMozo === 0 || reviewData.estrellasComida === 0) {
      alert("Por favor califica ambas opciones con estrellas.");
      return;
    }

    setIsSubmittingReview(true);
    const success = await submitSheetData('Reseñas', {
      timestamp: new Date().toLocaleString('es-PE'),
      estrellasMozo: reviewData.estrellasMozo,
      estrellasComida: reviewData.estrellasComida,
      comentario: reviewData.comentario || 'Sin comentarios'
    });
    
    setIsSubmittingReview(false);
    if (success) {
      setReviewSuccess(true);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccess(false);
        setReviewData({ estrellasMozo: 0, estrellasComida: 0, comentario: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tu reseña. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-slogan text-primary font-bold tracking-widest uppercase text-xs">Cargando delicias...</p>
      </div>
    );
  }

  return (
    <div className="menu-shell max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden flex flex-col font-sans">
      <header className="sticky top-0 bg-[#fffaf2]/95 backdrop-blur-xl z-50 px-4 py-3 flex justify-between items-center border-b border-orange-100/80">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_PATH}
            alt={RESTAURANTE_NAME}
            className="h-12 w-auto object-contain drop-shadow-sm"
          />
          <div className="flex flex-col items-start">
            <h1 className="font-title text-[24px] text-primary leading-none tracking-wide">{RESTAURANTE_NAME}</h1>
            <span className="font-slogan text-[10px] text-secondary font-bold tracking-wider mt-0.5 uppercase">{RESTAURANTE_SLOGAN}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {FACEBOOK_URL && (
            <motion.a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary cursor-pointer border border-primary/10 shadow-sm"
            >
              <Facebook size={20} />
            </motion.a>
          )}
          {MAPS_URL && (
            <motion.a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary cursor-pointer border border-primary/10 shadow-sm"
            >
              <MapPin size={20} />
            </motion.a>
          )}
          <motion.div
            onClick={() => cartCount > 0 && setShowSummary(true)}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center relative cursor-pointer shadow-lg shadow-primary/25"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-secondary text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </motion.div>
        </div>
      </header>

      <div className="w-full bg-primary py-2 overflow-hidden flex items-center">
        <div className="animate-marquee flex gap-6 text-white font-slogan font-bold text-[11px] tracking-widest uppercase whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i}>{MARQUEE_TEXT}</span>
          ))}
        </div>
      </div>

      <section className="hero-cover relative min-h-[536px] overflow-hidden bg-[#100b08] px-5 pt-5 pb-6 flex flex-col">
        <img src="/hero-woodfire.png" alt="Pollo a la leña y papas nativas XI O XI" className="hero-food-image absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 hero-cover-overlay pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full flex-1">
          <div className="flex items-center justify-center gap-2 text-[#ffd36b] font-slogan font-black uppercase tracking-[0.2em] text-[9px]">
            <Flame size={13} className="fill-[#ffd36b]" /> Carta digital
          </div>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="hero-logo-frame mt-5 mx-auto w-[82%] max-w-[300px] h-[126px] rounded-[1.55rem] flex items-center justify-center px-6">
            <img src={LOGO_PATH} alt={RESTAURANTE_NAME} className="max-h-[95px] max-w-full object-contain" />
          </motion.div>

          <div className="mt-7 text-center">
            <p className="font-title text-[40px] leading-[0.96] tracking-tight text-white uppercase">El fuego<br />en tu mesa</p>
            <p className="font-title text-[35px] leading-none tracking-tight text-[#f8b942] uppercase italic">con XI O XI</p>
            <p className="mt-4 text-[12px] text-[#fff4de] leading-relaxed max-w-[265px] mx-auto">Pollo a la leña, papas nativas y antojos que llegan directito a ti.</p>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => categories[0] && scrollToCategory(categories[0].id)} className="hero-action hero-action-primary">
              Ver la carta <ArrowDown size={16} />
            </motion.button>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola XI O XI, quisiera hacer un pedido.')}`} target="_blank" rel="noopener noreferrer" className="hero-action hero-action-secondary">
              <Phone size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <div className="px-5 -mt-4 relative z-20">
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowBirthdayForm(true)}
          className="birthday-strip w-full bg-[#fffaf2] py-3 px-3.5 rounded-2xl flex items-center gap-3 text-left shadow-xl shadow-black/15 border border-white"
        >
          <span className="w-10 h-10 shrink-0 rounded-xl bg-[#ffdc89] text-[#8a3a0d] grid place-items-center"><Gift size={20} /></span>
          <span className="flex-1 min-w-0">
            <span className="block text-[12px] font-black text-dark uppercase">¿Estás de cumpleaños?</span>
            <span className="block text-[10px] text-gray-500 mt-0.5">Regístrate y celebra con nosotros</span>
          </span>
          <ChevronRight size={18} className="text-secondary" />
        </motion.button>
      </div>

      {/* Información de Delivery y Pagos de la Carta */}
      <div className="px-5 pb-2">
        <div className="delivery-card rounded-2xl p-3.5 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 shadow-lg shadow-orange-100/40">
          <div className="flex items-center gap-2 text-[11px] font-bold text-white">
            <span className="w-7 h-7 bg-white/15 rounded-lg grid place-items-center"><Truck size={16} /></span>
            <span>Delivery: 987037010<br />943841509</span>
          </div>
          <span className="self-center bg-[#ffd36b] text-[#6b2904] px-2.5 py-1 rounded-full font-black text-[9px] uppercase">Yape & efectivo</span>
          <div className="col-span-2 flex items-center justify-between text-[9px] text-white/85 border-t border-white/15 pt-2">
            <span className="flex items-center gap-1"><MapPin size={12} /> Av. Huachipa Mz. D Lote 2A</span>
            <span className="font-bold"><Clock3 size={11} className="inline mr-1" />Min. S/. 30</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-3 pb-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-[11px] font-category font-bold whitespace-nowrap transition-all duration-200 border
                ${activeCategory === cat.id
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 -translate-y-0.5'
                  : 'bg-[#fffaf2] text-dark border-orange-100 hover:border-primary/40 hover:text-primary'
                }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 px-5">
        <div className="menu-intro mb-7 px-1">
          <div className="flex items-center gap-2 text-secondary font-slogan font-bold uppercase tracking-[0.18em] text-[9px] mb-1"><Sparkles size={13} /> Nuestra carta</div>
          <h2 className="font-title text-[29px] text-dark leading-none">Elige tu antojo</h2>
          <p className="text-[11px] text-gray-500 mt-2">Sabores hechos al fuego, pensados para compartir.</p>
        </div>
        {categories.map((cat, categoryIndex) => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-28">
            <div className="mb-4 pt-2 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="category-symbol">{CATEGORY_MARKS[categoryIndex % CATEGORY_MARKS.length]}</span>
                  <h3 className="font-category font-bold text-primary text-[26px] leading-none tracking-wide category-underline">
                  {cat.nombre}
                  </h3>
                </div>
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest ml-8">{cat.items.length} opciones para ti</p>
              </div>
              <Utensils className="text-secondary/35 wave-icon mb-1" size={20} />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {cat.items.map((dish, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.32, delay: Math.min(idx * 0.04, 0.2) }}
                  whileHover={{ y: -5 }}
                  className="dish-card overflow-hidden flex flex-col"
                >
                  <div className="dish-banner relative overflow-hidden p-3.5 min-h-[72px] flex items-end">
                    <span className="absolute -right-2 -top-7 font-title text-[76px] leading-none text-primary/[0.07] select-none">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="relative flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-primary text-white grid place-items-center text-[9px] font-black">{CATEGORY_MARKS[categoryIndex % CATEGORY_MARKS.length]}</span>
                      <span className="font-slogan text-[8px] text-primary uppercase font-black tracking-[0.14em]">XI O XI favorito</span>
                    </div>
                  </div>
                  
                  <div className="p-3.5 pt-3 flex flex-col flex-1 bg-white">
                    <h4 className="font-dish font-extrabold text-dark text-[13px] leading-[1.15] mb-1.5">
                      {dish.nombre}
                    </h4>
                    {dish.descripcion && (
                      <p className="text-[10px] text-gray-500 leading-[1.35] mb-2 line-clamp-3">
                        {dish.descripcion}
                      </p>
                    )}
                    <div className="flex-1"></div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-dish font-extrabold text-primary text-[16px] whitespace-nowrap">
                        {dish.precio}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => addToCart(dish)}
                        className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-md shadow-primary/20 transition-colors duration-200 shrink-0 hover:bg-secondary"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-8 mb-4 border border-gray-100 bg-gray-50 rounded-3xl p-5 text-center shadow-sm">
          <h3 className="font-title text-primary text-[22px] leading-tight mb-2">¿Cómo estuvo todo?</h3>
          <p className="text-[11px] text-gray-500 mb-4 px-4">Ayúdanos a mejorar calificando tu experiencia con nosotros</p>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReviewForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 mx-auto w-full"
          >
            <Star size={18} className="fill-white" />
            Reseña nuestra comida
          </motion.button>
        </section>

        <footer className="mt-8 pt-8 pb-10 border-t border-gray-200 flex flex-col items-center justify-center text-center px-4">
          <img src={LOGO_PATH} alt={RESTAURANTE_NAME} className="h-16 w-auto object-contain mb-3" />
          <p className="font-title text-2xl text-primary mb-1">{RESTAURANTE_NAME}</p>
          <p className="font-slogan text-xs text-secondary font-bold mb-3 uppercase tracking-wider">{RESTAURANTE_SLOGAN}</p>
          <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3 max-w-xs text-xs text-amber-900 mb-4 space-y-1">
            <p className="font-bold text-primary">🛵 Delivery: 987037010 / 943841509</p>
            <p>📍 Av. Huachipa Mz. D Lote 2A</p>
            <p className="text-[10px] text-gray-500">* Delivery por consumo mayor a S/. 30. Aceptamos Efectivo y Yape.</p>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">© 2026 {RESTAURANTE_NAME} Pollos a la Leña. Todos los derechos reservados.</p>
        </footer>

        <div className="bg-dark py-6 flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1 opacity-50 text-white/50">Digital Menu Experience</p>
          <motion.a 
            href="https://tymasolutions.lat/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-bold text-sm tracking-tight group cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white group-hover:text-[#00BFFF] transition-colors duration-200">Hecho por Tyma</span>
            <span className="text-[#00BFFF] group-hover:text-white transition-colors duration-200">Solutions</span>
          </motion.a>
        </div>
      </main>

      <AnimatePresence>
        {cartCount > 0 && !showSummary && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 w-full max-w-md p-5 z-40"
          >
            <div className="glass rounded-[2rem] p-4 flex items-center justify-between border border-white/50 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="shimmer absolute inset-0 opacity-20"></div>
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tu Pedido</p>
                  <p className="font-bold text-dark text-lg">{cartCount} Artículos</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummary(true)}
                className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/30 font-bold text-sm"
              >
                Ver Pedido
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 lg:p-0"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[3rem] p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-title text-2xl text-primary">Mi Pedido</h2>
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-3 mb-8">
                {cart.map(item => (
                  <div
                    key={`${item.nombre}-${item.precio}`}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-dish font-semibold text-dark text-sm truncate">{item.nombre}</h4>
                      <p className="font-dish text-xs text-primary font-bold">{item.precio}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                      <button onClick={() => updateQuantity(item.nombre, item.precio, -1)} className="text-gray-400">
                        <Minus size={16} />
                      </button>
                      <span className="font-dish font-bold text-sm w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.nombre, item.precio, 1)} className="text-primary">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => updateQuantity(item.nombre, item.precio, -item.cantidad)}
                      className="text-red-300 ml-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-dish text-xl font-bold text-dark">Total a pagar</h3>
                  <h3 className="font-dish text-xl font-bold text-primary">S/.{calculateTotal().toFixed(2)}</h3>
                </div>
              </div>
              <button
                onClick={sendToWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:scale-[1.02] transition-transform font-bold"
              >
                Enviar Pedido a WhatsApp
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Plato ampliado"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBirthdayForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowBirthdayForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center"
              >
                <X size={18} className="text-gray-400" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                  <Gift size={24} className="text-secondary" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-2">¡Tu Cumpleaños!</h2>
                <p className="text-xs text-gray-500">Déjanos tus datos para enviarte una sorpresa en tu día especial.</p>
              </div>

              {birthdaySuccess ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-center text-sm font-bold border border-green-100">
                  ¡Gracias! Tus datos han sido guardados.
                </div>
              ) : (
                <form onSubmit={handleBirthdaySubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre Completo</label>
                    <input required type="text" value={birthdayData.nombre} onChange={e => setBirthdayData({...birthdayData, nombre: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Teléfono</label>
                    <input required type="tel" minLength={9} maxLength={11} pattern="[0-9]*" value={birthdayData.telefono} onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setBirthdayData({...birthdayData, telefono: val});
                    }} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors" placeholder="Ej. 987654321" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Fecha de Nacimiento</label>
                    <input required type="date" value={birthdayData.fechaNacimiento} onChange={e => setBirthdayData({...birthdayData, fechaNacimiento: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors text-gray-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Distrito</label>
                    <input required type="text" value={birthdayData.distrito} onChange={e => setBirthdayData({...birthdayData, distrito: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors" placeholder="Ej. Miraflores" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Correo Electrónico (Opcional)</label>
                    <input type="email" value={birthdayData.correo} onChange={e => setBirthdayData({...birthdayData, correo: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors" placeholder="correo@ejemplo.com" />
                  </div>
                  
                  <button disabled={isSubmittingBirthday} type="submit" className="w-full bg-secondary text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-secondary/20 mt-2 disabled:opacity-70 flex justify-center items-center">
                    {isSubmittingBirthday ? <Loader2 size={18} className="animate-spin" /> : "Guardar mis datos"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowReviewForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center"
              >
                <X size={18} className="text-gray-400" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-3">
                  <Star size={24} className="text-primary fill-primary" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-2">¡Calificanos!</h2>
                <p className="text-xs text-gray-500">Tu opinión es muy importante para nosotros.</p>
              </div>

              {reviewSuccess ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-center text-sm font-bold border border-green-100">
                  ¡Gracias por tu reseña! Nos ayuda a mejorar.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-500 mb-2">Atención del Mozo</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasMozo: star})}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star size={28} className={reviewData.estrellasMozo >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-500 mb-2">Calidad de la Comida</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasComida: star})}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star size={28} className={reviewData.estrellasComida >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Comentario (Opcional)</label>
                    <textarea 
                      rows={3} 
                      value={reviewData.comentario} 
                      onChange={e => setReviewData({...reviewData, comentario: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none mt-1" 
                      placeholder="Cuéntanos más sobre tu experiencia..." 
                    />
                  </div>
                  
                  <button disabled={isSubmittingReview} type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-primary/20 mt-2 disabled:opacity-70 flex justify-center items-center">
                    {isSubmittingReview ? <Loader2 size={18} className="animate-spin" /> : "Enviar Reseña"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
