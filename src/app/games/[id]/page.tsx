'use client'

import { useEffect, useRef, useState } from 'react'
import { Game, GamesList } from '../../../../interfaces'
import { notFound } from 'next/navigation'

export default function Page({ params }: { params: { id: string } }) {
  const [game, setGame] = useState<Game | null>()
  const [error, setError] = useState('')
  const gameView = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getData() {
    const res: Response = await fetch(
      'https://heihei-server.gamefroot.com/games/?approved=1&parent=0&%24sort%5BcreatedAt%5D=-1'
    )

    if (!res.ok) {
      setError('Failed to fetch Games :(')
      return
    }

    const data: GamesList = await res.json()
    const game = data.data.find((x) => x.id === decodeURIComponent(params.id))

    if (!game) {
      setError(`Couldn't find game informaion :(`)
      return notFound()
    }

    setGame(game)
  }

  if (error) {
    return <p className="text-5xl font-semibold text-green">{error}</p>
  }

  if (!game) {
    return <p className="text-5xl font-semibold text-green">Fetching Game...</p>
  }

  return (
    <div className="flex flex-row justify-evenly gap-10">
      <div className="space-y-6 min-w-[400px] w-[400px] h-full">
        <h1 className="text-5xl text-green font-semibold">{game.name}</h1>
        <p className="text-xl whitespace-pre-line">{game.description}</p>
      </div>
      <div
        ref={gameView}
        style={{ maxWidth: game.width }}
        className="justify-center max-h-[800px] items-center aspect-video flex-grow relative flex flex-col box-content rounded-lg *:rounded-lg"
      >
        {game.url ? (
          <>
            <iframe
              src={game.url}
              allowFullScreen
              className="w-full h-full shadow-lg overflow-hidden"
              style={{ maxWidth: game.width, maxHeight: game.height }}
              scrolling="no"
              id="heihei-game"
              allowTransparency
              frameBorder={0}
            ></iframe>
            <div
              style={{ maxWidth: game.width }}
              className="w-full h-16 flex justify-between flex-row-reverse items-center"
            >
              <button
                onClick={() => {
                  setFullscreen((old) => {
                    if (old) {
                      document.exitFullscreen()
                    } else {
                      gameView.current?.requestFullscreen()
                    }
                    return !old
                  })

                  gameView.current?.requestFullscreen()
                }}
                className="flex bg-green h-9 w-40 rounded-full items-center justify-center hover:scale-105 duration-100 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="-pl-0.5 w-7 h-7"
                >
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                </svg>
                <p className="font-semibold text-white pt-0.5 ">
                  {isFullscreen ? 'EXIT' : 'FULLSCREEN'}
                </p>
              </button>
            </div>
          </>
        ) : (
          <p className="text-5xl font-semibold text-green">
            Game doesn&apos;t exist!
          </p>
        )}
      </div>
    </div>
  )
}