import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Import semua controller
const AuthController = () => import('#controllers/auth_controller')
const PagesController = () => import('#controllers/dashboard_controller')
const FilmsController = () => import('#controllers/films_controller')
const SchedulesController = () => import('#controllers/schedules_controller')
const GenresController = () => import('#controllers/genres_controller')
const StudiosController = () => import('#controllers/studios_controller')
const TicketsController = () => import('#controllers/tickets_controller')

router.get('login', [AuthController, 'loginCreate']).as('auth.login.create').use(middleware.guest())
router.post('login', [AuthController, 'loginStore']).as('auth.login.store').use(middleware.guest())
router.get('register', [AuthController, 'registerCreate']).as('auth.register.create').use(middleware.guest())
router.post('register', [AuthController, 'registerStore']).as('auth.register.store').use(middleware.guest())
router.post('logout', [AuthController, 'destroy']).as('auth.logout')


router
  .group(() => {
    router.get('/', [PagesController, 'home']).as('dashboard')
    router.get('/history', [PagesController, 'history']).as('tickets.history')
    router.post('/buy-ticket/:id', [PagesController, 'buyTicket']).as('tickets.buy')
    
    router
      .group(() => {
        router.resource('films', FilmsController)
        router.resource('schedules', SchedulesController)
        router.resource('genres', GenresController).except(['show'])
        router.resource('studios', StudiosController).except(['show'])

        router.resource('tickets', TicketsController).only(['index', 'destroy'])

      })
      .prefix('manage')
      .use(middleware.admin())
  })
  .use(middleware.auth())
