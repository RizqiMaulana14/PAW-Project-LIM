// Middleware validasi request menggunakan library JOI
import Joi from 'joi';

// Skema validasi tambah produk (POST /api/produk)
export const createProductSchema = Joi.object({
  nama: Joi.string().trim().min(1).max(255).messages({
    'string.base': 'Nama/Judul buku harus berupa teks.',
    'string.empty': 'Nama/Judul buku tidak boleh kosong.',
    'string.max': 'Nama/Judul buku maksimal 255 karakter.'
  }),
  title: Joi.string().trim().min(1).max(255).messages({
    'string.base': 'Judul buku harus berupa teks.',
    'string.empty': 'Judul buku tidak boleh kosong.',
    'string.max': 'Judul buku maksimal 255 karakter.'
  }),
  penulis: Joi.string().trim().min(1).max(255).messages({
    'string.base': 'Penulis buku harus berupa teks.',
    'string.empty': 'Penulis buku tidak boleh kosong.',
    'string.max': 'Penulis buku maksimal 255 karakter.'
  }),
  author: Joi.string().trim().min(1).max(255).messages({
    'string.base': 'Penulis buku harus berupa teks.',
    'string.empty': 'Penulis buku tidak boleh kosong.',
    'string.max': 'Penulis buku maksimal 255 karakter.'
  }),
  kode: Joi.string().trim().max(50).optional().allow('', null).messages({
    'string.base': 'Kode buku harus berupa teks.',
    'string.max': 'Kode buku maksimal 50 karakter.'
  }),
  kategori_id: Joi.number().integer().positive().optional().allow(null, '').messages({
    'number.base': 'Kategori ID harus berupa angka bulat positif.',
    'number.positive': 'Kategori ID harus berupa angka positif.'
  }),
  kategori: Joi.string().trim().max(100).optional().allow('', null),
  category: Joi.string().trim().max(100).optional().allow('', null),
  status: Joi.string().valid('Tersedia', 'Dipinjam').default('Tersedia').messages({
    'any.only': 'Status harus berupa salah satu dari: Tersedia, Dipinjam.'
  }),
  lokasi_rak: Joi.string().trim().max(100).optional().allow('', null),
  lokasiRak: Joi.string().trim().max(100).optional().allow('', null),
  tahun: Joi.number().integer().min(1000).max(2100).optional().allow(null, '').messages({
    'number.base': 'Tahun terbit harus berupa angka.',
    'number.min': 'Tahun terbit minimal tahun 1000.',
    'number.max': 'Tahun terbit maksimal tahun 2100.'
  }),
  cover_bg: Joi.string().trim().max(255).optional().allow('', null),
  coverBg: Joi.string().trim().max(255).optional().allow('', null),
  deskripsi: Joi.string().trim().optional().allow('', null),
  description: Joi.string().trim().optional().allow('', null)
})
  .or('nama', 'title')
  .or('penulis', 'author')
  .messages({
    'object.missing': 'Field judul (nama) dan penulis (penulis) wajib diisi.'
  });

// Skema validasi update produk (PUT /api/produk/:id)
export const updateProductSchema = Joi.object({
  nama: Joi.string().trim().min(1).max(255).optional().messages({
    'string.base': 'Nama/Judul buku harus berupa teks.',
    'string.empty': 'Nama/Judul buku tidak boleh kosong.'
  }),
  title: Joi.string().trim().min(1).max(255).optional(),
  penulis: Joi.string().trim().min(1).max(255).optional().messages({
    'string.base': 'Penulis buku harus berupa teks.',
    'string.empty': 'Penulis buku tidak boleh kosong.'
  }),
  author: Joi.string().trim().min(1).max(255).optional(),
  kode: Joi.string().trim().max(50).optional().allow('', null),
  kategori_id: Joi.number().integer().positive().optional().allow(null, '').messages({
    'number.base': 'Kategori ID harus berupa angka bulat positif.'
  }),
  kategori: Joi.string().trim().max(100).optional().allow('', null),
  category: Joi.string().trim().max(100).optional().allow('', null),
  status: Joi.string().valid('Tersedia', 'Dipinjam').optional().messages({
    'any.only': 'Status harus bernilai Tersedia atau Dipinjam.'
  }),
  lokasi_rak: Joi.string().trim().max(100).optional().allow('', null),
  lokasiRak: Joi.string().trim().max(100).optional().allow('', null),
  tahun: Joi.number().integer().min(1000).max(2100).optional().allow(null, '').messages({
    'number.base': 'Tahun terbit harus berupa angka.',
    'number.min': 'Tahun terbit minimal tahun 1000.',
    'number.max': 'Tahun terbit maksimal tahun 2100.'
  }),
  cover_bg: Joi.string().trim().max(255).optional().allow('', null),
  coverBg: Joi.string().trim().max(255).optional().allow('', null),
  deskripsi: Joi.string().trim().optional().allow('', null),
  description: Joi.string().trim().optional().allow('', null)
})
  .min(1)
  .messages({
    'object.min': 'Setidaknya satu field harus dikirim untuk diperbarui.'
  });

// Skema validasi parameter ID/Kode produk (:id)
export const productIdParamSchema = Joi.object({
  id: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.string().trim().min(1).max(50)
  ).required().messages({
    'alternatives.types': 'Parameter ID/Kode produk harus berupa angka bulat positif atau string kode yang valid.',
    'any.required': 'Parameter ID/Kode produk wajib disertakan pada URL.'
  })
});

// Skema validasi tambah transaksi peminjaman (POST /api/peminjaman)
export const createLoanSchema = Joi.object({
  bookId: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.string().trim().min(1)
  ).required().messages({
    'any.required': 'Parameter bookId wajib diisi.',
    'alternatives.types': 'bookId harus berupa angka ID atau string kode buku.'
  }),
  peminjamNama: Joi.string().trim().max(150).optional().allow('', null).messages({
    'string.base': 'Nama peminjam harus berupa teks.',
    'string.max': 'Nama peminjam maksimal 150 karakter.'
  }),
  startDate: Joi.string().trim().max(100).optional().allow('', null),
  endDate: Joi.string().trim().max(100).optional().allow('', null)
});

// Skema validasi parameter ID peminjaman (:id)
export const loanIdParamSchema = Joi.object({
  id: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.string().trim().min(1).max(50)
  ).required().messages({
    'any.required': 'Parameter ID peminjaman wajib disertakan.',
    'alternatives.types': 'ID peminjaman harus berupa angka ID atau string kode.'
  })
});

// Helper middleware validasi otomatis JOI
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: false
    });

    if (error) {
      const errorDetails = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        status: 'error',
        code: 400,
        message: `Validasi gagal: ${error.details[0].message}`,
        errors: errorDetails
      });
    }

    req[source] = value;
    next();
  };
};

export default {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  createLoanSchema,
  loanIdParamSchema,
  validate
};
