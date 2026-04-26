import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: 'BarberBook — Премиальные мужские стрижки', 
  description: 'Запишитесь к лучшим мастерам города онлайн. Стрижки, бритье и уход.',
  icons: {
    icon: [
      {
        // Добавляем ?v=4, чтобы принудительно обновить иконку в кэше браузера
        url: '/apple-icon.png?v=4',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png?v=4',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="bg-background">
      <body className={`${geist.className} ${geistMono.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

// import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import './globals.css'

// const geist = Geist({ subsets: ["latin", "cyrillic"] }); // Добавили поддержку кириллицы
// const geistMono = Geist_Mono({ subsets: ["latin", "cyrillic"] });

// export const metadata: Metadata = {
//   title: 'BarberBook — Премиальные мужские стрижки', 
//   description: 'Запишитесь к лучшим мастерам города онлайн. Стрижки, бритье и уход.',
//   icons: {
//     icon: [
//       {
//         // Мы добавляем ?v=3, чтобы браузер понял: это новая иконка и её надо загрузить заново
//         url: '/apple-icon.png?v=3',
//         type: 'image/png',
//       },
//     ],
//     // Это для иконки, если кто-то сохранит сайт на экран iPhone
//     apple: '/apple-icon.png?v=3',
//   },
// }
// // export const metadata: Metadata = {
// //   // 1. Название вашего сайта (будет на вкладке браузера)
// //   title: 'BarberBook — Премиальные мужские стрижки', 
  
// //   // 2. Описание для поисковиков
// //   description: 'Запишитесь к лучшим мастерам города онлайн. Стрижки, бритье и уход.',
  
// //   // СТРОКУ generator: 'v0.app' МЫ УДАЛИЛИ
  
// //   icons: {
// //     icon: [
// //       {ч
// //         url: '/Barber.jpg.avif', // Кавычка закрыта, запятая поставлена
// //         media: '(prefers-color-scheme: light)',
// //       },
// //       {
// //         url: '/Barber.jpg.avif', // Используем этот же файл для темной темы
// //         media: '(prefers-color-scheme: dark)',
// //       },
// //       {
// //         url: '/Barber.jpg.avif',
// //         type: 'image/avif', // Указали правильный тип для .avif
// //       },
// //     ],
// //     apple: '/Barber.jpg.avif',
// //   },
// // }
// //   icons: {
// //     icon: [
// //       {
// //         url: '/Barber.jpg.avif // Ссылка на ваш будущий логотип
// //         media: '(prefers-color-scheme: light)',
// //       },
// //       {
// //         url: '/icon.png',
// //         media: '(prefers-color-scheme: dark)',
// //       },
// //       {
// //         url: '/icon.png',
// //         type: 'image/png',
// //       },
// //     ],
// //     apple: '/apple-icon.png',
// //   },
// // }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     // 3. Поменяли язык страницы на русский
//     <html lang="ru" className="bg-background">
//       <body className={`${geist.className} ${geistMono.className} antialiased`}>
//         {children}
//         {process.env.NODE_ENV === 'production' && <Analytics />}
//       </body>
//     </html>
//   )
// }