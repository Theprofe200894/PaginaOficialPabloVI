window.onload = () => {
  const { jsPDF } = window.jspdf;

  const form = document.getElementById('preinscripcionForm');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const estudianteNombre = form.estudianteNombre.value.trim();
    const estudianteFechaNacimiento = form.estudianteFechaNacimiento.value;
    const estudianteEdad = form.estudianteEdad.value.trim();
    const estudianteGenero = form.estudianteGenero.value || form.querySelector('input[name="estudianteGenero"]:checked')?.value;
    const estudianteDireccion = form.estudianteDireccion.value.trim();
    const estudianteTelefono = form.estudianteTelefono.value.trim() || 'No proporcionado';
    const estudianteNivelGrado = form.estudianteNivelGrado.value;
    const cartaBuenaConducta = form.cartaBuenaConducta.checked ? 'Sí' : 'No';

    const encargadoNombre = form.encargadoNombre.value.trim();
    const encargadoDPI = form.encargadoDPI.value.trim();
    const encargadoParentesco = form.encargadoParentesco.value;
    const encargadoTelefonoCelular = form.encargadoTelefonoCelular.value.trim() || 'No proporcionado';
    const encargadoTelefonoCasa = form.encargadoTelefonoCasa.value.trim() || 'No proporcionado';
    const encargadoDireccion = form.encargadoDireccion.value.trim() || 'Igual que el estudiante';
    const encargadoEmail = form.encargadoEmail.value.trim() || 'No proporcionado';

    // Crear documento PDF tamaño carta (8.5 x 11 pulgadas = 612 x 792 puntos)
    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter'
    });

    const marginLeft = 40;
    const marginRight = 40;
    const pageWidth = 612;
    const maxWidth = pageWidth - marginLeft - marginRight;
    let y = 50;
    const lineHeight = 16;

    // Título centrado
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Comprobante de Preinscripción', pageWidth / 2, y, null, null, 'center');
    y += 30;

    const addText = (label, value) => {
      doc.setFont(undefined, 'bold');
      doc.setFontSize(12);
      doc.text(label + ':', marginLeft, y);
      y += lineHeight - 4;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(value, maxWidth);
      doc.text(splitText, marginLeft, y);
      y += splitText.length * lineHeight;
      y += 6;
    };

    // Sección: Información del Estudiante
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('🔹 Información del Estudiante', marginLeft, y);
    y += lineHeight + 6;

    addText('Nombres y apellidos completos', estudianteNombre);
    addText('Fecha de nacimiento', new Date(estudianteFechaNacimiento).toLocaleDateString('es-PE'));
    addText('Edad', estudianteEdad);
    addText('Género', estudianteGenero);
    addText('Dirección de residencia', estudianteDireccion);
    addText('Teléfono de contacto (WhatsApp)', estudianteTelefono);
    addText('Nivel y grado al que desea ingresar', estudianteNivelGrado);
    addText('Cuenta con Carta de buena conducta', cartaBuenaConducta);

    // Sección: Información del Padre, Madre o Encargado
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('🔹 Información del Padre, Madre o Encargado', marginLeft, y);
    y += lineHeight + 6;

    addText('Nombres y apellidos completos', encargadoNombre);
    addText('Número de DPI', encargadoDPI);
    addText('Parentesco con el estudiante', encargadoParentesco);

    // Teléfonos de contacto sin salto de línea problemático
    const telefonos = [
      `Celular: ${encargadoTelefonoCelular}`,
      `Casa: ${encargadoTelefonoCasa}`
    ];
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('Teléfonos de contacto:', marginLeft, y);
    y += lineHeight - 4;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    telefonos.forEach(line => {
      const splitLine = doc.splitTextToSize(line, maxWidth);
      doc.text(splitLine, marginLeft + 15, y);
      y += splitLine.length * lineHeight;
    });
    y += 6;

    addText('Dirección de residencia', encargadoDireccion);
    addText('Correo electrónico', encargadoEmail);

    // Nota final
    y += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const nota = 'Este comprobante es válido para el proceso de inscripción en la Escuela Particular Mixta Pablo VI.';
    const splitNota = doc.splitTextToSize(nota, maxWidth);
    doc.text(splitNota, marginLeft, y);

    // Firma simulada
    y += splitNota.length * lineHeight + 30;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, y, marginLeft + 120, y);
    doc.text('Firma del responsable', marginLeft, y + 14);

    // Fecha de emisión
    const fechaEmision = new Date().toLocaleDateString('es-PE');
    doc.text(`Fecha de emisión: ${fechaEmision}`, pageWidth - marginRight - 150, y + 14);

    // Guardar PDF
    const nombreArchivo = `Comprobante_Preinscripcion_${estudianteNombre.replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);
  });
};
