import { IoEye, IoEyeOff } from 'react-icons/io5'
import { IconButton } from '../(components)/iconButton'
import { FormEvent, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { MdDeleteForever } from 'react-icons/md'
import Confirm from './confirm'
import Button from '../(components)/button'
import { Partner } from '../../../types'

export default function Partners({
  className,
  partners,
  invalidatePartners,
}: {
  className: string
  partners: Partner[]
  invalidatePartners: () => void
}) {
  const [user] = useAuthState(getAuth())

  const [partnerData, setPartnerData] = useState<Partner[]>()
  const [confirmText, setConfirmText] = useState('')
  const [partnerToDelete, setPartnerToDelete] = useState('')

  useEffect(() => {
    setPartnerData(partners)
  }, [partners])

  async function onToggleVisibility(partner: {
    name: string
    hidden: boolean
  }) {
    const shouldHide = !partner.hidden

    let res

    setPartnerData(
      partnerData?.map((x) => {
        if (x.name === partner.name) {
          x.hidden = shouldHide
        }
        return x
      })
    )

    try {
      res = await fetch(`/api/dashboard/partners`, {
        body: JSON.stringify({ hidden: shouldHide, name: partner.name }),
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert('An error occured while setting partner visibility')
      console.error(error)
      return
    }

    switch (res.status) {
      case 200:
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while setting partner visibility')
        return
      default:
        alert('An unknown error occured')
        console.error(res.status, res.statusText, res.body)
        return
    }
  }

  async function deletePartner() {
    let res
    try {
      res = await fetch(`/api/dashboard/partners`, {
        body: JSON.stringify(partnerToDelete),
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert('An error occured while deleting partner')
      console.error(error)
      return
    }

    switch (res.status) {
      case 200:
        invalidatePartners()
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while deleting partner')
        return
      default:
        alert('An unknown error occured')
        console.error(res.status, res.statusText, res.body)
        return
    }
  }

  async function addPartner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let res

    const currentTarget = event.currentTarget[0] as HTMLFormElement
    const pName = currentTarget.value

    currentTarget.value = ''

    try {
      res = await fetch(`/api/dashboard/partners`, {
        body: JSON.stringify(pName),
        method: 'POST',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert('An error occured while adding partner')
      console.error(error)
      return
    }

    switch (res.status) {
      case 200:
        invalidatePartners()
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while adding partner')
        return
      default:
        alert('An unknown error occured')
        console.error(res.status, res.statusText, res.body)
        return
    }
  }

  return (
    <div className={className}>
      <Confirm
        text={confirmText}
        onConfirm={deletePartner}
        onCancel={() => setConfirmText('')}
      />
      <h1 className="text-4xl pl-2 font-bold">Partners</h1>

      <form
        onSubmit={addPartner}
        className="flex justify-between items-center gap-8"
      >
        <input
          minLength={3}
          maxLength={100}
          required
          type="text"
          placeholder="Enter new partner name..."
          className="py-0.5 mt-3 px-2 rounded-lg flex-1 border border-white focus:border-black outline-none text-lg"
        />
        <Button
          className="bg-black text-white"
          invertedClassName="bg-white text-black"
        >
          Add Partner
        </Button>
      </form>
      <br />
      <table className="w-full">
        <thead>
          <tr>
            <th className="pl-2">Partner</th>
            <th className="w-16 text-center">Hide</th>
            <th className="w-16 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {partnerData?.map((element, key) => {
            return (
              <tr key={key} className="even:bg-zinc-100 odd:bg-white">
                <td className="pl-2">{element.name}</td>
                <td>
                  <IconButton
                    onClick={() => {
                      onToggleVisibility(element)
                    }}
                  >
                    {element.hidden ? (
                      <IoEyeOff className="w-full" size={'30px'} />
                    ) : (
                      <IoEye className="w-full" size={'30px'} />
                    )}
                  </IconButton>
                </td>
                <td>
                  <IconButton
                    onClick={() => {
                      setPartnerToDelete(element.name)
                      setConfirmText(
                        'Are you sure you want to delete this partner? This action is irreversible.'
                      )
                    }}
                  >
                    <MdDeleteForever className="w-full" size={'30px'} />
                  </IconButton>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
