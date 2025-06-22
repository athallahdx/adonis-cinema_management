import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {

  async loginCreate({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async loginStore({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash({ error: 'Email atau password salah.' })
      return response.redirect().back()
    }
  }

  async registerCreate({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async registerStore({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    
    const user = await User.create(payload)

    await auth.use('web').login(user)

    return response.redirect().toRoute('dashboard')
  }
  
  /**
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login.create')
  }
}
