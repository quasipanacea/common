import { Evt } from 'evt'

let isPopupVisible = false

export interface PopupEvents {
	'show-null': undefined
	'show-pod-rename-popup': { podUuid: string; oldName: string }
	'hide-null': undefined
	'hide-cancel': undefined
}

export const popupEmitter = Evt.create<{
	id: keyof PopupEvents
	component?: unknown
	props?: Record<string, unknown>
}>()

export async function showPopup<T extends keyof PopupEvents>(
	eventString: T,
	component: unknown,
	props?: PopupEvents[T],
) {
	if (isPopupVisible) {
		throw new Error('A popup is already visible')
	}
	isPopupVisible = true

	popupEmitter.post({
		id: eventString,
		component,
		props,
	})
	await popupEmitter.waitFor()

	isPopupVisible = false
}
