import vine from '@vinejs/vine'

export const filmValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    director: vine.string().trim().minLength(3),
    year: vine.number().min(1900).max(new Date().getFullYear() + 1),
    genreId: vine.number().exists(async (db, value) => {
      const genre = await db.from('genres').where('id', value).first()
      return !!genre
    }),
  })
)
