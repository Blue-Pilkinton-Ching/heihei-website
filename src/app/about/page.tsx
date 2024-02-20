import Link from 'next/link'
import Background from '../background'

const classes =
  'font-bold text-3xl hover:underline hover:brightness-75 duration-100 *:mb-4'

export default function Page() {
  return (
    <>
      <Link href={'/about/whowhatwhy'} className={classes}>
        <p>The Who, What, & Why</p>
      </Link>
      <Link href={'/about/help'} className={classes}>
        <p>Help & FAQ</p>
      </Link>

      <Link href={'/about/privacy'} className={classes}>
        <p>Privacy & Safety</p>
      </Link>
      <Link href={'/about/contact'} className={classes}>
        <p>Contact Us</p>
      </Link>
    </>
  )
}