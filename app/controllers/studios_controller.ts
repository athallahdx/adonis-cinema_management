import type { HttpContext } from '@adonisjs/core/http'
import Studio from '#models/studio'
import { studioValidator } from '#validators/studio'

export default class StudiosController {
  async index({ view }: HttpContext) {
    const studios = await Studio.query().orderBy('name', 'asc')
    return view.render('pages/admin/studios/index', { studios })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/studios/create')
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(studioValidator)
    await Studio.create(payload)
    session.flash('success', 'New Studio Created Successfully.')
    return response.redirect().toRoute('studios.index')
  }

  async edit({ params, view }: HttpContext) {
    const studio = await Studio.findOrFail(params.id)
    return view.render('pages/admin/studios/edit', { studio })
  }

  async update({ params, request, response, session }: HttpContext) {
    const studio = await Studio.findOrFail(params.id)
    const payload = await request.validateUsing(studioValidator, {
      meta: {
        id: studio.id,
      },
    })

    studio.merge(payload)
    await studio.save()
    session.flash('success', 'Studio Updated Successfully.')
    return response.redirect().toRoute('studios.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const studio = await Studio.findOrFail(params.id)
    await studio.delete()
    session.flash('success', 'Studio Deleted Successfully.')
    return response.redirect().back()
  }
}
