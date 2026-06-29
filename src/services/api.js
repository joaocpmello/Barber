import { supabase } from '../lib/supabaseClient';

// ============================================
// 📡 API Service — Mineiro Barbearia
// ============================================

/**
 * Busca todos os serviços ativos.
 */
export async function fetchServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('ativo', true)
    .order('preco', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Busca todos os barbeiros ativos.
 */
export async function fetchBarbers() {
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .eq('ativo', true)
    .order('nome', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Busca agendamentos existentes de um barbeiro em uma data específica.
 * Usado para calcular horários indisponíveis.
 */
export async function fetchAppointmentsByBarberAndDate(barberId, dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const end = new Date(y, m - 1, d, 23, 59, 59, 999);

  const { data, error } = await supabase
    .from('appointments')
    .select('data_hora, services(duracao_minutos)')
    .eq('barber_id', barberId)
    .in('status', ['pendente', 'confirmado'])
    .gte('data_hora', start.toISOString())
    .lte('data_hora', end.toISOString());

  if (error) throw error;
  return data;
}

/**
 * Busca todos os agendamentos de uma data com dados de barbeiro e serviço.
 * Usado pelo painel admin.
 */
export async function fetchAppointmentsByDate(date) {
  const [y, m, d] = date.split('-').map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const end = new Date(y, m - 1, d, 23, 59, 59, 999);

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      barbers (id, nome, foto_url, especialidade),
      services (id, nome, preco, duracao_minutos)
    `)
    .gte('data_hora', start.toISOString())
    .lte('data_hora', end.toISOString())
    .order('data_hora', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Atualiza o status de um agendamento.
 */
export async function updateAppointmentStatus(id, status) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Cria um novo agendamento.
 * Aceita tanto payload com chaves camelCase (do wizard) quanto já em snake_case.
 */
export async function createAppointment(payload) {
  const row = {
    barber_id: payload.barberId ?? payload.barber_id,
    service_id: payload.serviceId ?? payload.service_id,
    cliente_nome: payload.clienteNome ?? payload.cliente_nome,
    cliente_whatsapp: payload.clienteWhatsapp ?? payload.cliente_whatsapp,
    data_hora: payload.dataHora ?? payload.data_hora,
    observacoes: payload.observacoes ?? null,
    status: payload.status ?? 'pendente',
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return data;
}
