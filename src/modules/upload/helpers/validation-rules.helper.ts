import dayjs from 'dayjs';

export interface PrescriptionCsvRecord {
  id: string;
  date: string;
  patient_cpf: string;
  doctor_crm: string;
  doctor_uf: string;
  medication: string;
  controlled: string;
  dosage: string;
  duration: string;
  frequency: string;
  notes: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorField?: string;
  errorMessage?: string;
  value?: string;
  validatedData?: any;
}

export function validatePrescription(
  record: PrescriptionCsvRecord,
): ValidationResult {
  const requiredFields = [
    'id',
    'date',
    'patient_cpf',
    'doctor_crm',
    'doctor_uf',
    'medication',
    'controlled',
    'dosage',
    'frequency',
    'duration',
  ];

  for (const field of requiredFields) {
    if (!record[field]) {
      return {
        isValid: false,
        errorField: field,
        errorMessage: `${field} is a required field.`,
        value: record[field],
      };
    }
  }

  const date = dayjs(record.date, 'YYYY-MM-DD');
  if (!date.isValid() || date.isAfter(dayjs())) {
    return {
      isValid: false,
      errorField: 'date',
      errorMessage: 'Invalid date or future date.',
      value: record.date,
    };
  }

  if (!/^\d{11}$/.test(record.patient_cpf)) {
    return {
      isValid: false,
      errorField: 'patient_cpf',
      errorMessage: 'CPF must have exactly 11 digits.',
      value: record.patient_cpf,
    };
  }

  if (!/^\d+$/.test(record.doctor_crm)) {
    return {
      isValid: false,
      errorField: 'doctor_crm',
      errorMessage: 'CRM must contain only numbers.',
      value: record.doctor_crm,
    };
  }

  const validUFs = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];
  if (!validUFs.includes(record.doctor_uf)) {
    return {
      isValid: false,
      errorField: 'doctor_uf',
      errorMessage: 'Invalid UF.',
      value: record.doctor_uf,
    };
  }

  const frequency = parseFloat(record.frequency);
  if (isNaN(frequency) || frequency <= 0) {
    return {
      isValid: false,
      errorField: 'frequency',
      errorMessage: 'Frequency must be a positive number.',
      value: record.frequency,
    };
  }

  const duration = parseInt(record.duration, 10);
  if (isNaN(duration) || duration <= 0 || duration > 90) {
    return {
      isValid: false,
      errorField: 'duration',
      errorMessage: 'Duration must be a positive number up to 90 days.',
      value: record.duration,
    };
  }

  const isControlled = record.controlled == 'True';
  if (isControlled) {
    if (!record.notes) {
      return {
        isValid: false,
        errorField: 'notes',
        errorMessage: 'Controlled medications require notes.',
        value: record.notes,
      };
    }
    if (duration > 60) {
      return {
        isValid: false,
        errorField: 'duration',
        errorMessage:
          'Duration for controlled medication cannot exceed 60 days.',
        value: record.duration,
      };
    }
  }

  return {
    isValid: true,
    validatedData: {
      id: record.id,
      date: date.toDate(),
      patient_cpf: record.patient_cpf,
      doctor_crm: record.doctor_crm,
      doctor_uf: record.doctor_uf,
      medication: record.medication,
      controlled: isControlled,
      dosage: record.dosage,
      frequency: frequency,
      duration: duration,
      notes: record.notes || null,
    },
  };
}
