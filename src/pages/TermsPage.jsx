import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const sections = [
    { title: "1. NATURALEZA DEL SERVICIO", content: "Go Shopping es una plataforma de comercio electrónico destinada a la exhibición, promoción y comercialización de productos importados, como: Humidificadores, Esencias aromáticas, Quemadores de reflujo, Conos de reflujo, Accesorios y joyería (aleación de zinc, hierro, bronce, acero quirúrgico), Tecnología importada, Otros productos disponibles en el catálogo. Importante: Los productos comercializados son en su mayoría de fabricación extranjera, por lo que pueden presentar variaciones en diseño, acabado, tamaño, color o funcionamiento conforme a estándares internacionales." },
    { title: "2. CAPACIDAD LEGAL", content: "El usuario declara tener capacidad legal suficiente para contratar conforme a la legislación peruana. En caso de actuar en representación de terceros, asume responsabilidad total por dicha representación." },
    { title: "3. PRECIOS Y PAGOS", content: "Todos los precios están expresados en Soles (PEN) e incluyen IGV cuando corresponda. Go Shopping se reserva el derecho de modificar precios, promociones y condiciones comerciales en cualquier momento sin previo aviso. El pedido se considera válido únicamente tras la confirmación efectiva del pago. Canales autorizados: Cuentas oficiales de la empresa, Aplicativos como Yape y Plin (solo números verificados), Cuentas Bancarias a nombre de la Empresa Importaciones Puno s.r.l. ⚠️ Exclusión de responsabilidad: La empresa no asume responsabilidad alguna por pagos realizados a cuentas no autorizadas, errores del cliente en la transferencia, fraudes externos o suplantaciones." },
    { title: "4. PROMOCIONES Y OFERTAS", content: "Sujetos a stock disponible y vigencia específica. Pueden incluir limitaciones de modelo, color o características. No acumulables con otras promociones salvo indicación expresa. Go Shopping puede cancelar promociones por error técnico o humano sin obligación de compensación adicional." },
    { title: "5. PROCESAMIENTO DE PEDIDOS", content: "El pedido entra en proceso solo tras validación de pago y stock. Go Shopping puede rechazar o cancelar pedidos unilateralmente en caso de: Errores de precio, Sospecha de fraude, Datos inconsistentes, Uso indebido del sistema." },
    { title: "6. ENVÍOS, TRANSPORTE Y RIESGO", content: "El despacho se realiza dentro de un plazo estimado de 4 a 24 horas. El cliente elige la empresa de transporte, actuando esta como tercero independiente. Transferencia de riesgo: Una vez entregado el producto al transportista, el riesgo se transfiere totalmente al cliente. ⚠️ Go Shopping no es responsable por: Pérdidas, Daños, Retrasos, Manipulación indebida, Condiciones de transporte. Se podrá proporcionar: Video de embalaje, Foto de guía de envío. Esto constituye prueba suficiente del estado del producto al momento del despacho." },
    { title: "7. EMBALAJE", content: "Gratis hasta 5 kg. Peso mayor: costo adicional obligatorio. El pedido no será despachado sin pago completo, incluyendo embalaje." },
    { title: "8. PRODUCTOS Y USO", content: "El cliente acepta que: Los productos deben utilizarse conforme a su finalidad. Algunos productos (ej. humidificadores, quemadores, esencias) implican riesgos inherentes si son mal utilizados. ⚠️ Go Shopping no se responsabiliza por: Daños por uso indebido, Manipulación incorrecta, Instalación incorrecta, Uso en condiciones no recomendadas." },
    { title: "9. GARANTÍAS Y EXCLUSIONES", content: "Salvo indicación expresa: Los productos se venden “tal cual” (as-is). No existe garantía adicional más allá de la legal mínima aplicable. Se excluye responsabilidad por: Daños indirectos, Lucro cesante, Daños consecuenciales, Pérdida de oportunidad." },
    { id: "devoluciones", title: "10. DEVOLUCIONES Y REEMBOLSOS", content: "Condiciones estrictas: Plazo máximo: 24 horas desde la compra. Producto: Sin uso, Sin daños, Con empaque original, Sin manipulación externa. El cliente asume: Costos de devolución, Riesgos del envío de retorno. Go Shopping puede rechazar devoluciones unilateralmente si no se cumplen condiciones." },
    { title: "11. CLIENTES EN PROVINCIA", content: "Retiro obligatorio en máximo 3 días calendario. ⚠️ La empresa no se responsabiliza por: Abandono del paquete, Retenciones, Daños en agencia, Devociones por no recojo. No hay obligación de: Reenvío, Reembolso." },
    { title: "12. LIMITACIÓN DE RESPONSABILIDAD", content: "En todos los casos, la responsabilidad máxima de Go Shopping se limita al: 👉 Monto efectivamente pagado por el cliente." },
    { title: "13. PROPIEDAD INTELECTUAL", content: "Todo el contenido es propiedad de la empresa o sus proveedores. Prohibido: Copiar, Reproducir, Distribuir, Usar comercialmente, Sin autorización expresa." },
    { title: "14. PRUEBAS DIGITALES Y VALIDEZ", content: "El cliente acepta como medios probatorios válidos: Correos electrónicos, WhatsApp, Videos, Registros del sistema, Comprobantes digitales." },
    { title: "15. FUERZA MAYOR", content: "Go Shopping no será responsable por incumplimientos derivados de: Desastres naturales, Paros, Fallas logísticas, Problemas de importación, Actos gubernamentales." },
    { id: "privacidad", title: "16. PROTECCIÓN DE DATOS PERSONALES", content: "Conforme a la Ley N° 29733: Uso limitado a gestión comercial, Posible uso para marketing (con aceptación del usuario), Compartición solo con proveedores necesarios. Podrás ejercer en cualquier momento tus derechos de acceso, rectificación, cancelación y oposición (ARCO) contactándonos por correo electrónico importergo@proton.me o enviándonos un mensaje por WhatsApp."},
    { title: "17. USO DE LOS DATOS PERSONALES", content:"Los datos personales que nos proporciones serán utilizados exclusivamente para gestionar tus pedidos, brindarte atención al cliente y mantener la comunicación contigo. Esta información es proporcionada de forma voluntaria por el usuario al momento del registro o al realizar una compra. Su recopilación nos permite ofrecerte servicios personalizados, mejorar nuestras ofertas y comunicar promociones o actualizaciones relevantes."},
    { title: "18. COMPARTICIÓN DE DATOS PERSONALES", content:"No compartiremos tu información personal con terceros sin tu consentimiento, salvo que exista una obligación legal. No obstante, podremos compartir datos con proveedores de servicios de confianza que nos asisten en la operación del sitio web y en la prestación de servicios al usuario, siempre bajo estrictos acuerdos de confidencialidad."},
    { title: "19. SEGURIDAD DE LA INFORMACION", content: "Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdidas o alteraciones. Utilizamos cookies y tecnologías similares para mejorar la experiencia del usuario en nuestro sitio. Puedes gestionar el uso de cookies desde la configuración de tu navegador, aunque esto podría afectar ciertas funcionalidades del sitio."},
    { title: "20. MODIFICACIONES", content: "Go Shopping puede modificar estos términos en cualquier momento. El uso continuo implica aceptación automática." },
    { title: "21. JURISDICCIÓN Y LEY APLICABLE", content: "Este contrato se rige por las leyes de la República del Perú. Cualquier controversia será resuelta en: 👉 Juzgados de Puno, renunciando el usuario a cualquier otro fuero." },
    { title: "22. CONTACTO OFICIAL", content: "Correo: imporpuno@gmail.com | Tel. 962 810 439" },
    { title: "23. CLÁUSULA DE ACEPTACIÓN TOTAL", content: "El usuario declara haber leído, comprendido y aceptado la totalidad de las condiciones sin reservas, incluyendo limitaciones de responsabilidad y exclusiones." },
    { title: "24. MODIFICACIONES", content: "Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Te recomendamos revisar periódicamente esta página para estar informado sobre cualquier cambio. El uso continuado del sitio tras la publicación de cambios implicará tu aceptación de los mismos. Si tienes preguntas sobre esta política, contáctanos en imporpuno@gmail.com."}
  ];

  const clauses = [
    { title: "CLÁUSULA DE RENUNCIA A REVERSIÓN FRAUDULENTA", content: "El cliente renuncia expresamente a iniciar procesos de contracargo o reversión de pago fraudulenta (chargeback) sin haber agotado previamente los canales directos de la empresa. En caso de hacerlo: Se considerará incumplimiento contractual y la empresa podrá iniciar acciones legales civiles y/o penales." },
    { title: "CLÁUSULA DE VALIDACIÓN DIGITAL", content: "Toda compra realizada en el sitio web constituye: ✔ Aceptación expresa del contrato, ✔ Firma electrónica válida, ✔ Consentimiento inequívoco, Sin necesidad de firma manuscrita." },
    { title: "CLÁUSULA DE ABUSO DEL DERECHO", content: "La empresa podrá rechazar reclamos cuando detecte: Conductas reiterativas de reclamo sin sustento, Uso indebido del libro de reclamaciones, Intentos de obtener beneficios económicos indebidos. Esto bajo el principio de prohibición del abuso del derecho." },
    { title: "CLÁUSULA DE PRODUCTOS IMPORTADOS", content: "El cliente reconoce que: Los productos son importados, Pueden existir variaciones respecto a referencias visuales y No constituyen defecto. Esto elimina reclamos por: 👉 “no era exactamente igual a la foto”." },
    { title: "CLÁUSULA DE PRUEBA PRECONSTITUIDA", content: "Los siguientes elementos tienen valor probatorio pleno: Videos de embalaje, Fotografías, Registros del sistema, Chats (WhatsApp, redes sociales). Esto es clave para defenderte ante INDECOPI." },
    { title: "CLÁUSULA DE RIESGO DEL PRODUCTO", content: "El cliente asume responsabilidad total por el uso de productos como: Humidificadores, Esencias, Quemadores. Incluyendo riesgos por: Mala instalación, Uso excesivo, Falta de mantenimiento." },
    { title: "CLÁUSULA DE NO GARANTÍA COMERCIAL EXTENDIDA", content: "La empresa no otorga garantías adicionales, salvo las mínimas exigidas por ley." },
    { title: "CLÁUSULA DE COSTOS OCULTOS / LOGÍSTICOS", content: "La empresa no asume: Costos de transporte, Reenvíos, Almacenaje en agencias, Costos por abandono del producto." },
    { title: "CLÁUSULA DE BLACKLIST COMERCIAL", content: "La empresa se reserva el derecho de: ❌ Bloquear clientes, ❌ Cancelar futuras compras en caso de: Reclamos maliciosos, Fraude, Conducta agresiva o abusiva." },
    { title: "CLÁUSULA DE INTERPRETACIÓN PRO-EMPRESA", content: "En caso de duda o ambigüedad: 👉 Se interpretará en el sentido más favorable a la continuidad operativa de la empresa." }
  ];

  return (
    <>
      <Helmet>
        <title>Términos y Condiciones | GO SHOPPING</title>
        <meta name="description" content="Términos, condiciones y políticas legales de Importaciones Go Shopping (Importaciones Puno S.R.L.)" />
      </Helmet>

      <section className="bg-background-soft py-16 px-4 md:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-strong p-8 md:p-16 border border-border-light"
          >
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Marco Legal</span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-accent italic mb-6">
                Términos, Condiciones y Políticas Legales
              </h1>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-8"></div>
              
              <div className="bg-beige-soft rounded-2xl p-6 text-left border border-border-light max-w-2xl mx-auto">
                <p className="text-xs font-bold text-accent uppercase tracking-widest mb-4">Información de la Empresa</p>
                <ul className="space-y-2 text-sm text-text-main">
                  <li><span className="font-bold text-accent">Razón Social:</span> Importaciones Puno S.R.L.</li>
                  <li><span className="font-bold text-accent">Nombre Comercial:</span> Go Shopping</li>
                  <li><span className="font-bold text-accent">RUC:</span> 20601880904</li>
                 {/*<li><span className="font-bold text-accent">Domicilio:</span> Calle Lima N° 332 Interior, Cercado, Puno, Perú</li>*/}
                </ul>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed space-y-12">
              <p className="text-center italic text-text-muted">
                La presente página establece las condiciones legales, contractuales y administrativas que regulan el acceso, navegación y uso del sitio web <a href="https://www.goshopping.pe/" className="text-primary font-bold">https://www.goshopping.pe/</a>. El uso del sitio implica la aceptación plena, expresa e irrevocable de todos los términos aquí contenidos.
              </p>

              <div id="terminos" className="space-y-10">
                {sections.map((s, idx) => (
                  <motion.div 
                    key={idx}
                    id={s.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="border-l-2 border-primary/20 pl-6 py-2"
                  >
                    <h2 className="font-serif text-xl font-bold text-accent mb-3 uppercase tracking-wide">{s.title}</h2>
                    <p className="text-sm line-height-relaxed">{s.content}</p>
                  </motion.div>
                ))}
              </div>

              {/* Special Clauses */}
              <div id="clausulas" className="pt-16 border-t border-border-light">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary italic lowercase">Cláusulas Especiales</h2>
                  <p className="text-xs text-text-muted uppercase tracking-[0.2em] mt-2">Protección y Garantías Adicionales</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {clauses.map((c, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="bg-beige-soft/50 rounded-3xl p-8 border border-border-light hover:border-primary transition-all duration-300 shadow-soft"
                    >
                      <h3 className="font-bold text-accent text-sm mb-3 flex items-center gap-2">
                        <span className="size-2 bg-primary rounded-full"></span>
                        {c.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{c.content}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-16 text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-6">Última actualización: Abril 2026</p>
             { /*  <button 
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-bold text-xs uppercase tracking-widest border-b border-primary/20 pb-1"
                >
                  <span className="material-symbols-outlined text-sm">print</span> Imprimir Documento Legal
                </button> */}
              
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
