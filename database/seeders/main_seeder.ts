import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Genre from '#models/genre'
import Studio from '#models/studio'

export default class extends BaseSeeder {
  async run() {
    await User.query().delete()
    
    await User.create({
      name: 'Admin One',
      email: 'admin@example.com',
      password: 'qwerty123', 
      isAdmin: true,
    })

    // Buat data Genre
    await Genre.createMany([
      { name: 'Action' },
      { name: 'Comedy' },
      { name: 'Horror' },
      { name: 'Sci-Fi' },
    ])

    // Buat data Studio
    await Studio.createMany([
        { name: 'Studio 1', capacity: 100 },
        { name: 'Studio 2', capacity: 80 },
    ])
  }
}
