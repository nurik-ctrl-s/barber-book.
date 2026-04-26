import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Scissors, Star, Clock, Calendar, User, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getBarbers } from '@/app/actions/barbers'
import { getServices } from '@/app/actions/services'
import { getCurrentUser, logout } from '@/app/actions/auth'

export default async function HomePage() {
  const [barbers, services, user] = await Promise.all([
    getBarbers(),
    getServices(),
    getCurrentUser()
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Scissors className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BarberBook</span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Бронирование</span>
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Профиль</span>
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">Админ</span>
                    </Button>
                  </Link>
                )}
                <form action={async () => {
                  'use server'
                  await logout()
                  redirect('/')
                }}>
                  <Button type="submit" variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Выйти</span>
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Войти</Button>
                </Link>
                <Link href="/register">
                  <Button>Начать</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-card to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Забронируй свой идеальный стиль
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Твой стиль — твои правила. Премиальный сервис без лишних слов. Бронируй место у лучших в пару кликов.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={user ? "/dashboard" : "/register"}>
              <Button size="lg" className="gap-2">
                <Calendar className="h-5 w-5" />
                Зайти к мастеру
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold">Почему BarberBook?</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Мастера высшей пробы</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Только опытные мастера. Никаких новичков, только проверенные люди и железная репутация. 
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Запись без лишних слов</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                 Занимай кресло за полминуты. Никакой лишней возни — только выбор времени и подтверждение. 
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Без очередей и пауз</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Твое время — в приоритете. Сразу приступаем к делу, без ожиданий в очереди. 
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Barbers */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold">КТО В ДЕЛЕ</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Здесь нет случайных людей. Только профи, которые делают правильный стиль без лишних слов.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {barbers.map((barber) => (
              <Card key={barber.id}>
                <CardContent className="p-6 text-center">
                  <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full">
                    <Image
                      src={barber.photo}
                      alt={barber.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-semibold">{barber.name}</h3>
                  <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{barber.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({barber.reviewCount})
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold">Весь арсенал</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Высший разряд мужского сервиса. Ничего лишнего.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold">${service.price}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Готовы к следующему стрижке?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Присоединяйтесь к тысячам довольных клиентов и забронируйте вашу запись сегодня.
          </p>
          <Link href={user ? "/dashboard" : "/register"} className="mt-8 inline-block">
            <Button size="lg" variant="secondary">
              Забронировать время
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Scissors className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BarberBook</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Запись в барбершоп премиум-класса в пару кликов.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            © 2026 Барбер Книга. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  )
}
