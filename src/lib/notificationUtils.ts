export const formatNotificationType = (type: string): string => {
  const typeMap: Record<string, string> = {
    GOAL_UPDATE: "Atualização de Meta",
    CONSULTATION_REMINDER: "Lembrete de Consulta",
    GENERAL_INFO: "Informação Geral",
    NEW_MEDICAL_RECORD: "Novo Registro Médico",
  };

  return typeMap[type] || type;
};

