function formatarData(data: Date): string {
  // Usa getters locais (e nao toISOString) para evitar a virada de dia por fuso horario
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // getMonth() comeca em 0
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function numeroAleatorio(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function gerarPeriodoReserva(
  { minDias = 30, maxDias = 365, noites = 1 } = {}
): { checkin: string; checkout: string } {
  const checkin = new Date();
  checkin.setDate(checkin.getDate() + numeroAleatorio(minDias, maxDias));

  const checkout = new Date(checkin); // copia, para nao alterar o checkin
  checkout.setDate(checkout.getDate() + noites);

  return { checkin: formatarData(checkin), checkout: formatarData(checkout) };
}