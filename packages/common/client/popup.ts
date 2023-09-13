import { z } from 'zod'
import { Evt } from 'evt'

const PopupEvents = z.object({
	null: z.object({
		show: z.undefined(),
		hide: z.undefined(),
	}),
	cancel: z.object({
		show: z.undefined(),
		hide: z.undefined(),
	}),
	'pod-new-2': z.object({
		show: z.undefined(),
		hide: z.undefined(),
	}),
	'pod-create-3': z.object({
		show: z.object({
			modelUuid: z.string(),
		}),
		hide: z.undefined(),
	}),
	'pod-rename-popup': z.object({
		show: z.object({
			podUuid: z.string(),
			oldName: z.string(),
		}),
		hide: z.undefined(),
	}),
	'model-create': z.object({
		show: z.undefined(),
		hide: z.undefined(),
	}),
	'model-create-light': z.object({
		show: z.undefined(),
		hide: z.object({
			format: z.string(),
		}),
	}),
	'model-create-custom': z.object({
		show: z.object({
			pluginId: z.string(),
		}),
		hide: z.object({
			name: z.string(),
		}),
	}),
	'model-edit-properties': z.object({
		show: z.object({
			uuid: z.string(),
			oldName: z.string(),
		}),
		hide: z.undefined(),
	}),
	'model-create-child': z.object({
		show: z.object({
			modelUuid: z.string(),
			validationFn: z.any(),
		}),
		hide: z.undefined(),
	}),
	'view-create': z.object({
		show: z.object({
			modelUuid: z.string(),
		}),
		hide: z.undefined(),
	}),
	'plugin-model-flat-pod-edit-metadata': z.object({
		show: z.object({
			uuid: z.string(),
			name: z.string(),
			description: z.string(),
			tags: z.array(z.string()),
		}),
		hide: z.undefined(),
	}),
})
type PopupEvents_t = z.infer<typeof PopupEvents>

type UndefinedInputKeys = keyof {
	[key in keyof PopupEvents_t as PopupEvents_t[key]['show'] extends undefined
		? key
		: never]: PopupEvents_t[key]
}

type NotUndefinedInputKeys = keyof {
	[key in keyof PopupEvents_t as PopupEvents_t[key]['show'] extends undefined
		? never
		: key]: PopupEvents_t[key]
}

type UndefinedOutputKeys = keyof {
	[key in keyof PopupEvents_t as PopupEvents_t[key]['hide'] extends undefined
		? key
		: never]: PopupEvents_t[key]
}

type NotUndefinedOutputKeys = keyof {
	[key in keyof PopupEvents_t as PopupEvents_t[key]['hide'] extends undefined
		? never
		: key]: PopupEvents_t[key]
}

export const popupEmitter = Evt.create<
	| {
			type: 'show'
			id: keyof PopupEvents_t
			component?: unknown
			props?: Record<string, unknown>
	  }
	| {
			type: 'hide'
			id: keyof PopupEvents_t
			response?: Record<string, unknown>
	  }
>()

export async function showNoData<T extends UndefinedInputKeys>(
	eventString: T,
	component: unknown,
) {
	return await _showPopup(eventString, component, undefined)
}

export async function show<T extends NotUndefinedInputKeys>(
	eventString: T,
	component: unknown,
	props: PopupEvents_t[T]['show'],
) {
	return await _showPopup(eventString, component, props)
}

async function _showPopup<T extends keyof PopupEvents_t>(
	eventString: T,
	component: unknown,
	props: PopupEvents_t[T]['show'],
): Promise<{
	type: 'hide'
	id: keyof PopupEvents_t
	response: PopupEvents_t[T]['hide']
}> {
	popupEmitter.post({
		type: 'show',
		id: eventString,
		component,
		props,
	})

	const result = await popupEmitter.waitFor()
	return result
}

export async function hideNoData<T extends UndefinedOutputKeys>(
	eventString: T,
) {
	return await _hidePopup(eventString, undefined)
}

export async function hide<T extends NotUndefinedOutputKeys>(
	eventString: T,
	response: PopupEvents_t[T]['hide'],
) {
	return await _hidePopup(eventString, response)
}

async function _hidePopup<T extends keyof PopupEvents_t>(
	eventString: T,
	response: PopupEvents_t[T]['hide'],
) {
	popupEmitter.post({ type: 'hide', id: eventString, response })
}
