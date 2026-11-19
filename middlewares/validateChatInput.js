// Middleware validasi input chat pengguna untuk AI Assistant
import Joi from 'joi';

const chatInputSchema = Joi.object({
  message: Joi.string().trim().min(1).max(500).required().messages({
    'string.base': 'Pesan harus berupa teks.',
    'string.empty': 'Pesan pertanyaan tidak boleh kosong.',
    'string.min': 'Pesan pertanyaan terlalu pendek.',
    'string.max': 'Pesan pertanyaan maksimal 500 karakter.',
    'any.required': 'Field message wajib disertakan.'
  })
});

export function validateChatInput(req, res, next) {
  const { error, value } = chatInputSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(d => d.message).join(' ');
    return res.status(400).json({
      success: false,
      status: 'error',
      code: 400,
      message: errorMessages
    });
  }

  req.body = value;
  next();
}

export default validateChatInput;
