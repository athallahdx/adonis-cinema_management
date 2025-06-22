import type { HttpContext } from '@adonisjs/core/http'
import Schedule from '#models/schedule'
import Genre from '#models/genre'
import Ticket from '#models/ticket'
import { DateTime } from 'luxon'

export default class DashboardController {
  async home({ view, request }: HttpContext) {
    const selectedDate = request.input('selectedDate', DateTime.now().toISODate())
    const selectedGenre = request.input('selectedGenre', '')

    console.log('=== DASHBOARD DEBUG ===')
    console.log('Selected date:', selectedDate)
    console.log('Selected genre:', selectedGenre)
    console.log('Current date (ISO):', DateTime.now().toISODate())

    try {
      // Build the query step by step
      let scheduleQuery = Schedule.query()
        .preload('film', (filmQuery) => {
          filmQuery.preload('genre')
        })
        .preload('studio')
        .preload('tickets')

      // Add date filter
      if (selectedDate) {
        scheduleQuery = scheduleQuery.where('date', selectedDate)
      }

      // Add genre filter if selected
      if (selectedGenre) {
        scheduleQuery = scheduleQuery.whereHas('film', (filmQuery) => {
          filmQuery.where('genre_id', selectedGenre)
        })
      }

      const schedules = await scheduleQuery.orderBy('time', 'asc')
      
      console.log('Total schedules found:', schedules.length)
      
      // Debug each schedule
      schedules.forEach((schedule, index) => {
        console.log(`Schedule ${index + 1}:`, {
          id: schedule.id,
          date: schedule.date,
          time: schedule.time,
          film: schedule.film?.title || 'No film',
          studio: schedule.studio?.name || 'No studio',
          ticketsCount: schedule.tickets?.length || 0
        })
      })

      // Group schedules by film
      const schedulesByFilm = schedules.reduce((acc, schedule) => {
        if (!schedule.film) {
          console.log('Warning: Schedule without film found:', schedule.id)
          return acc
        }

        const filmTitle = schedule.film.title
        if (!acc[filmTitle]) {
          acc[filmTitle] = {
            title: filmTitle,
            schedules: []
          }
        }
        acc[filmTitle].schedules.push(schedule)
        return acc
      }, {} as Record<string, { title: string; schedules: any[] }>)

      console.log('Films grouped:', Object.keys(schedulesByFilm))
      console.log('Total film groups:', Object.keys(schedulesByFilm).length)

      const genres = await Genre.all()
      console.log('Total genres:', genres.length)

      return view.render('pages/dashboard', {
        schedulesByFilm: Object.values(schedulesByFilm),
        genres,
        selectedDate,
        selectedGenre,
      })

    } catch (error) {
      console.error('Error in dashboard controller:', error)
      
      // Fallback: return empty data
      const genres = await Genre.all()
      return view.render('pages/dashboard', {
        schedulesByFilm: [],
        genres,
        selectedDate,
        selectedGenre,
      })
    }
  }
  
  async buyTicket({ params, auth, response, session }: HttpContext) {
    try {
      const schedule = await Schedule.query()
        .where('id', params.id)
        .preload('studio')
        .preload('tickets')
        .preload('film')
        .firstOrFail()

      const user = auth.user!

      // Calculate available tickets
      const totalCapacity = schedule.studio.capacity
      const soldTickets = schedule.tickets.length
      const availableTickets = totalCapacity - soldTickets

      console.log('Buy ticket debug:', {
        scheduleId: schedule.id,
        totalCapacity,
        soldTickets,
        availableTickets
      })

      if (availableTickets <= 0) {
        session.flash('error', 'Sorry, no tickets available.')
        return response.redirect().back()
      }

      await Ticket.create({
        scheduleId: schedule.id,
        userId: user.id,
        price: 50000,
      })

      session.flash('success', `Ticket for "${schedule.film.title}" has been successfully purchased!`)
      return response.redirect().back()

    } catch (error) {
      console.error('Error buying ticket:', error)
      session.flash('error', 'An error occurred while purchasing the ticket.')
      return response.redirect().back()
    }
  }

  async history({ view, auth }: HttpContext) {
    try {
      const user = auth.user!
      const tickets = await Ticket.query()
        .where('user_id', user.id)
        .preload('schedule', (scheduleQuery) => {
          scheduleQuery.preload('film').preload('studio')
        })
        .orderBy('created_at', 'desc')

      console.log('User tickets found:', tickets.length)

      return view.render('pages/tickets_history', { tickets })

    } catch (error) {
      console.error('Error in history:', error)
      return view.render('pages/tickets_history', { tickets: [] })
    }
  }
}