export const transferSapiSchema = {
  sapiId: {
    required: true,
  },
  tujuanId: {
    required: true,
  },
  tanggalTransfer: {
    required: true,
  },
};

export function validateTransferSapi(data: any) {
  const errors: Record<string, string> = {};

  if (!data.sapiId) {
    errors.sapiId = "Pilih sapi";
  }

  if (!data.tujuanId) {
    errors.tujuanId = "Pilih tujuan transfer";
  }

  if (!data.tanggalTransfer) {
    errors.tanggalTransfer = "Tanggal transfer harus diisi";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
