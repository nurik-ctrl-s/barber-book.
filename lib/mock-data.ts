import type { Barber, Service, TimeSlot, Appointment, User } from './types'

export const barbers: Barber[] = [
  {
    id: '1',
    name: 'Маркус Джонсон',
    photo: '1.jpg',
    experience: 8,
    specialty: 'Мастер классической стрижки и фейда',
    rating: 4.9,
    reviewCount: 234
  },
  {
    id: '2',
    name: 'Давид ',
    photo: '2.jpg',
    experience: 5,
    specialty: 'Современные стили и работа с бородой',
    rating: 4.8,
    reviewCount: 156
  },
  {
    id: '3',
    name: 'Алексей Смирнов',
    photo: '3.jpg',
    experience: 12,
    specialty: 'Традиционное барберство',
    rating: 5.0,
    reviewCount: 312
  },
  {
    id: '4',
    name: 'Майкл Браун',
    photo: '4.jpg',
    experience: 6,
    specialty: 'Модные стрижки и креативные решения',
    rating: 4.7,
    reviewCount: 189
  },
  {
    id: '5',
    name: 'Оскар Петров',
    photo: '5.jpg',
    experience: 6,
    specialty: 'Стрижка по-королевски',
    rating: 4.8,
    reviewCount: 100
  },
  {
    id: '6',
    name: 'Тимур Ким',
    photo: '6.jpg',
    experience: 6,
    specialty: 'Элегантный, винтажный, «old money»',
    rating: 4.5,
    reviewCount: 89
  }
]

export const services: Service[] = [
  {
    id: '1',
    name: 'Классическая стрижка',
    description: 'Традиционная стрижка с использованием клиньев и ножниц',
    price: 18,
    duration: 30
  },
  {
    id: '2',
    name: 'Фейд стрижка',
    description: 'Современная стрижка с плавным переходом от коротких к длинным волосам',
    price: 24,
    duration: 40
  },
  {
    id: '3',
    name: 'Стрижка бороды',
    description: 'Формирование и подстригивание бороды до идеала',
    price: 20,
    duration: 20
  },
  {
    id: '4',
    name: 'Комплексная стрижка',
    description: 'Комплексная стрижка с укладкой и использованием горячего полотенца',
    price: 30,
    duration: 60
  },
  {
    id: '5',
    name: 'Классическое бритье',
    description: 'Классическое бритье с использованием горячего полотенца для смягчения кожи',
    price: 20,
    duration: 45
  },
  {
    id: '6',
    name: 'Детская стрижка',
    description: 'Стрижка для детей до 12 лет',
    price: 20,
    duration: 25
  }
]

export const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startHour = 9
  const endHour = 18

  for (let hour = startHour; hour < endHour; hour++) {
    for (const minutes of ['00', '30']) {
      const time = `${hour.toString().padStart(2, '0')}:${minutes}`
      slots.push({
        time,
        available: Math.random() > 0.3
      })
    }
  }

  return slots
}

export const currentUser: User = {
  id: '1',
  name: 'Nursultan',
  email: 'Nurs.@gmail.com',
  phone: '+(996) 999-558-998',
  avatar: 'profile.jpg',
  memberSince: 'January 2022',
  role: 'admin' // Добавь это свойство
}

export const appointments: Appointment[] = [
  {
    id: '1',
    barber: barbers[0],
    service: services[1],
    date: '2026-04-28',
    time: '10:00',
    status: 'upcoming'
  },
  {
    id: '2',
    barber: barbers[2],
    service: services[3],
    date: '2026-05-05',
    time: '14:30',
    status: 'upcoming'
  },
  {
    id: '3',
    barber: barbers[1],
    service: services[0],
    date: '2026-04-15',
    time: '11:00',
    status: 'completed'
  },
  {
    id: '4',
    barber: barbers[0],
    service: services[2],
    date: '2026-04-01',
    time: '09:30',
    status: 'completed'
  },
  {
    id: '5',
    barber: barbers[3],
    service: services[4],
    date: '2026-03-20',
    time: '16:00',
    status: 'completed'
  }
]

export const adminAppointments: Appointment[] = [
  ...appointments,
  {
    id: '6',
    barber: barbers[1],
    service: services[1],
    date: '2026-04-24',
    time: '09:00',
    status: 'upcoming'
  },
  {
    id: '7',
    barber: barbers[2],
    service: services[0],
    date: '2026-04-24',
    time: '10:30',
    status: 'upcoming'
  },
  {
    id: '8',
    barber: barbers[0],
    service: services[3],
    date: '2026-04-24',
    time: '13:00',
    status: 'upcoming'
  }
]
