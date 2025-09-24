import z from 'zod';

// id: único no sistema
// date: data válida
// patient_cpf: 11 dígitos
// doctor_crm: apenas números
// doctor_uf: UF válida (2 letras)
// medication: obrigatório
// controlled: boolean (quando vazio considerar false)
// dosage: obrigatório
// duration: obrigatório
// frequency: número positivo

export const uploadInputSchema = z.object({
  id: z.string().uuid(),
  data: z.date(),
  patient_cpf: z.string().min(11),
  doctor_crm: z.number(),
  doctor_uf: z.string().max(2),
  medication: z.string(),
  controlled: z.boolean(),
  dosage: z.string(),
  duration: z.number().max(90),
  frequency: z.number().positive(),
});
