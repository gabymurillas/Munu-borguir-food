/**
 * Datos del Menú (Simulando una base de datos o llamada API)
 */
const MenuData = {
    perros: [
        { nombre: "Perro Normal", desc: "Salchicha ahumada, ensalada, papitas, cebolla y queso llanero.", precios: [{ label: "1x", monto: 1.40 }, { label: "2x", monto: 2.80 }] },
        { nombre: "Perro Especial", desc: "Salchicha ahumada, ensalada, papitas, cebolla, jamón, tocineta y queso amarillo.", precios: [{ label: "1x", monto: 2.50 }, { label: "2x", monto: 5.00 }] }
    ],
    burgers: [
        { nombre: "Burguir Normal", desc: "Carne de res, vegetales, papitas, cebolla caramelizada y salsas.", precios: [{ label: "Pedir", monto: 2.80 }] },
        { nombre: "Hamburguesa Chicken", desc: "Pollo, vegetales, papitas, cebolla caramelizada y salsas.", precios: [{ label: "Pedir", monto: 3.20 }] },
        { nombre: "MC Borguir", desc: "Carne de res, lechuga, cebolla caramelizada, queso amarillo y pepinillo.", precios: [{ label: "Pedir", monto: 3.50 }] },
        { nombre: "Especial Proteica", desc: "Carne de res, vegetales, huevo, jamón, queso amarillo y tocineta.", precios: [{ label: "Pedir", monto: 5.25 }] },
        { nombre: "Chicken S", desc: "Pollo, vegetales, jamón, queso amarillo y tocineta.", precios: [{ label: "Pedir", monto: 5.65 }] },
        { nombre: "Hamburguesa Doble", desc: "2 Carnes de res, jamón, queso amarillo, tocineta y huevo.", precios: [{ label: "Pedir", monto: 7.20 }] },
        { nombre: "Hamburguesa Mixta", desc: "Carne de res + Pollo, jamón, queso amarillo, tocineta y huevo.", precios: [{ label: "Pedir", monto: 7.80 }] }
    ],
    "combos-perros": [
        { nombre: "Combo 2 Perros Normales + Refresco 400ml", desc: "2 Perros Normales + Refresco 400ml", tituloCard: "2 NORMALES + REFRESCO", esCombo: true, precios: [{ label: "Pedir", monto: 3.40 }] },
        { nombre: "Combo 2 Perros Especiales + Refresco 400ml", desc: "2 Perros Especiales + Refresco 400ml", tituloCard: "2 ESPECIALES + REFRESCO", esCombo: true, precios: [{ label: "Pedir", monto: 5.45 }] }
    ],
    "combos-burgers": [
        { nombre: "Clásica + 1 Refresco 400ml", desc: "Borguir Clásica + 1 Refresco", tituloCard: "CLÁSICA + 1 REFRESCO", esCombo: true, precios: [{ label: "Pedir", monto: 3.40 }] },
        { nombre: "Chicken + 1 Refresco 400ml", desc: "Hamburguesa Chicken + 1 Refresco", tituloCard: "CHICKEN + 1 REFRESCO", esCombo: true, precios: [{ label: "Pedir", monto: 3.85 }] },
        { nombre: "Mc Borguir + 1 Refresco 400ml", desc: "Mc Borguir + 1 Refresco", tituloCard: "MC BORGUIR + 1 REFRESCO", esCombo: true, precios: [{ label: "Pedir", monto: 3.85 }] },
        { nombre: "Proteica + 1 Refresco 400ml", desc: "Especial Proteica + 1 Refresco", tituloCard: "1 PROTEICA + 1 REFRESCO", esCombo: true, precios: [{ label: "Pedir", monto: 5.75 }] },
        { nombre: "Special Chicken + 1 Refresco 400ml", desc: "Special Chicken + 1 Refresco", tituloCard: "SPECIAL CHICKEN + 1 REFRESCO", esCombo: true, precios: [{ label: "Pedir", monto: 6.15 }] },
        { nombre: "Doble + 1 Refresco 400ml", desc: "Hamburguesa Doble + 1 Refresco", tituloCard: "DOBLE + 1 REFRESCO", esCombo: true, precios: [{ label: "Pedir", monto: 7.50 }] },
        { nombre: "Mixta + 1 Refresco 400ml", desc: "Hamburguesa Mixta + 1 Refresco", tituloCard: "MIXTA + 1 REFRESCO", esCombo: true, precios: [{ label: "Pedir", monto: 8.20 }] }
    ],
    "combos-papas": [
        { nombre: "Combo Clásica + Papas", tituloCard: "CLÁSICA + PAPAS", esCombo: true, precios: [{ label: "Pedir", monto: 4.30 }] },
        { nombre: "Combo Chicken + Papas", tituloCard: "CHICKEN + PAPAS", esCombo: true, precios: [{ label: "Pedir", monto: 4.70 }] },
        { nombre: "Combo Mc Borguir + Papas", tituloCard: "MC BORGUIR + PAPAS", esCombo: true, precios: [{ label: "Pedir", monto: 4.90 }] },
        { nombre: "Combo Proteica + Papas", tituloCard: "PROTEICA + PAPAS", esCombo: true, precios: [{ label: "Pedir", monto: 6.75 }] },
        { nombre: "Combo Doble + Papas", tituloCard: "DOBLE + PAPAS", esCombo: true, precios: [{ label: "Pedir", monto: 8.40 }] },
        { nombre: "Papas", desc: "Full o Media ración", tituloCard: "RACIÓN DE PAPAS", esCombo: true, precios: [{ label: "Media", monto: 2.90 }, { label: "Full", monto: 5.00 }] }
    ],
    "combos-mixtos": [
        { nombre: "Promo Perro Normal + Especial", desc: "Perro Normal + Perro Especial + Refresco.", tituloCard: "NORMAL + ESPECIAL", esCombo: true, precios: [{ label: "Pedir", monto: 4.55 }] },
        { nombre: "Promo DÚO: 1 Perro + 1 Borguir + Refresco", desc: "1 Perro Clásico + 1 Borguir Clásica + Refresco.", tituloCard: "PERRO CLÁSICO + B. CLÁSICA", esCombo: true, precios: [{ label: "Pedir", monto: 4.85 }] },
        { nombre: "Promo TRÍO: 3 Mc Borguir + Refresco 1L", desc: "3 Mc Borguir + Refresco 1 Litro.", tituloCard: "3 MC BORGUIR + REFRESCO 1L", esCombo: true, precios: [{ label: "Pedir", monto: 11.20 }] },
        { nombre: "Promo 2 Proteicas + Refresco 1L", desc: "2 Hamburguesas Proteicas + Refresco 1 Litro.", tituloCard: "2 PROTEICAS + REFRESCO 1L", esCombo: true, precios: [{ label: "Pedir", monto: 11.20 }] },
        { nombre: "Promo 2 Chicken S + Refresco 1L", desc: "2 Chicken (S) + Refresco 1 Litro.", tituloCard: "2 CHICKEN (S) + REFRESCO 1L", esCombo: true, precios: [{ label: "Pedir", monto: 12.00 }] },
        { nombre: "Promo PAREJA: 2 Mixtas + Refresco 1L", desc: "2 Mixtas + Refresco 1 Litro.", tituloCard: "2 MIXTAS + REFRESCO 1L", esCombo: true, precios: [{ label: "Pedir", monto: 16.30 }] },
        { nombre: "Promo MEGA DOBLE: 3 Dobles + Refresco 1L", desc: "3 Dobles + Refresco 1 Litro.", tituloCard: "3 DOBLES + REFRESCO 1L", esCombo: true, precios: [{ label: "Pedir", monto: 22.20 }] }
    ],
    terneritos: [
        { nombre: "2 Terneritos Especiales", desc: "Pan Jumbo, carne, pollo, ensalada, papitas, jamón, tocineta y queso amarillo.", tituloCard: "2 TERNERITOS ESPECIALES", precios: [{ label: "Pedir", monto: 7.80 }] }
    ],
    bebidas: [
        { nombre: "Refresco", tituloCard: "REFRESCOS", precios: [{ label: "400ml", monto: 0.70 }, { label: "Glup 1 Litro", monto: 0.90 }] }
    ]
};
