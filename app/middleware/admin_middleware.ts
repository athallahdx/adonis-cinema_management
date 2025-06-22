import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user || !user.isAdmin) {
      ctx.session.flash('error', 'You do not have access rights.')
      return ctx.response.redirect().toRoute('dashboard')
    }

    const output = await next()
    return output
  }
}