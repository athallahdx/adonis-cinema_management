import type { HttpContext } from '@adonisjs/core/http'
import Film from '#models/film'
import Studio from '#models/studio'
import { scheduleValidator } from '#validators/schedule'
import Schedule from '#models/schedule'

export default class SchedulesController {
  async index({ view }: HttpContext) {
    const schedules = await Schedule.query().preload('film').preload('studio').orderBy('date', 'desc')
    return view.render('pages/admin/schedule/index', { schedules })
  }

  async create({ view }: HttpContext) {
    const films = await Film.all()
    const studios = await Studio.all()
    return view.render('pages/admin/schedule/create', { films, studios })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(scheduleValidator)
    await Schedule.create(payload)

    session.flash({ success: 'Schedule Created Successfully.' })
    return response.redirect().toRoute('schedules.index')
  }

  async edit({ params, view }: HttpContext) {
    const schedule = await Schedule.findOrFail(params.id)
    const films = await Film.all()
    const studios = await Studio.all()
    return view.render('pages/admin/schedule/edit', { schedule, films, studios })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schedule = await Schedule.findOrFail(params.id)
    const payload = await request.validateUsing(scheduleValidator)

    schedule.merge(payload)
    await schedule.save()

    session.flash({ success: 'Schedule Updated Successfully.' })
    return response.redirect().toRoute('schedules.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schedule = await Schedule.findOrFail(params.id)
    await schedule.delete()

    session.flash({ success: 'Schedule Deleted Successfully.' })
    return response.redirect().toRoute('schedules.index')
  }
}
