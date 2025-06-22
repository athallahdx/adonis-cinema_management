import type { HttpContext } from '@adonisjs/core/http'
import Ticket from '#models/ticket'

export default class TicketsController {
  async index({ view }: HttpContext) {
    const tickets = await Ticket.query()
      .preload('user')
      .preload('schedule', (query) => {
        query.preload('film').preload('studio')
      })
      .orderBy('created_at', 'desc')

    return view.render('pages/admin/tickets/index', { tickets })
  }

  /**
   * Menghapus/membatalkan tiket.
   */
  async destroy({ params, response, session }: HttpContext) {
    const ticket = await Ticket.findOrFail(params.id)
    await ticket.delete()

    session.flash({ success: 'Ticket successfully deleted.' })
    return response.redirect().back()
  }
}
