import http from 'k6/http';
import { sleep, check } from 'k6';

// Configuração de Carga (escalonável para estresse: 10, 50, 100, 1000 VUs...)
export const options = {
  vus: 50000,          // 10 Usuários Virtuais simultâneos
  duration: '30s',  // Duração total do teste
};

export default function () {
  // IMPORTANTE: Apontem para a rota real da aplicação
  const res = http.get('http://localhost:3000/locais/');

  // Validações automatizadas (Checks)
  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}