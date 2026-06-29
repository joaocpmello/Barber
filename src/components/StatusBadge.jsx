const STATUS_MAP = {
  pendente: {
    label: '⏳ Pendente',
    classes: 'bg-warning/20 text-warning',
  },
  confirmado: {
    label: '✅ Confirmado',
    classes: 'bg-success/20 text-success',
  },
  cancelado: {
    label: '❌ Cancelado',
    classes: 'bg-error/20 text-error',
  },
  concluido: {
    label: '✔️ Concluído',
    classes: 'bg-info/20 text-info',
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.pendente;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
