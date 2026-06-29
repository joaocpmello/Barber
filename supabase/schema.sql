-- ============================================
-- 🏪 MINEIRO BARBEARIA - Database Schema
-- Supabase (PostgreSQL)
-- ============================================

-- Habilita a extensão UUID (já vem habilitada no Supabase, mas garantimos)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABELA: barbers (Barbeiros)
-- ============================================
CREATE TABLE barbers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome        TEXT NOT NULL,
  foto_url    TEXT,
  especialidade TEXT,
  ativo       BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE barbers IS 'Cadastro dos barbeiros da barbearia';
COMMENT ON COLUMN barbers.nome IS 'Nome completo do barbeiro';
COMMENT ON COLUMN barbers.foto_url IS 'URL da foto de perfil do barbeiro';
COMMENT ON COLUMN barbers.especialidade IS 'Especialidade principal (ex: degradê, barba, etc.)';
COMMENT ON COLUMN barbers.ativo IS 'Indica se o barbeiro está ativo para agendamentos';

-- ============================================
-- 2. TABELA: services (Serviços)
-- ============================================
CREATE TABLE services (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome            TEXT NOT NULL,
  preco           NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  duracao_minutos INTEGER NOT NULL CHECK (duracao_minutos > 0),
  ativo           BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE services IS 'Catálogo de serviços oferecidos pela barbearia';
COMMENT ON COLUMN services.nome IS 'Nome do serviço (ex: Corte Masculino, Barba, etc.)';
COMMENT ON COLUMN services.preco IS 'Preço do serviço em reais (R$)';
COMMENT ON COLUMN services.duracao_minutos IS 'Duração estimada do serviço em minutos';
COMMENT ON COLUMN services.ativo IS 'Indica se o serviço está disponível para agendamento';

-- ============================================
-- 3. TABELA: appointments (Agendamentos)
-- ============================================
CREATE TABLE appointments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id         UUID NOT NULL REFERENCES barbers(id) ON DELETE RESTRICT,
  service_id        UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  cliente_nome      TEXT NOT NULL,
  cliente_whatsapp  TEXT NOT NULL,
  data_hora         TIMESTAMPTZ NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pendente'
                    CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido')),
  observacoes       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE appointments IS 'Agendamentos dos clientes';
COMMENT ON COLUMN appointments.barber_id IS 'Barbeiro responsável pelo atendimento';
COMMENT ON COLUMN appointments.service_id IS 'Serviço agendado';
COMMENT ON COLUMN appointments.cliente_nome IS 'Nome do cliente';
COMMENT ON COLUMN appointments.cliente_whatsapp IS 'WhatsApp do cliente para contato';
COMMENT ON COLUMN appointments.data_hora IS 'Data e horário do agendamento';
COMMENT ON COLUMN appointments.status IS 'Status: pendente | confirmado | cancelado | concluido';
COMMENT ON COLUMN appointments.observacoes IS 'Observações adicionais do cliente';

-- ============================================
-- 4. ÍNDICES para performance
-- ============================================

-- Buscar agendamentos por barbeiro e data (consulta mais frequente)
CREATE INDEX idx_appointments_barber_data 
  ON appointments (barber_id, data_hora);

-- Buscar agendamentos por status
CREATE INDEX idx_appointments_status 
  ON appointments (status);

-- Buscar agendamentos por data (agenda do dia)
CREATE INDEX idx_appointments_data_hora 
  ON appointments (data_hora);

-- Filtrar barbeiros e serviços ativos
CREATE INDEX idx_barbers_ativo ON barbers (ativo);
CREATE INDEX idx_services_ativo ON services (ativo);

-- ============================================
-- 5. FUNÇÃO: Atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para auto-update do campo updated_at
CREATE TRIGGER trigger_barbers_updated_at
  BEFORE UPDATE ON barbers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilita RLS em todas as tabelas
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública (qualquer um pode ver barbeiros e serviços)
CREATE POLICY "Barbeiros visíveis publicamente"
  ON barbers FOR SELECT
  USING (true);

CREATE POLICY "Serviços visíveis publicamente"
  ON services FOR SELECT
  USING (true);

-- Políticas de agendamentos
CREATE POLICY "Agendamentos visíveis publicamente"
  ON appointments FOR SELECT
  USING (true);

CREATE POLICY "Qualquer um pode criar agendamento"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar agendamento"
  ON appointments FOR UPDATE
  USING (true);

-- ============================================
-- 7. DADOS INICIAIS (Seed)
-- ============================================

-- Barbeiros de exemplo
INSERT INTO barbers (nome, foto_url, especialidade) VALUES
  ('Carlos Silva',   'https://i.pravatar.cc/300?img=12', 'Degradê e Cortes Modernos'),
  ('Rafael Oliveira', 'https://i.pravatar.cc/300?img=11', 'Barba e Bigode'),
  ('Lucas Santos',   'https://i.pravatar.cc/300?img=14', 'Corte Infantil e Adulto');

-- Serviços disponíveis
INSERT INTO services (nome, preco, duracao_minutos) VALUES
  ('Corte Masculino',       35.00, 30),
  ('Barba',                 25.00, 20),
  ('Corte + Barba',         55.00, 50),
  ('Sobrancelha',           15.00, 10),
  ('Hidratação Capilar',    40.00, 30),
  ('Corte Infantil',        30.00, 25);
