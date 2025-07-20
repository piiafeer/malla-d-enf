const ramos = document.querySelectorAll('.ramo');

function getEstado(id) {
  return localStorage.getItem(`ramo-${id}`) || 'pendiente';
}

function setEstado(id, estado) {
  localStorage.setItem(`ramo-${id}`, estado);
}

function actualizarEstados() {
  let aprobados = 0;
  ramos.forEach(ramo => {
    const id = ramo.dataset.id;
    const prereqs = ramo.dataset.prereqs ? ramo.dataset.prereqs.split(',') : [];
    const estado = getEstado(id);
    ramo.classList.remove('aprobado', 'cursando', 'bloqueado');

    const prereqsAprobados = prereqs.every(pid => getEstado(pid) === 'aprobado');
    if (!prereqsAprobados) {
      ramo.classList.add('bloqueado');
      return;
    }

    if (estado === 'aprobado') {
      ramo.classList.add('aprobado');
      aprobados++;
    } else if (estado === 'cursando') {
      ramo.classList.add('cursando');
    }
  });

  const progreso = (aprobados / ramos.length) * 100;
  document.getElementById('progress-bar').style.width = `${progreso}%`;
  document.getElementById('progress-text').textContent = `${Math.round(progreso)}% completado`;
}

ramos.forEach(ramo => {
  ramo.addEventListener('click', () => {
    if (ramo.classList.contains('bloqueado')) return;
    const id = ramo.dataset.id;
    const estado = getEstado(id);
    const nuevoEstado = estado === 'aprobado' ? 'pendiente'
                      : estado === 'cursando' ? 'aprobado'
                      : 'cursando';
    setEstado(id, nuevoEstado);
    actualizarEstados();
  });
});

actualizarEstados();
