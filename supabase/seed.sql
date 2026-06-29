-- ============================================
-- 🌱 MINEIRO BARBEARIA - Seed Data
-- Cole no SQL Editor do Supabase após o schema
-- ============================================

-- Limpa dados existentes (ordem importa por causa das FKs)
TRUNCATE appointments CASCADE;
TRUNCATE services CASCADE;
TRUNCATE barbers CASCADE;

-- ============================================
-- 1. BARBEIROS (3)
-- ============================================
INSERT INTO barbers (id, nome, foto_url, especialidade) VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Carlos "Cadu" Silva',
    'https://i.pravatar.cc/300?img=12',
    'Degradê e Cortes Modernos'
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Rafael Oliveira',
    'https://i.pravatar.cc/300?img=11',
    'Barba Artística e Bigode'
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Lucas Santos',
    'https://i.pravatar.cc/300?img=14',
    'Corte Infantil e Coloração'
  );

-- ============================================
-- 2. SERVIÇOS (8)
-- ============================================
INSERT INTO services (id, nome, preco, duracao_minutos) VALUES
  (
    'b1b2c3d4-0001-4000-8000-000000000001',
    'Corte de Cabelo',
    35.00,
    30
  ),
  (
    'b1b2c3d4-0002-4000-8000-000000000002',
    'Barba Completa',
    25.00,
    20
  ),
  (
    'b1b2c3d4-0003-4000-8000-000000000003',
    'Corte + Barba',
    55.00,
    50
  ),
  (
    'b1b2c3d4-0004-4000-8000-000000000004',
    'Sobrancelha',
    15.00,
    10
  ),
  (
    'b1b2c3d4-0005-4000-8000-000000000005',
    'Barba + Sobrancelha',
    35.00,
    30
  ),
  (
    'b1b2c3d4-0006-4000-8000-000000000006',
    'Corte + Barba + Sobrancelha',
    65.00,
    60
  ),
  (
    'b1b2c3d4-0007-4000-8000-000000000007',
    'Hidratação Capilar',
    40.00,
    30
  ),
  (
    'b1b2c3d4-0008-4000-8000-000000000008',
    'Corte Infantil',
    30.00,
    25
  );

-- ============================================
-- 3. AGENDAMENTOS DE TESTE (2)
-- ============================================

-- Agendamento 1: João marcou Corte de Cabelo com o Cadu para amanhã às 10h
INSERT INTO appointments (barber_id, service_id, cliente_nome, cliente_whatsapp, data_hora, status, observacoes) VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',  -- Carlos "Cadu" Silva
    'b1b2c3d4-0001-4000-8000-000000000001',  -- Corte de Cabelo
    'João Pedro Mendes',
    '(31) 99876-5432',
    now() + INTERVAL '1 day' + TIME '10:00',
    'confirmado',
    'Quero o degradê igual da última vez'
  );

-- Agendamento 2: Maria marcou Sobrancelha com o Rafael para amanhã às 14h30
INSERT INTO appointments (barber_id, service_id, cliente_nome, cliente_whatsapp, data_hora, status, observacoes) VALUES
  (
    'a1b2c3d4-0002-4000-8000-000000000002',  -- Rafael Oliveira
    'b1b2c3d4-0004-4000-8000-000000000004',  -- Sobrancelha
    'Maria Clara Souza',
    '(31) 91234-5678',
    now() + INTERVAL '1 day' + TIME '14:30',
    'pendente',
    NULL
  );

-- ============================================
-- ✅ Verificação: consulte os dados inseridos
-- ============================================
SELECT '--- BARBEIROS ---' AS info;
SELECT id, nome, especialidade, ativo FROM barbers;

SELECT '--- SERVIÇOS ---' AS info;
SELECT id, nome, preco, duracao_minutos, ativo FROM services;

SELECT '--- AGENDAMENTOS ---' AS info;
SELECT 
  a.id,
  a.cliente_nome,
  a.cliente_whatsapp,
  b.nome AS barbeiro,
  s.nome AS servico,
  s.preco,
  a.data_hora,
  a.status
FROM appointments a
JOIN barbers b ON a.barber_id = b.id
JOIN services s ON a.service_id = s.id;
