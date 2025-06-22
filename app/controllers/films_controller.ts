import type { HttpContext } from '@adonisjs/core/http'
import Film from '#models/film'
import Genre from '#models/genre'
import { filmValidator } from '#validators/film'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs'

export default class FilmsController {
  async index({ view }: HttpContext) {
    const films = await Film.query().preload('genre').orderBy('created_at', 'desc')
    return view.render('pages/admin/films/index', { films })
  }

  async create({ view }: HttpContext) {
    const genres = await Genre.all()
    return view.render('pages/admin/films/create', { genres })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(filmValidator)
    const imageFile = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    const film = new Film()
    film.title = payload.title
    film.director = payload.director
    film.year = payload.year
    film.genreId = payload.genreId

    if (imageFile) {
      const fileName = `${cuid()}.${imageFile.extname}`
      await imageFile.move(app.publicPath('uploads'), { name: fileName })
      film.image = `uploads/${fileName}`
    }

    await film.save()

    session.flash('success', 'Film Succesfully Created.')
    return response.redirect().toRoute('films.index')
  }

  /**
   * Menampilkan form untuk mengedit film.
   */
  async edit({ params, view }: HttpContext) {
    const film = await Film.findOrFail(params.id)
    const genres = await Genre.all()
    return view.render('pages/admin/films/edit', { film, genres })
  }

  /**
   * Memperbarui data film di database.
   */
  async update({ params, request, response, session }: HttpContext) {
    const film = await Film.findOrFail(params.id)
    const payload = await request.validateUsing(filmValidator)
    const imageFile = request.file('poster', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    film.title = payload.title
    film.director = payload.director
    film.year = payload.year
    film.genreId = payload.genreId

    if (imageFile) {
      // Hapus poster lama jika ada
      if (film.image) {
        fs.unlink(app.publicPath(film.image), () => {})
      }
      const fileName = `${cuid()}.${imageFile.extname}`
      await imageFile.move(app.publicPath('uploads'), { name: fileName })
      film.image = `uploads/${fileName}`
    }

    await film.save()

    session.flash('success', 'Film Updated Successfully.')
    return response.redirect().toRoute('films.index')
  }

  /**
   * Menghapus film dari database.
   */
  async destroy({ params, response, session }: HttpContext) {
    const film = await Film.findOrFail(params.id)
    
    // Hapus poster dari storage jika ada
    if (film.image) {
      fs.unlink(app.publicPath(film.image), () => {})
    }
    
    await film.delete()

    session.flash('success', 'Film Deleted Successfully.')
    return response.redirect().back()
  }
}
