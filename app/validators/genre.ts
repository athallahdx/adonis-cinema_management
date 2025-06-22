import vine from '@vinejs/vine'

export const genreValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).unique(async (db, value, field) => {
      const query = db.from('genres').where('name', value)
      
      if (field.meta.id) {
        query.whereNot('id', field.meta.id)
      }
      
      const genre = await query.first()
      return !genre
    }),
  })
)