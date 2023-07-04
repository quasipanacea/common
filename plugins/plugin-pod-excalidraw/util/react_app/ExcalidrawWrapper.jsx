import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Excalidraw } from '@excalidraw/excalidraw'

import { trpcClient } from '@quasipanacea/common/client/index.js'
// import type { PluginAppRouter } from '../s.js'

const api = trpcClient.yieldClient()

// interface IBasic {
// 	props: {
// 		uuid: string,
// 	};
// }

export default function Basic(props /*: IBasic */) {
	const onChange = (excalidrawElements, _appState, _files) => {
		// useEffect(() => {
		async function work() {
			await api.plugins.pod.excalidraw.saveDrawing.mutate({
				uuid: props.uuid,
				state: excalidrawElements,
			})
		}

		work().catch(console.error)
		// }, [state])
	}

	return (
		<div>
			<div style={{ height: '500px' }}>
				<Excalidraw initialData={props.initialData} onChange={onChange} />
			</div>
		</div>
	)
}
