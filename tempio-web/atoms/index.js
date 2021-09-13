import { atom } from 'jotai'

export const employeesAtom = atom([])

export const notificationsAtom = atom([])
export const hasNotificationsAtom = atom(false)
export const writeHasNotificationsAtom = atom(null, 
  (_, set, update) => {
    set(hasNotificationsAtom, update)
  }
)

export const devicesAtom = atom([])
export const writeDevicesAtom = atom(null, 
  (_, set, update) => {
    set(devicesAtom, () => update)
  }
)