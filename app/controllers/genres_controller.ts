import type { HttpContext } from '@adonisjs/core/http'
import Genre from '#models/genre'
import { genreValidator } from '#validators/genre'

export default class GenresController {
  async index({ view }: HttpContext) {
    const genres = await Genre.query().orderBy('name', 'asc')
    return view.render('pages/admin/genres/index', { genres })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/genres/create')
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(genreValidator)
    await Genre.create(payload)
    session.flash('success', 'New Genre Created Successfully.')
    return response.redirect().toRoute('genres.index')
  }

  async edit({ params, view }: HttpContext) {
    const genre = await Genre.findOrFail(params.id)
    return view.render('pages/admin/genres/edit', { genre })
  }

  async update({ params, request, response, session }: HttpContext) {
    const genre = await Genre.findOrFail(params.id)
    const payload = await request.validateUsing(genreValidator, {
      meta: {
        id: genre.id
      }
    })
    
    genre.merge(payload)
    await genre.save()
    session.flash('success', 'Genre Updated Successfully.')
    return response.redirect().toRoute('genres.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const genre = await Genre.findOrFail(params.id)
    await genre.delete()
    session.flash('success', 'Genre Deleted Successfully.')
    return response.redirect().back()
  }
}
